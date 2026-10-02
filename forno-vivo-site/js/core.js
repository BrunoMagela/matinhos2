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

/* ====================================================================
   2. ESTADO DA APLICAÇÃO (tudo que muda durante o uso fica aqui)
   ==================================================================== */
var S = {
  screen: 'signup',          // tela atual: signup | build | cart | checkout | pix | done
  step: 'tamanho',           // etapa atual do construtor de pizza
  tab: 'classic',            // aba do sabor: classic | custom
  cur: {                     // pizza que está sendo montada agora
    size: 'grande', massa: 'tradicional', borda: 'sem', mode: 'classic',
    // flavors: até 2 ids de SABORES ESCOLHIDOS (ver FLAVORS em catalog.js).
    // 1 item = pizza inteira; 2 itens = meio a meio (1º = metade esquerda
    // do desenho, 2º = metade direita). `flavor` é mantido só como
    // "espelho" do primeiro item, para um código mais simples em telas
    // que só precisam saber o sabor principal.
    flavor: 'portuguesa', flavors: ['portuguesa'],
    ing: ['presunto', 'ovo', 'cebola', 'azeitona', 'pimentao']
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
/** Lê a lista de sabores escolhidos de uma config, com fallback para o
 *  campo antigo "flavor" (útil para pequenos objetos montados na hora,
 *  como os usados nas pré-visualizações dos cartões de sabor). */
function flavorsOf(c) { return (c.flavors && c.flavors.length) ? c.flavors : (c.flavor ? [c.flavor] : []); }
/** Decompõe o preço de uma pizza em base + massa + borda + sabor.
 *  Meio a meio (2 sabores): cobra-se o valor do sabor MAIS CARO dos
 *  dois, nunca a soma — é a regra mais usada pelas pizzarias no Brasil
 *  e evita um preço "estranho" para o cliente. */
function parts(c) {
  var sz = byId(SIZES, c.size), ms = byId(MASSAS, c.massa), bd = byId(BORDAS, c.borda);
  var base = pr(BASE, sz.m), massa = pr(ms.add, sz.m), borda = pr(bd.add, sz.m), sab = 0;
  if (c.mode === 'classic') {
    var maiorTier = flavorsOf(c).reduce(function (m, id) { return Math.max(m, byId(FLAVORS, id).tier); }, 0);
    sab = pr(maiorTier, sz.m);
  } else { sab = c.ing.reduce(function (s, id) { return s + pr(byId(ING, id).p, sz.m); }, 0); }
  return { base: base, massa: massa, borda: borda, sab: sab, total: base + massa + borda + sab };
}
function calc(c) { return parts(c).total; }
function drinkPrice(d) { return Math.round(d.p * BRAND.scale); }
/** Junta (sem repetir) os ingredientes de uma lista de sabores — usado
 *  para manter c.ing como um "resumo" da pizza clássica/meio a meio,
 *  útil só para estatísticas agregadas do pedido (ver "ingredientes
 *  mais pedidos" na ficha da cozinha, em app.js). O desenho e o preço
 *  da pizza em si vêm sempre de c.flavors, nunca deste resumo. */
function flavorIngUnion(ids) {
  var seen = {}, out = [];
  ids.forEach(function (id) { byId(FLAVORS, id).ing.forEach(function (x) { if (!seen[x]) { seen[x] = 1; out.push(x); } }); });
  return out;
}
/** Soma tudo: pizzas do carrinho + bebidas + taxa de entrega. */
function totals() {
  var sub = S.cart.reduce(function (s, i) { return s + calc(i.cfg) * i.qty; }, 0);
  DRINKS.forEach(function (d) { sub += (S.drinks[d.id] || 0) * drinkPrice(d); });
  return { sub: sub, fee: BRAND.fee, total: sub + BRAND.fee };
}
function itemCount() { var n = S.cart.reduce(function (s, i) { return s + i.qty; }, 0); DRINKS.forEach(function (d) { n += S.drinks[d.id] || 0; }); return n; }
function names(c) { return c.ing.map(function (id) { return byId(ING, id).name; }); }
/** Nome de exibição da pizza: nome do sabor, "Sabor A / Sabor B" quando
 *  é meio a meio, ou "Monte a sua" no modo de ingredientes livres. */
function title(c) {
  if (c.mode !== 'classic') return 'Monte a sua';
  var fl = flavorsOf(c);
  if (fl.length === 2) return byId(FLAVORS, fl[0]).name + ' / ' + byId(FLAVORS, fl[1]).name;
  return fl[0] ? byId(FLAVORS, fl[0]).name : 'Escolha o sabor';
}
/** Lista os ingredientes de uma pizza para exibição. No "monte a sua" é
 *  só a lista de ingredientes escolhidos. No clássico com 2 sabores
 *  (meio a meio), mostra os ingredientes de CADA metade separadamente
 *  — importante para o cliente conferir o pedido antes de pagar. */
function describe(c) {
  if (c.mode === 'classic') {
    var fl = flavorsOf(c);
    if (fl.length === 2) {
      var a = names({ ing: byId(FLAVORS, fl[0]).ing }), b = names({ ing: byId(FLAVORS, fl[1]).ing });
      return 'Metade ' + byId(FLAVORS, fl[0]).name + ': ' + (a.length ? a.join(', ') : 'molho e mussarela') +
        ' · Metade ' + byId(FLAVORS, fl[1]).name + ': ' + (b.length ? b.join(', ') : 'molho e mussarela');
    }
  }
  var n = names(c);
  return n.length ? n.join(', ') : 'Só molho e mussarela';
}

