/**
 * ZEPLAO.VN — Cyber Portfolio Script
 * Updated: Single-file audio + chapter tracklist, mobile-optimized drag, accessibility
 */

'use strict';

// =========================================
// 1. TRACKLIST — Chapter timestamps (seconds)
// =========================================
const tracks = [
  { name: "Blue Wednesday - Anther",                    start:    0 },
  { name: "No Spirit, marsquake - blue skies",          start:  189 },
  { name: "xander., lucid keys - home in spring",       start:  334 },
  { name: "aimless, G Mills - New Leaf",                start:  507 },
  { name: "Deauxnuts, Nokiaa - Nine Leaves",            start:  625 },
  { name: "softy, eehou - woodnotes",                   start:  751 },
  { name: "Lazlow - Honeycomb",                         start:  877 },
  { name: "Takeo, after noon - morning sun",            start: 1015 },
  { name: "Laffey, azayaka - April Showers",            start: 1151 },
  { name: "ZENDR, Comodo - Brighter Days",              start: 1277 },
  { name: "Aboueb, Klemsis - Horizon",                  start: 1381 },
  { name: "Swink - Back Home",                          start: 1520 },
  { name: "Solar Body, marsquake - Hummingbird",        start: 1654 },
  { name: "Casiio, Slo Loris - Wildflowers",            start: 1781 },
  { name: "Dennisivnvc, Banks - here again",            start: 1937 },
  { name: "Grisp, tibeauthetraveler - picnicdate",      start: 2065 },
  { name: "Mondo Loops - Acorn Falls",                  start: 2195 },
  { name: "morningtime - clover",                       start: 2323 },
  { name: "Saint Rumi, Towerz - Eggs and Toast",        start: 2485 },
  { name: "WYS - fresh start",                          start: 2592 },
  { name: "fnonose - everything grows again",           start: 2736 },
  { name: "Quist, lov sum - Dewdrops",                  start: 2879 },
  { name: "Hoogway - Sunny Days Are Back",              start: 2978 },
  { name: "MyceliumBug, marie - Allium",                start: 3127 },
  { name: "Nadav Cohen, Odd Panda - komorebi",          start: 3258 },
  { name: "amies, Hoffy Beats - Lavender",              start: 3408 },
  { name: "blurred figures, another silent weekend - nakama", start: 3541 },
  { name: "Kainbeats, after noon - sunmist",            start: 3712 },
];

// =========================================
// 2. GLOBAL STATE
// =========================================
const AUDIO_FILE = "assets/cozy spring lofi 🌸 chill music to study & relax.mp3";
const TYPEWRITER_MSG = "Security Researcher // CTF Player // Bug Bounty Hunter";
let typeIndex = 0;
let currentTrackIndex = 0;


// Matrix
const canvas  = document.getElementById('matrixCanvas');
const ctx     = canvas.getContext('2d');
let columns, drops;
const LETTERS   = "01アイウエオカキクケコABCDEFGHIJKLMNOPQRSTUVWXYZ";
const FONT_SIZE = 14;



// Player DOM refs (cached once)
const music          = document.getElementById("bgMusic");
const playBtn        = document.getElementById("playBtn");
const statusText     = document.getElementById("status");
const statusDot      = document.getElementById("statusDot");
const progressBar    = document.getElementById("progressBar");
const progressThumb  = document.getElementById("progressThumb");
const trackNameEl    = document.getElementById("trackName");
const playlistEl     = document.getElementById("playlist");
const player         = document.getElementById("mainPlayer");
const currentTimeEl  = document.getElementById("currentTime");
const durationTimeEl = document.getElementById("durationTime");

// =========================================
// 3. INIT
// =========================================
window.addEventListener('load', () => {
  resizeCanvas();
  animateMatrix();
  setTimeout(typewriter, 900);
  initPlaylist();
  loadAudio();
  setupNavActiveOnScroll();
});

window.addEventListener('resize', debounce(() => {
  resizeCanvas();
  keepPlayerInBounds();
}, 200));

// =========================================
// 4. MATRIX RAIN
// =========================================
function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  columns = Math.floor(canvas.width / FONT_SIZE);
  drops   = Array(columns).fill(1);
}

function animateMatrix() {
  drawMatrix();
  requestAnimationFrame(animateMatrix);
}

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 6, 0, 0.13)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ff41";
  ctx.font = `${FONT_SIZE}px monospace`;
  for (let i = 0; i < drops.length; i++) {
    const ch = LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
    ctx.fillText(ch, i * FONT_SIZE, drops[i] * FONT_SIZE);
    if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}

// =========================================
// 5. TYPEWRITER
// =========================================
function typewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;
  if (typeIndex < TYPEWRITER_MSG.length) {
    el.textContent += TYPEWRITER_MSG.charAt(typeIndex++);
    setTimeout(typewriter, 55);
  }
}

// =========================================
// 6. SKILLS ACCORDION
// =========================================
function toggleSkill(btn) {
  const item    = btn.parentElement;
  const content = btn.nextElementSibling;
  const isOpen  = item.classList.contains('active');

  // Close all
  document.querySelectorAll('.skill-item').forEach(el => {
    el.classList.remove('active');
    const c = el.querySelector('.skill-content');
    const inner = el.querySelector('.skill-content-inner');
    if (c) c.style.maxHeight = null;
    el.querySelector('.skill-header')?.setAttribute('aria-expanded', 'false');
  });

  if (!isOpen) {
    item.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
    // wrap content in inner div if not already
    let inner = content.querySelector('.skill-content-inner');
    if (!inner) {
      // move existing children into a wrapper
      inner = document.createElement('div');
      inner.className = 'skill-content-inner';
      while (content.firstChild) inner.appendChild(content.firstChild);
      content.appendChild(inner);
    }
    content.style.maxHeight = (inner.scrollHeight + 32) + "px";
  }
}

// =========================================
// 7. AUDIO — single file, chapter-seek
// =========================================
function loadAudio() {
  music.src = AUDIO_FILE;
  music.preload = "metadata";
  music.load();
  updateTrackDisplay(0);
}

/** Determine which chapter is currently playing based on currentTime */
function getCurrentChapterIndex() {
  const t = music.currentTime;
  let idx = 0;
  for (let i = tracks.length - 1; i >= 0; i--) {
    if (t >= tracks[i].start) { idx = i; break; }
  }
  return idx;
}

music.addEventListener('timeupdate', () => {
  if (!music.duration) return;

  // Progress bar
  const pct = (music.currentTime / music.duration) * 100;
  progressBar.style.width = pct + "%";
  if (progressThumb) progressThumb.style.left = pct + "%";

  // Times
  currentTimeEl.textContent  = formatTime(music.currentTime);
  durationTimeEl.textContent = formatTime(music.duration);

  // Auto-update active chapter in playlist
  const newIdx = getCurrentChapterIndex();
  if (newIdx !== currentTrackIndex) {
    currentTrackIndex = newIdx;
    updateTrackDisplay(currentTrackIndex);
    updatePlaylistUI();
  }
});

music.addEventListener('ended', () => updateUI(false));
music.addEventListener('play',  () => updateUI(true));
music.addEventListener('pause', () => updateUI(false));

function toggleMusic() {
  if (music.paused) {
    music.play().catch(() => {});
  } else {
    music.pause();
  }
}

/** Seek to chapter by index */
function seekToChapter(index) {
  currentTrackIndex = index;
  music.currentTime = tracks[index].start;
  if (music.paused) {
    music.play().catch(() => {});
  }
  updateTrackDisplay(index);
  updatePlaylistUI();
}

function nextTrack() {
  const next = (currentTrackIndex + 1) % tracks.length;
  seekToChapter(next);
}

function prevTrack() {
  // If >3s into track, restart chapter; else go previous
  if (music.currentTime - tracks[currentTrackIndex].start > 3) {
    music.currentTime = tracks[currentTrackIndex].start;
  } else {
    const prev = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    seekToChapter(prev);
  }
}

function updateTrackDisplay(index) {
  if (!trackNameEl) return;
  trackNameEl.textContent = tracks[index].name;
  // Reset scroll animation
  trackNameEl.style.animation = 'none';
  void trackNameEl.offsetHeight;
  trackNameEl.style.animation = null;
}

function updateUI(isPlaying) {
  if (isPlaying) {
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    statusText.textContent = "ONLINE";
    statusText.classList.remove("blink");
    if (statusDot) { statusDot.classList.add('online'); }
  } else {
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    statusText.textContent = "OFFLINE";
    statusText.classList.add("blink");
    if (statusDot) { statusDot.classList.remove('online'); }
  }
}

// Progress bar click/drag seek
function setProgress(e) {
  const rect  = document.getElementById('progressContainer').getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio  = Math.max(0, Math.min(clickX / rect.width, 1));
  if (music.duration) music.currentTime = ratio * music.duration;
}

// Touch seek on progress bar
let seekingProgress = false;
const progressContainer = document.getElementById('progressContainer');
if (progressContainer) {
  progressContainer.addEventListener('click', setProgress);
  progressContainer.addEventListener('mousedown', (e) => { seekingProgress = true; setProgress(e); });
  document.addEventListener('mousemove', (e) => { if (seekingProgress) setProgress(e); });
  document.addEventListener('mouseup', () => { seekingProgress = false; });
}

// =========================================
// 8. PLAYLIST
// =========================================
function initPlaylist() {
  playlistEl.innerHTML = "";
  tracks.forEach((track, i) => {
    const li = document.createElement("li");
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', 'false');

    const num  = document.createElement('span');
    num.className = 'track-num';
    num.textContent = formatTime(track.start) + " ";

    const name = document.createTextNode(track.name);

    li.appendChild(num);
    li.appendChild(name);
    li.addEventListener('click', () => seekToChapter(i));
    playlistEl.appendChild(li);
  });
  updatePlaylistUI();
}

function updatePlaylistUI() {
  const items = playlistEl.querySelectorAll("li");
  items.forEach((li, i) => {
    const isActive = i === currentTrackIndex;
    li.classList.toggle("active-track", isActive);
    li.setAttribute('aria-selected', isActive ? 'true' : 'false');

    // Auto-scroll active item into view if playlist is open
    if (isActive && playlistEl.classList.contains('show')) {
      li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
}

function togglePlayer() {
  const icon = document.getElementById('toggleIcon');
  player.classList.toggle('minimized');
  const isMin = player.classList.contains('minimized');
  icon.className = isMin ? 'fas fa-expand-alt' : 'fas fa-minus';
}

function togglePlaylist() {
  const chevron    = document.getElementById('playlistChevron');
  const toggleBtn  = document.querySelector('.toggle-list-btn');
  const isOpen     = playlistEl.classList.toggle('show');
  toggleBtn?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  if (chevron) chevron.classList.toggle('open', isOpen);
  if (isOpen) updatePlaylistUI(); // scroll active into view
}

function formatTime(s) {
  if (isNaN(s) || s < 0) return "00:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

// =========================================
// 9. NAVIGATION
// =========================================
const mobileMenuBtn = document.getElementById('mobile-menu');
const navMenu       = document.querySelector('.nav-menu');

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', String(!expanded));
    mobileMenuBtn.classList.toggle('is-active');
    navMenu.classList.toggle('active');
  });
}

// Close nav on link click
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuBtn?.classList.remove('is-active');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    navMenu?.classList.remove('active');
  });
});

// Active nav highlight on scroll
function setupNavActiveOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-menu a[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-50% 0px -45% 0px' });

  sections.forEach(s => observer.observe(s));
}

// =========================================
// 10. DRAGGABLE PLAYER
// =========================================
let isDragging = false;
let offsetX = 0, offsetY = 0;

function getClientXY(e) {
  if (e.touches && e.touches.length) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  return { x: e.clientX, y: e.clientY };
}

function startDrag(e) {
  if (e.target.closest('button') ||
      e.target.closest('.progress-container') ||
      e.target.closest('.playlist')) return;

  isDragging = true;
  const rect = player.getBoundingClientRect();
  const { x, y } = getClientXY(e);
  offsetX = x - rect.left;
  offsetY = y - rect.top;
  player.style.transition = 'none';
}

function onDrag(e) {
  if (!isDragging) return;
  if (e.type === 'touchmove') e.preventDefault();

  const { x, y } = getClientXY(e);
  const maxX = window.innerWidth  - player.offsetWidth;
  const maxY = window.innerHeight - player.offsetHeight;
  const nx   = Math.max(0, Math.min(x - offsetX, maxX));
  const ny   = Math.max(0, Math.min(y - offsetY, maxY));

  player.style.left   = `${nx}px`;
  player.style.top    = `${ny}px`;
  player.style.right  = 'auto';
  player.style.bottom = 'auto';
}

function stopDrag() {
  if (!isDragging) return;
  isDragging = false;
  player.style.transition = 'box-shadow 0.25s ease';
}

function keepPlayerInBounds() {
  const rect = player.getBoundingClientRect();
  const maxX = window.innerWidth  - rect.width;
  const maxY = window.innerHeight - rect.height;
  player.style.left   = `${Math.max(0, Math.min(rect.left, maxX))}px`;
  player.style.top    = `${Math.max(0, Math.min(rect.top,  maxY))}px`;
  player.style.right  = 'auto';
  player.style.bottom = 'auto';
}

player.addEventListener('mousedown',  startDrag);
document.addEventListener('mousemove', onDrag);
document.addEventListener('mouseup',   stopDrag);

player.addEventListener('touchstart', startDrag, { passive: false });
document.addEventListener('touchmove', onDrag,   { passive: false });
document.addEventListener('touchend',  stopDrag);

// =========================================
// 11. EASTER EGGS
// =========================================

// Block right-click
document.addEventListener('contextmenu', e => {
  e.preventDefault();
  // Silent block — no alert (less annoying UX)
});

// Konami code
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;

document.addEventListener('keydown', e => {
  if (e.key === KONAMI[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI.length) {
      activateEasterEgg();
      konamiIdx = 0;
    }
  } else {
    konamiIdx = 0;
  }
});

function activateEasterEgg() {
  document.body.style.filter = "hue-rotate(240deg) brightness(1.15) contrast(1.4)";
  if (statusText) statusText.textContent = "SYSTEM OVERRIDE";
  setTimeout(() => {
    document.body.style.filter = "";
    if (statusText) statusText.textContent = music.paused ? "OFFLINE" : "ONLINE";
  }, 3000);
}

// Click-5-times easter egg on username
let clickCount = 0;
const eggEl = document.querySelector('#easter_egg');
if (eggEl) {
  eggEl.addEventListener('click', () => {
    clickCount++;
    if (clickCount >= 5) {
      clickCount = 0;
      document.body.classList.add('glitch-active');
      if (statusText) statusText.textContent = "CRITICAL_FAILURE";
      setTimeout(() => {
        document.body.classList.remove('glitch-active');
        if (statusText) statusText.textContent = music.paused ? "OFFLINE" : "ONLINE";
      }, 2000);
    }
  });
}

// =========================================
// 12. CONSOLE BRANDING
// =========================================
console.clear();
console.log(
  `%c STOP! %c\n\nTrying to hack this site?\nThis IS a security researcher's portfolio — good luck! 😏`,
  "color:#ff0000;font-size:36px;font-weight:bold;",
  "color:#00ff41;font-size:14px;"
);
console.log(
  `%c
███████╗███████╗██████╗ ██╗      █████╗  ██████╗ 
╚══███╔╝██╔════╝██╔══██╗██║     ██╔══██╗██╔═══██╗
  ███╔╝ █████╗  ██████╔╝██║     ███████║██║   ██║
 ███╔╝  ██╔══╝  ██╔═══╝ ██║     ██╔══██║██║   ██║
███████╗███████╗██║     ███████╗██║  ██║╚██████╔╝
╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝ ╚═════╝ 
`,
  "color:#00ff41;"
);
// Silence console after branding
const noop = () => {};
console.log   = noop;
console.warn  = noop;
console.error = noop;

// ==========================================
// 13. UTILITY
// ==========================================
function debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}
