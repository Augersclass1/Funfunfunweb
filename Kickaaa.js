javascript:(function(){
  if(window.__destroyer_active) return alert('Destroyer ya activo');
  window.__destroyer_active=true;
  const cv=document.createElement('canvas');
  cv.style.position='fixed'; cv.style.left=0; cv.style.top=0; cv.style.width='100%'; cv.style.height='100%';
  cv.style.zIndex=2147483647; cv.style.pointerEvents='none';
  cv.width=innerWidth; cv.height=innerHeight; document.body.appendChild(cv);
  const ctx=cv.getContext('2d');
  let ship={x:innerWidth/2,y:innerHeight/2,ang:0,vx:0,vy:0};
  const bullets=[];
  const keys={};
  function onResize(){cv.width=innerWidth; cv.height=innerHeight;}
  addEventListener('resize',onResize);
  addEventListener('keydown',e=>{keys[e.key]=true; if(e.key===' '){ spawnBullet(); e.preventDefault(); }});
  addEventListener('keyup',e=>{keys[e.key]=false;});
  function spawnBullet(){
    const speed=12;
    const ang=ship.ang;
    bullets.push({x:ship.x+Math.cos(ang)*20, y:ship.y+Math.sin(ang)*20, vx:Math.cos(ang)*speed, vy:Math.sin(ang)*speed, life:120});
  }
  function drawShip(){
    ctx.save();
    ctx.translate(ship.x,ship.y);
    ctx.rotate(ship.ang);
    ctx.beginPath(); ctx.moveTo(15,0); ctx.lineTo(-10,8); ctx.lineTo(-10,-8); ctx.closePath();
    ctx.fillStyle='white'; ctx.fill(); ctx.restore();
  }
  function explodeElement(el,x,y){
    if(!el || el===document.documentElement || el===document.body) return;
    // animación rápida y borrado
    el.style.transition='transform 0.6s ease,opacity 0.6s ease';
    el.style.transform='translate('+((Math.random()-0.5)*200)+'px,'+((Math.random()-0.5)*200)+'px) rotate('+((Math.random()-0.5)*720)+'deg) scale(0.1)';
    el.style.opacity='0';
    setTimeout(()=>{ try{ el.remove() }catch(e){} },650);
    // opcional: dibujar una explosión en el canvas
    ctx.beginPath(); ctx.arc(x,y,30,0,Math.PI*2); ctx.fillStyle='rgba(255,140,0,0.9)'; ctx.fill();
  }
  function update(){
    // controles
    if(keys.ArrowUp||keys.w) { ship.vx += Math.cos(ship.ang)*0.4; ship.vy += Math.sin(ship.ang)*0.4; }
    if(keys.ArrowDown||keys.s) { ship.vx *= 0.98; ship.vy *= 0.98; }
    if(keys.ArrowLeft||keys.a) { ship.ang -= 0.08; }
    if(keys.ArrowRight||keys.d) { ship.ang += 0.08; }
    ship.x += ship.vx; ship.y += ship.vy;
    ship.vx *= 0.98; ship.vy *= 0.98;
    // límites
    if(ship.x<0) ship.x=0; if(ship.x>cv.width) ship.x=cv.width;
    if(ship.y<0) ship.y=0; if(ship.y>cv.height) ship.y=cv.height;
    // bullets
    for(let i=bullets.length-1;i>=0;i--){
      const b=bullets[i];
      b.x+=b.vx; b.y+=b.vy; b.life--;
      // colisión con elementos DOM
      try{
        const elems=document.elementsFromPoint(Math.max(0,Math.min(innerWidth-1, b.x)), Math.max(0,Math.min(innerHeight-1, b.y)));
        if(elems && elems.length){
          const el=elems.find(e=>e!==cv && e!==null && e!==document.documentElement && e!==document.body);
          if(el){ explodeElement(el,b.x,b.y); bullets.splice(i,1); continue; }
        }
      }catch(e){}
      if(b.life<=0 || b.x<0 || b.y<0 || b.x>cv.width || b.y>cv.height) bullets.splice(i,1);
    }
  }
  function render(){
    ctx.clearRect(0,0,cv.width,cv.height);
    // dibuja balas
    for(const b of bullets){ ctx.beginPath(); ctx.arc(b.x,b.y,4,0,Math.PI*2); ctx.fillStyle='yellow'; ctx.fill(); }
    drawShip();
  }
  function loop(){ update(); render(); window.__destroyer_loop=requestAnimationFrame(loop); }
  loop();
  // instrucciones rápidas
  alert('Destroyer activo — usa WASD o flechas para mover, ESPACIO para disparar. Recarga la página para restaurar.');
  // botón para desactivar si quieres
  const kill=document.createElement('button'); kill.textContent='✖ Destroyer OFF'; kill.style.position='fixed'; kill.style.zIndex=2147483647; kill.style.right='10px'; kill.style.top='10px';
  kill.style.padding='6px 10px'; kill.style.fontSize='12px'; document.body.appendChild(kill);
  kill.addEventListener('click',()=>{
    cancelAnimationFrame(window.__destroyer_loop);
    try{ cv.remove(); kill.remove(); }catch(e){}
    window.__destroyer_active=false;
    alert('Destroyer desactivado. Recarga la página si ves efectos residuales.');
  });
})();
