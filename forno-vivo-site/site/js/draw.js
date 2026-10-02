/* ======================================================================
   draw.js — MOTOR DE DESENHO DA PIZZA (SVG gerado por código)
   ======================================================================
   Gera a ilustração realista da pizza (massa, molho, queijo derretido e
   cada ingrediente) inteiramente em SVG, a partir dos dados de catalog.js.
   É por isso que a pizza muda "ao vivo" na tela conforme o cliente clica
   nos ingredientes — não são fotos fixas, é um desenho paramétrico.
   Não precisa editar este arquivo para trocar de pizzaria; edite
   catalog.js. Só mexa aqui se quiser desenhar um ingrediente novo que
   ainda não existe (veja o objeto P logo abaixo, uma função por item).
   ====================================================================== */

/* shade(cor, fator) — clareia (fator > 0) ou escurece (fator < 0) uma cor hex.
   Usada para gerar sombras/luzes da massa a partir de uma única cor base. */
function shade(hex,f){var n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,t=f<0?0:255,p=Math.abs(f);r=Math.round((t-r)*p+r);g=Math.round((t-g)*p+g);b=Math.round((t-b)*p+b);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);}
function hl(x,y,rx,ry,op,rot){return '<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="#fff" opacity="'+op+'" transform="rotate('+(rot||0)+' '+x+' '+y+')"/>';}
function f1(n){return n.toFixed(1);}
/* P = "paleta" de desenho: uma função por ingrediente.
   Cada função recebe (índice da peça, gerador de números aleatórios com
   seed fixa) e devolve um fragmento de SVG centrado em (0,0) — a posição
   final é aplicada depois, em topsMarkup(). Usar uma seed fixa garante
   que a mesma pizza sempre nasça com o mesmo visual (nada "pisca" ao
   re-renderizar). Para adicionar um ingrediente novo: crie uma entrada
   aqui com o mesmo id usado em catalog.js (ING) e inclua esse id em
   ORDER/COUNT/MIND (também em catalog.js). */
var P={
  tomate:function(i,r){
    var a=Math.round(r()*360),seeds='';
    for(var k=0;k<5;k++){var ang=r()*6.28,d=2.4+r()*2.2,x=f1(Math.cos(ang)*d),y=f1(Math.sin(ang)*d);seeds+='<ellipse cx="'+x+'" cy="'+y+'" rx=".95" ry=".55" fill="#FBE8A6" transform="rotate('+Math.round(ang*57)+' '+x+' '+y+')"/>';}
    return '<circle r="9.2" fill="url(#g-tomato)" stroke="#A82012" stroke-width="1"/><circle r="6.6" fill="#F7957A" opacity=".5"/>'+
      '<path d="M0,0 L0,-6.4 M0,0 L5.6,3.2 M0,0 L-5.6,3.2" stroke="#F9C0AE" stroke-width="1.1" opacity=".8" transform="rotate('+a+')"/>'+seeds+hl(-3.2,-4.2,3,1.4,.38,-35);
  },
  cebola:function(i,r){
    var a=Math.round(r()*360);
    return '<g transform="rotate('+a+')"><path d="M-8.2,1 A8.2,8.2 0 1,1 8.2,1" fill="none" stroke="#EFE0F5" stroke-width="2.8" stroke-linecap="round" opacity=".92"/>'+
      '<path d="M-8.2,1 A8.2,8.2 0 1,1 8.2,1" fill="none" stroke="#C99BD8" stroke-width=".8" opacity=".7" transform="scale(1.16)"/>'+
      '<path d="M-4.6,1 A4.6,4.6 0 1,1 4.6,1" fill="none" stroke="#E3C8EC" stroke-width="2.2" stroke-linecap="round" opacity=".9"/>'+
      '<path d="M-6,-4 A7.6,7.6 0 0,1 1,-7.8" fill="none" stroke="#fff" stroke-width=".9" opacity=".7" stroke-linecap="round"/></g>';
  },
  azeitona:function(){return '<path fill-rule="evenodd" d="M-4.9,0 a4.9,4.9 0 1,0 9.8,0 a4.9,4.9 0 1,0 -9.8,0 M-1.7,0 a1.7,1.7 0 1,0 3.4,0 a1.7,1.7 0 1,0 -3.4,0Z" fill="url(#g-olive)" stroke="#0d0d0d" stroke-width=".5"/>'+hl(-2.4,-2.6,1.5,.7,.42,-38);},
  champignon:function(){return '<path d="M-8.2,1 C-9,-6 -4,-9.4 0,-9.4 C4,-9.4 9,-6 8.2,1 C6.4,2 4.2,2 3.1,2.6 L3.1,8 C3.1,9.2 -3.1,9.2 -3.1,8 L-3.1,2.6 C-4.2,2 -6.4,2 -8.2,1Z" fill="url(#g-mush)" stroke="#A88B62" stroke-width=".9"/>'+
    '<path d="M-7.6,-2 C-6,-7.4 -2,-8.6 0,-8.6 C2,-8.6 6,-7.4 7.6,-2" fill="none" stroke="#8B6B45" stroke-width="1.5" opacity=".65" stroke-linecap="round"/>'+
    '<path d="M-5.6,1.6 L-4.8,3.6 M-2.2,2.2 L-2,4 M1.2,2.2 L1,4 M4.6,1.6 L4,3.6" stroke="#B79C74" stroke-width=".7" opacity=".7"/>'+hl(-3.4,-5.2,2.4,1,.35,-20);},
  brocolis:function(){
    var c=[[-4.6,-1.4,4],[4.6,-1.4,4],[0,-4.6,4.7],[-2.2,1.6,3.7],[2.8,1.8,3.5],[-6.2,2.2,2.6],[6.4,2.4,2.4]],s='<path d="M-1.8,3 L-2.6,9.4 L2.6,9.4 L1.8,3Z" fill="#A6D083" stroke="#6FA357" stroke-width=".6"/>';
    c.forEach(function(q,k){s+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="'+q[2]+'" fill="url(#g-broc)"/><circle cx="'+(q[0]-q[2]*.3).toFixed(1)+'" cy="'+(q[1]-q[2]*.3).toFixed(1)+'" r="'+(q[2]*.35).toFixed(1)+'" fill="#8ADB86" opacity=".7"/>';});
    return s;},
  rucula:function(){return '<path d="M0,0 C2,-7 9,-10 15,-6 C11,-4 12,-1 15,0 C11,2 12,5 14,7 C8,7 3,5 0,0Z" fill="url(#g-leaf)" stroke="#2A6B2C" stroke-width=".8"/>'+
    '<path d="M0,0 C5,-1 9,-2 14,0" fill="none" stroke="#C2EBA9" stroke-width="1"/><path d="M4,-.8 L6,-4.6 M8,-1.4 L10,-5 M6,-.6 L8,3.6 M10,-.4 L11.6,3.4" stroke="#B4E29A" stroke-width=".55" opacity=".8"/>'+hl(5,-4,3,1,.22,-20);},
  manjericao:function(){return '<path d="M-8.4,0 C-6,-6.6 3,-7.2 8.4,0 C3,7.2 -6,6.6 -8.4,0Z" fill="url(#g-basil)" stroke="#124A1B" stroke-width=".8"/>'+
    '<path d="M-7.6,0 L7.6,0" stroke="#8BDB8B" stroke-width=".8"/><path d="M-3,0 L-1,-3.6 M1,0 L3,-3.4 M-3,0 L-1.4,3.4 M1,0 L3,3.2" stroke="#7CD07E" stroke-width=".5" opacity=".8"/>'+
    '<circle cx="2.6" cy="1.8" r=".9" fill="#0F3D17" opacity=".6"/><circle cx="-3.6" cy="-1.6" r=".7" fill="#0F3D17" opacity=".5"/>'+hl(-2.4,-2.4,3,.9,.28,-15);},
  milho:function(){return '<ellipse rx="2.8" ry="3.3" fill="url(#g-corn)" stroke="#C88B00" stroke-width=".5"/>'+hl(-.9,-1.2,.9,.6,.7,-30);},
  palmito:function(){return '<circle r="5.7" fill="url(#g-heart)" stroke="#CDB26E" stroke-width=".9"/><circle r="3.7" fill="none" stroke="#DCC58A" stroke-width=".7"/><circle r="1.6" fill="#F7E7B5"/>'+hl(-2.2,-2.6,2,.9,.45,-35);},
  pimentao:function(i){var g=i%2,c1=g?'#A81E14':'#26762F',c2=g?'#E5503C':'#4FB055',d='M-9.4,3.6 Q0,-9 9.4,3.6';
    return '<path d="'+d+'" fill="none" stroke="'+c1+'" stroke-width="5.4" stroke-linecap="round"/><path d="'+d+'" fill="none" stroke="'+c2+'" stroke-width="3.8" stroke-linecap="round" transform="translate(0,-.5)"/><path d="'+d+'" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width=".9" stroke-linecap="round" transform="translate(-.4,-1.6)"/>';},
  ovo:function(){return '<path d="M-11.5,0 C-12.5,-8 -4,-12.6 3.6,-10.6 C10.6,-9.6 14,-1.4 8.6,7 C3.4,13 -7.6,11 -11.5,0Z" fill="url(#g-white)" stroke="#E2D7BB" stroke-width=".8"/>'+
    '<path d="M-9,1 C-9.6,-5 -3.6,-9.4 2.6,-8.2" fill="none" stroke="#fff" stroke-width="1.2" opacity=".7" stroke-linecap="round"/>'+
    '<circle cx=".4" cy=".2" r="5.2" fill="#000" opacity=".1"/><circle r="4.8" fill="url(#g-yolk)" stroke="#D97800" stroke-width=".5"/>'+hl(-1.5,-1.9,1.6,.9,.75,-30);},
  calabresa:function(i,r){var sp='';for(var k=0;k<7;k++){var a=r()*6.28,d=1.5+r()*5;sp+='<ellipse cx="'+f1(Math.cos(a)*d)+'" cy="'+f1(Math.sin(a)*d)+'" rx="'+f1(.7+r()*.9)+'" ry="'+f1(.5+r()*.6)+'" fill="#F4B09B" opacity=".85"/>';}
    return '<circle r="8.9" fill="url(#g-cal)" stroke="#5E120C" stroke-width="1"/><circle r="7.4" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="1.2"/>'+sp+hl(-3,-3.6,3,1.4,.3,-35);},
  presunto:function(){return '<path d="M-9.4,-1.4 C-9.6,-7.8 2.4,-9.4 8,-5.4 C11.4,-2 10.4,4.4 5,6.6 C-.6,8.6 -9.2,6 -9.4,-1.4Z" fill="url(#g-ham)" stroke="#C4706B" stroke-width=".9"/>'+
    '<path d="M-5,-3.6 Q0,1 6,-2.6" fill="none" stroke="#D27C77" stroke-width="1.1" opacity=".65"/><path d="M-6.4,2 Q-1,5 4,3" fill="none" stroke="#D27C77" stroke-width=".9" opacity=".5"/>'+hl(-3.4,-4.6,3.4,1.1,.34,-20);},
  bacon:function(){var d='M-11,0 q5.5,-4.5 11,0 t11,0';return '<path d="'+d+'" fill="none" stroke="#6E2417" stroke-width="6.4" stroke-linecap="round"/><path d="'+d+'" fill="none" stroke="#BF5A44" stroke-width="4.8" stroke-linecap="round"/><path d="'+d+'" fill="none" stroke="#F4D3C4" stroke-width="1.9" stroke-linecap="round" stroke-dasharray="6 2.5" transform="translate(0,.5)"/><path d="'+d+'" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width=".8" transform="translate(0,-1.8)"/>';},
  frango:function(i,r){var s='';for(var k=0;k<7;k++){var x=(r()-.5)*11,y=(r()-.5)*9,a=r()*3.14,l=6+r()*4,cx=x+Math.cos(a)*l/2+(r()-.5)*4,cy=y+Math.sin(a)*l/2+(r()-.5)*4,ex=x+Math.cos(a)*l,ey=y+Math.sin(a)*l,d='M'+f1(x)+','+f1(y)+' Q'+f1(cx)+','+f1(cy)+' '+f1(ex)+','+f1(ey);
      s+='<path d="'+d+'" fill="none" stroke="#C99A62" stroke-width="3.4" stroke-linecap="round"/><path d="'+d+'" fill="none" stroke="#F0D3A6" stroke-width="1.7" stroke-linecap="round"/>'+(k%3===0?'<path d="'+d+'" fill="none" stroke="#9C6B36" stroke-width=".7" stroke-dasharray="1 2.4" opacity=".7"/>':'');}return s;},
  carne:function(i,r){var s='';for(var k=0;k<6;k++){var x=(r()-.5)*10,y=(r()-.5)*9,q=1.7+r()*1.6;s+='<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+f1(q)+'" fill="url(#g-beef)"/><circle cx="'+f1(x-q*.3)+'" cy="'+f1(y-q*.35)+'" r="'+f1(q*.3)+'" fill="#B57A58" opacity=".55"/>';}return s;},
  provolone:function(){return '<rect x="-5.2" y="-5.2" width="10.4" height="10.4" rx="3.4" fill="url(#g-prov)" stroke="#DDB84F" stroke-width=".8"/><path d="M-3.6,-3.4 L2.8,-3.6" stroke="#fff" stroke-width="1" opacity=".55" stroke-linecap="round"/><ellipse cx="1.2" cy="2.6" rx="4" ry="1.6" fill="#E6BE55" opacity=".4"/>';},
  gorgonzola:function(){return '<path d="M-8,0 C-8,-6 0,-9 6,-5 C10,-2 8,5 2,7 C-4,8 -8,4 -8,0Z" fill="url(#g-gorg)" stroke="#BDB8A1" stroke-width=".8"/>'+
    '<path d="M-4,-2 Q-1,0 -2,3 M2,-4 Q3,-1 1,1" fill="none" stroke="#5B8DB5" stroke-width="1.1" opacity=".85"/><circle cx="3" cy="2.6" r="1.1" fill="#5E9D9A"/><circle cx="-4.4" cy="1.4" r=".8" fill="#4F7FB0"/>'+hl(-2.6,-3.4,2.6,.9,.4,-20);},
  parmesao:function(){return '<path d="M-6.2,1 Q0,-3.2 6.4,0 Q0,2 -6.2,1Z" fill="#FFF9E0" stroke="#E9D89E" stroke-width=".5" opacity=".95"/>';},
  requeijao:function(){return '<path d="M-6.4,.6 C-7,-4.6 -1,-7.6 3.6,-6 C7.8,-4.4 8,1.8 4.4,5 C0,7.6 -5.8,5.6 -6.4,.6Z" fill="url(#g-cream)" stroke="#E4D8B6" stroke-width=".8"/><ellipse cx="1.4" cy="3" rx="4.6" ry="2" fill="#E9DDBD" opacity=".55"/>'+hl(-2.4,-3,2.4,1.2,.85,-25);},
  cheddar:function(){return '<path d="M-6.2,.4 C-6.8,-4.4 -1,-7.2 3.4,-5.8 C7.6,-4.2 7.8,1.6 4.2,4.8 C0,7.2 -5.6,5.4 -6.2,.4Z" fill="url(#g-cheddar)" stroke="#C7740E" stroke-width=".8"/><ellipse cx="1.4" cy="2.8" rx="4.4" ry="1.9" fill="#D9820F" opacity=".4"/>'+hl(-2.4,-2.8,2.2,1.1,.6,-25);},
  batatapalha:function(i,r){var s='';for(var k=0;k<7;k++){var a=r()*Math.PI,l=8+r()*5,ox=(r()-.5)*9,oy=(r()-.5)*9,x1=f1(ox-Math.cos(a)*l/2),y1=f1(oy-Math.sin(a)*l/2),x2=f1(ox+Math.cos(a)*l/2),y2=f1(oy+Math.sin(a)*l/2);
      s+='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#DDA43A" stroke-width="1.8" stroke-linecap="round"/><line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#F7DA84" stroke-width=".7" stroke-linecap="round"/>';}return s;},
  chocolate:function(){return '<g filter="url(#f-edge)"><circle r="80" fill="url(#g-choc)"/><path d="M-62,-32 Q-31,-54 0,-32 T62,-32" fill="none" stroke="#9C6547" stroke-width="5" stroke-linecap="round" opacity=".55"/><path d="M-66,0 Q-33,-22 0,0 T66,0" fill="none" stroke="#9C6547" stroke-width="5" stroke-linecap="round" opacity=".55"/><path d="M-62,32 Q-31,10 0,32 T62,32" fill="none" stroke="#9C6547" stroke-width="5" stroke-linecap="round" opacity=".55"/></g>'+hl(-30,-46,18,5,.16,-10)+hl(28,-20,12,3.4,.12,15);},
  morango:function(){return '<path d="M0,-7.4 C8.4,-8.6 10.6,2 0,9.6 C-10.6,2 -8.4,-8.6 0,-7.4Z" fill="url(#g-straw)" stroke="#A5152F" stroke-width=".8"/>'+
    '<path d="M0,-4.4 C4.4,-5 5.6,1 0,5.6 C-5.6,1 -4.4,-5 0,-4.4Z" fill="#FFC9D1" opacity=".75"/>'+
    '<circle cx="-4.4" cy="-1" r=".7" fill="#FFE9B0"/><circle cx="4.2" cy="-.6" r=".7" fill="#FFE9B0"/><circle cx="-2.6" cy="3.6" r=".7" fill="#FFE9B0"/><circle cx="2.8" cy="3.4" r=".7" fill="#FFE9B0"/>'+
    '<path d="M-4.6,-7.6 L0,-11 L4.6,-7.6 L0,-6Z" fill="#3E9B47"/>'+hl(-3.4,-3.4,2.4,1,.4,-30);}
};
/* Cache: cada ingrediente só precisa ter seu layout e SVG calculados uma
   vez por carregamento de página — depois disso é só exibir/ocultar com
   CSS (ver .ing / .ing.on no style.css), o que é muito mais rápido. */
var TOPS={};

/* layoutFor(id) — espalha N peças de um ingrediente dentro do círculo da
   pizza sem deixá-las muito próximas (distância mínima MIND[id]). Usa um
   gerador de números pseudoaleatórios com seed fixa (rng/hash, definidos
   em app.js) para que o resultado seja sempre o mesmo para aquele id. */
function layoutFor(id){
  if(id==='chocolate')return[{x:0,y:0,r:0,s:1}];
  var R=rng(hash('L'+id)),n=COUNT[id],minD=MIND[id]||15,out=[],tries=0;
  while(out.length<n&&tries<900){
    tries++;if(tries%150===0)minD*=.8;
    var a=R()*6.2832,d=Math.sqrt(R())*71,x=Math.cos(a)*d,y=Math.sin(a)*d;
    if(out.every(function(p){return Math.hypot(p.x-x,p.y-y)>=minD;}))out.push({x:+x.toFixed(1),y:+y.toFixed(1),r:Math.round(R()*360),s:+(.88+R()*.3).toFixed(2)});
  }
  return out;
}
function topsMarkup(id){
  if(TOPS[id])return TOPS[id];
  TOPS[id]=layoutFor(id).map(function(p,i){
    return '<g transform="translate('+p.x+' '+p.y+') rotate('+p.r+') scale('+p.s+')"><g class="pc" style="--d:'+(i*0.035).toFixed(2)+'s">'+P[id](i,rng(hash(id+i)))+'</g></g>';
  }).join('');
  return TOPS[id];
}
function crustMarkup(ms,bd){
  var t=ms.t,rc=100-t/2,R=rng(hash('crust'+ms.id)),dough=ms.dough,dark=shade(dough,-.36),light=shade(dough,.32),s='',k,
      circ=2*Math.PI*rc,N=Math.round(circ/(t>18?22:19)),len=circ/N;
  s+='<g filter="url(#f-crust)"><circle r="'+rc+'" fill="none" stroke="'+(bd.color||dark)+'" stroke-width="'+t+'"/>';
  if(bd.color)s+='<circle r="'+rc+'" fill="none" stroke="'+shade(bd.color,-.22)+'" stroke-opacity=".35" stroke-width="'+(t*.3).toFixed(1)+'"/>';
  for(k=0;k<N;k++){
    var a=(k+R()*.3)*2*Math.PI/N,x=Math.cos(a)*rc,y=Math.sin(a)*rc,lit=-(Math.cos(a)+Math.sin(a))/1.414,
        rx=len*(bd.color?.45:.6),ry=t*.5+R()*t*.05;
    s+='<g transform="translate('+f1(x)+' '+f1(y)+') rotate('+f1(a*57.2958+90)+')"><ellipse rx="'+f1(rx)+'" ry="'+f1(ry)+'" fill="'+dough+'" stroke="'+dark+'" stroke-opacity=".75" stroke-width=".9"/>'+
      '<ellipse cx="'+f1((R()-.5)*2)+'" cy="'+f1(-t*.14)+'" rx="'+f1(rx*.62)+'" ry="'+f1(t*.2)+'" fill="'+light+'" opacity="'+Math.max(.15,Math.min(.85,.4+lit*.45)).toFixed(2)+'"/>'+
      '<ellipse cx="0" cy="'+f1(t*.3)+'" rx="'+f1(rx*.8)+'" ry="'+f1(t*.14)+'" fill="'+dark+'" opacity=".28"/></g>';
  }
  if(bd.color){
    for(k=0;k<9;k++){var a2=R()*6.283,x2=Math.cos(a2)*(100-t+1),y2=Math.sin(a2)*(100-t+1);
      s+='<ellipse cx="'+f1(x2)+'" cy="'+f1(y2)+'" rx="'+f1(3+R()*3)+'" ry="'+f1(1.8+R()*1.4)+'" transform="rotate('+f1(a2*57.2958+90)+' '+f1(x2)+' '+f1(y2)+')" fill="'+bd.color+'" stroke="'+shade(bd.color,-.2)+'" stroke-opacity=".5" stroke-width=".6"/>';}
  }
  s+='</g><g filter="url(#f-b1)">';
  for(k=0;k<26;k++){var a3=R()*6.283,rr=rc+(R()-.5)*t*.7,x3=Math.cos(a3)*rr,y3=Math.sin(a3)*rr;
    s+='<ellipse cx="'+f1(x3)+'" cy="'+f1(y3)+'" rx="'+f1(1.6+R()*3.2)+'" ry="'+f1(1+R()*1.6)+'" transform="rotate('+Math.round(a3*57.3+90)+' '+f1(x3)+' '+f1(y3)+')" fill="#4E2308" opacity="'+(.2+R()*.32).toFixed(2)+'"/>';}
  s+='</g>';
  for(k=0;k<34;k++){var a4=R()*6.283,r4=rc+(R()-.5)*t*.8;s+='<circle cx="'+f1(Math.cos(a4)*r4)+'" cy="'+f1(Math.sin(a4)*r4)+'" r=".6" fill="#fff" opacity=".5"/>';}
  s+='<circle r="'+(100-t).toFixed(1)+'" fill="none" stroke="rgba(50,20,2,.38)" stroke-width="1.8"/><circle r="99.4" fill="none" stroke="rgba(50,20,2,.4)" stroke-width="1.2"/>';
  return s;
}
function sliceMarkup(n){
  var s='';
  for(var k=0;k<n;k++){var a=k*2*Math.PI/n-Math.PI/2,c=Math.cos(a),si=Math.sin(a);
    s+='<line x1="0" y1="0" x2="'+f1(c*99)+'" y2="'+f1(si*99)+'" stroke="rgba(60,25,4,.34)" stroke-width="1.5"/><line x1="'+f1(-si*.9)+'" y1="'+f1(c*.9)+'" x2="'+f1(c*99-si*.9)+'" y2="'+f1(si*99+c*.9)+'" stroke="rgba(255,240,200,.22)" stroke-width=".9"/>';}
  return s;
}
var CHEESE=(function(){
  var R=rng(77),s='',i;
  for(i=0;i<10;i++){var a=R()*6.28,d=Math.sqrt(R())*62,x=f1(Math.cos(a)*d),y=f1(Math.sin(a)*d);
    s+='<ellipse cx="'+x+'" cy="'+y+'" rx="'+f1(12+R()*16)+'" ry="'+f1(7+R()*9)+'" transform="rotate('+Math.round(R()*180)+' '+x+' '+y+')" fill="'+(i%3?'#FBEAAB':'#DFA845')+'" opacity="'+(i%3?'.5':'.3')+'"/>';}
  for(i=0;i<30;i++){var a3=R()*6.28,d3=Math.sqrt(R())*76,bx=Math.cos(a3)*d3,by=Math.sin(a3)*d3,rr=2.4+R()*5.2;
    s+='<circle cx="'+f1(bx)+'" cy="'+f1(by)+'" r="'+f1(rr)+'" fill="url(#g-bubble)" stroke="#D59A3A" stroke-opacity=".55" stroke-width=".7"/>';
    if(R()>.5)s+='<circle cx="'+f1(bx)+'" cy="'+f1(by)+'" r="'+f1(rr*.55)+'" fill="#B9762A" opacity=".4"/>';
    s+='<ellipse cx="'+f1(bx-rr*.3)+'" cy="'+f1(by-rr*.36)+'" rx="'+f1(rr*.36)+'" ry="'+f1(rr*.18)+'" fill="#fff" opacity=".55"/>';}
  return s;
})();
/* pizzaSVG(config, opções) — monta o SVG completo da pizza:
   disco de madeira (fundo) → molho → queijo derretido → ingredientes
   (clipados em círculo, com sombra) → borda/crosta → brilho → linhas de
   corte. `config` é um objeto {size, massa, borda, mode, flavor, ing[]}
   igual ao usado no estado do app (ver S.cur em app.js).
   opções.all = true desenha TODOS os ingredientes no DOM (ocultos via
   CSS) para permitir a animação de entrada ao marcar/desmarcar — usado
   na tela de montagem; nas demais telas só os ingredientes do pedido
   são desenhados. */
function pizzaSVG(c,o){
  o=o||{};
  var sz=byId(SIZES,c.size),ms=byId(MASSAS,c.massa),bd=byId(BORDAS,c.borda),uid=o.uid||('u'+(S.uid++));
  var tops=ORDER.filter(function(id){return o.all||c.ing.indexOf(id)>-1;}).map(function(id){
    return '<g class="ing'+(c.ing.indexOf(id)>-1?' on':'')+'" data-id="'+id+'">'+topsMarkup(id)+'</g>';
  }).join('');
  return '<svg viewBox="-130 -130 260 260" role="img" aria-label="Pizza '+esc(title(c))+'">'+
    '<defs><clipPath id="c-'+uid+'"><circle r="88"/></clipPath></defs>'+
    '<circle r="124" fill="url(#g-wood)" filter="url(#f-wood)"/><circle r="124" fill="none" stroke="#4A2F14" stroke-opacity=".6" stroke-width="2.5"/><circle r="120.5" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="1.4"/>'+
    '<g class="pz-scale" style="transform:scale('+sz.k+')">'+
      '<circle r="103" cy="6" fill="#1c0d02" opacity=".4" filter="url(#f-b3)"/>'+
      '<circle r="94" fill="url(#g-sauce)" filter="url(#f-edge)"/>'+
      '<circle r="82" fill="url(#g-cheese)" filter="url(#f-cheese)"/>'+CHEESE+
      '<g clip-path="url(#c-'+uid+')"><g class="pz-tops" style="filter:url(#f-drop)">'+tops+'</g></g>'+
      '<g class="pz-crust">'+crustMarkup(ms,bd)+'</g>'+
      '<circle r="100" fill="url(#g-light)" pointer-events="none"/>'+
      '<g class="pz-slices">'+sliceMarkup(sz.slices)+'</g>'+
    '</g></svg>';
}
