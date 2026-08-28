// order of pages for the star trail + side nav
const PAGES = [
  { id: 'portada',    file: 'index.html',      label: 'Portada' },
  { id: 'bienvenida', file: 'bienvenida.html', label: 'Bienvenida' },
  { id: 'recuerdos',  file: 'recuerdos.html',  label: 'Recuerdos' },
  { id: 'palabras',   file: 'palabras.html',   label: 'Palabras' },
  { id: 'cualidades', file: 'cualidades.html', label: 'Eres así' },
  { id: 'cierre',     file: 'cierre.html',     label: 'Cierre' },
];

function currentPageIndex(){
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const idx = PAGES.findIndex(p => p.file === path);
  return idx === -1 ? 0 : idx;
}

function buildSideNav(){
  const nav = document.getElementById('sideNav');
  if(!nav) return;
  const current = currentPageIndex();
  nav.innerHTML = '';
  PAGES.forEach((p, i) => {
    const a = document.createElement('a');
    a.href = p.file;
    a.dataset.target = p.id;
    if(i === current) a.classList.add('active');
    a.innerHTML = `<span class="dash"></span>${p.label}`;
    nav.appendChild(a);
  });
}

function buildTrail(){
  const wrap = document.getElementById('trailDots');
  if(!wrap) return;
  const current = currentPageIndex();
  wrap.innerHTML = '';
  PAGES.forEach((p, i) => {
    const dot = document.createElement('div');
    dot.className = 'trail-dot';
    dot.style.top = ((i + 0.5) / PAGES.length * 100) + '%';
    if(i < current) dot.classList.add('lit');
    if(i === current) dot.classList.add('lit', 'current');
    wrap.appendChild(dot);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildSideNav();
  buildTrail();

  // animated starfield (only present on the cover page)
  const starsField = document.getElementById('starsField');
  if(starsField){
    const count = window.innerWidth < 640 ? 60 : 110;
    for(let i = 0; i < count; i++){
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2 + 1;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = (Math.random() * 3.5) + 's';
      star.style.animationDuration = (2.5 + Math.random() * 3) + 's';
      starsField.appendChild(star);
    }

    // occasional shooting star, subtle and infrequent
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!prefersReducedMotion){
      function spawnShootingStar(){
        const s = document.createElement('div');
        s.className = 'shooting-star';
        s.style.left = (20 + Math.random() * 55) + '%';
        s.style.top = (8 + Math.random() * 25) + '%';
        starsField.appendChild(s);
        setTimeout(() => s.remove(), 1700);
      }
      setInterval(spawnShootingStar, 7000 + Math.random() * 4000);
    }
  }

  // spark burst helper (used when the envelope opens)
  function burstSparks(x, y){
    const layer = document.getElementById('sparksLayer');
    if(!layer) return;
    const colors = ['#E7B76B', '#B48EE0', '#E8A6C4', '#D8C4F0'];
    const total = 18;
    for(let i = 0; i < total; i++){
      const spark = document.createElement('div');
      spark.className = 'spark';
      const angle = (Math.PI * 2 * i) / total + Math.random() * 0.3;
      const distance = 60 + Math.random() * 90;
      const sx = Math.cos(angle) * distance;
      const sy = Math.sin(angle) * distance;
      spark.style.left = x + 'px';
      spark.style.top = y + 'px';
      spark.style.background = colors[Math.floor(Math.random() * colors.length)];
      spark.style.setProperty('--sx', sx + 'px');
      spark.style.setProperty('--sy', sy + 'px');
      layer.appendChild(spark);
      setTimeout(() => spark.remove(), 1200);
    }
  }

  // envelope open (only present on portada)
  const envelope = document.getElementById('envelope');
  const portadaMain = document.querySelector('.portada-main');
  const envHint = document.getElementById('envHint');
  const welcomeModal = document.getElementById('welcomeModal');
  if(envelope){
    envelope.addEventListener('click', () => {
      if(envelope.classList.contains('open')) return;
      const rect = envelope.getBoundingClientRect();
      burstSparks(rect.left + rect.width / 2, rect.top + rect.height * 0.42);

      envelope.classList.add('open');
      if(envHint) envHint.style.opacity = '0';

      setTimeout(() => { if(portadaMain) portadaMain.classList.add('dimmed'); }, 700);
      setTimeout(() => { if(welcomeModal) welcomeModal.classList.add('show'); }, 1100);
    });
  }

  // flip cards (only present on cualidades) + progress tracker
  const flipCards = document.querySelectorAll('.flip-card');
  const progressFill = document.getElementById('progressFill');
  const progressCount = document.getElementById('progressCount');
  const totalCards = flipCards.length;

  function updateProgress(){
    if(!progressFill || !progressCount) return;
    const discovered = document.querySelectorAll('.flip-card.flipped').length;
    progressFill.style.width = (discovered / totalCards * 100) + '%';
    progressCount.textContent = discovered === totalCards
      ? '¡las descubriste todas! 💜'
      : discovered + ' de ' + totalCards + ' descubiertas';
  }

  flipCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      updateProgress();
    });
  });

  // gift box open (only present on cierre)
  const giftBox = document.getElementById('giftBox');
  const giftHint = document.getElementById('giftHint');
  const cierreMain = document.querySelector('.cierre-main');
  const cierreModal = document.getElementById('cierreModal');
  const confettiLayer = document.getElementById('confettiLayer');

  function burstEmojisAt(x, y){
    const layer = document.getElementById('sparksLayer');
    if(!layer) return;
    const emojis = ['🎉', '🎊', '✨', '💜', '🌟', '💫'];
    const total = 20;
    for(let i = 0; i < total; i++){
      const e = document.createElement('span');
      e.className = 'emoji-burst';
      e.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const angle = (Math.PI * 2 * i) / total + Math.random() * 0.4;
      const distance = 90 + Math.random() * 130;
      const ex = Math.cos(angle) * distance;
      const ey = Math.sin(angle) * distance - 40;
      e.style.left = x + 'px';
      e.style.top = y + 'px';
      e.style.setProperty('--ex', ex + 'px');
      e.style.setProperty('--ey', ey + 'px');
      e.style.setProperty('--er', (Math.random() * 360 - 180) + 'deg');
      layer.appendChild(e);
      setTimeout(() => e.remove(), 1500);
    }
  }

  function spawnConfettiPiece(){
    if(!confettiLayer) return;
    const colors = ['#E7B76B', '#B48EE0', '#E8A6C4', '#D8C4F0', '#5B3B7A'];
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    const duration = 2.2 + Math.random() * 1.6;
    piece.style.animationDuration = duration + 's';
    confettiLayer.appendChild(piece);
    setTimeout(() => piece.remove(), duration * 1000 + 100);
  }

  if(giftBox){
    giftBox.addEventListener('click', () => {
      if(giftBox.classList.contains('open')) return;
      const rect = giftBox.getBoundingClientRect();
      burstEmojisAt(rect.left + rect.width / 2, rect.top + rect.height * 0.28);

      giftBox.classList.add('open');
      if(giftHint) giftHint.style.opacity = '0';

      let confettiTicks = 0;
      const confettiInterval = setInterval(() => {
        spawnConfettiPiece();
        spawnConfettiPiece();
        confettiTicks++;
        if(confettiTicks > 45){ clearInterval(confettiInterval); }
      }, 90);

      setTimeout(() => { if(cierreMain) cierreMain.classList.add('dimmed'); }, 750);
      setTimeout(() => { if(cierreModal) cierreModal.classList.add('show'); }, 1150);
    });
  }

  // "último detalle" keepsake card (only present on cierre)
  const lastDetailBtn = document.getElementById('lastDetailBtn');
  const keepsakeModal = document.getElementById('keepsakeModal');
  const keepsakeClose = document.getElementById('keepsakeClose');
  const photoUpload = document.getElementById('photoUpload');
  const uploadedPreview = document.getElementById('uploadedPreview');
  const uploadLabel = document.getElementById('uploadLabel');
  const uploadSlot = document.getElementById('uploadSlot');
  const saveCardBtn = document.getElementById('saveCardBtn');
  const keepsakeHint = document.getElementById('keepsakeHint');
  let uploadedImageDataUrl = null;

  if(lastDetailBtn && keepsakeModal){
    lastDetailBtn.addEventListener('click', () => {
      if(cierreModal) cierreModal.classList.remove('show');
      keepsakeModal.classList.add('show');
    });
  }
  if(keepsakeClose && keepsakeModal){
    keepsakeClose.addEventListener('click', () => {
      keepsakeModal.classList.remove('show');
      if(cierreModal) cierreModal.classList.add('show');
    });
    keepsakeModal.addEventListener('click', (e) => {
      if(e.target === keepsakeModal){
        keepsakeModal.classList.remove('show');
        if(cierreModal) cierreModal.classList.add('show');
      }
    });
  }

  if(photoUpload){
    photoUpload.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        uploadedImageDataUrl = ev.target.result;
        uploadedPreview.src = uploadedImageDataUrl;
        uploadedPreview.style.display = 'block';
        if(uploadLabel) uploadLabel.style.display = 'none';
        if(uploadSlot) uploadSlot.classList.add('filled-upload');
        if(saveCardBtn) saveCardBtn.disabled = false;
        if(keepsakeHint){
          keepsakeHint.textContent = 'lista para guardar';
          keepsakeHint.classList.add('done');
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function loadImagePromise(src){
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight){
    const words = text.split(' ');
    let line = '';
    let curY = y;
    for(let n = 0; n < words.length; n++){
      const testLine = line + words[n] + ' ';
      if(ctx.measureText(testLine).width > maxWidth && n > 0){
        ctx.fillText(line.trim(), x, curY);
        line = words[n] + ' ';
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, curY);
    return curY;
  }

  function drawRoundedImage(ctx, img, x, y, w, h, radius){
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
    ctx.clip();
    const imgRatio = img.width / img.height;
    const boxRatio = w / h;
    let drawW, drawH, dx, dy;
    if(imgRatio > boxRatio){
      drawH = h; drawW = h * imgRatio;
      dx = x - (drawW - w) / 2; dy = y;
    } else {
      drawW = w; drawH = w / imgRatio;
      dx = x; dy = y - (drawH - h) / 2;
    }
    ctx.drawImage(img, dx, dy, drawW, drawH);
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#EDC17E';
    ctx.stroke();
  }

  async function generateAndSaveCard(){
    if(!uploadedImageDataUrl) return;
    saveCardBtn.disabled = true;
    saveCardBtn.innerHTML = '<span class="btn-icon">⏳</span> Generando…';

    try{
      if(document.fonts && document.fonts.ready){ await document.fonts.ready; }

      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 1300;
      const ctx = canvas.getContext('2d');

      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#241531');
      bgGrad.addColorStop(1, '#150C1F');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(237,193,126,0.5)';
      ctx.lineWidth = 3;
      ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#EDC17E';
      ctx.font = '600 24px Jost, sans-serif';
      ctx.fillText('UN RECUERDO PARA GUARDAR', canvas.width / 2, 120);

      ctx.fillStyle = '#F5EFFC';
      ctx.font = 'italic 600 58px "Cormorant Garamond", serif';
      ctx.fillText('Luminé & Roly', canvas.width / 2, 205);

      const [rolyImg, uploadedImg] = await Promise.all([
        loadImagePromise('img/roly.jpg'),
        loadImagePromise(uploadedImageDataUrl)
      ]);

      const photoW = 380, photoH = 380, gap = 40;
      const totalW = photoW * 2 + gap;
      const startX = (canvas.width - totalW) / 2;
      const photoY = 260;

      drawRoundedImage(ctx, rolyImg, startX, photoY, photoW, photoH, 24);
      drawRoundedImage(ctx, uploadedImg, startX + photoW + gap, photoY, photoW, photoH, 24);

      ctx.font = '500 24px Jost, sans-serif';
      ctx.fillStyle = '#C6B7DE';
      ctx.fillText('Roly', startX + photoW / 2, photoY + photoH + 44);
      ctx.fillText('Luminé', startX + photoW + gap + photoW / 2, photoY + photoH + 44);

      ctx.font = '300 30px Jost, sans-serif';
      ctx.fillStyle = '#F5EFFC';
      const wordsY = photoY + photoH + 130;
      const lastY = wrapCanvasText(
        ctx,
        'Dos historias, un mismo cariño de siempre. Que esta imagen te recuerde, cada vez que la veas, todo lo que compartimos este año y todo lo que nos queda por vivir.',
        canvas.width / 2, wordsY, canvas.width - 180, 44
      );

      ctx.font = 'italic 34px "Caveat", cursive';
      ctx.fillStyle = '#EDC17E';
      ctx.fillText('Milagros Luminé · 19 años · con cariño, Roly', canvas.width / 2, lastY + 80);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'milagros-19-recuerdo.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);

        saveCardBtn.disabled = false;
        saveCardBtn.innerHTML = '<span class="btn-icon">✓</span> Guardar tarjeta';
        if(keepsakeHint){
          keepsakeHint.textContent = '¡tarjeta descargada! 💜';
          keepsakeHint.classList.add('done');
        }
        const btnRect = saveCardBtn.getBoundingClientRect();
        burstEmojisAt(btnRect.left + btnRect.width / 2, btnRect.top + btnRect.height / 2);
      }, 'image/png');
    } catch(err){
      saveCardBtn.disabled = false;
      saveCardBtn.innerHTML = '<span class="btn-icon">⬇</span> Guardar tarjeta';
      if(keepsakeHint) keepsakeHint.textContent = 'algo falló, intenta de nuevo';
    }
  }

  if(saveCardBtn){
    saveCardBtn.addEventListener('click', generateAndSaveCard);
  }
});
