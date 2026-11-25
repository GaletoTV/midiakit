#!/usr/bin/env python3
"""
Coleta os dados da sua conta do Instagram e gera data/dashboard.json,
que é o arquivo lido pelo painel (index.html).

Uso:
  python scripts/fetch_instagram.py            # dados reais (precisa de IG_ACCESS_TOKEN)
  python scripts/fetch_instagram.py --demo     # gera dados fictícios para testar o painel
  python scripts/fetch_instagram.py --refresh-token
                                               # renova o token (válido por mais 60 dias)
                                               # e grava o novo em .novo_token

Só usa a biblioteca padrão do Python: não é preciso instalar nada.
"""

import json
import os
import random
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CONFIG_PATH = RAIZ / "config-instagram.json"
SAIDA_PATH = RAIZ / "data" / "dashboard.json"
HISTORICO_PATH = RAIZ / "data" / "historico_seguidores.json"
NOVO_TOKEN_PATH = RAIZ / ".novo_token"

BASE_IG = "https://graph.instagram.com"
BASE_FB = "https://graph.facebook.com"
# Definidos em detectar_modo(): token do "login do Instagram" (graph.instagram.com,
# caminho "me") ou token do "login unificado"/usuário do sistema
# (graph.facebook.com, caminho = ID da conta do Instagram).
BASE = BASE_IG
ALVO = "me"

# Métricas pedidas para cada post. Nem todo formato aceita todas;
# quando a API recusa, o script tenta uma a uma e ignora as que não existirem.
METRICAS_POST = ["reach", "views", "likes", "comments", "shares", "saved", "total_interactions"]
METRICAS_REELS_EXTRA = ["ig_reels_avg_watch_time"]


# ---------------------------------------------------------------- utilidades

def carregar_config():
    with open(CONFIG_PATH, encoding="utf-8") as f:
        return json.load(f)


def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}", flush=True)


class ErroAPI(Exception):
    def __init__(self, status, corpo):
        super().__init__(f"HTTP {status}: {corpo}")
        self.status = status
        self.corpo = corpo


def chamar_api(caminho, params, token, versao, tentativas=3):
    """GET na API do Instagram. Repete em caso de erro temporário."""
    params = dict(params or {})
    params["access_token"] = token
    if caminho.startswith("http"):
        url = caminho  # URLs de paginação já vêm completas
        if "access_token=" not in url:
            url += ("&" if "?" in url else "?") + urllib.parse.urlencode({"access_token": token})
    else:
        caminho = caminho.lstrip('/')
        if caminho == "me" or caminho.startswith("me/"):
            caminho = ALVO + caminho[2:]
        url = f"{BASE}/{versao}/{caminho}?{urllib.parse.urlencode(params)}"

    for i in range(tentativas):
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            corpo = e.read().decode("utf-8", errors="replace")
            # 4xx (exceto limite de uso) não adianta repetir
            if 400 <= e.code < 500 and e.code != 429:
                raise ErroAPI(e.code, corpo)
            if i == tentativas - 1:
                raise ErroAPI(e.code, corpo)
        except urllib.error.URLError as e:
            if i == tentativas - 1:
                raise
        time.sleep(2 * (i + 1))


# ---------------------------------------------------------------- categorias

def compilar_categorias(cfg):
    regras = []
    for nome, palavras in cfg.get("categorias", {}).items():
        padroes = []
        for p in palavras:
            p = p.strip().lower()
            if not p:
                continue
            # "gol" casa com "gol!" mas não com "golpe"
            padroes.append(re.compile(r"(?<![\w#])" + re.escape(p) + r"(?!\w)"))
        regras.append((nome, padroes))
    return regras


def classificar(legenda, regras, padrao):
    texto = (legenda or "").lower()
    melhor, melhor_pts = padrao, 0
    for nome, padroes in regras:
        pts = sum(len(p.findall(texto)) for p in padroes)
        # hashtag com o próprio nome da categoria vale mais (ex.: #humor)
        if re.search(r"#" + re.escape(nome.lower()) + r"(?!\w)", texto):
            pts += 5
        if pts > melhor_pts:
            melhor, melhor_pts = nome, pts
    return melhor


def formato_legivel(media_type, product_type):
    if product_type == "REELS":
        return "Reels"
    if media_type == "CAROUSEL_ALBUM":
        return "Carrossel"
    if media_type == "VIDEO":
        return "Vídeo"
    return "Foto"


# ---------------------------------------------------------------- coleta real

def buscar_insights_post(media_id, product_type, token, versao):
    metricas = list(METRICAS_POST)
    if product_type == "REELS":
        metricas += METRICAS_REELS_EXTRA
    resultado = {}

    def ler(resp):
        for item in resp.get("data", []):
            valores = item.get("values") or []
            if valores:
                resultado[item["name"]] = valores[0].get("value")
            elif "total_value" in item:
                resultado[item["name"]] = item["total_value"].get("value")

    try:
        ler(chamar_api(f"{media_id}/insights", {"metric": ",".join(metricas)}, token, versao))
    except ErroAPI:
        # Algum formato não aceita uma das métricas: pede uma por vez
        for m in metricas:
            try:
                ler(chamar_api(f"{media_id}/insights", {"metric": m}, token, versao))
            except ErroAPI:
                pass
    return resultado


def detectar_modo(token, versao, ig_id_config=""):
    """Descobre qual API o token aceita e qual é a conta do Instagram."""
    global BASE, ALVO
    BASE, ALVO = BASE_IG, "me"
    try:
        chamar_api("me", {"fields": "user_id,username"}, token, versao, tentativas=1)
        log("Token do login do Instagram (graph.instagram.com).")
        return
    except ErroAPI as e:
        erro_ig = e

    BASE = BASE_FB
    ig_id = os.environ.get("IG_USER_ID", "").strip() or str(ig_id_config or "").strip()
    if not ig_id:
        try:
            r = chamar_api("me/accounts", {"fields": "instagram_business_account{id,username}"}, token, versao)
            for pag in r.get("data", []):
                conta = pag.get("instagram_business_account")
                if conta:
                    ig_id = conta["id"]
                    break
        except ErroAPI:
            pass
    if not ig_id:
        try:
            r = chamar_api("me/businesses", {"fields": "owned_instagram_accounts{id,username},"
                                                       "instagram_accounts{id,username}"}, token, versao)
            for emp in r.get("data", []):
                for campo in ("owned_instagram_accounts", "instagram_accounts"):
                    contas = (emp.get(campo) or {}).get("data") or []
                    if contas:
                        ig_id = contas[0]["id"]
                        break
                if ig_id:
                    break
        except ErroAPI:
            pass
    if not ig_id:
        raise erro_ig
    ALVO = ig_id
    log(f"Token do login unificado (graph.facebook.com), conta {ig_id}.")


def coletar_real(cfg, token):
    versao = cfg.get("versao_api", "v24.0")
    max_posts = int(cfg.get("max_posts", 150))
    regras = compilar_categorias(cfg)
    padrao = cfg.get("categoria_padrao", "Outros")

    detectar_modo(token, versao, cfg.get("ig_user_id"))

    log("Lendo perfil…")
    campos_perfil = "username,name,biography,website,followers_count,follows_count,media_count,profile_picture_url"
    if BASE == BASE_IG:
        campos_perfil = "user_id," + campos_perfil
    perfil = chamar_api("me", {"fields": campos_perfil}, token, versao)
    perfil.setdefault("user_id", perfil.get("id"))

    log("Listando posts…")
    campos = ("id,caption,media_type,media_product_type,timestamp,permalink,"
              "like_count,comments_count,thumbnail_url,media_url")
    posts_brutos = []
    resp = chamar_api("me/media", {"fields": campos, "limit": 50}, token, versao)
    while True:
        posts_brutos.extend(resp.get("data", []))
        prox = resp.get("paging", {}).get("next")
        if not prox or len(posts_brutos) >= max_posts:
            break
        resp = chamar_api(prox, None, token, versao)
    posts_brutos = posts_brutos[:max_posts]

    log(f"Buscando métricas de {len(posts_brutos)} posts…")
    posts = []
    for i, p in enumerate(posts_brutos, 1):
        ins = buscar_insights_post(p["id"], p.get("media_product_type"), token, versao)
        likes = ins.get("likes", p.get("like_count")) or 0
        comentarios = ins.get("comments", p.get("comments_count")) or 0
        posts.append({
            "id": p["id"],
            "data": p.get("timestamp"),
            "link": p.get("permalink"),
            "legenda": (p.get("caption") or "")[:300],
            "formato": formato_legivel(p.get("media_type"), p.get("media_product_type")),
            "tema": classificar(p.get("caption"), regras, padrao),
            "miniatura": p.get("thumbnail_url") or (p.get("media_url") if p.get("media_type") == "IMAGE" else None),
            "alcance": ins.get("reach"),
            "views": ins.get("views"),
            "curtidas": likes,
            "comentarios": comentarios,
            "compartilhamentos": ins.get("shares") or 0,
            "salvamentos": ins.get("saved") or 0,
            "tempo_medio_reels_ms": ins.get("ig_reels_avg_watch_time"),
        })
        if i % 25 == 0:
            log(f"  {i}/{len(posts_brutos)}")

    # Na primeira execução, tenta montar 30 dias de histórico de seguidores
    # a partir dos ganhos diários informados pela API.
    ganhos_diarios = {}
    try:
        ate = datetime.now(timezone.utc)
        desde = ate - timedelta(days=29)
        r = chamar_api("me/insights", {
            "metric": "follower_count", "period": "day",
            "since": int(desde.timestamp()), "until": int(ate.timestamp()),
        }, token, versao)
        for item in r.get("data", []):
            for v in item.get("values", []):
                dia = v["end_time"][:10]
                ganhos_diarios[dia] = v.get("value", 0)
    except Exception as e:  # contas com menos de 100 seguidores não têm esse dado
        log(f"Aviso: histórico diário de seguidores indisponível ({e})")

    extras = coletar_extras(perfil, posts, token, versao)
    return perfil, posts, ganhos_diarios, extras


# ------------------------------------------------- dados extras do mídia kit
# Tudo aqui é opcional: se a API recusar alguma parte, o site usa os valores
# digitados em conteudo/redes.json para aquele item.

IG_DIR = RAIZ / "data" / "ig"


def baixar(url, destino):
    """Baixa uma imagem do Instagram para o repositório (os links da API expiram)."""
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            destino.write_bytes(r.read())
        return str(destino.relative_to(RAIZ)).replace("\\", "/")
    except Exception as e:
        log(f"Aviso: não consegui baixar {destino.name} ({e})")
        return None


def total_da_conta(metrica, desde, ate, token, versao):
    """Soma uma métrica da conta em janelas de até 30 dias (limite da API)."""
    total, ini = 0, desde
    while ini < ate:
        fim = min(ini + timedelta(days=30), ate)
        r = chamar_api("me/insights", {
            "metric": metrica, "period": "day", "metric_type": "total_value",
            "since": int(ini.timestamp()), "until": int(fim.timestamp()),
        }, token, versao)
        for item in r.get("data", []):
            total += (item.get("total_value") or {}).get("value", 0) or 0
        ini = fim
    return total


def totais_da_conta(metricas, desde, ate, token, versao):
    """Como total_da_conta, mas para várias métricas de uma vez; devolve {métrica: total}."""
    tot, ini = {m: 0 for m in metricas}, desde
    while ini < ate:
        fim = min(ini + timedelta(days=30), ate)
        r = chamar_api("me/insights", {
            "metric": ",".join(metricas), "period": "day", "metric_type": "total_value",
            "since": int(ini.timestamp()), "until": int(fim.timestamp()),
        }, token, versao)
        for item in r.get("data", []):
            if item.get("name") in tot:
                tot[item["name"]] += (item.get("total_value") or {}).get("value", 0) or 0
        ini = fim
    return tot


def demografia(quebra, token, versao):
    r = chamar_api("me/insights", {
        "metric": "follower_demographics", "period": "lifetime",
        "metric_type": "total_value", "breakdown": quebra,
    }, token, versao)
    res = {}
    for item in r.get("data", []):
        for b in (item.get("total_value") or {}).get("breakdowns", []):
            for x in b.get("results", []):
                res[x["dimension_values"][0]] = x.get("value", 0)
    return res


def coletar_extras(perfil, posts, token, versao):
    IG_DIR.mkdir(parents=True, exist_ok=True)
    extras = {}

    # foto de perfil e as 9 últimas capas, para o mockup do perfil no site
    if perfil.get("profile_picture_url"):
        extras["avatar"] = baixar(perfil["profile_picture_url"], IG_DIR / "avatar.jpg")
    grade = []
    for p in posts:
        if len(grade) == 9:
            break
        if not p.get("miniatura"):
            continue
        img = baixar(p["miniatura"], IG_DIR / f"grade-{len(grade) + 1}.jpg")
        if img:
            grade.append({"img": img, "link": p.get("link"), "formato": p.get("formato")})
    extras["grade"] = grade

    # visualizações da conta nos últimos 90 dias
    try:
        ate = datetime.now(timezone.utc)
        desde = ate - timedelta(days=90)
        extras["conta_90d"] = {
            "views": total_da_conta("views", desde, ate, token, versao),
            "desde": desde.date().isoformat(), "ate": ate.date().isoformat(),
        }
    except Exception as e:
        log(f"Aviso: visualizações da conta indisponíveis ({e})")

    # alcance único dos últimos 90 dias: o app mostra, mas a API costuma limitar a janela a 30 dias.
    # Tenta pedir a janela inteira; se a API recusar, o site segue com o alcance digitado.
    try:
        ate = datetime.now(timezone.utc)
        desde = ate - timedelta(days=90)
        r = chamar_api("me/insights", {
            "metric": "reach", "period": "day", "metric_type": "total_value",
            "since": int(desde.timestamp()), "until": int(ate.timestamp()),
        }, token, versao)
        alc = sum((i.get("total_value") or {}).get("value", 0) or 0 for i in r.get("data", []))
        if alc:
            extras.setdefault("conta_90d", {"desde": desde.date().isoformat(), "ate": ate.date().isoformat()})
            extras["conta_90d"]["alcance"] = alc
    except Exception as e:
        log(f"Aviso: alcance de 90 dias indisponível pela API, mantendo o valor manual ({e})")

    # interações dos últimos 90 dias: curtidas, comentários, compartilhamentos e salvamentos
    try:
        ate = datetime.now(timezone.utc)
        desde = ate - timedelta(days=90)
        t = totais_da_conta(["total_interactions", "likes", "comments", "shares", "saves"], desde, ate, token, versao)
        extras.setdefault("conta_90d", {"desde": desde.date().isoformat(), "ate": ate.date().isoformat()})
        extras["conta_90d"]["interacoes"] = {
            "total": t["total_interactions"] or (t["likes"] + t["comments"] + t["shares"] + t["saves"]),
            "curtidas": t["likes"], "comentarios": t["comments"],
            "compartilhamentos": t["shares"], "salvamentos": t["saves"],
        }
    except Exception as e:
        log(f"Aviso: interações da conta indisponíveis ({e})")

    # últimos 30 dias (relatório; o site ainda não usa): visualizações, alcance, interações, novos seguidores
    try:
        ate = datetime.now(timezone.utc)
        desde = ate - timedelta(days=30)
        t = totais_da_conta(["views", "reach", "total_interactions", "likes", "comments", "shares", "saves"],
                            desde, ate, token, versao)
        c30 = {
            "desde": desde.date().isoformat(), "ate": ate.date().isoformat(),
            "views": t["views"], "alcance": t["reach"],
            "interacoes": {
                "total": t["total_interactions"] or (t["likes"] + t["comments"] + t["shares"] + t["saves"]),
                "curtidas": t["likes"], "comentarios": t["comments"],
                "compartilhamentos": t["shares"], "salvamentos": t["saves"],
            },
        }
        try:
            r = chamar_api("me/insights", {
                "metric": "follower_count", "period": "day",
                "since": int((ate - timedelta(days=29)).timestamp()), "until": int(ate.timestamp()),
            }, token, versao)
            c30["novos_seguidores"] = sum(v.get("value", 0) or 0 for i in r.get("data", []) for v in i.get("values", []))
        except Exception as e:
            log(f"Aviso: novos seguidores de 30 dias indisponíveis ({e})")
        extras["conta_30d"] = c30
    except Exception as e:
        log(f"Aviso: métricas de 30 dias indisponíveis ({e})")

    # público: idade, gênero e cidades (em % dos seguidores)
    try:
        idade, genero, cidade = (demografia(q, token, versao) for q in ("age", "gender", "city"))
        pct = lambda d, total: {k: round(v * 100 / total, 1) for k, v in d.items()} if total else {}
        ti, tg, tc = sum(idade.values()), sum(genero.values()), sum(cidade.values())
        idade_p, genero_p, cidade_p = pct(idade, ti), pct(genero, tg), pct(cidade, tc)
        extras["publico"] = {
            "faixa_etaria": [{"faixa": k.replace("-", " a ") + " anos" if "-" in k else k + " anos", "percentual": v}
                             for k, v in sorted(idade_p.items(), key=lambda x: -x[1])[:3]],
            "genero": {"homens": round(genero_p.get("M", 0)), "mulheres": round(genero_p.get("F", 0))},
            "cidades": [{"cidade": k.split(",")[0].strip(), "percentual": v}
                        for k, v in sorted(cidade_p.items(), key=lambda x: -x[1])[:3]],
        }
    except Exception as e:
        log(f"Aviso: dados de público indisponíveis ({e})")
    return extras


# ---------------------------------------------------------------- dados demo

def coletar_demo(cfg):
    random.seed(7)
    regras = compilar_categorias(cfg)
    padrao = cfg.get("categoria_padrao", "Outros")
    agora = datetime.now(timezone.utc)
    seguidores = 155400

    legendas = {
        "Esporte": ["Que GOL foi esse?! ⚽ #futebol", "Resumo do clássico em 30s #futebol",
                    "O juiz viu outro jogo 😂 #esporte", "Brasileirão: quem leva? #futebol",
                    "Bastidores do jogo de domingo #esporte"],
        "Humor": ["Todo torcedor depois da derrota kkkk #humor", "Tipos de amigo no churrasco #meme",
                  "Esquete: o técnico do grupo do zap #humor", "Quando o pai explica o impedimento #meme"],
        "Entretenimento": ["React do episódio de ontem #entretenimento", "Reality: minha opinião sincera #bbb",
                           "Filme que todo mundo precisa ver #entretenimento"],
        "Outros": ["Bom dia, galera! ☀️", "Novidade chegando…", "Obrigado pelos 48 mil! 🙏"],
    }
    pesos_tema = {"Esporte": 0.38, "Humor": 0.34, "Entretenimento": 0.18, "Outros": 0.10}
    base_alcance = {"Reels": 95000, "Carrossel": 30000, "Foto": 20000}
    mult_tema = {"Esporte": 1.0, "Humor": 1.35, "Entretenimento": 0.85, "Outros": 0.6}

    posts = []
    t = agora - timedelta(hours=random.randint(2, 20))
    for i in range(120):
        tema = random.choices(list(pesos_tema), weights=pesos_tema.values())[0]
        formato = random.choices(["Reels", "Carrossel", "Foto"], weights=[0.6, 0.25, 0.15])[0]
        hora_local = random.choice([7, 8, 12, 12, 13, 18, 19, 19, 20, 20, 21, 21, 22, 23])
        dia = (t - timedelta(days=i * 1.5)).replace(hour=(hora_local + 3) % 24, minute=random.randint(0, 59))
        sorte = random.lognormvariate(0, 0.65)
        noite = 1.25 if 19 <= hora_local <= 22 else 1.0
        alcance = int(base_alcance[formato] * mult_tema[tema] * sorte * noite)
        views = int(alcance * (random.uniform(1.6, 2.6) if formato == "Reels" else random.uniform(1.15, 1.6)))
        taxa = random.uniform(0.035, 0.09) * (1.3 if tema == "Humor" else 1.0)
        inter = alcance * taxa
        compart = int(inter * (0.30 if tema == "Humor" else 0.14))
        salv = int(inter * (0.12 if formato == "Carrossel" else 0.06))
        coment = int(inter * random.uniform(0.04, 0.09))
        likes = max(0, int(inter) - compart - salv - coment)
        legenda = random.choice(legendas[tema])
        posts.append({
            "id": f"demo{i}",
            "data": dia.strftime("%Y-%m-%dT%H:%M:%S+0000"),
            "link": "https://www.instagram.com/",
            "legenda": legenda,
            "formato": formato,
            "tema": classificar(legenda, regras, padrao),
            "miniatura": None,
            "alcance": alcance,
            "views": views,
            "curtidas": likes,
            "comentarios": coment,
            "compartilhamentos": compart,
            "salvamentos": salv,
            "tempo_medio_reels_ms": random.randint(4000, 14000) if formato == "Reels" else None,
        })

    # histórico de 180 dias, crescendo com alguns picos
    historico = {}
    s = seguidores
    for d in range(0, 181):
        dia = (agora - timedelta(days=d)).strftime("%Y-%m-%d")
        historico[dia] = s
        s -= int(max(0, random.gauss(180, 90)) + (2500 if d in (23, 61, 97) else 0))
    perfil = {"username": "galeto.tv", "name": "Perfil Demonstração",
              "followers_count": seguidores, "follows_count": 610, "media_count": 412}
    return perfil, posts, historico


# ---------------------------------------------------------------- saída

def atualizar_historico(seguidores_hoje, ganhos_diarios, historico_demo=None):
    if historico_demo is not None:
        historico = historico_demo
    else:
        historico = {}
        era_demo = False
        if SAIDA_PATH.exists():
            try:
                era_demo = json.loads(SAIDA_PATH.read_text(encoding="utf-8")).get("demo", False)
            except Exception:
                pass
        # Na primeira coleta real, descarta o histórico fictício da demonstração
        if HISTORICO_PATH.exists() and not era_demo:
            historico = json.loads(HISTORICO_PATH.read_text(encoding="utf-8"))
        hoje = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        # Reconstrói dias passados que ainda não existem, a partir dos ganhos diários
        if ganhos_diarios:
            total = seguidores_hoje
            for dia in sorted(ganhos_diarios, reverse=True):
                if dia >= hoje:
                    continue
                historico.setdefault(dia, total)
                total -= ganhos_diarios[dia] or 0
        historico[hoje] = seguidores_hoje
    HISTORICO_PATH.write_text(json.dumps(dict(sorted(historico.items())), indent=1), encoding="utf-8")
    return [{"data": d, "seguidores": v} for d, v in sorted(historico.items())]


def salvar(cfg, perfil, posts, serie_seguidores, demo, extras=None):
    saida = {
        "titulo": cfg.get("titulo", "Painel do Instagram"),
        "fuso_horario": cfg.get("fuso_horario", "America/Sao_Paulo"),
        "atualizado_em": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "demo": demo,
        "perfil": {
            "usuario": perfil.get("username"),
            "nome": perfil.get("name"),
            "seguidores": perfil.get("followers_count"),
            "seguindo": perfil.get("follows_count"),
            "total_posts": perfil.get("media_count"),
            "bio": perfil.get("biography"),
            "site": perfil.get("website"),
            "avatar": (extras or {}).get("avatar"),
        },
        "grade": (extras or {}).get("grade", []),
        "conta_90d": (extras or {}).get("conta_90d"),
        "conta_30d": (extras or {}).get("conta_30d"),
        "publico": (extras or {}).get("publico"),
        "temas": list(cfg.get("categorias", {}).keys()) + [cfg.get("categoria_padrao", "Outros")],
        "seguidores_historico": serie_seguidores,
        "posts": sorted(posts, key=lambda p: p["data"] or "", reverse=True),
    }
    SAIDA_PATH.parent.mkdir(parents=True, exist_ok=True)
    SAIDA_PATH.write_text(json.dumps(saida, ensure_ascii=False, indent=1), encoding="utf-8")
    log(f"Pronto: {len(posts)} posts salvos em {SAIDA_PATH.relative_to(RAIZ)}")


def renovar_token(token):
    url = f"{BASE_IG}/refresh_access_token?" + urllib.parse.urlencode(
        {"grant_type": "ig_refresh_token", "access_token": token})
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            resp = json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError:
        # Tokens do login unificado (usuário do sistema) não expiram e não
        # passam por esta renovação.
        log("Este token não usa renovação (provavelmente não expira). Nada a fazer.")
        return
    novo = resp["access_token"]
    NOVO_TOKEN_PATH.write_text(novo, encoding="utf-8")
    dias = int(resp.get("expires_in", 0)) // 86400
    log(f"Token renovado. Novo prazo: ~{dias} dias.")


def main():
    cfg = carregar_config()
    args = sys.argv[1:]

    if "--demo" in args:
        perfil, posts, historico = coletar_demo(cfg)
        serie = atualizar_historico(perfil["followers_count"], {}, historico_demo=historico)
        salvar(cfg, perfil, posts, serie, demo=True)
        return

    token = os.environ.get("IG_ACCESS_TOKEN", "").strip()
    if not token:
        sys.exit("ERRO: defina o segredo IG_ACCESS_TOKEN (veja o README).")

    if "--refresh-token" in args:
        renovar_token(token)
        return

    try:
        perfil, posts, ganhos, extras = coletar_real(cfg, token)
    except ErroAPI as e:
        if '"code":190' in e.corpo.replace(" ", ""):
            sys.exit("ERRO: o token expirou ou é inválido. Gere um novo e atualize o segredo "
                     "IG_ACCESS_TOKEN (veja a seção 'Token' do README).")
        raise
    serie = atualizar_historico(perfil.get("followers_count") or 0, ganhos)
    salvar(cfg, perfil, posts, serie, demo=False, extras=extras)


if __name__ == "__main__":
    main()
