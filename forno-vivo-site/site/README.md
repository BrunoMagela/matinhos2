# Forno Vivo — site de pedidos de pizza (modelo white-label)

Site estático (HTML + CSS + JavaScript puro, sem build, sem framework, sem
backend) para pedidos de pizza com construtor visual ao vivo e pagamento
Pix simulado. Pensado para ser entregue como demonstração a uma pizzaria e,
depois de aprovado, publicado de verdade.

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

- `BRAND` — nome da pizzaria, cor principal (`accentLight`/`accentDark`),
  taxa de entrega, prazo estimado e número de WhatsApp.
- `SIZES`, `MASSAS`, `BORDAS`, `ING`, `FLAVORS`, `DRINKS` — cardápio e preços.
- `PHOTOS` — os IDs das fotos usadas nos banners (ver "Imagens" abaixo).

Você **não precisa mexer** em `core.js`, `draw.js` ou `app.js` para atender
um cliente novo — esses arquivos são a "engine" e servem para qualquer
pizzaria. Isso é o que torna o modelo reaproveitável (white-label): para
vender para a próxima pizzaria, copie a pasta inteira e troque só o
`catalog.js` (e, se quiser, as fotos).

## Imagens

A pizza do construtor ("monte a sua") é sempre o **desenho ao vivo em SVG**
(`js/draw.js`), porque é ele que muda na hora conforme o cliente clica nos
ingredientes — uma foto não consegue fazer isso.

As fotos reais usadas nos banners (tela inicial, passo da massa, carrinho
de bebidas, tela de pedido confirmado) vêm do banco de imagens gratuito
Unsplash, carregadas diretamente da CDN deles
(`https://images.unsplash.com/...`), sem custo e sem precisar baixar nada.
**Antes de publicar para o cliente final**, troque os IDs em `PHOTOS`
(em `catalog.js`) e o `background` do bloco `@media (min-width: 760px)`
em `css/style.css` por fotos de verdade da pizzaria (fachada, forno, pizzas
prontas) — fica muito mais convincente para o dono do que fotos de banco.

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
- `loading="lazy"` nas fotos para não atrasar o carregamento inicial.
