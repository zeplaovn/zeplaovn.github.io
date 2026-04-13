/**
 * ZEPLAO.VN - Cyber Portfolio Logic
 */

// =========================================
// 1. KHAI BÁO BIẾN TOÀN CỤC
// =========================================

const message = "Cyber Security Enthusiast - CTF Player - Researcher";
let typeIndex = 0;

// Matrix Rain
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
let columns, drops;
const letters = "0101010101010101ABCDEFHIJKLMNOPQRSTUVWXYZ";
const fontSize = 16;

// Music Player
const music = document.getElementById("bgMusic");
const playBtn = document.getElementById("playBtn");
const statusText = document.getElementById("status");
const progressBar = document.getElementById("progressBar");
const trackName = document.getElementById("trackName");
const playlistElement = document.getElementById("playlist");
const player = document.getElementById('mainPlayer');

const tracks = [
    { name: "a-y-o", file: "a-y-o.mp3" },
    { name: "Rainy Sunday", file: "rainy sunday.mp3" },
    { name: "Amano", file: "amano.mp3" },
    { name: "Saturday", file: "saturday.mp3" },
    { name: "Anubias", file: "anubias.mp3" },
    { name: "Shinjuki Gyoen", file: "shinjuki gyoen.mp3" },
    { name: "Campus Coffee", file: "campus coffee.mp3" },
    { name: "Shinjuku Gyoen -WIP-", file: "shinjuku gyoen -wip-.mp3" },
    { name: "End of Tape", file: "end of tape.mp3" },
    { name: "Tears Pt. 2", file: "tears pt. 2.mp3" },
    { name: "Frappe Girl", file: "frappe girl.mp3" },
    { name: "Tears Pt. 3", file: "tears pt. 3.mp3" },
    { name: "Full Moon", file: "full moon.mp3" },
    { name: "Tinytokyo", file: "tinytokyo.mp3" },
    { name: "Highway", file: "highway.mp3" },
    { name: "Waiting", file: "waiting.mp3" },
    { name: "Late Breakfast", file: "late breakfast.mp3" },
    { name: "〒160-0014 Tokyo '82", file: "〒160-0014 tokyo '82.mp3" }
];
let currentTrackIndex = 0;

// =========================================
// 2. KHỞI TẠO & LẮNG NGHE SỰ KIỆN
// =========================================

window.addEventListener('load', () => {
    resize();
    setInterval(drawMatrix, 50);
    setTimeout(typewriter, 1000); 
    initPlaylist();
    loadTrack(0);
});

window.addEventListener('resize', () => {
    resize();
    keepPlayerInBounds(); // Đảm bảo player không văng khỏi màn hình khi resize
});

// Cập nhật tiến trình nhạc (Đã sửa lỗi cú pháp)
music.ontimeupdate = () => {
    if (music.duration) {
        const progressPercent = (music.currentTime / music.duration) * 100;
        if (progressBar) progressBar.style.width = progressPercent + "%";
        
        document.getElementById("currentTime").innerText = formatTime(music.currentTime);
        document.getElementById("durationTime").innerText = formatTime(music.duration);
    }
};

music.onended = nextTrack;

// =========================================
// 3. HIỆU ỨNG VISUALS
// =========================================

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
}

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 8, 0, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff41";
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}

function typewriter() {
    const el = document.getElementById("typewriter");
    if (el && typeIndex < message.length) {
        el.innerHTML += message.charAt(typeIndex);
        typeIndex++;
        setTimeout(typewriter, 60);
    }
}

function toggleSkill(header) {
    const item = header.parentElement;
    const content = header.nextElementSibling;
    const icon = header.querySelector('.icon');
    const isOpen = item.classList.contains('active');
    
    document.querySelectorAll('.skill-item').forEach(el => {
        el.classList.remove('active');
        el.querySelector('.skill-content').style.maxHeight = null;
        el.querySelector('.icon').innerText = '▼';
    });

    if (!isOpen) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
        icon.innerText = '▲';
    }
}

// =========================================
// 4. MUSIC PLAYER LOGIC
// =========================================

function initPlaylist() {
    playlistElement.innerHTML = "";
    tracks.forEach((track, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="track-num">${(index + 1).toString().padStart(2, '0')}.</span> ${track.name}`;
        li.onclick = () => {
            loadTrack(index);
            music.play().then(() => updateUI(true));
        };
        playlistElement.appendChild(li);
    });
}

function loadTrack(index) {
    currentTrackIndex = index;
    music.src = `assets/${tracks[index].file}`;
    if (trackName) trackName.innerText = tracks[index].name;
    
    document.getElementById("currentTime").innerText = "00:00";
    document.getElementById("durationTime").innerText = "00:00";
    
    trackName.style.animation = 'none';
    trackName.offsetHeight; 
    trackName.style.animation = null;

    updatePlaylistUI();
}

function updatePlaylistUI() {
    const items = playlistElement.querySelectorAll("li");
    items.forEach((li, i) => {
        li.classList.toggle("active-track", i === currentTrackIndex);
        li.style.color = (i === currentTrackIndex) ? "var(--neon-green)" : "#fff";
    });
}

function updateUI(isPlaying) {
    if (isPlaying) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        statusText.innerText = "SYSTEM ONLINE";
        statusText.classList.remove("blink");
        statusText.style.color = "var(--neon-green)";
    } else {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        statusText.innerText = "SYSTEM OFFLINE";
        statusText.classList.add("blink");
        statusText.style.color = "#ff4141";
    }
}

function toggleMusic() {
    if (music.paused) {
        music.play().then(() => updateUI(true)).catch(e => console.log("User interaction required"));
    } else {
        music.pause();
        updateUI(false);
    }
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    music.play().then(() => updateUI(true));
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    music.play().then(() => updateUI(true));
}

function setProgress(e) {
    const container = document.querySelector('.progress-container');
    const width = container.clientWidth;
    const clickX = e.offsetX;
    if (music.duration) music.currentTime = (clickX / width) * music.duration;
}

function togglePlayer() {
    const icon = document.getElementById('toggleIcon');
    player.classList.toggle('minimized');
    icon.className = player.classList.contains('minimized') ? 'fas fa-expand-alt' : 'fas fa-minus';
}

function togglePlaylist() {
    const playlist = document.getElementById('playlist');
    const toggleBtn = document.querySelector('.toggle-list');
    playlist.classList.toggle('show');
    toggleBtn.innerHTML = playlist.classList.contains('show') ? `<i class="fas fa-list"></i> HIDE_PLAYLIST` : `<i class="fas fa-list"></i> VIEW_PLAYLIST`;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

// =========================================
// 5. MENU MOBILE & DRAG LOGIC
// =========================================

const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.nav-menu');

menu.addEventListener('click', () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    menu.classList.remove('is-active');
    menuLinks.classList.remove('active');
}));

// DRAGGABLE PLAYER
let isDragging = false;
let offsetX, offsetY;

player.addEventListener('mousedown', (e) => {
    if (e.target.closest('button') || e.target.closest('.progress-container') || e.target.closest('.playlist')) return;

    isDragging = true;
    const rect = player.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    player.style.transition = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    const maxX = window.innerWidth - player.offsetWidth;
    const maxY = window.innerHeight - player.offsetHeight;
    
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    player.style.left = `${x}px`;
    player.style.top = `${y}px`;
    player.style.right = 'auto';
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        player.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    }
});

function keepPlayerInBounds() {
    const rect = player.getBoundingClientRect();
    const padding = 20;
    let newX = rect.left;
    let newY = rect.top;

    if (rect.right > window.innerWidth) newX = window.innerWidth - rect.width - padding;
    if (rect.bottom > window.innerHeight) newY = window.innerHeight - rect.height - padding;
    if (rect.left < 0) newX = padding;
    if (rect.top < 0) newY = padding;

    player.style.left = `${newX}px`;
    player.style.top = `${newY}px`;
    player.style.right = 'auto';
}