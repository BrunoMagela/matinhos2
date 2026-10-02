/* ======================================================================
   catalog.js — DADOS DA PIZZARIA (modelo white-label)
   ======================================================================
   Este é o ÚNICO arquivo que normalmente precisa mudar quando você for
   vender/entregar o site para uma pizzaria diferente: nome, cores, taxa
   de entrega, tamanhos, massas, bordas, ingredientes, sabores e bebidas.
   Nenhuma lógica fica aqui — só dados. A lógica (preços, telas, pedido)
   está em js/app.js e não precisa ser tocada ao trocar de cliente.
   ====================================================================== */

/* ---------- 1. Identidade da pizzaria -----------------------------------
   scale  : multiplicador aplicado em cima de todos os preços-base.
            Ex.: 1 = preço de tabela; 1.15 = 15% acima da tabela.
   fee    : taxa de entrega cobrada no carrinho (R$).
   eta    : prazo estimado mostrado ao cliente.
   accent : cor principal da marca (usada em botões, destaques, etc.).
------------------------------------------------------------------------- */
var BRAND = {
  name: 'Forno Vivo',
  scale: 1,
  fee: 6,
  eta: '40 a 55 min',
  accentLight: '#D8391F',
  accentDark: '#FF7359',
  whatsapp: '5548900000000' // usado só no botão "pedir pelo WhatsApp" do rodapé
};

/* ---------- 2. Tamanhos de pizza -----------------------------------------
   m = multiplicador de preço | k = escala visual do desenho da pizza */
var SIZES = [
  { id: 'broto',   name: 'Broto',   cm: 25, slices: 4,  m: .6,  k: .68, serve: '1 pessoa' },
  { id: 'media',   name: 'Média',   cm: 30, slices: 6,  m: 1,   k: .8,  serve: '2 pessoas' },
  { id: 'grande',  name: 'Grande',  cm: 35, slices: 8,  m: 1.3, k: .9,  serve: '3 pessoas' },
  { id: 'gigante', name: 'Gigante', cm: 40, slices: 12, m: 1.55, k: 1,  serve: '4 a 5 pessoas' }
];

/* Preço-base (molho + mussarela), antes de massa/borda/sabor */
var BASE = 36;

/* ---------- 3. Tipos de massa --------------------------------------------
   dough = cor usada para desenhar a crosta | t = espessura visual (px) */
var MASSAS = [
  { id: 'tradicional', short: 'Clássica', name: 'Tradicional',   desc: 'Macia e alta, o clássico',        add: 0, dough: '#D9963F', t: 16 },
  { id: 'fina',        short: 'Fina',     name: 'Fina crocante', desc: 'Borda leve e fundo bem crocante', add: 0, dough: '#E0A755', t: 10 },
  { id: 'pan',         short: 'Pan',      name: 'Pan (grossa)',  desc: 'Fofa por dentro, dourada por fora', add: 5, dough: '#D08B31', t: 24 },
  { id: 'integral',    short: 'Integral', name: 'Integral',      desc: 'Farinha integral e sementes',     add: 5, dough: '#AE763C', t: 16 }
];

/* ---------- 4. Bordas recheadas ------------------------------------------
   color = cor usada para pintar o recheio na borda do desenho (null = sem) */
var BORDAS = [
  { id: 'sem',       short: 'Sem',        name: 'Sem recheio',   add: 0,  color: null },
  { id: 'requeijao', name: 'Requeijão',                          add: 8,  color: '#FBF4DF' },
  { id: 'cheddar',   name: 'Cheddar',                            add: 8,  color: '#F4A31C' },
  { id: 'chocolate', name: 'Chocolate',                          add: 10, color: '#4B2A1A' },
  { id: 'doceleite', short: 'Doce leite', name: 'Doce de leite', add: 10, color: '#C68642' }
];

/* ---------- 5. Ingredientes para o "monte a sua" --------------------------
   cat = chave usada para agrupar visualmente (ver CATS logo abaixo)
   p   = preço adicional por ingrediente (R$, antes do multiplicador do tamanho) */
var CATS = [
  ['queijos',  'Queijos'],
  ['carnes',   'Carnes'],
  ['vegetais', 'Vegetais e ervas'],
  ['extras',   'Extras'],
  ['doces',    'Doces']
];
var ING = [
  { id: 'provolone',   name: 'Provolone',       cat: 'queijos',  p: 6 },
  { id: 'gorgonzola',  name: 'Gorgonzola',      cat: 'queijos',  p: 8 },
  { id: 'parmesao',    name: 'Parmesão',        cat: 'queijos',  p: 5 },
  { id: 'requeijao',   name: 'Requeijão',       cat: 'queijos',  p: 5 },
  { id: 'cheddar',     name: 'Cheddar',         cat: 'queijos',  p: 5 },
  { id: 'calabresa',   name: 'Calabresa',       cat: 'carnes',   p: 6 },
  { id: 'presunto',    name: 'Presunto',        cat: 'carnes',   p: 5 },
  { id: 'bacon',       name: 'Bacon',           cat: 'carnes',   p: 7 },
  { id: 'frango',      name: 'Frango desfiado', cat: 'carnes',   p: 7 },
  { id: 'carne',       name: 'Carne moída',     cat: 'carnes',   p: 8 },
  { id: 'tomate',      name: 'Tomate',          cat: 'vegetais', p: 4 },
  { id: 'cebola',      name: 'Cebola',          cat: 'vegetais', p: 3 },
  { id: 'pimentao',    name: 'Pimentão',        cat: 'vegetais', p: 4 },
  { id: 'champignon',  name: 'Champignon',      cat: 'vegetais', p: 6 },
  { id: 'brocolis',    name: 'Brócolis',        cat: 'vegetais', p: 6 },
  { id: 'rucula',      name: 'Rúcula',          cat: 'vegetais', p: 5 },
  { id: 'milho',       name: 'Milho',           cat: 'vegetais', p: 3 },
  { id: 'palmito',     name: 'Palmito',         cat: 'vegetais', p: 7 },
  { id: 'azeitona',    name: 'Azeitona',        cat: 'vegetais', p: 4 },
  { id: 'manjericao',  name: 'Manjericão',      cat: 'vegetais', p: 3 },
  { id: 'ovo',         name: 'Ovo',             cat: 'extras',   p: 4 },
  { id: 'batatapalha', name: 'Batata palha',    cat: 'extras',   p: 4 },
  { id: 'chocolate',   name: 'Chocolate ao leite', cat: 'doces', p: 7 },
  { id: 'morango',     name: 'Morango',         cat: 'doces',    p: 9 }
];

/* ---------- 6. Sabores prontos (preço fechado por "tier") ----------------
   tier = quanto esse sabor soma ao preço-base (0 = entrada, 14 = premium) */
var FLAVORS = [
  { id: 'margherita',    name: 'Margherita',               tier: 0,  ing: ['tomate', 'manjericao'] },
  { id: 'napolitana',    name: 'Napolitana',                tier: 0,  ing: ['tomate', 'parmesao', 'manjericao'] },
  { id: 'calabresa',     name: 'Calabresa',                 tier: 0,  ing: ['calabresa', 'cebola', 'azeitona'] },
  { id: 'portuguesa',    name: 'Portuguesa',                tier: 8,  ing: ['presunto', 'ovo', 'cebola', 'azeitona', 'pimentao'] },
  { id: 'frango',        name: 'Frango com requeijão',      tier: 8,  ing: ['frango', 'requeijao', 'milho'] },
  { id: 'quatroqueijos', name: 'Quatro queijos',            tier: 8,  ing: ['provolone', 'gorgonzola', 'parmesao', 'requeijao'] },
  { id: 'horta',         name: 'Da horta',                  tier: 8,  ing: ['brocolis', 'champignon', 'tomate', 'pimentao', 'milho'] },
  { id: 'baconcheddar',  name: 'Bacon com cheddar',         tier: 14, ing: ['bacon', 'cheddar', 'cebola'] },
  { id: 'chocomorango',  name: 'Chocolate com morango',     tier: 14, ing: ['chocolate', 'morango'] }
];

/* ---------- 7. Bebidas ---------------------------------------------------- */
var DRINKS = [
  { id: 'refri', name: 'Refrigerante 2 L',      sub: 'Gelado',               p: 12 },
  { id: 'suco',  name: 'Suco natural 500 ml',   sub: 'Laranja ou maracujá',  p: 9 },
  { id: 'agua',  name: 'Água mineral 500 ml',   sub: 'Sem gás',              p: 4 }
];

/* Preferências que aparecem como chips no pré-cadastro (perfil do cliente) */
var PREFS = ['Carnes', 'Vegetariana', 'Queijos', 'Picante', 'Doces', 'Borda recheada', 'Massa fina'];

/* Ordem das etapas do construtor de pizza */
var STEPS = [['tamanho', 'Tamanho'], ['massa', 'Massa'], ['borda', 'Borda'], ['sabor', 'Sabor']];

/* ---------- 8. Parâmetros do desenho da pizza (não é preço, é visual) ----
   ORDER = ordem de "empilhamento" dos ingredientes ao desenhar
   COUNT = quantas peças de cada ingrediente aparecem
   MIND  = distância mínima entre peças do mesmo ingrediente (evita sobrepor) */
var ORDER = ['chocolate', 'requeijao', 'cheddar', 'provolone', 'gorgonzola', 'parmesao', 'tomate', 'cebola', 'pimentao', 'calabresa', 'presunto', 'bacon', 'frango', 'carne', 'champignon', 'brocolis', 'milho', 'palmito', 'azeitona', 'ovo', 'rucula', 'manjericao', 'batatapalha', 'morango'];
var COUNT = { tomate: 8, cebola: 14, azeitona: 9, champignon: 7, brocolis: 7, rucula: 10, manjericao: 7, milho: 26, palmito: 8, pimentao: 10, ovo: 3, presunto: 8, calabresa: 11, bacon: 9, frango: 12, carne: 14, provolone: 8, gorgonzola: 8, parmesao: 22, requeijao: 7, cheddar: 7, batatapalha: 9, chocolate: 1, morango: 9 };
var MIND = { milho: 7, parmesao: 6, carne: 9, cebola: 10, ovo: 34, batatapalha: 12, manjericao: 12 };

/* ---------- 9. Fotos reais (banco de imagens livre, Unsplash) ------------
   Usadas só como apoio visual (banners, cabeçalhos de categoria, etc.).
   A pizza do "monte a sua" continua sendo o desenho ao vivo, porque é ele
   que muda na hora conforme o cliente escolhe os ingredientes — uma foto
   real não consegue fazer isso. Troque os IDs abaixo por fotos próprias
   da pizzaria assim que o dono mandar material (ver README do projeto). */
function unsplash(id, w) {
  // Monta a URL já otimizada (formato, recorte e largura) a partir do ID da foto.
  return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + w + '&q=72';
}
var PHOTOS = {
  hero:     '1745031601376-51802da5ae5e', // forno a lenha, pizzaiolo assando
  carnes:   '1564128442383-9201fcc740eb', // pizza de pepperoni
  queijos:  '1607811253515-57ef7723099d', // margherita com manjericão
  vegetais: '1517685645259-c6caddb7165d', // pizza clássica na mesa
  massa:    '1745031854888-3bc4344e37a1', // massa sendo esticada à mão
  fatia:    '1616141215340-34b0e7c661c8', // fatia puxando queijo
  pessoa:   '1686659437288-8625c420a23b', // pessoa comendo uma fatia
  bebidas:  '1649930302517-a06774ae4d3f'  // lata gelada no gelo
};
