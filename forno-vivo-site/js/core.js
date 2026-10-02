/* ======================================================================
   core.js — UTILITÁRIOS, ESTADO E PREÇOS
   ======================================================================
   Carregado DEPOIS de catalog.js e ANTES de draw.js: o desenho da pizza
   (draw.js) usa as funções utilitárias daqui (byId, esc, rng, hash) e o
   objeto de estado S assim que é carregado (para gerar o preenchimento
   de queijo "CHEESE" uma única vez). Por isso a ordem dos <script> no
   index.html importa — não mude sem necessidade.
   ====================================================================== */

/* ====================================================================
   1. UTILITÁRIOS GERAIS
   ==================================================================== */

/** Procura um item por id dentro de um array do catálogo. */
function byId(a, id) { for (var i = 0; i < a.length; i++) { if (a[i].id === id) return a[i]; } return null; }
/** Formata um número como preço em reais: 12 -> "R$ 12,00".
 *  ÚNICO formatador de preço do site — use sempre esta função (nunca
 *  monte "R$ " + número na mão), para que todo preço mostrado ao
 *  cliente siga o mesmo padrão brasileiro, com vírgula e duas casas
 *  decimais. (Uma versão anterior tinha um segundo formatador, fmt0,
 *  que mostrava preços sem centavos em algumas telas — isso é o que
 *  deixava os valores "confusos": o mesmo tipo de preço aparecia como
 *  "R$ 47,00" em um lugar e "R$ 47" em outro. Foi removido.) */
function fmt(n) { return 'R$ ' + n.toFixed(2).replace('.', ','); }
/** Escapa texto do usuário antes de inserir como HTML (evita injeção). */
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
/** Gerador de números pseudoaleatórios com seed fixa (mesmo padrão sempre). */
function rng(seed) { var a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
/** Transforma uma string em um número (seed) de forma determinística. */
function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
/** Atalho para document.querySelector. */
function $(s) { return document.querySelector(s); }
/** Monta a tag <img> responsiva de uma foto do catálogo (ver PHOTOS).
 *  Propositalmente SEM os atributos width/height: toda classe "*-img"
 *  usada aqui (about-img, flavor-img, panel-img, hero-img...) já define
 *  o formato da caixa pelo CSS (aspect-ratio ou width/height 100%). Se a
 *  tag <img> também tivesse width/height fixos, o navegador trataria a
 *  altura como "definida" e a propriedade aspect-ratio do CSS deixaria
 *  de ter efeito (ela só entra em ação quando largura OU altura está
 *  "auto") — a foto nasceria com uma altura errada, empurrando o resto
 *  da seção para baixo. O CSS sozinho já reserva o espaço certo e evita
 *  o "pulo" de layout enquanto a foto carrega. */
function photo(key, w, cls, alt) {
  return '<img class="' + cls + '" loading="lazy" decoding="async"' +
    ' src="' + unsplash(PHOTOS[key], w) + '" srcset="' + unsplash(PHOTOS[key], w) + ' 1x, ' + unsplash(PHOTOS[key], w * 2) + ' 2x"' +
    ' alt="' + esc(alt || '') + '">';
}

/* ====================================================================
   2. ESTADO DA APLICAÇÃO (tudo que muda durante o uso fica aqui)
   ==================================================================== */
var S = {
  screen: 'signup',          // tela atual: signup | build | cart | checkout | pix | done
  step: 'tamanho',           // etapa atual do construtor de pizza
  tab: 'classic',            // aba do sabor: classic | custom
  cur: {                     // pizza que está sendo montada agora
    size: 'grande', massa: 'tradicional', borda: 'sem', mode: 'classic',
    flavor: 'portuguesa', ing: ['presunto', 'ovo', 'cebola', 'azeitona', 'pimentao']
  },
  cart: [],                  // pizzas já adicionadas ao pedido
  drinks: {},                // quantidades de bebida por id
  profile: null,             // dados do cliente (pré-cadastro)
  prefs: [],                 // preferências marcadas no pré-cadastro
  orderN: 1042,               // número do próximo pedido (demonstração)
  order: null,                // pedido confirmado (depois do Pix)
  track: 0,                   // etapa do acompanhamento pós-pedido
  timers: [],                 // intervalos/timeouts ativos (p/ limpar ao navegar)
  uid: 0                      // contador para ids únicos de <svg>/<clipPath>
};
/** Perfil de demonstração, usado quando o cliente pula o cadastro. */
var DEMO_PROFILE = { name: 'Cliente Demo', phone: '(48) 90000-0000', cep: '', street: 'Rua das Palmeiras', num: '120', comp: '', hood: 'Centro', prefs: ['Carnes', 'Borda recheada'], consent: false };
/** Guarda o cadastro do cliente no navegador, para não pedir de novo. */
function save() { try { localStorage.setItem('pz-state', JSON.stringify({ profile: S.profile })); } catch (e) {} }
function load() { try { var j = JSON.parse(localStorage.getItem('pz-state') || 'null'); if (j && j.profile) S.profile = j.profile; } catch (e) {} }

/* ====================================================================
   3. PREÇOS
   ==================================================================== */
/** Aplica o multiplicador de tamanho (m) e o ajuste da marca (BRAND.scale). */
function pr(x, m) { return Math.round(x * m * BRAND.scale); }
/** Decompõe o preço de uma pizza em base + massa + borda + sabor. */
function parts(c) {
  var sz = byId(SIZES, c.size), ms = byId(MASSAS, c.massa), bd = byId(BORDAS, c.borda);
  var base = pr(BASE, sz.m), massa = pr(ms.add, sz.m), borda = pr(bd.add, sz.m), sab = 0;
  if (c.mode === 'classic') { sab = pr(byId(FLAVORS, c.flavor).tier, sz.m); }
  else { sab = c.ing.reduce(function (s, id) { return s + pr(byId(ING, id).p, sz.m); }, 0); }
  return { base: base, massa: massa, borda: borda, sab: sab, total: base + massa + borda + sab };
}
function calc(c) { return parts(c).total; }
function drinkPrice(d) { return Math.round(d.p * BRAND.scale); }
/** Soma tudo: pizzas do carrinho + bebidas + taxa de entrega. */
function totals() {
  var sub = S.cart.reduce(function (s, i) { return s + calc(i.cfg) * i.qty; }, 0);
  DRINKS.forEach(function (d) { sub += (S.drinks[d.id] || 0) * drinkPrice(d); });
  return { sub: sub, fee: BRAND.fee, total: sub + BRAND.fee };
}
function itemCount() { var n = S.cart.reduce(function (s, i) { return s + i.qty; }, 0); DRINKS.forEach(function (d) { n += S.drinks[d.id] || 0; }); return n; }
function names(c) { return c.ing.map(function (id) { return byId(ING, id).name; }); }
function title(c) { return c.mode === 'classic' ? byId(FLAVORS, c.flavor).name : 'Monte a sua'; }
function describe(c) { var n = names(c); return n.length ? n.join(', ') : 'Só molho e mussarela'; }

