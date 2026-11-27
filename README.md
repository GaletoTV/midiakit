# Mídia Kit online — Galeto.tv

Site do mídia kit com a identidade dos slides. Ele tem:

- **números que se atualizam sozinhos**, puxados do Instagram de 15 em 15 dias (dias 1 e 15 de cada mês, de manhã);
- **painel de edição** (Pages CMS) para incluir parcerias, trocar fotos e atualizar números sem mexer em código;
- **link personalizado por marca**: `seusite.com.br/?marca=Nike` abre com "Mídia kit preparado para Nike" no topo;
- botão para **salvar em PDF**.

## Como o site está organizado

| Pasta / arquivo | O que tem | Como editar |
|---|---|---|
| `conteudo/parcerias.json` | todas as parcerias (marca, categoria, texto, logo, fotos, links) | painel → **Parcerias** |
| `conteudo/virais.json` | os 10 virais | painel → **Virais** |
| `conteudo/redes.json` | números e audiência do Instagram e do TikTok | painel → **Números e audiência** |
| `conteudo/destaques.json` | case em destaque (Copa do Mundo) | painel → **Case em destaque** |
| `conteudo/perfil.json` | bio, credenciais, territórios e contato | painel → **Perfil e contato** |
| `midia/` | logotipo (3 versões), recortes das capas, títulos, fundos, mockups, logos e fotos | enviadas pelo painel |
| `data/dashboard.json` | dados ao vivo do Instagram | **automático**, não edite |

Qualquer imagem ainda não enviada aparece como um **espaço tracejado com o nome do que vai ali**, por exemplo "Logo · Banco BMG". Assim que você envia a imagem pelo painel, ela substitui o espaço.

---

## Colocar no ar (uma vez só)

### 1. GitHub
1. Crie um repositório **público** no github.com (ex.: `midiakit`).
2. Envie **todo o conteúdo desta pasta**, incluindo as pastas ocultas `.github` e o arquivo `.pages.yml`. O jeito mais fácil é o app **GitHub Desktop**.
3. Vá em **Settings → Pages → Source: GitHub Actions**.
4. Vá em **Actions → Atualizar dados e publicar mídia kit → Run workflow**.

Em 1 a 2 minutos o site fica no ar em `https://SEU_USUARIO.github.io/midiakit/`. O arquivo `CNAME` já aponta para o domínio **galetotv.com.br**.

### 2. Números ao vivo do Instagram
Siga os passos 1, 2, 4 e 6 do README do painel que montamos antes: conta profissional, token do Instagram, segredo `IG_ACCESS_TOKEN` e, opcionalmente, `GH_PAT` para renovar o token sozinho.

Enquanto o token não estiver configurado, o site usa os números e o print do perfil que estão em `redes.json`. Quando os dados reais chegam (2 vezes por dia), atualizam sozinhos: seguidores, posts, seguindo, foto, bio, os 6 últimos posts do celular, os 2 posts flutuantes, as visualizações dos últimos 90 dias e o público (idade, gênero e cidades). O alcance de 90 dias é buscado direto do Instagram; se a API recusar a janela de 90 dias, fica o valor digitado em `redes.json`.

### 3. Painel de edição (Pages CMS)
1. Acesse **app.pagescms.org** e entre com sua conta do GitHub.
2. Instale o app do Pages CMS no seu GitHub quando ele pedir e escolha o repositório do mídia kit.
3. Pronto: aparecem as telas **Parcerias, Virais, Números e audiência, Case em destaque e Perfil e contato**.

Cada vez que você salva, o site é republicado sozinho em cerca de 1 minuto.

### 4. Domínio próprio (opcional, ~R$ 40/ano)
1. Registre o domínio no **registro.br** (ex.: `galetotv.com.br`).
2. No GitHub, vá em **Settings → Pages → Custom domain**, digite o domínio e salve.
3. No registro.br, em DNS, crie os registros que o GitHub mostrar: 4 registros **A** para a raiz e um **CNAME** `www` apontando para `SEU_USUARIO.github.io`.
4. Depois que o DNS propagar (algumas horas), marque **Enforce HTTPS**.

---

## Tarefas do dia a dia

**Incluir uma parceria nova:** no painel, abra *Parcerias* e clique em **Adicionar**. Preencha marca, categoria e descrição, envie o logo e as fotos e cole os links dos conteúdos. Marque *Mostrar primeiro no mural* para que ela apareça no começo.

**Atualizar números e audiência:** no painel, abra *Números e audiência*, troque os valores e o período e salve.

**Trocar um viral:** no painel, abra *Virais*. A ordem da lista é a ordem do ranking no site.

**Enviar para uma marca:** mande o link com o nome dela no final:
```
https://galetotv.com.br/?marca=Nome%20da%20Marca
```
(`%20` é o espaço; também funciona digitar o espaço normalmente no WhatsApp.)

**Destacar uma palavra em rosa** nos textos longos: escreva-a entre dois asteriscos, assim: `**palavra**`.

## Tamanhos recomendados para as imagens

| Imagem | Formato | Tamanho sugerido |
|---|---|---|
| Logo de marca | PNG com fundo transparente | 600 × 300 px |
| Fotos de case | vertical 9:16 ou 4:5 | 1080 × 1920 px |
| Capa de viral / conteúdo | vertical 9:16 | 720 × 1280 px |
| Fotos da seção "Quem é" | quadrada | 800 × 800 px |

Use JPG ou WebP para fotos, porque são bem mais leves que PNG.

## Para conferir

Itens que estavam na apresentação e precisam da sua confirmação (o site mostra "Marca a confirmar"):
- Parceria com foco em Branding / programas no YouTube
- Cobertura de jogos da Seleção Brasileira no Rio
- Conteúdo criativo das Olimpíadas com cupom
- Pré-Carnaval 2024 da Escola (qual escola?)
- Conteúdo em casal no Carnaval
- Parceiro da cobertura da Copa do Mundo

Confira também os links de vídeo de cada parceria. Alguns slides tinham links repetidos de outros cases, e eu mantive cada um só no case de origem.
