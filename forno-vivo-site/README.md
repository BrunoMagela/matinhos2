# Forno Vivo — site de pedidos de pizza (modelo white-label)

Site estático (HTML + CSS + JavaScript puro, sem build, sem framework, sem
backend) para pedidos de pizza com construtor visual ao vivo e pagamento
Pix simulado. Pensado para ser entregue como demonstração a uma pizzaria e,
depois de aprovado, publicado de verdade.

A página inicial funciona como uma home de verdade (inspirada em sites de
pizzarias/restaurantes de marca forte, adaptada à realidade brasileira):
herói com a pizza desenhada ao vivo e frase de efeito, sabores em destaque,
bloco "como funciona", seção "sobre" com uma mini ficha técnica, rodapé com
endereço/horário/WhatsApp/Instagram e um botão flutuante de WhatsApp — tudo
em português e em reais (R$). O pré-cadastro e o construtor de pizza
continuam exatamente como antes, agora como a continuação natural da home
(âncora `#cadastro`).

O site **não usa nenhuma foto** (nem de banco de imagens, nem própria da
pizzaria) em lugar nenhum — ver seção "Visual: zero fotos, só o desenho ao
vivo" mais abaixo para o porquê e como isso foi feito.

## Estrutura dos arquivos

```
index.html        Estrutura da página + definições SVG da pizza
css/style.css      Todo o visual do site (comentado por seção)
js/catalog.js       DADOS da pizzaria: nome, cores, tamanhos, massas,
                     bordas, ingredientes, sabores, bebidas, fotos
js/core.js           Utilitários, estado da aplicação e cálculo de preços
js/draw.js           Motor que desenha a pizza em SVG (muda ao vivo)
js/app.js            Telas, navegação e ações (cliques, formulário, Pix)
```

Não há processo de build: é só HTML/CSS/JS puro, então qualquer hospedagem
de arquivos estáticos funciona (Vercel, Hostinger, Netlify, GitHub Pages...).

## Como personalizar para uma pizzaria (o que você normalmente vai editar)

Praticamente tudo fica em **`js/catalog.js`**:

- `BRAND` — nome, frase de efeito (`tagline`), texto do "sobre" (`about`),
  cor principal (`accentLight`/`accentDark`), taxa de entrega, prazo
  estimado, WhatsApp, Instagram, endereço, horário e link do Google Maps.
- `SIZES`, `MASSAS`, `BORDAS`, `ING`, `FLAVORS`, `DRINKS` — cardápio e preços.

Você **não precisa mexer** em `core.js`, `draw.js` ou `app.js` para atender
um cliente novo — esses arquivos são a "engine" e servem para qualquer
pizzaria. Isso é o que torna o modelo reaproveitável (white-label): para
vender para a próxima pizzaria, copie a pasta inteira e troque só o
`catalog.js` (e, se quiser, as fotos).

## Visual: zero fotos, só o desenho ao vivo

Decisão de design proposital: o site **não usa nenhuma foto** — nem de
banco de imagens, nem foto própria da pizzaria — em lugar nenhum (home,
sabores em destaque, construtor, carrinho, tela de pedido confirmado).
Todo visual de pizza do site é o **mesmo desenho SVG ao vivo**
(`js/draw.js`), só que às vezes parado/em miniatura em vez de interativo:

- Na home (herói) e nos cartões de "sabores em destaque": uma instância
  pequena e estática do desenho, já com os ingredientes daquele sabor.
- No construtor: a instância grande e interativa, que muda a cada clique
  do cliente (massa, borda, sabor, ingrediente, e agora também meio a meio
  — ver seção abaixo).
- No carrinho e na ficha do pedido: miniaturas da mesma pizza montada.

Por que essa troca (em vez da versão anterior, com fotos do Unsplash):

1. **Elimina uma categoria inteira de bug.** Foto de banco de imagens
   depende de rede (CDN externa) e pode falhar, carregar devagar ou vir
   com proporção diferente do espaço reservado — foi exatamente isso que
   causava os problemas visuais no celular na versão anterior. Um SVG
   gerado pelo próprio site nunca "quebra" nem precisa carregar nada.
2. **Mais honesto com o cliente.** O que ele vê é literalmente a pizza que
   ele está montando (o sabor certo, o meio a meio certo, a borda certa),
   não uma foto genérica de banco de imagens.
3. **Mais rápido.** Nada para baixar além do HTML/CSS/JS do próprio site.
4. **Visual mais limpo e consistente** — todas as pizzas do site (home,
   destaques, construtor, carrinho, confirmação) têm exatamente o mesmo
   estilo de ilustração, em vez de misturar fotos de fontes diferentes.

Quando a pizzaria tiver fotos profissionais próprias (fachada, salão,
equipe, forno a lenha aceso), elas combinam bem num Instagram/WhatsApp,
mas **não são necessárias no site** — o desenho ao vivo já cumpre o papel
de "fazer o cliente salivar" e tem a vantagem extra de ser interativo.
Se um dia quiser adicionar uma foto pontual (ex.: a fachada, na seção
"Sobre"), é só colocar uma tag `<img>` com `width`/`height` fixos (nunca
só `aspect-ratio` no CSS sozinho — foi a combinação dos dois que causava
o bug de layout da versão anterior) e, de preferência, usando um arquivo
próprio hospedado junto do site em vez de um link de CDN externa.

## Meio a meio (até 2 sabores por pizza)

O cliente pode combinar **até 2 sabores prontos do cardápio** numa mesma
pizza (meio a meio) — como numa pizzaria de verdade. Funciona assim:

- Na etapa "Sabor", aba "Clássicas", cada sabor agora é um botão de
  **seleção múltipla** (não mais de escolha única): tocar adiciona,
  tocar de novo remove. Com 2 já escolhidos, o próximo toque mostra um
  aviso pedindo para trocar um dos dois em vez de simplesmente ignorar o
  clique sem explicação.
- O desenho da pizza divide ao vivo em duas metades (uma linha tracejada
  aparece só quando os 2 sabores são diferentes) — cada metade mostra os
  ingredientes do sabor correspondente.
- **Preço:** cobra-se o valor do sabor **mais caro** dos dois escolhidos,
  nunca a soma dos dois — é a regra mais comum entre pizzarias no Brasil e
  evita um preço "estranho" ou alto demais para o cliente. Essa regra está
  isolada numa função só (`parts()`, em `core.js`), fácil de trocar para
  "média dos dois" se a pizzaria preferir.
- O meio a meio vale só para os sabores prontos do cardápio (aba
  "Clássicas"). O "Monte a sua" (aba de ingredientes livres) continua
  sendo uma pizza inteira com os ingredientes escolhidos — não tem
  conceito de "metade" ali, porque o cliente já escolhe ingrediente por
  ingrediente livremente.

## O que é real e o que é simulado nesta demonstração

- ✅ Cálculo de preço, construtor de pizza, carrinho, cadastro: tudo real
  e funcional, roda inteiramente no navegador.
- ⚠️ Pix: **simulado**. O QR code e o código "copia e cola" são gerados só
  para a demonstração e não geram cobrança nenhuma. Para aceitar Pix de
  verdade é necessário integrar uma operadora de pagamento (Mercado Pago,
  Asaas, Pagar.me ou Stripe Brasil são as opções mais usadas) — isso exige
  um pequeno backend (ex.: uma function na Vercel) para gerar a cobrança
  com segurança, o que não existe neste site estático.
- ⚠️ Painel da pizzaria: a tela "Pedido confirmado" tem um botão **Copiar
  resumo do pedido**, que gera um texto pronto para colar num grupo de
  WhatsApp ou sistema de comandas — é um jeito simples de ajudar a cozinha
  enquanto não existe um painel de verdade. Um painel completo (pedidos
  em tempo real, histórico de clientes, etc.) é a próxima fase do projeto
  e precisa de um banco de dados (ex. Supabase) por trás.

## Publicar na Vercel (primeira etapa, para aprovação)

1. Crie uma conta gratuita em vercel.com (dá para entrar com GitHub, GitLab
   ou e-mail).
2. Opção mais simples — **arrastar e soltar**: entre em vercel.com →
   "Add New..." → "Project" → aba de importar uma pasta/arquivo zip, e
   envie o conteúdo desta pasta.
3. Opção via linha de comando, se preferir:
   ```
   npm i -g vercel
   cd pasta-do-site
   vercel
   ```
   Siga as perguntas (pode aceitar todas as opções padrão: não é um
   framework, não precisa de build command). A Vercel devolve uma URL do
   tipo `seu-projeto.vercel.app` para você mandar ao dono da pizzaria.
4. Qualquer alteração: edite os arquivos e rode `vercel --prod` de novo
   (ou reenvie a pasta pela interface web).

## Publicar na Hostinger (depois de aprovado)

1. No painel da Hostinger, abra o **Gerenciador de Arquivos** (ou conecte
   por FTP) do plano de hospedagem do cliente.
2. Envie todo o conteúdo desta pasta (`index.html`, `css/`, `js/`) para a
   pasta pública do site — geralmente `public_html`.
3. Confirme que a estrutura de pastas foi mantida (ou seja, que
   `public_html/css/style.css` e `public_html/js/app.js` existem) — o
   `index.html` referencia esses caminhos relativos.
4. Acesse o domínio do cliente para conferir.

Não é necessário Node, banco de dados nem nenhuma configuração de servidor
— é hospedagem de arquivos estáticos simples, compatível com qualquer
plano da Hostinger (mesmo o mais básico).

## Acessibilidade e boas práticas já incluídas

- HTML semântico, `aria-label`/`aria-live` nos pontos certos (carrinho,
  etapas, QR code, acompanhamento do pedido).
- Contraste de cores testado em modo claro e escuro (o site segue a
  preferência do sistema do visitante automaticamente).
- `prefers-reduced-motion` respeitado (desliga animações para quem
  configurou o sistema para isso).
- Layout responsivo "mobile-first": funciona de 320px até telas grandes,
  com um tratamento específico de "cartão central" a partir de 760px.
- Testado em 7 larguras de tela (320 a 1440px) sem nenhum elemento
  cortado, sobreposto ou com rolagem horizontal indevida.
