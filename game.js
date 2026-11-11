(() => {
  const toys = [
    { id: 'mimi', name: 'Mimi the moon kitty', kind: 'cat', color: '#f3c3cf', shadow: '#df9dab', accent: '#a895d0', mark: '☾', ears: 'cat' },
    { id: 'poppy', name: 'Poppy the daydream bunny', kind: 'bunny', color: '#eee1f5', shadow: '#cbb4db', accent: '#e69aa8', mark: '✿', ears: 'bunny' },
    { id: 'momo', name: 'Momo the honey bear', kind: 'bear', color: '#e8c99e', shadow: '#c69e75', accent: '#e8949f', mark: '♥', ears: 'bear' },
    { id: 'pip', name: 'Pip the sleepy chick', kind: 'chick', color: '#f5dc8e', shadow: '#e5c15f', accent: '#e99491', mark: '✦', ears: 'chick' },
    { id: 'lulu', name: 'Lulu the cloud pup', kind: 'pup', color: '#c7e4dc', shadow: '#95c2b5', accent: '#d996ad', mark: '☁', ears: 'pup' },
    { id: 'nova', name: 'Nova the star sprite', kind: 'star', color: '#c9c4ed', shadow: '#a49fd3', accent: '#f0c77f', mark: '✧', ears: 'star' }
  ];
  const wraps = [
    { name: 'Rose petal', color: '#ef9eaa', side: '#d97d90' },
    { name: 'Lilac dream', color: '#b8a9dc', side: '#9785c1' },
    { name: 'Mint wishes', color: '#9fcdbb', side: '#79ae9a' },
    { name: 'Peachy keen', color: '#f0bd92', side: '#d99b76' }
  ];
  const $ = (id) => document.getElementById(id);
  const boxStage = $('boxStage'), scene = $('scene'), reveal = $('toyReveal');
  const openButton = $('openButton'), buttonText = $('buttonText');
  let collected = [];
  let selectedWrap = 0;
  let busy = false;
  let soundOn = localStorage.getItem('littleWonderSound') !== 'off';
  let audio;
  let toastTimer;

  try {
    const saved = JSON.parse(localStorage.getItem('littleWonderCollection') || '[]');
    collected = saved.filter(id => toys.some(toy => toy.id === id));
  } catch (_) { collected = []; }

  function toySvg(toy, small = false) {
    let ears = '';
    switch (toy.ears) {
      case 'cat': ears = `<path d="M43 57 39 29Q39 25 43 29L61 43M79 43 97 29Q101 25 101 30L97 57" fill="${toy.color}" stroke="${toy.shadow}" stroke-width="3" stroke-linejoin="round"/><path d="m45 37 10 9m40-9-10 9" stroke="#e9aab8" stroke-width="3" stroke-linecap="round"/>`; break;
      case 'bunny': ears = `<ellipse cx="53" cy="40" rx="12" ry="28" fill="${toy.color}" stroke="${toy.shadow}" stroke-width="3" transform="rotate(-15 53 40)"/><ellipse cx="82" cy="38" rx="12" ry="29" fill="${toy.color}" stroke="${toy.shadow}" stroke-width="3" transform="rotate(12 82 38)"/><ellipse cx="53" cy="40" rx="5" ry="19" fill="#f2bdca" transform="rotate(-15 53 40)"/><ellipse cx="82" cy="38" rx="5" ry="19" fill="#f2bdca" transform="rotate(12 82 38)"/>`; break;
      case 'bear': ears = `<circle cx="48" cy="48" r="16" fill="${toy.color}" stroke="${toy.shadow}" stroke-width="3"/><circle cx="88" cy="48" r="16" fill="${toy.color}" stroke="${toy.shadow}" stroke-width="3"/><circle cx="48" cy="48" r="7" fill="#f2b9b4"/><circle cx="88" cy="48" r="7" fill="#f2b9b4"/>`; break;
      case 'chick': ears = `<path d="M66 38Q59 21 68 18Q71 29 73 35Q81 22 86 27Q85 38 78 43" fill="#f4d57d" stroke="${toy.shadow}" stroke-width="2.5" stroke-linejoin="round"/>`; break;
      case 'pup': ears = `<ellipse cx="43" cy="55" rx="12" ry="22" fill="${toy.color}" stroke="${toy.shadow}" stroke-width="3" transform="rotate(20 43 55)"/><ellipse cx="93" cy="55" rx="12" ry="22" fill="${toy.color}" stroke="${toy.shadow}" stroke-width="3" transform="rotate(-20 93 55)"/>`; break;
      case 'star': ears = `<path d="M70 18 80 37 101 39 86 54 90 75 70 65 50 75 54 54 39 39 60 37Z" fill="${toy.color}" stroke="${toy.shadow}" stroke-width="3" stroke-linejoin="round"/>`; break;
    }
    let head = toy.ears === 'star' ? `<circle cx="70" cy="57" r="26" fill="${toy.color}"/>` : `<ellipse cx="70" cy="63" rx="32" ry="31" fill="${toy.color}" stroke="${toy.shadow}" stroke-width="3"/>`;
    let cheeks = `<ellipse cx="51" cy="68" rx="5" ry="3" fill="#ee9ca7" opacity=".55"/><ellipse cx="89" cy="68" rx="5" ry="3" fill="#ee9ca7" opacity=".55"/>`;
    let face = `<path d="M59 60v2m22-2v2" stroke="#655667" stroke-width="3.5" stroke-linecap="round"/><path d="M67 68q3 4 6 0" fill="none" stroke="#9b6670" stroke-width="2" stroke-linecap="round"/>`;
    if (toy.ears === 'chick') face = `<path d="M59 59v2m22-2v2" stroke="#655667" stroke-width="3.5" stroke-linecap="round"/><path d="m66 66 4 4 4-4Z" fill="#e99b72"/>`;
    if (toy.ears === 'star') cheeks = '';
    const belly = `<ellipse cx="70" cy="105" rx="27" ry="24" fill="${toy.color}" stroke="${toy.shadow}" stroke-width="3"/><ellipse cx="70" cy="108" rx="17" ry="14" fill="#fff5ea" opacity=".72"/><path d="M64 108q6-5 12 0" fill="none" stroke="${toy.accent}" stroke-width="2" stroke-linecap="round"/>`;
    const accessory = toy.ears === 'cat' ? `<path d="M84 42q2-14 14-9 10 8-2 14l-6-2" fill="${toy.accent}" stroke="#fff6" stroke-width="1.5"/>` : toy.ears === 'bunny' ? `<path d="M82 42q-10-9-3-15 7-3 8 8 5-11 11-6 5 7-7 14Z" fill="${toy.accent}" stroke="#fff8" stroke-width="1.5"/>` : toy.ears === 'bear' ? `<path d="M78 40q3-13 12-10 7 6-2 13l-6 2" fill="${toy.accent}"/>` : toy.ears === 'pup' ? `<path d="M48 51q8-11 15-3 3 8-9 9" fill="${toy.accent}"/>` : toy.ears === 'star' ? `<path d="m91 36 2 5 5 1-4 3 1 5-4-3-5 2 2-5-3-4 5 1Z" fill="#fff1bb"/>` : '';
    const feet = `<ellipse cx="55" cy="122" rx="11" ry="7" fill="${toy.shadow}" opacity=".66"/><ellipse cx="85" cy="122" rx="11" ry="7" fill="${toy.shadow}" opacity=".66"/>`;
    const paw = toy.ears === 'star' ? '' : `<path d="M40 91q-12 9-3 17 7 4 12-4m51-13q12 9 3 17-7 4-12-4" fill="${toy.color}" stroke="${toy.shadow}" stroke-width="3" stroke-linecap="round"/>`;
    return `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${toy.name}"><g>${ears}${feet}${belly}${paw}${head}${cheeks}${face}${accessory}<path d="M47 80q-2 15 8 21" fill="none" stroke="#fff" stroke-width="3" opacity=".35" stroke-linecap="round"/></g><text x="70" y="137" text-anchor="middle" font-size="8" font-family="Nunito,sans-serif" font-weight="800" fill="#fff" opacity=".9">${toy.name.split(' ')[0]}</text></svg>`;
  }

  function renderWraps() {
    const picker = $('boxPicker');
    picker.innerHTML = wraps.map((wrap, i) => `<button class="wrap-choice ${i === selectedWrap ? 'selected' : ''}" data-wrap="${i}" aria-pressed="${i === selectedWrap}" aria-label="${wrap.name} wrapping"><span class="wrap-swatch" style="background:linear-gradient(125deg,${wrap.color},${wrap.side})"></span><span>${wrap.name}<small>pretty & cozy</small></span></button>`).join('');
    picker.querySelectorAll('.wrap-choice').forEach(button => button.addEventListener('click', () => {
      if (busy) return;
      selectedWrap = Number(button.dataset.wrap);
      setWrap();
      renderWraps();
      playChime('soft');
    }));
  }

  function setWrap() {
    const wrap = wraps[selectedWrap];
    document.documentElement.style.setProperty('--wrap', wrap.color);
    document.documentElement.style.setProperty('--wrap-side', wrap.side);
    document.querySelectorAll('.box-front').forEach(el => { el.style.background = `linear-gradient(100deg,${wrap.color},${wrap.color} 52%,${wrap.side})`; });
    document.querySelectorAll('.box-side').forEach(el => { el.style.background = `linear-gradient(90deg,${wrap.side},${wrap.side})`; });
    document.querySelectorAll('.box-back').forEach(el => { el.style.background = wrap.side; });
    document.querySelectorAll('.lid-top').forEach(el => { el.style.background = `linear-gradient(115deg,${lighten(wrap.color)},${wrap.color} 68%,${wrap.side})`; });
    document.querySelectorAll('.lid-front').forEach(el => { el.style.background = `linear-gradient(${wrap.color},${wrap.side})`; });
    document.querySelectorAll('.lid-side').forEach(el => { el.style.background = wrap.side; });
  }

  function lighten(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, ((n >> 16) & 255) + 20), g = Math.min(255, ((n >> 8) & 255) + 20), b = Math.min(255, (n & 255) + 20);
    return `rgb(${r},${g},${b})`;
  }

  function renderCollection() {
    const found = toys.filter(toy => collected.includes(toy.id));
    $('collectionCount').textContent = `${found.length} / ${toys.length}`;
    $('progressFill').style.width = `${found.length / toys.length * 100}%`;
    $('miniCollection').innerHTML = toys.map(toy => collected.includes(toy.id)
      ? `<div class="mini-slot filled" title="${toy.name}">${toySvg(toy, true)}</div>`
      : '<div class="mini-slot" aria-label="Not found yet">✧</div>').join('');
    const hint = found.length === toys.length ? 'A whole shelf of little friends! 💕' : found.length ? `${toys.length - found.length} sweet ${toys.length - found.length === 1 ? 'pal' : 'pals'} still dreaming...` : 'Your first little friend is waiting ✨';
    $('collectionHint').textContent = hint;
    localStorage.setItem('littleWonderCollection', JSON.stringify(collected));
  }

  function updateSoundButton() {
    const btn = $('soundToggle');
    btn.classList.toggle('is-on', soundOn);
    btn.setAttribute('aria-label', soundOn ? 'Turn sound off' : 'Turn sound on');
    btn.title = soundOn ? 'Sound on' : 'Sound off';
    btn.querySelector('.sound-label').textContent = soundOn ? 'Sound on' : 'Sound off';
    $('sceneMessage').textContent = soundOn ? 'A surprise is tucked inside...' : 'A quiet little surprise awaits...';
  }

  function ensureAudio() {
    if (!soundOn) return null;
    if (!audio) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audio = new AudioContext();
    }
    if (audio && audio.state === 'suspended') audio.resume();
    return audio;
  }

  function playChime(type = 'reveal') {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = type === 'soft' ? [659.25] : [523.25, 659.25, 783.99];
    notes.forEach((frequency, index) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.value = frequency;
      gain.gain.setValueAtTime(.0001, now + index * .12);
      gain.gain.exponentialRampToValueAtTime(type === 'soft' ? .025 : .035, now + index * .12 + .025);
      gain.gain.exponentialRampToValueAtTime(.0001, now + index * .12 + .65);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now + index * .12); osc.stop(now + index * .12 + .7);
    });
  }

  function playRustle() {
    const ctx = ensureAudio();
    if (!ctx) return;
    const duration = .42, size = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate), data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / size) * .28;
    const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
    source.buffer = buffer; filter.type = 'lowpass'; filter.frequency.value = 1400;
    gain.gain.setValueAtTime(.075, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + duration);
    source.connect(filter); filter.connect(gain); gain.connect(ctx.destination); source.start();
    playChime('soft');
  }

  function popConfetti() {
    const symbols = ['✦', '✧', '♡', '·', '✿'];
    const layer = $('confettiLayer'); layer.innerHTML = '';
    for (let i = 0; i < 17; i++) {
      const bit = document.createElement('span'); bit.className = 'confetti'; bit.textContent = symbols[i % symbols.length];
      bit.style.setProperty('--dx', `${Math.round((Math.random() - .5) * 270)}px`);
      bit.style.setProperty('--dy', `${Math.round(-45 - Math.random() * 170)}px`);
      bit.style.animationDelay = `${Math.random() * .24}s`;
      bit.style.color = ['#e995a7', '#d2b4e5', '#e9c987', '#a8d1bd'][i % 4];
      layer.appendChild(bit);
    }
    window.setTimeout(() => { layer.innerHTML = ''; }, 1800);
  }

  function setReady() {
    busy = false;
    openButton.disabled = false;
    boxStage.classList.remove('open');
    scene.classList.remove('revealed');
    reveal.classList.remove('visible');
    $('actionKicker').textContent = collected.length === toys.length ? 'THE COZIEST COLLECTION' : 'A LITTLE SURPRISE';
    $('actionTitle').textContent = collected.length === toys.length ? 'Your shelf is full of love' : 'Ready when you are';
    $('actionDescription').textContent = collected.length === toys.length ? 'Open another box and say hello again.' : 'Tap the box, or use the button below.';
    buttonText.textContent = collected.length === toys.length ? 'Open another' : 'Open my box';
    $('sceneMessage').textContent = collected.length === toys.length ? 'Your little friends are all together ♡' : 'A surprise is tucked inside...';
  }

  function openBox() {
    if (busy) return;
    busy = true;
    const missing = toys.filter(toy => !collected.includes(toy.id));
    const toy = missing.length ? missing[Math.floor(Math.random() * missing.length)] : toys[Math.floor(Math.random() * toys.length)];
    openButton.disabled = true;
    buttonText.textContent = 'Opening gently...';
    $('actionKicker').textContent = 'TAKE A DEEP BREATH';
    $('actionTitle').textContent = 'Something sweet is inside';
    $('actionDescription').textContent = 'A little rustle... a little sparkle...';
    $('sceneMessage').textContent = 'unwrap... and let the magic find you';
    reveal.innerHTML = toySvg(toy);
    reveal.classList.remove('visible');
    scene.classList.remove('revealed');
    boxStage.classList.add('open');
    playRustle();
    window.setTimeout(() => {
      reveal.classList.add('visible');
      scene.classList.add('revealed');
      $('sceneMessage').textContent = `Oh! It's ${toy.name}!`;
      $('actionKicker').textContent = missing.length ? 'A NEW LITTLE FRIEND' : 'A FAMILIAR LITTLE FRIEND';
      $('actionTitle').textContent = toy.name;
      $('actionDescription').textContent = missing.length ? 'A soft new friend for your collection.' : 'This sweet pal is happy to see you again.';
      if (missing.length) {
        collected.push(toy.id);
        renderCollection();
      }
      popConfetti();
      playChime('reveal');
      buttonText.textContent = collected.length === toys.length ? 'Open another' : 'Open another box';
      openButton.disabled = false;
      busy = false;
    }, 850);
  }

  function showToast(message) {
    const toast = $('toast'); toast.textContent = message; toast.classList.add('show');
    window.clearTimeout(toastTimer); toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2300);
  }

  openButton.addEventListener('click', openBox);
  boxStage.addEventListener('click', openBox);
  boxStage.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openBox(); } });
  $('soundToggle').addEventListener('click', () => {
    soundOn = !soundOn;
    localStorage.setItem('littleWonderSound', soundOn ? 'on' : 'off');
    updateSoundButton();
    if (soundOn) playChime('soft');
    showToast(soundOn ? 'Little sounds are back on ♫' : 'A little quiet moment ♡');
  });
  $('resetButton').addEventListener('click', () => { $('resetModal').classList.add('show'); $('resetModal').setAttribute('aria-hidden', 'false'); });
  $('keepButton').addEventListener('click', closeModal);
  $('confirmReset').addEventListener('click', () => {
    collected = []; localStorage.removeItem('littleWonderCollection'); renderCollection();
    reveal.innerHTML = ''; setReady(); closeModal(); showToast('A fresh little adventure begins ✨');
  });
  $('resetModal').addEventListener('click', event => { if (event.target === $('resetModal')) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
  function closeModal() { $('resetModal').classList.remove('show'); $('resetModal').setAttribute('aria-hidden', 'true'); }

  renderWraps(); setWrap(); renderCollection(); updateSoundButton(); setReady();
})();