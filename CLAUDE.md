# Mídia Kit online — Galeto.tv

Site estático (HTML/CSS/JS puro, sem build) do mídia kit do creator **Galeto.tv** (humor, esporte e entretenimento), feito para enviar a marcas em prospecção. Responda e escreva textos do site em **português do Brasil**.

## Workflows (feito em 24/11/2026)
`atualizar-dados.yml` e `renovar-token.yml` já foram movidos para `.github/workflows/` e a pasta `workflows-para-mover/` foi apagada. O `.pages.yml` e o `.gitignore` foram recuperados do zip.

## Como rodar
```bash
python3 -m http.server 8000      # abra http://localhost:8000
python3 scripts/fetch_instagram.py --demo   # gera dados fictícios em data/
```
- O bloco "Instagram ao vivo" só aparece com dados reais. Com `data/dashboard.json` em modo demo, ele fica escondido, **a não ser** que o `<html>` tenha o atributo `data-previa` (usado só na prévia de aprovação).
- A fonte Unbounded (títulos) e a Montserrat (textos) vêm do Google Fonts.

## Estrutura
| Caminho | Conteúdo |
|---|---|
| `index.html` | esqueleto das seções |
| `assets/site.css` | estilos **mobile first** (base = celular; `min-width` 600/900/1180 acrescentam layout) |
| `assets/site.js` | renderiza tudo a partir de `conteudo/*.json` |
| `conteudo/perfil.json` | bio, títulos da seção "Quem é", credenciais, territórios, arrobas, contato |
| `conteudo/redes.json` | números e audiência do Instagram/TikTok (`total_seguidores` = "+250k") |
| `conteudo/destaques.json` | case em destaque (Copa do Mundo) |
| `conteudo/virais.json` | 10 virais (ordem = ranking) |
| `conteudo/parcerias.json` | mural do slide 12 + um case por slide (13–39), ver seção "Parcerias" abaixo |
| `midia/` | logo (3 versões), fotos recortadas, títulos das capas, fundos, mockups, logos de parceiros |
| `data/dashboard.json` | dados do Instagram (gerados automaticamente, não editar) |
| `scripts/fetch_instagram.py` | coleta da API do Instagram (Instagram Login, graph.instagram.com) — só biblioteca padrão |
| `.github/workflows/` | `atualizar-dados.yml` (2x/dia + deploy no GitHub Pages) e `renovar-token.yml` (token de 60 dias) |
| `.pages.yml` | painel de edição Pages CMS (formulários para os JSON) |
| `README.md` | guia para o dono do site publicar e editar |

## Identidade visual
- Cores: rosa `#f72b8b`, verde-limão `#d5ff00`, laranja `#ff6400`, preto `#131313`.
- Logotipo: `midia/logo/galeto-verde.webp` em fundos escuros/ondas (tem contorno preto), `galeto-preto.webp` sobre barras verdes e fundos brancos, `galeto-branco.webp` no rodapé. Sempre usar o logotipo onde aparece o nome "Galeto.tv" (arrobas como @galeto.tv continuam em texto).
- Painéis brancos com barra verde-limão no topo = padrão dos slides originais.
- **Textos com `**palavra**`** nos JSON viram destaque (função `rico()` em site.js). Nunca usar innerHTML com conteúdo dos JSON.

## Decisões importantes (pedidas pelo cliente — não desfazer)
1. **Capas em camadas, sempre em 16:9, inclusive no celular.** Cada capa (`.capitulo > .palco`) tem fundo + foto recortada + título como camadas `position:absolute` em %. As porcentagens foram **medidas por template matching nas artes originais 1920×1080** (valor = px ÷ 1920 ou ÷ 1080). Só a largura é definida (`height:auto`) → nada distorce.
2. **Nenhum recorte de foto pode aparecer.** Toda foto passa um pouco da borda onde foi cortada (ex.: `bottom: -0.5%`) e o palco tem `overflow:hidden`. Ao mexer em posições, manter essa regra.
3. **Seção "Quem é" (título "ENTRETENIMENTO / QUE VIRA RESENHA")**
   - ≥ 700px: réplica do slide — painel desenhado em 1180px e reduzido por inteiro via `zoom` (JS `escalarSobre()`); bio à esquerda, foto no meio subindo sobre o título e saindo pela base, credenciais à direita.
   - < 700px (celular em pé): título; bio à esquerda + foto à direita (`midia/fotos/sobre-celular.webp`, versão sem margem transparente) cortada pela borda de baixo do quadro (`overflow:hidden`); credenciais saem do quadro e viram "botões" na faixa escura `.faixa-cred`, com a frase final embaixo (mesmo estilo da faixa +250k/155k/+22M).
   - O título usa `ajustarTitulos()` para ocupar exatamente a largura.
3b. **Copa do Mundo** (`destaques.json`): diagramação do slide 7 com fontes e cores do site. Quadro branco à esquerda (escudo verde/amarelo/azul `midia/logo/escudo-copa.webp` + traço fino + "Cobertura in loco da / COPA DO MUNDO" em preto, datas, texto, logo MVA do slide), quadros pretos de métricas à direita. O fundo ondulado termina nesses quadros; embaixo vem a seção lisa `.copa-carrossel-secao` com as capas do slide 8 em 2 faixas (9 em cima, 9 embaixo, sentidos opostos). Item de `videos` sem `capa` não aparece.
4. Abertura: tagline e arrobas são HTML dentro do palco, com tamanhos em `cqw` e mínimo em px.
5. Personalização por marca: `?marca=Nome` mostra "Mídia kit preparado para Nome".
6. Placeholders (`.ph`) mostram o nome do que vai no lugar ("Logo · ge", "Capa 01"…) até a imagem ser enviada. O cliente pediu para mantê-los por enquanto.

## Parcerias = cópia fiel da apresentação (refeito em 24/11/2026, pedido do cliente)
Regra: a seção de parcerias segue **apenas** o Google Slides "MidiaKit_Galeto.tv 2026.2" (exportado em `10_Claude/08_pptx`). Não acrescentar marcas que não estejam lá.
- **Mural** (`parcerias.json` → `mural`): os logos do slide 12 mais Prime Sports (1º da 1ª linha) e Midea (1º da 2ª linha, sem link), pedidos pelo cliente: 7 + 7 + 9, coloridos, em `midia/mural/`. Cada quadro é um link para o exemplo de conteúdo daquele logo no slide (não abre o case). Salgueiro + Bateria Furiosa dividem um quadro, como no slide.
- **Cases** (`parcerias.json` → `parcerias`): um por slide, do 13 ao 39, na ordem dos slides. Cada um tem categoria, logos (versão escura do slide) + "& Galeto.tv", descrição com os negritos do slide, notas "// Parceria com…", período, visualizações, interações e o **mosaico** da coluna esquerda do slide: cada quadro tem a imagem como recortada no slide, posição e tamanho em % da coluna (68–521 × 0–810 px do slide) e o link (quadros com link mostram ▶).
- No site: cards com a maior foto do mosaico, logos, texto, período e números; "Ver case" abre a janela que reproduz o slide (mosaico à esquerda, painel à direita; empilha no celular).
- Gerado por script a partir do .pptx (imagens em `midia/cases/NN-marca-K.webp`, logos `-logoK.webp`). Logos antigos em `midia/parcerias/` não são mais usados pela seção.
- Outras imagens da apresentação: capas dos virais (`midia/virais/`), Reels e fotos da Copa (`midia/copa/`), "não é só futebol" (`midia/fotos/variedadeN.webp`), escudo `midia/logo/escudo-galeto.webp` (não usado).

## Pendências
- Prime Video e Midea não estão na apresentação, por isso saíram do site.
- Conferir com o cliente: viral nº 7 tem "+148k" de alcance para 2,5M de views (talvez 1,48M); links de TikTok (`@galeto.tv`) e YouTube (`@canal.galetotv`) não foram verificados; capa "Se liga na proposta" ainda sem uso; usar ou não o escudo GA LE TO na barra verde.
- **Publicação**: repositório GitHub público + GitHub Pages (Source: GitHub Actions) + segredos `IG_ACCESS_TOKEN` e opcional `GH_PAT` + Pages CMS + domínio próprio (registro.br, ~R$40/ano). Passo a passo no README.

## Prévia publicada
Existe uma prévia de aprovação publicada como artifact no claude.ai ("Galeto.tv — Mídia Kit"). Ela é uma cópia deste projeto com `data-previa` no `<html>`.

## Arquivos-fonte do cliente
Em `C:\Users\Galo\Desktop\@galeto.tv\@galeto.tv\06_Mídia Kit\2026\10_Claude\` (artes PNG/PSD das capas, fotos recortadas, logotipos, fundos, mockups, logos de parceiros em `07_logotipos parceiros`). Apresentação original no Google Slides "MidiaKit_Galeto.tv 2026.2".

## Como testar mudanças
Sempre conferir em 360, 390, 768, 1024 e 1440 px de largura (sem rolagem horizontal) e olhar cada capa: foto sem distorção e sem recorte visível.
