/* ======================================================================
   app.js — TELAS, NAVEGAÇÃO E AÇÕES
   ======================================================================
   Carregado por último. Depende de catalog.js (dados), core.js
   (utilitários/estado/preços) e draw.js (desenho da pizza). Contém tudo
   que monta HTML de tela, troca de tela e responde a cliques/toques.
   ====================================================================== */

/* ====================================================================
   4. ÍCONES (pequenos SVGs de interface, não confundir com draw.js)
   ==================================================================== */
var MARK = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="var(--accent)"/><path d="M12 12 L12 1.5 A10.5 10.5 0 0 1 21.1 6.8 Z" fill="var(--on-accent)" opacity=".9"/><circle cx="15.5" cy="15.5" r="1.6" fill="var(--on-accent)"/><circle cx="8.5" cy="14.5" r="1.3" fill="var(--on-accent)" opacity=".8"/></svg>';
var BAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>';
var CLIP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="M9 11h6M9 15h6"/></svg>';
/* Ícones "genéricos" (não são os logotipos oficiais de WhatsApp/Instagram —
   só um balão de conversa e uma câmera — o texto ao lado é que identifica
   o serviço, então não há uso de marca registrada de terceiros aqui). */
var CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-11.9 7.8L4 21l1.7-5.1A8.5 8.5 0 1 1 21 11.5Z"/></svg>';
var CAM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="3"/><path d="M8 7 9.5 4h5L16 7"/><circle cx="12" cy="13.5" r="3.4"/></svg>';
var PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.4"/></svg>';
var CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>';
var FLAME = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 3-3 4-3 7.5a3 3 0 0 0 6 0c0-1-.4-1.8-1-2.5 1.8.6 3 2.6 3 5a5 5 0 0 1-10 0C7 8 10 6.5 12 2Z" fill="currentColor"/></svg>';

/* ====================================================================
   5. TELAS (cada função devolve o HTML de uma tela inteira)
   ==================================================================== */
function renderHdr() {
  var n = itemCount();
  $('#hdr').innerHTML =
    '<button class="brand" data-act="home" aria-label="Início, ' + esc(BRAND.name) + '"><span class="mark">' + MARK + '</span><span class="bname">' + esc(BRAND.name) + '</span></button>' +
    '<div class="top-r"><button class="cartbtn" data-act="cart" aria-label="Ver pedido, ' + n + ' itens">' + BAG + (n ? '<span class="badge">' + n + '</span>' : '') + '</button></div>';
}

/** Rodapé com endereço, horário e contatos — reaproveitado na home e na
 *  tela de pedido confirmado (uma pizzaria local brasileira sempre deixa
 *  isso visível: WhatsApp, endereço e horário de funcionamento). */
function footerMarkup() {
  var wa = 'https://wa.me/' + BRAND.whatsapp + '?text=' + encodeURIComponent('Olá! Vim pelo site da ' + BRAND.name + ' e quero fazer um pedido.');
  return '<footer class="site-footer">' +
    '<div class="footer-brand"><span class="mark">' + MARK + '</span><b>' + esc(BRAND.name) + '</b></div>' +
    '<ul class="footer-list">' +
    '<li>' + PIN + '<a href="' + esc(BRAND.mapsUrl) + '" target="_blank" rel="noopener">' + esc(BRAND.address) + '</a></li>' +
    '<li>' + CLOCK + '<span>' + esc(BRAND.hours) + '</span></li>' +
    '<li>' + CHAT + '<a href="' + wa + '" target="_blank" rel="noopener">WhatsApp: pedir ou tirar dúvidas</a></li>' +
    '<li>' + CAM + '<span>Instagram ' + esc(BRAND.instagram) + '</span></li>' +
    '</ul>' +
    '<p class="fine">Site de demonstração — pedido e Pix simulados para fins de apresentação.</p>' +
    '</footer>';
}
/** Botão flutuante de WhatsApp — só aparece na home. Nas demais telas ele
 *  disputaria espaço com a barra de ação (build/cart/checkout) ou podia
 *  tampar texto da "ficha da cozinha" (done); lá o link já está no rodapé. */
function renderFab() {
  var el = $('#fab'); if (!el) return;
  var show = S.screen === 'signup';
  el.hidden = !show;
  if (!show) return;
  var wa = 'https://wa.me/' + BRAND.whatsapp + '?text=' + encodeURIComponent('Olá! Vim pelo site da ' + BRAND.name + ' e quero fazer um pedido.');
  el.innerHTML = '<a class="fab-whats" href="' + wa + '" target="_blank" rel="noopener" aria-label="Chamar no WhatsApp">' + CHAT + '</a>';
}

function viewSignup() {
  var p = S.profile || {}, prefs = S.prefs.length ? S.prefs : (p.prefs || []);
  var def = { size: 'grande', massa: 'tradicional', borda: 'cheddar', mode: 'classic', flavor: 'portuguesa', ing: byId(FLAVORS, 'portuguesa').ing };
  function field(id, label, val, extra, err, ph) {
    return '<div class="f"><label for="su-' + id + '">' + label + '</label><input type="' + (extra && extra.type || 'text') + '" id="su-' + id + '" name="' + id + '"' + (extra && extra.mode ? ' inputmode="' + extra.mode + '"' : '') + (extra && extra.ac ? ' autocomplete="' + extra.ac + '"' : '') + (ph ? ' placeholder="' + ph + '"' : '') + ' value="' + esc(val || '') + '">' + (err ? '<span class="err" id="e-' + id + '" role="alert" hidden></span>' : '') + '</div>';
  }

  // --- Navegação rápida da home (âncoras para as seções da página) -------
  var subnav = '<nav class="subnav" aria-label="Seções da página">' +
    '<a href="#destaques">Cardápio</a><a href="#como-funciona">Como funciona</a><a href="#sobre">Sobre</a><a href="#cadastro" class="subnav-cta">Pedir agora</a>' +
    '</nav>';

  // --- Hero cheio de personalidade: foto + título grande por cima --------
  var hero = '<section class="hero2">' +
    photo('hero', 900, 'hero2-img', 'Pizza inteira pronta, com cortador, sobre tábua de madeira') +
    '<div class="hero2-overlay">' +
    '<p class="eyebrow eyebrow-light">' + esc(BRAND.name) + ' · pizzaria de bairro</p>' +
    '<h1 class="hero2-title">' + esc(BRAND.tagline) + '</h1>' +
    '<a href="#cadastro" class="btn hero2-cta">Montar minha pizza</a>' +
    '</div></section>';

  // --- Teaser do construtor: a pizza desenhada que muda ao vivo ----------
  var teaser = '<section class="section teaser">' +
    '<div class="hero-pz">' + pizzaSVG(def, { uid: 'hero' }) + '</div>' +
    '<div><p class="eyebrow">' + FLAME + ' Direto do forno a lenha</p><h2 class="h2">Veja sua pizza ganhar vida, ao vivo</h2>' +
    '<p class="lead">Escolha massa, borda e cada ingrediente — o desenho na tela muda junto, na hora, pra você conferir antes de pagar.</p></div></section>';

  // --- Sabores em destaque: fotos reais inspirando o pedido ---------------
  var destaques = [
    { k: 'carnes', f: 'baconcheddar' },
    { k: 'queijos', f: 'quatroqueijos' },
    { k: 'vegetais', f: 'horta' }
  ];
  var grid = '<section class="section" id="destaques"><p class="eyebrow">Sabores em destaque</p><h2 class="h2">Alguns clássicos da casa</h2>' +
    '<div class="flavor-grid">' + destaques.map(function (d) {
      var f = byId(FLAVORS, d.f);
      return '<figure class="flavor-card">' + photo(d.k, 420, 'flavor-img', esc(f.name)) + '<figcaption><b>' + esc(f.name) + '</b><span>' + esc(describe({ ing: f.ing })) + '</span></figcaption></figure>';
    }).join('') + '</div>' +
    '<p class="fine">E muito mais no construtor — incluindo o "monte a sua", com mais de 20 ingredientes.</p></section>';

  // --- Como funciona: 3 passos, em bloco de cor forte (como uma marca) ---
  var como = '<section class="section band" id="como-funciona"><p class="eyebrow eyebrow-light">Como funciona</p><h2 class="h2 light">Da tela pro seu prato</h2>' +
    '<ol class="how-steps">' +
    '<li><span class="how-n">1</span><b>Monte sua pizza</b><span>Tamanho, massa, borda e sabor — veja o desenho mudar ao vivo.</span></li>' +
    '<li><span class="how-n">2</span><b>Pague com Pix</b><span>Direto pelo site, sem sair pra outro aplicativo.</span></li>' +
    '<li><span class="how-n">3</span><b>Acompanhe a entrega</b><span>Do forno até a sua porta, com status em tempo real.</span></li>' +
    '</ol></section>';

  // --- Sobre a pizzaria -----------------------------------------------------
  var sobre = '<section class="section about" id="sobre">' +
    photo('sobre', 700, 'about-img', 'Salão e balcão da pizzaria') +
    '<div><p class="eyebrow">Sobre a ' + esc(BRAND.name) + '</p><h2 class="h2">Receita simples, feita com capricho</h2>' +
    '<p class="lead">' + esc(BRAND.about) + '</p></div></section>';

  // --- Formulário de pré-cadastro -------------------------------------------
  var form = '<section class="section" id="cadastro"><p class="eyebrow">Pré-cadastro rápido</p><h2 class="h2">Faça seu pedido</h2>' +
    '<p class="lead" style="margin:8px 0 16px">A ' + esc(BRAND.name) + ' entrega no endereço certo e passa a conhecer o seu gosto.</p>' +
    '<form class="form" id="signup" novalidate>' +
    field('name', 'Nome', p.name, { ac: 'name' }, true, 'Como devemos te chamar?') +
    field('phone', 'WhatsApp', p.phone, { type: 'tel', mode: 'tel', ac: 'tel' }, true, '(48) 91234-5678') +
    '<div class="row3">' + field('street', 'Rua', p.street, { ac: 'address-line1' }, true) + field('num', 'Número', p.num, { mode: 'numeric' }, true) + '</div>' +
    '<div class="row2">' + field('hood', 'Bairro', p.hood, {}, true) + field('cep', 'CEP', p.cep, { mode: 'numeric', ac: 'postal-code' }, false, '00000-000') + '</div>' +
    field('comp', 'Complemento <span>(opcional)</span>', p.comp, {}, false, 'Apto, bloco, referência') +
    '<div class="f"><span class="lbl" id="prefs-l">O que você mais curte? <span>(opcional)</span></span><div class="chips" role="group" aria-labelledby="prefs-l">' +
    PREFS.map(function (x) { return '<button type="button" class="chip" data-act="pref" data-v="' + esc(x) + '" aria-pressed="' + (prefs.indexOf(x) > -1) + '">' + esc(x) + '</button>'; }).join('') + '</div></div>' +
    '<label class="check"><input type="checkbox" id="su-consent"' + (p.consent ? ' checked' : '') + '><span>Quero receber ofertas no WhatsApp. Seus dados ficam só com a pizzaria e servem para entrega e recomendações.</span></label>' +
    '<button class="btn block" type="submit">Começar meu pedido</button>' +
    '<button class="link" type="button" data-act="skip">Pular por enquanto (demo)</button>' +
    '</form></section>';

  return subnav + hero + teaser + grid + como + sobre + form + footerMarkup();
}

function viewBuild() {
  return '<section class="build"><div class="stage"><div id="pzMount"></div><div class="stage-meta" id="stageMeta" aria-live="polite"></div></div>' +
    '<nav class="steps" id="steps" aria-label="Etapas do pedido"></nav><div class="panel" id="panel"></div></section>';
}
function stepVal(k) {
  var c = S.cur;
  if (k === 'tamanho') return byId(SIZES, c.size).name;
  if (k === 'massa') return byId(MASSAS, c.massa).short;
  if (k === 'borda') return byId(BORDAS, c.borda).short || byId(BORDAS, c.borda).name;
  return c.mode === 'classic' ? byId(FLAVORS, c.flavor).name : (c.ing.length + (c.ing.length === 1 ? ' item' : ' itens'));
}
function renderSteps() {
  $('#steps').innerHTML = STEPS.map(function (s) {
    return '<button type="button" class="st' + (S.step === s[0] ? ' on' : '') + '" data-act="step" data-v="' + s[0] + '" role="tab" aria-selected="' + (S.step === s[0]) + '"><span class="l">' + s[1] + '</span><span class="v">' + esc(stepVal(s[0])) + '</span></button>';
  }).join('');
}
function opt(o) {
  return '<button type="button" class="opt' + (o.sel ? ' sel' : '') + '" role="radio" aria-checked="' + !!o.sel + '" data-act="' + o.act + '" data-v="' + o.v + '">' + (o.lead || '') +
    '<span class="o-main"><b>' + o.title + '</b>' + (o.sub ? '<small>' + o.sub + '</small>' : '') + '</span><span class="o-r">' + (o.right || '') + '</span></button>';
}
function renderPanel() {
  var c = S.cur, sz = byId(SIZES, c.size), h = '';
  if (S.step === 'tamanho') {
    h = '<h2>Qual o tamanho?</h2><p class="hint">Preço base com molho e mussarela. Massa, borda e sabor somam ao total.</p><div class="opts" role="radiogroup" aria-label="Tamanho">' +
      SIZES.map(function (s) { return opt({ act: 'size', v: s.id, sel: c.size === s.id, title: s.name, sub: s.cm + ' cm · ' + s.slices + ' fatias · ' + s.serve, right: fmt(pr(BASE, s.m)) }); }).join('') + '</div>';
  } else if (S.step === 'massa') {
    h = '<h2>Escolha a massa</h2><p class="hint">Veja a pizza mudar ao lado.</p>' +
      '<figure class="panel-photo">' + photo('massa', 640, 'panel-img', 'Massa de pizza sendo esticada à mão') + '<figcaption>Cada massa muda a espessura e a cor da crosta no desenho ao lado.</figcaption></figure>' +
      '<div class="opts" role="radiogroup" aria-label="Massa">' +
      MASSAS.map(function (m) { return opt({ act: 'massa', v: m.id, sel: c.massa === m.id, title: m.name, sub: m.desc, right: m.add ? '+' + fmt(pr(m.add, sz.m)) : 'Incluso' }); }).join('') + '</div>';
  } else if (S.step === 'borda') {
    h = '<h2>Quer borda recheada?</h2><p class="hint">Cada recheio aparece na borda da pizza.</p><div class="opts" role="radiogroup" aria-label="Borda">' +
      BORDAS.map(function (b) { return opt({ act: 'borda', v: b.id, sel: c.borda === b.id, title: b.name, lead: '<span class="dot" style="background:' + (b.color || 'transparent') + '"></span>', right: b.add ? '+' + fmt(pr(b.add, sz.m)) : 'Incluso' }); }).join('') + '</div>';
  } else {
    h = '<h2>Escolha o sabor</h2><p class="hint">Sabores prontos têm preço fechado. Montando, você paga por ingrediente.</p>' +
      '<div class="seg" role="tablist"><button type="button" data-act="tab" data-v="classic" class="' + (S.tab === 'classic' ? 'on' : '') + '">Clássicas</button><button type="button" data-act="tab" data-v="custom" class="' + (S.tab === 'custom' ? 'on' : '') + '">Monte a sua</button></div>';
    if (S.tab === 'classic') {
      h += '<div class="opts" role="radiogroup" aria-label="Sabores">' + FLAVORS.map(function (f) {
        var cc = { size: c.size, massa: c.massa, borda: c.borda, mode: 'classic', flavor: f.id, ing: f.ing };
        return opt({ act: 'flavor', v: f.id, sel: c.mode === 'classic' && c.flavor === f.id, title: esc(f.name), sub: esc(describe(cc)), right: fmt(calc(cc)) });
      }).join('') + '</div>';
    } else {
      h += '<figure class="panel-photo">' + photo('fatia', 640, 'panel-img', 'Fatia de pizza puxando queijo') + '<figcaption>Escolha os ingredientes abaixo — a pizza ao vivo acima atualiza a cada clique.</figcaption></figure>';
      CATS.forEach(function (cat) {
        h += '<div class="grp"><h3>' + cat[1] + '</h3><div class="chips">' + ING.filter(function (i) { return i.cat === cat[0]; }).map(function (i) {
          var on = c.ing.indexOf(i.id) > -1;
          return '<button type="button" class="chip" data-act="ing" data-v="' + i.id + '" aria-pressed="' + on + '"><span>' + i.name + '</span><em>+' + fmt(pr(i.p, sz.m)) + '</em></button>';
        }).join('') + '</div></div>';
      });
      h += '<div class="count"><span>' + c.ing.length + (c.ing.length === 1 ? ' ingrediente' : ' ingredientes') + ' escolhidos</span>' + (c.ing.length ? '<button type="button" class="rm" data-act="clear">Limpar tudo</button>' : '') + '</div>';
    }
  }
  $('#panel').innerHTML = h;
}
function updateTops() {
  var svg = document.querySelector('#pzMount svg'); if (!svg) return;
  svg.querySelectorAll('.ing').forEach(function (g) { g.classList.toggle('on', S.cur.ing.indexOf(g.getAttribute('data-id')) > -1); });
}
function updatePizza() {
  var svg = document.querySelector('#pzMount svg'); if (!svg) return;
  var c = S.cur, sz = byId(SIZES, c.size), ms = byId(MASSAS, c.massa), bd = byId(BORDAS, c.borda);
  svg.querySelector('.pz-scale').style.transform = 'scale(' + sz.k + ')';
  svg.querySelector('.pz-crust').innerHTML = crustMarkup(ms, bd);
  svg.querySelector('.pz-slices').innerHTML = sliceMarkup(sz.slices);
  svg.setAttribute('aria-label', 'Pizza ' + title(c));
  updateTops();
  $('#stageMeta').innerHTML = '<span>' + sz.name + ' · ' + sz.cm + ' cm · ' + sz.slices + ' fatias</span><b>' + esc(title(c)) + '</b>';
}
function mountPizza() {
  var blank = { size: S.cur.size, massa: S.cur.massa, borda: S.cur.borda, mode: S.cur.mode, flavor: S.cur.flavor, ing: [] };
  $('#pzMount').innerHTML = pizzaSVG(blank, { all: true, uid: 'main' });
  var sz = byId(SIZES, S.cur.size);
  $('#stageMeta').innerHTML = '<span>' + sz.name + ' · ' + sz.cm + ' cm · ' + sz.slices + ' fatias</span><b>' + esc(title(S.cur)) + '</b>';
  // Dois requestAnimationFrame: espera o navegador desenhar o SVG "zerado"
  // antes de ligar as classes .on, para garantir que a transição de
  // entrada (CSS) rode de verdade em vez de aparecer tudo de uma vez.
  requestAnimationFrame(function () { requestAnimationFrame(function () { updatePizza(); }); });
}
function refreshBuild() { updatePizza(); renderSteps(); renderPanel(); renderBar(); }

function pizzaLine(it) {
  var c = it.cfg, sz = byId(SIZES, c.size), ms = byId(MASSAS, c.massa), bd = byId(BORDAS, c.borda);
  return { t: 'Pizza ' + sz.name.toLowerCase() + ' · ' + title(c), s: ms.name + (c.borda !== 'sem' ? ' · borda ' + bd.name.toLowerCase() : '') + ' · ' + describe(c) };
}
function viewCart() {
  if (!S.cart.length && !itemCount()) {
    return '<section class="empty"><h2 class="h2">Seu pedido está vazio</h2><p class="lead">Monte a primeira pizza e veja ela ganhar forma na tela.</p><button class="btn" data-act="newpizza">Montar minha pizza</button></section>';
  }
  var t = totals();
  var h = '<p class="eyebrow" style="margin-top:6px">Seu pedido</p><h1 class="h2">Confira os itens</h1>';
  h += S.cart.map(function (it, i) {
    var l = pizzaLine(it);
    return '<div class="cartitem">' + pizzaSVG(it.cfg, { uid: 't' + it.id }) + '<div class="ci-t"><b>' + esc(l.t) + '</b><small>' + esc(l.s) + '</small></div><div class="ci-r"><span class="ci-p">' + fmt(calc(it.cfg) * it.qty) + '</span>' +
      '<span class="qty"><button type="button" data-act="cq" data-v="' + i + ':-1" aria-label="Diminuir">−</button><span>' + it.qty + '</span><button type="button" data-act="cq" data-v="' + i + ':1" aria-label="Aumentar">+</button></span>' +
      '<button type="button" class="rm" data-act="crm" data-v="' + i + '">Remover</button></div></div>';
  }).join('');
  h += '<h2 class="sec-h">Bebidas</h2><div class="drinks-row">' + photo('bebidas', 140, 'drinks-img', 'Bebida gelada') + '<div class="drinks-list">' + DRINKS.map(function (d) {
    var q = S.drinks[d.id] || 0;
    return '<div class="drink"><div><b>' + d.name + '</b><small>' + d.sub + ' · ' + fmt(drinkPrice(d)) + '</small></div><span class="qty"><button type="button" data-act="dq" data-v="' + d.id + ':-1" aria-label="Diminuir ' + d.name + '">−</button><span>' + q + '</span><button type="button" data-act="dq" data-v="' + d.id + ':1" aria-label="Aumentar ' + d.name + '">+</button></span></div>';
  }).join('') + '</div></div>';
  h += '<div class="sum"><div><span>Subtotal</span><span>' + fmt(t.sub) + '</span></div><div><span>Entrega</span><span>' + fmt(t.fee) + '</span></div><div class="tot"><span>Total</span><span>' + fmt(t.total) + '</span></div></div>' +
    '<div class="actions"><button class="btn sec block" data-act="newpizza">Adicionar outra pizza</button></div>';
  return h;
}
function viewCheckout() {
  var p = S.profile || DEMO_PROFILE, t = totals();
  return '<p class="eyebrow" style="margin-top:6px">Quase lá</p><h1 class="h2">Entrega e pagamento</h1>' +
    '<h2 class="sec-h">Entregar em</h2><div class="box"><b>' + esc(p.name) + ' · ' + esc(p.phone) + '</b><small>' + esc(p.street) + ', ' + esc(p.num) + (p.comp ? ' – ' + esc(p.comp) : '') + ' · ' + esc(p.hood) + '</small><small>Previsão: ' + BRAND.eta + '</small><button class="link edit" data-act="edit">Editar dados</button></div>' +
    '<h2 class="sec-h">Observações</h2><div class="f"><label for="ck-note" class="lbl">Recado para a cozinha ou o entregador <span>(opcional)</span></label><textarea id="ck-note" placeholder="Ex.: sem cebola na metade, tocar o interfone 2x"></textarea></div>' +
    '<h2 class="sec-h">Pagamento</h2><div class="opts">' +
    '<div class="pay sel" role="radio" aria-checked="true"><span class="dot" style="background:var(--accent)"></span><span class="o-main"><b>Pix</b><small>Pague aqui mesmo, sem sair do site</small></span><span class="tag">Aprovação na hora</span></div>' +
    '<div class="pay off" role="radio" aria-checked="false" aria-disabled="true"><span class="dot"></span><span class="o-main"><b>Cartão de crédito</b><small>Próxima fase</small></span><span class="tag">Em breve</span></div></div>' +
    '<div class="sum"><div><span>Subtotal</span><span>' + fmt(t.sub) + '</span></div><div><span>Entrega</span><span>' + fmt(t.fee) + '</span></div><div class="tot"><span>Total</span><span>' + fmt(t.total) + '</span></div></div>' +
    '<p class="fine">Nesta versão o Pix é simulado, para fins de demonstração. Na versão em produção, a operadora de pagamento gera o código real e confirma o pagamento automaticamente.</p>';
}
var CODE = 'DEMO-PIX-000000-NAO-PAGAVEL';
function qrMarkup(seed) {
  var N = 25, R = rng(hash('qr' + seed)), s = '', m = [];
  function finder(x, y) { for (var i = 0; i < 7; i++) for (var j = 0; j < 7; j++) { var edge = i === 0 || j === 0 || i === 6 || j === 6, core = i >= 2 && i <= 4 && j >= 2 && j <= 4; if (edge || core) m.push([x + j, y + i]); } }
  function inFinder(x, y) { return (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8); }
  finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
  for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) { if (!inFinder(x, y) && R() > .52) m.push([x, y]); }
  m.forEach(function (p) { s += '<rect x="' + p[0] + '" y="' + p[1] + '" width="1.02" height="1.02"/>'; });
  return '<svg viewBox="0 0 ' + N + ' ' + N + '" role="img" aria-label="QR code de demonstração" fill="#111" shape-rendering="crispEdges">' + s + '</svg>';
}
function viewPix() {
  var o = S.order;
  return '<section class="pixv"><p class="eyebrow">Pedido #' + o.n + '</p><h1 class="h2">Pague com Pix</h1>' +
    '<p class="lead">Escaneie o QR code ou copie o código no app do seu banco. Este QR é só uma demonstração.</p>' +
    '<div class="qr">' + qrMarkup(o.n) + '</div><div class="pixtotal">' + fmt(o.total) + '</div>' +
    '<div class="code" id="pixcode">' + CODE + '</div>' +
    '<button class="btn sec block" data-act="copy">Copiar código</button>' +
    '<p class="timer">Expira em <b id="timer">15:00</b></p>' +
    '<button class="btn block" data-act="approve">Simular pagamento aprovado</button>' +
    '<p class="fine">Na versão em produção, o QR code e a confirmação vêm da operadora de pagamento e o pedido segue sozinho para a cozinha.</p></section>';
}
var TRACK = ['Pagamento aprovado', 'Montando a sua pizza', 'No forno', 'Saiu para entrega', 'Entregue'];
/** Monta um resumo em texto puro do pedido — útil para a pizzaria colar
 *  no WhatsApp Web, em um sistema de comandas ou imprimir, enquanto não
 *  existe um painel de cozinha integrado (fase 2 do projeto). */
function orderText(o) {
  var lines = ['Pedido #' + o.n + ' — ' + BRAND.name, 'Cliente: ' + o.profile.name + ' (' + o.profile.phone + ')', 'Endereço: ' + o.profile.street + ', ' + o.profile.num + (o.profile.comp ? ' – ' + o.profile.comp : '') + ' · ' + o.profile.hood, ''];
  o.items.forEach(function (it) { var l = pizzaLine(it); lines.push(it.qty + 'x ' + l.t + ' — ' + l.s); });
  DRINKS.forEach(function (d) { var q = S.drinks[d.id] || 0; if (q) lines.push(q + 'x ' + d.name); });
  lines.push('', 'Total: ' + fmt(o.total));
  return lines.join('\n');
}
function viewDone() {
  var o = S.order, p = o.profile;
  var sizes = {}, bords = {};
  o.items.forEach(function (it) { sizes[byId(SIZES, it.cfg.size).name] = 1; bords[byId(BORDAS, it.cfg.borda).name] = 1; });
  var ings = {}; o.items.forEach(function (it) { it.cfg.ing.forEach(function (id) { ings[byId(ING, id).name] = (ings[byId(ING, id).name] || 0) + 1; }); });
  var fav = Object.keys(ings).sort(function (a, b) { return ings[b] - ings[a]; }).slice(0, 4);
  return '<section class="done">' +
    '<div class="done-photo">' + photo('pessoa', 760, 'hero-img', 'Pessoa saboreando uma fatia de pizza') + '<div class="hero-fade"></div></div>' +
    '<div><p class="eyebrow">Pedido #' + o.n + ' · ' + esc(BRAND.name) + '</p><h1 class="h2">Pedido confirmado, ' + esc(p.name.split(' ')[0]) + '!</h1><p class="lead" style="margin-top:6px">Previsão de entrega: ' + BRAND.eta + '.</p></div>' +
    '<ol class="track" id="track"></ol>' +
    '<div class="insight"><h3>Ficha para a cozinha / balcão</h3><dl>' +
    '<dt>Cliente</dt><dd>' + esc(p.name) + ' · ' + esc(p.hood) + '</dd>' +
    '<dt>Curte</dt><dd>' + esc((p.prefs && p.prefs.length ? p.prefs.join(', ') : 'Não informou')) + '</dd>' +
    '<dt>Pediu</dt><dd>' + esc(Object.keys(sizes).join(', ') + ' · borda ' + Object.keys(bords).join(', ').toLowerCase()) + '</dd>' +
    '<dt>Ingredientes</dt><dd>' + esc(fav.length ? fav.join(', ') : 'Só molho e mussarela') + '</dd>' +
    '<dt>Ticket</dt><dd>' + fmt(o.total) + '</dd>' +
    '<dt>Cliente desde</dt><dd>Primeiro pedido</dd></dl>' +
    '<button type="button" class="btn sec block" data-act="copyorder">' + CLIP + ' Copiar resumo do pedido</button>' +
    '<p class="fine">Cada pedido alimenta o perfil do cliente — é a base para recomendações e ofertas pelo WhatsApp. O botão acima gera um texto pronto para colar numa comanda, grupo de cozinha ou sistema de impressão, enquanto não há um painel próprio da pizzaria (próxima fase do projeto).</p></div>' +
    '<button class="btn block" data-act="again">Fazer outro pedido</button></section>' +
    footerMarkup();
}
function updateTrack() {
  var el = $('#track'); if (!el) return;
  el.innerHTML = TRACK.map(function (t, i) { var cls = i < S.track ? 'done' : (i === S.track ? 'now' : ''); return '<li class="' + cls + '">' + t + '</li>'; }).join('');
}

/* ====================================================================
   6. BARRA INFERIOR (resumo + botão de avançar, fixo no rodapé)
   ==================================================================== */
function renderBar() {
  var b = $('#bar'), h = '';
  if (S.screen === 'build') {
    var c = S.cur, last = S.step === 'sabor', dis = last && c.mode === 'custom' && c.ing.length === 0;
    h = '<div class="bar-in"><div class="bar-l"><small>' + byId(SIZES, c.size).name + ' · ' + esc(title(c)) + '</small><strong>' + fmt(calc(c)) + '</strong></div><button class="btn" data-act="next"' + (dis ? ' disabled' : '') + '>' + (last ? (dis ? 'Escolha um ingrediente' : 'Adicionar ao pedido') : 'Continuar') + '</button></div>';
  } else if (S.screen === 'cart' && (S.cart.length || itemCount())) {
    h = '<div class="bar-in"><div class="bar-l"><small>Total com entrega</small><strong>' + fmt(totals().total) + '</strong></div><button class="btn" data-act="checkout"' + (S.cart.length ? '' : ' disabled') + '>Ir para pagamento</button></div>';
  } else if (S.screen === 'checkout') {
    h = '<div class="bar-in"><div class="bar-l"><small>Total</small><strong>' + fmt(totals().total) + '</strong></div><button class="btn" data-act="pay">Pagar com Pix</button></div>';
  }
  b.innerHTML = h; b.hidden = !h;
}

/* ====================================================================
   7. NAVEGAÇÃO
   ==================================================================== */
function clearTimers() { S.timers.forEach(function (t) { clearInterval(t); clearTimeout(t); }); S.timers = []; }
function go(screen) { clearTimers(); $('#toast').hidden = true; S.screen = screen; render(); window.scrollTo(0, 0); }
function render() {
  renderHdr();
  var v = { signup: viewSignup, build: viewBuild, cart: viewCart, checkout: viewCheckout, pix: viewPix, done: viewDone }[S.screen];
  $('#view').innerHTML = v();
  if (S.screen === 'build') { renderSteps(); renderPanel(); mountPizza(); }
  if (S.screen === 'pix') startTimer();
  if (S.screen === 'done') startTrack();
  renderBar();
  renderFab();
}
function toast(msg) {
  var t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toast._t); toast._t = setTimeout(function () { t.hidden = true; }, 2300);
}
function startTimer() {
  var left = 15 * 60;
  S.timers.push(setInterval(function () {
    left--; var el = $('#timer'); if (!el) return;
    if (left <= 0) { el.textContent = 'expirado'; return; }
    el.textContent = String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0');
  }, 1000));
}
function startTrack() {
  S.track = 0; updateTrack();
  [3500, 7500, 12000, 17000].forEach(function (ms) { S.timers.push(setTimeout(function () { S.track++; updateTrack(); }, ms)); });
}

/* ====================================================================
   8. AÇÕES (um handler por data-act usado no HTML; ver listener de clique)
   ==================================================================== */
var STEP_KEYS = STEPS.map(function (s) { return s[0]; });
var ACT = {
  home: function () { go(S.profile ? 'build' : 'signup'); },
  cart: function () { go('cart'); },
  pref: function (v, el) {
    var i = S.prefs.indexOf(v); if (i > -1) S.prefs.splice(i, 1); else S.prefs.push(v);
    el.setAttribute('aria-pressed', S.prefs.indexOf(v) > -1);
  },
  skip: function () { S.profile = DEMO_PROFILE; go('build'); },
  edit: function () { go('signup'); },
  step: function (v) { S.step = v; renderSteps(); renderPanel(); renderBar(); },
  size: function (v) { S.cur.size = v; refreshBuild(); },
  massa: function (v) { S.cur.massa = v; refreshBuild(); },
  borda: function (v) { S.cur.borda = v; refreshBuild(); },
  tab: function (v) {
    S.tab = v;
    if (v === 'custom' && S.cur.mode === 'classic') { S.cur.mode = 'custom'; S.cur.flavor = null; }
    refreshBuild();
  },
  flavor: function (v) { S.cur.mode = 'classic'; S.cur.flavor = v; S.cur.ing = byId(FLAVORS, v).ing.slice(); refreshBuild(); },
  ing: function (v) {
    S.cur.mode = 'custom'; S.cur.flavor = null;
    var i = S.cur.ing.indexOf(v); if (i > -1) S.cur.ing.splice(i, 1); else S.cur.ing.push(v);
    refreshBuild();
  },
  clear: function () { S.cur.mode = 'custom'; S.cur.flavor = null; S.cur.ing = []; refreshBuild(); },
  next: function () {
    var i = STEP_KEYS.indexOf(S.step);
    if (i < STEP_KEYS.length - 1) { S.step = STEP_KEYS[i + 1]; renderSteps(); renderPanel(); renderBar(); return; }
    S.cart.push({ id: ++S.uid, qty: 1, cfg: JSON.parse(JSON.stringify(S.cur)) });
    go('cart'); toast('Pizza adicionada ao pedido');
  },
  newpizza: function () { S.step = 'tamanho'; go('build'); },
  cq: function (v) {
    var p = v.split(':'), i = +p[0], d = +p[1], it = S.cart[i]; if (!it) return;
    it.qty += d; if (it.qty < 1) S.cart.splice(i, 1);
    render();
  },
  crm: function (v) { S.cart.splice(+v, 1); render(); },
  dq: function (v) {
    var p = v.split(':'), id = p[0], d = +p[1];
    S.drinks[id] = Math.max(0, (S.drinks[id] || 0) + d); render();
  },
  checkout: function () { go('checkout'); },
  pay: function () {
    var t = totals();
    S.order = { n: S.orderN++, total: t.total, items: JSON.parse(JSON.stringify(S.cart)), profile: S.profile || DEMO_PROFILE };
    go('pix');
  },
  copy: function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(CODE).then(function () { toast('Código copiado'); }, function () { toast('Não foi possível copiar aqui. Selecione o código e copie.'); });
    } else { toast('Não foi possível copiar aqui. Selecione o código e copie.'); }
  },
  copyorder: function () {
    var text = orderText(S.order);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast('Resumo do pedido copiado'); }, function () { toast('Não foi possível copiar aqui.'); });
    } else { toast('Não foi possível copiar aqui.'); }
  },
  approve: function () { go('done'); },
  again: function () { S.cart = []; S.drinks = {}; S.step = 'tamanho'; go('build'); }
};
document.addEventListener('click', function (e) {
  var t = e.target.closest('[data-act]'); if (!t) return;
  var f = ACT[t.getAttribute('data-act')]; if (f) f(t.getAttribute('data-v'), t, e);
});
document.addEventListener('input', function (e) {
  var t = e.target;
  if (t.id === 'su-phone') {
    var d = t.value.replace(/\D/g, '').slice(0, 11), o = '';
    if (d.length > 0) o = '(' + d.slice(0, 2);
    if (d.length >= 3) o += ') ' + d.slice(2, d.length > 10 ? 7 : 6);
    if (d.length > (d.length > 10 ? 7 : 6)) o += '-' + d.slice(d.length > 10 ? 7 : 6);
    t.value = o;
  }
  if (t.id === 'su-cep') {
    var c = t.value.replace(/\D/g, '').slice(0, 8); t.value = c.length > 5 ? c.slice(0, 5) + '-' + c.slice(5) : c;
  }
});
document.addEventListener('submit', function (e) {
  if (e.target.id !== 'signup') return;
  e.preventDefault();
  function g(id) { return document.getElementById('su-' + id).value.trim(); }
  var errs = {}, phone = g('phone').replace(/\D/g, '');
  if (g('name').length < 2) errs.name = 'Informe seu nome.';
  if (phone.length < 10) errs.phone = 'Informe DDD e número, por exemplo (48) 91234-5678.';
  if (!g('street')) errs.street = 'Informe a rua.';
  if (!g('num')) errs.num = 'Informe o número.';
  if (!g('hood')) errs.hood = 'Informe o bairro.';
  ['name', 'phone', 'street', 'num', 'hood'].forEach(function (k) {
    var el = document.getElementById('e-' + k); if (!el) return;
    el.hidden = !errs[k]; el.textContent = errs[k] || '';
  });
  var first = Object.keys(errs)[0];
  if (first) { document.getElementById('su-' + first).focus(); return; }
  S.profile = { name: g('name'), phone: g('phone'), cep: g('cep'), street: g('street'), num: g('num'), comp: g('comp'), hood: g('hood'), prefs: S.prefs.slice(), consent: document.getElementById('su-consent').checked };
  save(); go('build');
});

/* ====================================================================
   9. INICIALIZAÇÃO
   ==================================================================== */
load();
if (S.profile) { S.screen = 'build'; }
render();

// Expõe o estado em window apenas para facilitar depuração manual no
// console do navegador durante o desenvolvimento (não é usado pelo app).
window.__pizzaDebug = { S: S, totals: totals };
