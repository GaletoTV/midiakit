/* Galeto.tv — Mídia Kit
   Todo o conteúdo vem dos arquivos da pasta /conteudo. Para atualizar textos,
   números, virais ou parcerias, edite esses arquivos (ou use o painel do Pages CMS). */
"use strict";

const $ = (s, r = document) => r.querySelector(s);
const nf = new Intl.NumberFormat("pt-BR");
const nf1 = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const compacto = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });

// ícones das redes (selo colorido + símbolo branco)
/* ícones de uma cor só (currentColor) para a abertura */
const ICONES_LINHA = {
  Instagram: [["rect", { x: 4, y: 4, width: 16, height: 16, rx: 4.8, fill: "none", stroke: "currentColor", "stroke-width": 2 }], ["circle", { cx: 12, cy: 12, r: 3.8, fill: "none", stroke: "currentColor", "stroke-width": 2 }], ["circle", { cx: 16.9, cy: 7.1, r: 1.2, fill: "currentColor" }]],
  TikTok: [["path", { d: "M16.6 3h-3.1v11.6a2.6 2.6 0 1 1-2.6-2.6c.27 0 .53.04.78.12V8.9a5.7 5.7 0 1 0 4.92 5.65V9.1a7 7 0 0 0 3.9 1.18V7.2a3.9 3.9 0 0 1-3.9-4.2z", fill: "currentColor" }]],
  Facebook: [["path", { d: "M13.6 21v-7.8h2.6l.4-3.1h-3v-2c0-.9.25-1.5 1.55-1.5h1.6V3.85c-.28-.04-1.24-.12-2.36-.12-2.33 0-3.93 1.42-3.93 4.04v2.3H7.85v3.1h2.6V21z", fill: "currentColor" }]],
  Kwai: [["circle", { cx: 7.2, cy: 6.6, r: 2.6, fill: "none", stroke: "currentColor", "stroke-width": 1.9 }], ["circle", { cx: 13.2, cy: 6.6, r: 2.6, fill: "none", stroke: "currentColor", "stroke-width": 1.9 }], ["rect", { x: 3.5, y: 10.4, width: 12.5, height: 9.6, rx: 2.4, fill: "none", stroke: "currentColor", "stroke-width": 1.9 }], ["path", { d: "M16 14.2l4.6-2.7v7.4L16 16.2z", fill: "none", stroke: "currentColor", "stroke-width": 1.9, "stroke-linejoin": "round" }]],
  YouTube: [["rect", { x: 2.6, y: 5.6, width: 18.8, height: 12.8, rx: 3.8, fill: "none", stroke: "currentColor", "stroke-width": 2 }], ["path", { d: "M10.2 9.3v5.4l4.7-2.7z", fill: "currentColor" }]],
};
function iconeLinha(nome) {
  const NS = "http://www.w3.org/2000/svg", mk = (t, a) => { const e = document.createElementNS(NS, t); for (const [k, v] of Object.entries(a)) e.setAttribute(k, v); return e; };
  const s = mk("svg", { viewBox: "0 0 24 24", class: "icone-linha", "aria-hidden": "true" });
  for (const [t, a] of (ICONES_LINHA[nome] || [])) s.append(mk(t, a));
  return s;
}

const ICONES_REDES = {
  Instagram: { fundo: "url(#ig-grad)", el: [["rect", { x: 6, y: 6, width: 12, height: 12, rx: 3.6, fill: "none", stroke: "#fff", "stroke-width": 1.8 }], ["circle", { cx: 12, cy: 12, r: 2.9, fill: "none", stroke: "#fff", "stroke-width": 1.8 }], ["circle", { cx: 15.5, cy: 8.5, r: 0.95, fill: "#fff" }]] },
  TikTok: { fundo: "#000", el: [["path", { d: "M15.6 5h-2.5v9.4a2.1 2.1 0 1 1-2.1-2.1l.6.1V9.8a4.6 4.6 0 1 0 4 4.5V9.7a5.6 5.6 0 0 0 3 .9V8.2a3.1 3.1 0 0 1-3-3.2z", fill: "#25F4EE", transform: "translate(-.6 -.4)" }], ["path", { d: "M15.6 5h-2.5v9.4a2.1 2.1 0 1 1-2.1-2.1l.6.1V9.8a4.6 4.6 0 1 0 4 4.5V9.7a5.6 5.6 0 0 0 3 .9V8.2a3.1 3.1 0 0 1-3-3.2z", fill: "#FE2C55", transform: "translate(.6 .4)" }], ["path", { d: "M15.6 5h-2.5v9.4a2.1 2.1 0 1 1-2.1-2.1l.6.1V9.8a4.6 4.6 0 1 0 4 4.5V9.7a5.6 5.6 0 0 0 3 .9V8.2a3.1 3.1 0 0 1-3-3.2z", fill: "#fff" }]] },
  Facebook: { fundo: "#1877F2", el: [["path", { d: "M13.3 20v-6.6h2.2l.35-2.6h-2.55V9.2c0-.75.2-1.27 1.3-1.27h1.35V5.6c-.23-.03-1.04-.1-1.98-.1-1.96 0-3.3 1.2-3.3 3.4v1.9H8.5v2.6h2.17V20z", fill: "#fff" }]] },
  Kwai: { fundo: "#FF7A00", el: [["rect", { x: 5, y: 8, width: 10, height: 8, rx: 2.2, fill: "#fff" }], ["path", { d: "M15.8 11.2 19 9.3v5.4l-3.2-1.9z", fill: "#fff" }], ["circle", { cx: 8.2, cy: 12, r: 1.1, fill: "#FF7A00" }], ["circle", { cx: 11.8, cy: 12, r: 1.1, fill: "#FF7A00" }]] },
  YouTube: { fundo: "#FF0000", el: [["path", { d: "M10 8.6v6.8l5.8-3.4z", fill: "#fff" }]] },
};
function iconeRede(nome) {
  const ic = ICONES_REDES[nome]; if (!ic) return null;
  const NS = "http://www.w3.org/2000/svg", mk = (t, a) => { const e = document.createElementNS(NS, t); for (const [k, v] of Object.entries(a)) e.setAttribute(k, v); return e; };
  const s = mk("svg", { viewBox: "0 0 24 24", class: "icone-rede", "aria-hidden": "true" });
  if (nome === "Instagram") {
    const d = mk("defs", {}), g = mk("linearGradient", { id: "ig-grad", x1: 0, y1: 1, x2: 1, y2: 0 });
    [["0", "#FEDA75"], [".3", "#FA7E1E"], [".6", "#D62976"], ["1", "#4F5BD5"]].forEach(([o, c]) => g.append(mk("stop", { offset: o, "stop-color": c })));
    d.append(g); s.append(d);
  }
  s.append(mk("rect", { width: 24, height: 24, rx: 6.5, fill: ic.fundo }));
  ic.el.forEach(([t, a]) => s.append(mk(t, a)));
  return s;
}

function h(tag, attrs = {}, ...filhos) {
  const e = tag === "svg" ? document.createElementNS("http://www.w3.org/2000/svg", "svg") : document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") e.setAttribute("class", v);
    else if (k === "text") e.textContent = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? "" : v);
  }
  for (const f of filhos.flat()) if (f != null) e.append(f instanceof Node ? f : document.createTextNode(f));
  return e;
}

/* **texto** vira destaque em rosa (sem usar innerHTML) */
function rico(texto) {
  const frag = document.createDocumentFragment();
  String(texto || "").split(/(\*\*[^*]+\*\*)/g).forEach((parte) => {
    if (/^\*\*[^*]+\*\*$/.test(parte)) frag.append(h("strong", { class: "realce", text: parte.slice(2, -2) }));
    else if (parte) frag.append(document.createTextNode(parte));
  });
  return frag;
}

/* Imagem ou espaço reservado com o nome do que vai ali */
function imagem(src, rotulo, formato = "paisagem", escuro = false) {
  if (src) return h("img", { src, alt: rotulo, loading: "lazy", class: "preenchida", style: formato === "vertical" ? "aspect-ratio:9/16" : formato === "quadrado" ? "aspect-ratio:1" : "aspect-ratio:4/3" });
  return h("div", { class: `ph ${formato}${escuro ? " escuro" : ""}`, role: "img", "aria-label": `Espaço para imagem: ${rotulo}` }, rotulo);
}
function logo(src, marca, escuro = false) {
  if (src) return h("div", { class: "logo-img" }, h("img", { src, alt: `Logo ${marca}`, loading: "lazy" }));
  return h("div", { class: `ph logo${escuro ? " escuro" : ""}` }, `Logo · ${marca}`);
}

/* Logotipo do Galeto.tv na versão certa para o fundo:
   preto sobre verde/branco, verde ou branco sobre fundos escuros */
function logoGaleto(versao = "preto", sufixo = "") {
  const img = h("img", { class: "logo-barra", src: `midia/logo/galeto-${versao}.webp`, alt: "Galeto.tv", width: 900, height: 158 });
  return sufixo ? h("span", { class: "topo-marca" }, img, h("b", { text: sufixo })) : img;
}

async function carregar(caminho) {
  const r = await fetch(caminho, { cache: "no-cache" });
  if (!r.ok) throw new Error(caminho);
  return r.json();
}

/* ---------------- personalização por marca: ?marca=Nome ---------------- */
function personalizar() {
  const p = new URLSearchParams(location.search);
  const marca = (p.get("marca") || p.get("para") || "").trim().slice(0, 40);
  if (!marca) return;
  $("#nome-marca").textContent = marca;
  document.body.classList.add("personalizado");
  document.title = `Galeto.tv × ${marca} — Mídia Kit`;
}

/* ---------------- seções ---------------- */
function renderPerfil(p) {
  $("#usuario-topo").textContent = "@" + p.usuario_instagram;
  if (p.titulo_linha1) $("#titulo-l1").textContent = p.titulo_linha1;
  if (p.titulo_linha2) $("#titulo-l2").textContent = p.titulo_linha2;
  // abertura: ícones das redes em verde-limão dentro de círculos, cada um com link
  const iconesRedes = () => (p.arrobas || []).filter((a) => a.link).map((a) => h("li", {},
    h("a", { href: a.link, target: "_blank", rel: "noopener", "aria-label": `${a.rede || "Rede"} ${a.texto || ""}`.trim(), title: `${a.rede || ""} ${a.texto || ""}`.trim() },
      iconeLinha(a.rede))));
  $("#arrobas").append(...iconesRedes());
  document.querySelectorAll(".redes-capa").forEach((ul) => ul.append(...iconesRedes()));
  // parágrafos da bio separados por linha em branco no JSON
  const partesBio = String(p.bio || "").split(/\n\s*\n/);
  $("#bio").append(rico(partesBio[0]));
  let ultimoBio = $("#bio");
  partesBio.slice(1).forEach((t) => { const np = h("p", {}, rico(t)); ultimoBio.after(np); ultimoBio = np; });
  const fr = $("#frase");
  const [a, ...b] = p.frase_destaque.split(",");
  fr.append(a + (b.length ? "," : ""), b.length ? h("em", { text: b.join(",") }) : "");
  $("#fechamento").append(rico(p.fechamento_bio));
  $("#cred-botoes").append(...p.credenciais.map((c) => h("li", {}, c.destaque ? h("b", { text: c.destaque }) : null, c.destaque ? " " : null, negrito(c.texto))));
  $("#cred-final").append(rico(p.fechamento_bio));
  $("#credenciais").append(...p.credenciais.map((c) => h("li", {}, c.destaque ? h("b", { text: c.destaque }) : null, c.destaque ? " " : null, negrito(c.texto))));
  $("#territorios-linha").textContent = p.territorios_linha;
  $("#territorios").append(...p.territorios.map((t) => h("li", {}, h("b", { text: t.nome }), h("span", { text: t.papel }))));
  $("#variedade-titulo").textContent = p.variedade_titulo;
  $("#variedade-texto").append(rico(p.variedade_texto));
  // carrossel: a lista aparece duas vezes para o loop não ter emenda (a cópia fica escondida do leitor de tela)
  const fotosVar = (p.fotos_variedade || []).filter(Boolean);
  [false, true].forEach((copia) => fotosVar.forEach((src, i) =>
    $("#fotos-variedade").append(h("img", { src, alt: copia ? "" : `Galeto em cenário ${i + 1}`, loading: "lazy", ...(copia ? { "aria-hidden": "true" } : {}) }))));
  $("#formatos").append(...(p.formatos || []).map((f) => h("span", { class: "chip", text: f })));

  // contato
  const c = p.contato;
  // contato oficial: e-mail
  const mail = `mailto:${c.email}?subject=${encodeURIComponent("Parceria com o Galeto.tv")}`;
  document.querySelectorAll("[data-email]").forEach((a) => { a.href = mail; });
  $("#acoes-contato").append(
    h("a", { class: "botao", href: mail }, "Enviar e-mail"),
    c.instagram && h("a", { class: "botao contorno", href: c.instagram, target: "_blank", rel: "noopener" }, "Instagram"),
    c.tiktok && h("a", { class: "botao contorno", href: c.tiktok, target: "_blank", rel: "noopener" }, "TikTok"),
    c.youtube && h("a", { class: "botao contorno", href: c.youtube, target: "_blank", rel: "noopener" }, "YouTube"),
  );
  $("#dados-contato").append(h("b", { text: c.email }));
  $("#rodape-texto").textContent = `© ${new Date().getFullYear()} · ${p.territorios_linha}`;
}

function barra(rotulo, pct, max = 100) {
  return h("div", { class: "barra" },
    h("div", { class: "l" }, h("span", { text: rotulo }), h("span", { text: nf1.format(pct) + "%" })),
    h("div", { class: "t" }, h("i", { style: `width:${Math.max(2, (pct / max) * 100)}%` })));
}

/* número "do Instagram" (trunca, como o app): 157822 -> "157k", 13797341 -> "13.7M" */
function curto(n) {
  if (n == null) return "";
  if (n >= 1e6) return nf1.format(Math.floor(n / 1e5) / 10).replace(/,0$/, "").replace(",", ".") + "M";
  if (n >= 1e3) return Math.floor(n / 1e3) + "k";
  return String(n);
}
/* visualizações: sempre arredonda para cima, sem casa decimal: 13797341 -> "14M" */
function curtoCima(n) {
  if (n == null) return "";
  if (n >= 1e6) return Math.ceil(n / 1e6) + "M";
  if (n >= 1e3) return Math.ceil(n / 1e3) + "k";
  return String(n);
}
const milhar = new Intl.NumberFormat("pt-BR");

/* Mockup do perfil do Instagram (visão do público), montado em HTML.
   Com dados reais (data/dashboard.json) mostra foto, bio, números e as 9 últimas capas;
   sem eles, usa o que está em conteudo/redes.json → perfil_mockup. */
function mockupInstagram(base, ao) {
  const p = ao ? ao.perfil : {};
  const nome = p.nome || base.nome;
  const bio = p.bio || base.bio || "";
  const grade = ao && ao.grade && ao.grade.length ? ao.grade : (base.grade || []).map((img) => ({ img }));
  const icone = (d, extra = {}) => h("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", ...extra }, ...d.map((x) => { const e = document.createElementNS("http://www.w3.org/2000/svg", "path"); e.setAttribute("d", x); return e; }));
  const ICS = {
    chat: ["M4 12a7 7 0 1 1 3 5.7L4 19l1-3.2A7 7 0 0 1 4 12z", "M9 12h.01M12 12h.01M15 12h.01"],
    threads: ["M16.5 11.2c-.3-2.7-2-4.2-4.6-4.2-2 0-3.5.9-4.2 2.4M16.5 11.2c2.3 1 3 3.4 1.8 5.5-1.2 2-3.6 3.1-6.3 3.1-4.4 0-7-2.9-7-7.8S7.6 4.2 12 4.2c3.6 0 6 1.8 6.9 4.9", "M16.5 11.2c-1-.4-2.2-.6-3.6-.5-2.4.2-3.8 1.3-3.7 2.9.1 1.4 1.5 2.3 3.2 2.2 2.4-.1 3.9-1.8 4.1-4.6z"],
    facebook: ["M12 3a9 9 0 0 0-1.4 17.9V14.6H8.3V12h2.3v-2c0-2.3 1.4-3.5 3.4-3.5 1 0 2 .2 2 .2v2.2h-1.1c-1.1 0-1.5.7-1.5 1.4V12h2.5l-.4 2.6h-2.1v6.3A9 9 0 0 0 12 3z"],
    email: ["M3.5 6h17v12h-17z", "M3.5 6.5 12 13l8.5-6.5"],
  };
  const seg = ao ? curto(p.seguidores).replace("k", " mil").replace("M", " mi") : base.seguidores_txt;
  return h("div", { class: "ig-celular", role: "img", "aria-label": `Perfil @${(ao && p.usuario) || "galeto.tv"} no Instagram` },
    h("div", { class: "ig-tela" },
      h("div", { class: "ig-status" }, h("span", { text: "17:09" }), h("span", { class: "ig-ilha" }), h("span", { class: "ig-bat" })),
      h("div", { class: "ig-barra" }, h("span", { class: "ig-voltar", text: "‹" }),
        h("b", { text: (ao && p.usuario) || "galeto.tv" }), base.verificado ? h("span", { class: "ig-verif", text: "✓" }) : null,
        h("span", { class: "ig-sino" }, icone(["M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z", "M10 20.5h4", "M9.5 11.5l2 2 3-3.5"])),
        h("span", { class: "ig-mais", text: "···" })),
      h("div", { class: "ig-cab" },
        h("div", { class: "ig-avatar" }, h("img", { src: (ao && p.avatar) || base.avatar, alt: "" })),
        h("div", { class: "ig-dados" },
          h("b", { class: "ig-nome", text: nome }),
          h("div", { class: "ig-stats" },
            h("span", {}, h("b", { text: milhar.format((ao && p.total_posts) || base.posts) }), "posts"),
            h("span", {}, h("b", { text: seg }), "seguidores"),
            h("span", {}, h("b", { text: milhar.format((ao && p.seguindo) || base.seguindo) }), "seguindo")))),
      h("p", { class: "ig-bio", text: bio }),
      base.link ? h("p", { class: "ig-link" }, icone(["M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1", "M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"]), base.link) : null,
      base.chips ? h("div", { class: "ig-chips" }, ...base.chips.map((c) => h("span", {}, ICS[c.icone] ? icone(ICS[c.icone]) : null, h("b", { text: c.texto }), c.extra ? h("em", { text: c.extra }) : null)))
        : h("div", { class: "ig-botoes" }, h("span", { text: "Seguindo ⌄" }), h("span", { text: "Mensagem" }), h("span", { text: "Email" })),
      h("div", { class: "ig-destaques" }, ...(base.destaques || []).map((d) =>
        h("span", {}, h("i", {}, h("img", { src: d.img, alt: "" })), d.titulo))),
      h("div", { class: "ig-abas" },
        h("span", { class: "on" }, icone(["M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z"], { class: "cheio" })),
        h("span", {}, icone(["M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z", "M10 9l5 3-5 3z"])),
        h("span", {}, icone(["M5 7h14v10H5z", "M14 7h3a2 2 0 0 1 2 2v1"])),
        h("span", {}, icone(["M17 4l3 3-3 3", "M20 7H8a4 4 0 0 0-4 4v1", "M7 20l-3-3 3-3", "M4 17h12a4 4 0 0 0 4-4v-1"])),
        h("span", {}, icone(["M4 7h3l2-2h6l2 2h3v12H4z", "M12 14a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8 18c.6-2 2.2-3 4-3s3.4 1 4 3"]))),
      h("div", { class: "ig-grade" }, ...grade.slice(0, 6).map((g) => h("span", {}, h("img", { src: g.img, alt: "", loading: "lazy" })))),
      h("div", { class: "ig-nav" }, icone(["M4 11l8-7 8 7v9h-5v-6H9v6H4z"]), icone(["M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 20 20"]), icone(["M4 4h16v16H4zM12 8v8M8 12h8"]), icone(["M4 4h16v16H4zM10 9l5 3-5 3z"]), h("img", { src: (ao && p.avatar) || base.avatar, alt: "" })))
  );
}

// cena com o mockup entregue (PNG com áreas brancas): o perfil e os 2 posts
// são encaixados em perspectiva (matrix3d) por baixo da moldura em "multiply"
const QUADROS_MOLDURA = { // cantos (TL, TR, BR, BL) no palco de 1062×1397
  tela: [[-16.6, 708.6], [416.2, 534.7], [932.0, 1161.6], [497.0, 1351.8]],
  tras: [[273.0, 421.0], [716.0, 283.0], [878.0, 822.0], [418.0, 962.0]],
  frente: [[600.5, 13.5], [1046.0, 132.0], [956.5, 679.0], [500.5, 565.0]],
};
function matrizQuad(w, hgt, q) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den, k = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + k * x3, d = y1 - y0 + g * y1, e = y3 - y0 + k * y3;
  return `matrix3d(${[a / w, d / w, 0, g / w, b / hgt, e / hgt, 0, k / hgt, 0, 0, 1, 0, x0, y0, 0, 1].map((n) => +n.toFixed(8)).join(",")})`;
}
function cenaInstagram(base, ao) {
  const grade = ao && ao.grade && ao.grade.length ? ao.grade : (base.grade || []).map((img) => ({ img }));
  const cards = ao && ao.grade && ao.grade.length ? grade : (base.cards || base.grade || []).map((img) => ({ img }));
  const tela = mockupInstagram(base, ao).firstChild; // só a tela; a moldura vem do PNG
  tela.classList.add("ig-tela-3d");
  tela.style.transform = matrizQuad(300, 652, QUADROS_MOLDURA.tela);
  const post = (g, nome) => g ? h("div", { class: "ig-post-3d", style: `transform:${matrizQuad(400, 500, QUADROS_MOLDURA[nome])}` }, h("img", { src: g.img, alt: "" })) : null;
  const cena = h("div", { class: "ig-cena ig-cena-moldura", role: "img", "aria-label": "Perfil @galeto.tv no Instagram" },
    h("div", { class: "ig-camada" }, tela, post(cards[1], "tras"), post(cards[0], "frente")),
    h("img", { class: "ig-moldura", src: "midia/mockups/ig/moldura.webp", alt: "" }),
    h("img", { class: "ig-moldura-topo", src: "midia/mockups/ig/moldura-topo.webp", alt: "" }));
  const caixa = h("div", { class: "ig-cena-caixa" }, cena);
  const ajustar = () => { const z = Math.min(1, caixa.clientWidth / 1062); cena.style.zoom = z.toFixed(4); };
  new ResizeObserver(ajustar).observe(caixa);
  return caixa;
}

// cena moderna: celular em pé, nítido, com posts e números flutuando ao redor
function cenaModerna(base, ao, nums) {
  const grade = ao && ao.grade && ao.grade.length ? ao.grade : (base.grade || []).map((img) => ({ img }));
  const cards = ao && ao.grade && ao.grade.length ? grade : (base.cards || base.grade || []).map((img) => ({ img }));
  const avatar = (ao && ao.perfil && ao.perfil.avatar) || base.avatar;
  const ic = (d, cls) => h("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", class: cls }, ...d.map((x) => { const e = document.createElementNS("http://www.w3.org/2000/svg", "path"); e.setAttribute("d", x); return e; }));
  const post = (g, cls) => g ? h("div", { class: "mod-post " + cls, "aria-hidden": "true" },
    h("div", { class: "mod-post-cab" }, h("img", { src: avatar, alt: "" }), h("b", { text: "galeto.tv" }), h("span", { class: "ig-verif", text: "✓" })),
    h("img", { class: "mod-post-img", src: g.img, alt: "" }),
    h("div", { class: "mod-post-pe" },
      ic(["M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"], "curtido"),
      ic(["M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.3A8 8 0 1 1 20 11.5z"]),
      ic(["M21 4 3 11l7 2.5L12.5 21z", "M10 13.5 21 4"]),
      ic(["M6 3h12v18l-6-5-6 5z"], "salvar"))) : null;
  const chip = (cls, valor, rotulo, icone) => h("div", { class: "mod-chip " + cls, "aria-hidden": "true" },
    icone, h("div", {}, h("b", { text: valor }), h("small", { text: rotulo })));
  const cena = h("div", { class: "mod-cena" },
    h("span", { class: "mod-marca", "aria-hidden": "true", text: "@galeto.tv" }),
    h("i", { class: "mod-brilho a" }), h("i", { class: "mod-brilho b" }),
    post(cards[1], "esq"),
    h("div", { class: "mod-celular" }, mockupInstagram(base, ao)),
    post(cards[0], "dir"),
    chip("c1", nums[0] ? nums[0].valor : "", "seguidores", iconeRede("Instagram")),
    nums[2] ? chip("c2", nums[2].valor, "visualizações", h("span", { class: "mod-play", text: "▶" })) : null);
  const caixa = h("div", { class: "ig-cena-caixa mod-caixa" }, cena);
  const ajustar = () => { const z = Math.min(1, caixa.clientWidth / 600); cena.style.zoom = z.toFixed(4); };
  new ResizeObserver(ajustar).observe(caixa);
  return caixa;
}

// métricas do Instagram: seguidores, visualizações, alcance, interações e taxa de engajamento (últimos 30 dias)
function kpisInstagram(rede, ao, nums) {
  const man = rede.interacoes || {};
  const vivo = ao && ao.conta_30d && ao.conta_30d.interacoes;
  const fmt = (n) => (typeof n === "number" ? curto(n) : n) || "—";
  const it = vivo ? {
    total: "+" + curto(vivo.total), curtidas: curto(vivo.curtidas), comentarios: curto(vivo.comentarios),
    compartilhamentos: curto(vivo.compartilhamentos), salvamentos: curto(vivo.salvamentos),
  } : { total: fmt(man.total), curtidas: fmt(man.curtidas), comentarios: fmt(man.comentarios), compartilhamentos: fmt(man.compartilhamentos), salvamentos: fmt(man.salvamentos) };
  // taxa = interações ÷ alcance (30 dias); com dado manual, usa o valor digitado
  let taxa = rede.taxa_engajamento || "—";
  const alcance = (ao && ao.conta_30d && ao.conta_30d.alcance) || rede.alcance_numero;
  if (vivo && vivo.total && alcance) taxa = (vivo.total / alcance * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "%";
  const caixa = (cls, v, r) => h("div", { class: "kpi " + cls }, h("div", { class: "v", text: v }), h("div", { class: "r", text: r }));
  const mini = (v, r) => h("span", {}, h("b", { text: v }), r);
  return h("div", { class: "kpis kpis-ig" },
    caixa("k-seg", nums[0].valor, "seguidores"),
    caixa("k-vis", nums[2] ? nums[2].valor : "—", "visualizações · 30 dias"),
    caixa("k-alc", nums[1] ? nums[1].valor : "—", "alcance · 30 dias"),
    h("div", { class: "kpi k-int" },
      h("div", {}, h("div", { class: "v", text: it.total }), h("div", { class: "r", text: "interações · 30 dias" })),
      h("div", { class: "k-int-det" }, mini(it.curtidas, "curtidas"), mini(it.comentarios, "comentários"), mini(it.compartilhamentos, "compartilhamentos"), mini(it.salvamentos, "salvamentos"))),
    caixa("k-taxa", taxa, "taxa de engajamento"));
}

function renderRedes(r, dash) {
  const ao = dash && !dash.demo ? dash : null; // só usa dados reais; sem eles, valores digitados
  $("#total").textContent = r.total_seguidores;
  $("#total-texto").textContent = `${r.total_texto}. ${r.rede_principal_texto}`;
  const rede = r.redes[0];
  const base = { ...(rede.perfil_mockup || {}), seguidores_txt: ((rede.numeros[0] || {}).valor || "").replace(/k$/, " mil") };
  // números: seguidores, visualizações e alcance (30 dias) vêm da API quando houver
  const nums = rede.numeros.map((n) => ({ ...n }));
  if (ao) {
    if (ao.perfil && ao.perfil.seguidores) nums[0].valor = curto(ao.perfil.seguidores);
    if (ao.conta_30d && ao.conta_30d.views && nums[2]) nums[2].valor = "+" + curtoCima(ao.conta_30d.views);
    if (ao.conta_30d && ao.conta_30d.alcance && nums[1]) nums[1].valor = "+" + curtoCima(ao.conta_30d.alcance);
  }
  const pub = (ao && ao.publico) || rede;
  const faixa = pub.faixa_etaria || [], cidades = pub.cidades || [], genero = pub.genero || { homens: 0, mulheres: 0 };
  const maxCid = Math.max(1, ...cidades.map((c) => c.percentual));
  const maxIdade = Math.max(...faixa.map((c) => c.percentual), 50);
  const periodo = rede.periodo || "Dados atualizados todo dia";
  $("#redes").append(h("article", { class: "painel rede rede-ig revelar", "data-rede": "Instagram" },
    h("div", { class: "lado-mockup ig-palco" },
      cenaModerna(base, ao, nums),
    ),
    h("div", { class: "painel-corpo" },
      h("div", { class: "rede-cab" }, h("h3", {}, iconeRede("Instagram"), "Instagram"), h("span", { class: "periodo", text: periodo })),
      h("p", { class: "rede-sub", text: `${rede.usuario} · rede principal` }),
      kpisInstagram(rede, ao, nums),
      h("div", { class: "publico" },
        h("div", {}, h("h4", { text: "Faixa etária" }), faixa.map((f) => barra(f.faixa, f.percentual, maxIdade))),
        h("div", { class: "genero" }, h("h4", { text: "Gênero" }),
          h("div", { class: "t", role: "img", "aria-label": `Homens ${genero.homens}%, mulheres ${genero.mulheres}%` },
            h("i", { class: "h", style: `width:${genero.homens}%`, text: genero.homens + "%" }),
            h("i", { class: "m", style: `width:${genero.mulheres}%`, text: genero.mulheres + "%" })),
          h("div", { class: "leg" }, h("span", { text: "Homens" }), h("span", { text: "Mulheres" }))),
        h("div", {}, h("h4", { text: "Principais cidades" }), cidades.map((c) => barra(c.cidade, c.percentual, maxCid * 1.15)))))));
  // demais redes: só seguidores e visualizações
  $("#outras-redes").append(...(r.outras_redes || []).map((o) =>
    h("article", { class: "rede-mini", "data-rede": o.nome },
      h("div", { class: "rede-mini-cab" }, h("b", {}, iconeRede(o.nome), o.nome), h("span", { text: o.usuario })),
      h("div", { class: "rede-mini-nums" },
        h("div", {}, h("b", { class: o.seguidores ? "" : "vazio", text: o.seguidores || "—" }), h("small", { text: o.rotulo_seguidores || "seguidores" })),
        h("div", {}, h("b", { class: o.visualizacoes ? "" : "vazio", text: o.visualizacoes || "—" }), h("small", { text: "visualizações" }))),
      o.periodo ? h("small", { class: "rede-mini-per", text: o.periodo }) : null)));
  // faixa da abertura: visualizações = Instagram + todas as outras redes, no mesmo período.
  // Usa 30 dias quando todas as outras redes estiverem em "últimos 30 dias"; senão, 90 dias.
  const numero = (t) => {
    const m = String(t || "").replace(",", ".").match(/([\d.]+)\s*([kKmM]?)/);
    if (!m) return 0;
    return parseFloat(m[1]) * ({ k: 1e3, m: 1e6 }[m[2].toLowerCase()] || 1);
  };
  const outras = r.outras_redes || [];
  const em30 = outras.every((o) => /30/.test(o.periodo || ""));
  const contaIg = ao && (em30 ? ao.conta_30d : ao.conta_90d);
  const viewsIg = (contaIg && contaIg.views) || numero(nums[2].valor);
  const viewsTotal = viewsIg + (r.outras_redes || []).reduce((s, o) => s + numero(o.visualizacoes), 0);
  $("#faixa-numeros").append(
    h("div", { class: "item" }, h("div", { class: "v", text: r.total_seguidores }), h("div", { class: "r", text: "seguidores em todas as redes" })),
    h("div", { class: "item" }, h("div", { class: "v", text: "+" + curtoCima(viewsTotal) }), h("div", { class: "r", text: `visualizações em todas as redes · ${em30 ? 30 : 90} dias` })),
  );

  // prévia do quadro do Instagram na capa (30 dias): seguidores, visualizações e alcance + botão
  const previa = () => h("div", { class: "previa-ig" },
    h("p", { class: "previa-cab" }, iconeLinha("Instagram"), h("span", { text: "Instagram · últimos 30 dias" })),
    h("div", { class: "previa-nums" },
      [[nums[0], "seguidores"], [nums[2], "visualizações"], [nums[1], "alcance"]].map(([n, rot]) =>
        h("div", { class: "previa-kpi" }, h("b", { text: (n && n.valor) || "—" }), h("small", { text: rot })))),
    h("a", { class: "botao previa-botao", href: "#numeros" }, "Acessar métricas completas"));
  $("#previa-capa").append(previa());
  $("#previa-capa-cel").append(previa());
}

function renderDestaques(d) {
  // diagramação do slide 7: quadro branco com escudo, textos e parceiro à esquerda, quadros de métricas à direita
  // (fontes e cores do site); embaixo, as capas dos conteúdos passando em carrossel
  const box = $("#destaques");
  for (const c of d.destaques || []) {
    const videos = (c.videos || []).filter((v) => v && v.link && v.capa);
    box.append(
      h("div", { class: "copa-grid" },
        h("article", { class: "painel destaque copa-painel revelar" },
          h("div", { class: "painel-topo" }, h("span", { text: "Case em destaque" }), h("small", { text: c.datas })),
          h("div", { class: "painel-corpo" },
            h("div", { class: "copa-cab" },
              c.escudo ? h("img", { class: "copa-escudo", src: c.escudo, alt: "Escudo Galeto nas cores do Brasil", width: 520, height: 615 }) : null,
              h("div", {},
                h("p", { class: "chapeu", text: c.chapeu }),
                h("h2", { class: "titulo-secao", text: c.titulo }))),
            h("p", { class: "datas", text: c.datas }),
            h("p", {}, rico(c.texto)),
            h("div", { class: "parceiro-linha" }, "Parceiro", logo(c.logo_parceiro, c.parceiro || "parceiro")))),
        h("div", { class: "nums-destaque copa-nums revelar" }, (c.numeros || []).map((n) => h("div", {}, h("div", { class: "v", text: n.valor }), h("div", { class: "r", text: n.rotulo })))))
    );
    // 2 faixas: a primeira metade das capas em cima, a outra embaixo (sentido contrário)
    const meio = Math.ceil(videos.length / 2);
    [videos.slice(0, meio), videos.slice(meio)].forEach((linha, l) => {
      if (!linha.length) return;
      $("#destaques-carrossel").append(h("div", { class: "carrossel-variedade carrossel-copa" + (l ? " volta" : "") },
        h("div", { class: "trilho" }, ...[false, true].flatMap((copia) => linha.map((v, i) =>
          h("a", { href: v.link, target: "_blank", rel: "noopener", ...(copia ? { "aria-hidden": "true", tabindex: "-1" } : { "aria-label": `Assistir conteúdo ${l * meio + i + 1} da Copa` }) },
            h("img", { src: v.capa, alt: "", loading: "lazy" }), h("span", { class: "play", text: "▶ Assistir" })))))));
    });
  }
}

// capas dos virais no formato quase quadrado do slide 10 (118×134), sem cortar a imagem
function capaViral(src, i) {
  const el = imagem(src, `Capa do viral ${i + 1}`, "quadrado", true);
  el.style.aspectRatio = "118 / 134";
  return el;
}
function renderVirais(v) {
  $("#virais-titulo").textContent = v.titulo;
  $("#virais-texto").textContent = v.texto;
  $("#grid-virais").append(...(v.virais || []).map((x, i) =>
    h("a", { class: "viral revelar", href: x.link, target: "_blank", rel: "noopener" },
      h("div", { class: "midia" }, capaViral(x.capa, i),
        h("div", { class: "views" }, h("b", { text: x.visualizacoes }), h("span", { text: "visualizações" }))),
      h("div", { class: "info" },
        x.titulo ? h("b", { text: x.titulo }) : null,
        h("span", {}, h("b", { text: x.alcance }), " de alcance"),
        h("span", {}, h("b", { text: x.interacoes }), " interações")),
      h("span", { class: "assistir", text: "▶ Assistir" }))));
}

let PARCERIAS = [];
/* Parcerias: tudo segue a apresentação. Mural = slide 12 (cada logo abre 1 exemplo);
   cada case = o slide individual da marca (mosaico à esquerda, painel à direita). */
const ehVideo = (l) => /youtu|\/reels?\/|\/p\//.test(l || "");
function negrito(texto) {
  // **palavra** vira negrito simples (como no slide), sem innerHTML
  const frag = document.createDocumentFragment();
  String(texto || "").split(/(\*\*[^*]+\*\*)/g).forEach((parte) => {
    if (/^\*\*[^*]+\*\*$/.test(parte)) frag.append(h("b", { text: parte.slice(2, -2) }));
    else if (parte) frag.append(document.createTextNode(parte));
  });
  return frag;
}
function linhaLogos(x) {
  const itens = [];
  (x.logos || []).forEach((src, k) => {
    if (k) itens.push(h("span", { class: "e", text: "&" }));
    // "logo_grande" no JSON: true (todos os logos da marca) ou lista de posições (0, 1…) que ficam maiores nos cards
    const grande = x.logo_grande === true || (Array.isArray(x.logo_grande) && x.logo_grande.includes(k));
    itens.push(h("img", { src, alt: `Logo ${x.marca}`, loading: "lazy", class: grande ? "grande" : null }));
  });
  itens.push(h("span", { class: "e", text: "&" }), h("img", { class: "galeto", src: "midia/logo/galeto-preto.webp", alt: "Galeto.tv", loading: "lazy" }));
  return h("div", { class: "logos-case" }, ...itens);
}
function numerosCase(x) {
  return h("div", { class: "numeros-case" },
    x.periodo ? h("div", { class: "periodo" }, h("span", { text: "Período" }), h("span", { text: x.periodo })) : null,
    h("div", { class: "nums" },
      x.visualizacoes ? h("div", {}, h("b", { text: x.visualizacoes }), h("small", { text: "visualizações" })) : null,
      x.interacoes ? h("div", {}, h("b", { text: x.interacoes }), h("small", { text: "interações" })) : null));
}
function mosaico(x) {
  return h("div", { class: "mosaico" }, ...(x.mosaico || []).map((t, k) => {
    const estilo = `left:${t.x}%;top:${t.y}%;width:${t.w}%;height:${t.h}%`;
    const img = h("img", { src: t.img, alt: t.link ? `Conteúdo ${k + 1} de ${x.marca}` : `Foto ${k + 1} de ${x.marca}`, loading: "lazy" });
    return t.link
      ? h("a", { class: "quadro video", href: t.link, target: "_blank", rel: "noopener", style: estilo, "aria-label": `Assistir conteúdo de ${x.marca}` }, img, h("span", { class: "play", "aria-hidden": "true" }))
      : h("div", { class: "quadro", style: estilo }, img);
  }));
}
function renderParcerias(p) {
  PARCERIAS = (p.parcerias || []).map((x) => ({ ...x, marca: x.marca || "Marca", categoria: x.categoria || "Geral", descricao: x.descricao || "", logos: (x.logos || []).filter(Boolean), notas: x.notas || [], mosaico: x.mosaico || [] }));
  // mural: exatamente os logos do slide 12, cada um levando a um exemplo de conteúdo
  $("#mural").append(...(p.mural || []).map((m) =>
    // quadro com link abre um exemplo; sem link (ex.: Midea) é só o logo
    m.link
      ? h("a", { href: m.link, target: "_blank", rel: "noopener", class: "logo-mural" + ((m.logos || []).length > 1 ? " duplo" : ""), "aria-label": `Ver um exemplo de conteúdo com ${m.marca}` },
          ...(m.logos || []).map((src) => h("img", { src, alt: "", loading: "lazy" })))
      : h("div", { class: "logo-mural sem-link" + ((m.logos || []).length > 1 ? " duplo" : ""), role: "img", "aria-label": `Logo ${m.marca}` },
          ...(m.logos || []).map((src) => h("img", { src, alt: "", loading: "lazy" })))));
  const cats = ["Todas", ...(p.categorias && p.categorias.length ? p.categorias : [...new Set(PARCERIAS.map((x) => x.categoria))])];
  const filtros = $("#filtros");
  cats.forEach((c) => {
    const n = c === "Todas" ? PARCERIAS.length : PARCERIAS.filter((x) => x.categoria === c).length;
    filtros.append(h("button", { type: "button", "aria-pressed": c === "Todas" ? "true" : "false", onclick: (ev) => filtrar(c, ev.currentTarget) }, c, h("span", { text: n })));
  });
  const grid = $("#grid-parcerias");
  PARCERIAS.forEach((x, i) => {
    // thumb: até 3 Reels verticais lado a lado (prioriza quadros com vídeo e os mais altos do mosaico)
    const trio = (x.mosaico || []).slice().sort((a, b) => (!!b.link - !!a.link) || (b.h / b.w - a.h / a.w)).slice(0, 3);
    grid.append(h("article", { class: "painel parceria" + (x.card_sem_e ? " sem-e" : ""), "data-cat": x.categoria },
      h("button", { type: "button", class: x.thumb ? "parceria-capa unica" : `parceria-capa n${trio.length}`, onclick: () => abrirCase(i), "aria-label": `Ver case ${x.marca}` },
        ...(x.thumb ? [h("span", { class: "reel" }, h("img", { src: x.thumb, alt: "", loading: "lazy" }))] : trio.map((t) => h("span", { class: "reel" }, h("img", { src: t.img, alt: "", loading: "lazy" })))),
        h("span", { class: `cat ${x.categoria}`, text: x.categoria })),
      h("div", { class: "painel-corpo" },
        linhaLogos(x),
        h("p", {}, negrito(x.descricao)),
        numerosCase(x),
        h("button", { class: "botao ver", type: "button", onclick: () => abrirCase(i) }, "Ver case"))));
  });
}
function filtrar(cat, btn) {
  document.querySelectorAll("#filtros button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
  document.querySelectorAll(".parceria").forEach((el) => { el.hidden = cat !== "Todas" && el.dataset.cat !== cat; });
}
function abrirCase(i) {
  const x = PARCERIAS[i], dlg = $("#case"), corpo = $("#case-corpo");
  $("#case-cat").textContent = x.categoria;
  corpo.replaceChildren(
    mosaico(x),
    h("div", { class: "case-info" },
      h("span", { class: `cat ${x.categoria}`, text: x.categoria }),
      h("h3", { id: "case-titulo", class: "sr-only", text: x.marca }),
      linhaLogos(x),
      h("p", { class: "case-texto" }, negrito(x.descricao)),
      ...x.notas.map((n) => h("p", { class: "colab", text: "// " + n })),
      numerosCase(x),
      h("p", { class: "dica", text: "Toque nos quadros com ▶ para assistir aos conteúdos." })));
  if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  corpo.scrollTop = 0; dlg.scrollTop = 0;
}


/* ---------------- comportamento ---------------- */
/* "Quem é": o painel é desenhado em 1180px e reduzido por inteiro em telas
   menores, mantendo a mesma composição do desktop */
function escalarSobre() {
  const painel = $(".painel-sobre"); if (!painel) return;
  const wrap = painel.parentElement, cs = getComputedStyle(wrap);
  const livre = wrap.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  // no celular em pé o layout próprio entra em ação (ver CSS) e não há redução
  painel.style.zoom = innerWidth < 700 ? "" : Math.min(1, livre / 1180).toFixed(4);
}

/* Faz cada linha do título ocupar exatamente a largura disponível */
function ajustarTitulos() {
  escalarSobre();
  document.querySelectorAll(".ajustar").forEach((el) => {
    const alvo = el.parentElement.clientWidth;
    if (!alvo) return;
    el.style.fontSize = "100px";
    const w = el.scrollWidth;
    el.style.fontSize = (100 * alvo / w * 0.995).toFixed(2) + "px";
  });
}

function animarEntrada() {
  const els = document.querySelectorAll(".revelar");
  if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("visivel")); return; }
  const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visivel"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
  els.forEach((e) => io.observe(e));
}
function ligarMenu() {
  const b = $(".abrir-menu"), m = $("#menu");
  b.addEventListener("click", () => { const a = m.classList.toggle("aberto"); b.setAttribute("aria-expanded", String(a)); b.textContent = a ? "Fechar" : "Menu"; });
  m.addEventListener("click", (e) => { if (e.target.tagName === "A") { m.classList.remove("aberto"); b.setAttribute("aria-expanded", "false"); b.textContent = "Menu"; } });
  $("#fechar-case").addEventListener("click", () => $("#case").close());
  $("#case").addEventListener("click", (e) => { if (e.target === e.currentTarget) e.currentTarget.close(); });
  // botão de PDF escondido do público; aparece só com ?pdf no endereço
  if (new URLSearchParams(location.search).has("pdf")) $("#linha-pdf").hidden = false;
  $("#salvar-pdf").addEventListener("click", () => { document.querySelectorAll(".revelar").forEach((e) => e.classList.add("visivel")); try { window.print(); } catch (_) {} });
}

(async function iniciar() {
  personalizar();
  ligarMenu();
  const [perfil, redes, destaques, virais, parcerias] = await Promise.all(
    ["perfil", "redes", "destaques", "virais", "parcerias"].map((n) => carregar(`conteudo/${n}.json`)));
  renderPerfil(perfil);
  let dash = null;
  try { dash = await carregar("data/dashboard.json"); } catch (_) { /* sem dados automáticos: usa os digitados */ }
  renderRedes(redes, dash);
  renderDestaques(destaques);
  renderVirais(virais);
  renderParcerias(parcerias);
  ajustarTitulos();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustarTitulos);
  let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(ajustarTitulos, 120); });
  animarEntrada();
})();
