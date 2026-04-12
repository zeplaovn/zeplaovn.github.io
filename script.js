/**
 * ZEPLAO.VN - Cyber Portfolio Logic
 */

// =========================================
// 1. KHAI BÁO BIẾN TOÀN CỤC
// =========================================

// --- Typewriter ---
const message = "Cyber Security Enthusiast | CTF Player | Researcher";
let typeIndex = 0;

// --- Matrix Rain ---
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
let columns, drops;
const letters = "0101010101010101ABCDEFHIJKLMNOPQRSTUVWXYZ";
const fontSize = 16;

// --- Music Player Data ---
const music = document.getElementById("bgMusic");
const playBtn = document.getElementById("playBtn");
const statusText = document.getElementById("status");
const progressBar = document.getElementById("progressBar");
const trackName = document.getElementById("trackName");
const playlistElement = document.getElementById("playlist");

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
// 2. KHỞI TẠO & LẮNG NGHE SỰ KIỆN (EVENTS)
// =========================================

window.addEventListener('resize', resize);

window.addEventListener('load', () => {
    // Khởi tạo Matrix
    resize();
    setInterval(drawMatrix, 50);
    
    // Khởi tạo Typewriter sau 1s
    setTimeout(typewriter, 1000); 
    
    // Khởi tạo Music Player
    initPlaylist();
    loadTrack(0);
});

// Cập nhật tiến trình nhạc (Progress Bar & Time)
music.ontimeupdate = () => {
    if (music.duration) {
        const progressPercent = (music.currentTime / music.duration) * 100;
        progressBar.style.width = progressPercent + "%";
        
        document.getElementById("currentTime").innerText = formatTime(music.currentTime);
        document.getElementById("durationTime").innerText = formatTime(music.duration);
    }
};

// Tự động chuyển bài khi kết thúc
music.onended = nextTrack;

// =========================================
// 3. CÁC HÀM HIỆU ỨNG (VISUALS)
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
    
    // Đóng các mục khác (Accordion mode)
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
// 4. LOGIC TRÌNH PHÁT NHẠC (MUSIC PLAYER)
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
    
    // Reset thời gian và animation
    document.getElementById("currentTime").innerText = "00:00";
    document.getElementById("durationTime").innerText = "00:00";
    
    // Reset hiệu ứng chữ chạy
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
        music.play().then(() => updateUI(true)).catch(e => console.log("Click required"));
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
    const width = document.querySelector('.progress-container').clientWidth;
    const clickX = e.offsetX;
    if (music.duration) music.currentTime = (clickX / width) * music.duration;
}

function togglePlayer() {
    const player = document.getElementById('mainPlayer');
    const minBtn = document.querySelector('.minimize-btn');
    player.classList.toggle('minimized');
    minBtn.innerText = player.classList.contains('minimized') ? "[ + ]" : "[ _ ]";
}

function togglePlaylist() {
    const playlist = document.getElementById('playlist');
    const toggleBtn = document.querySelector('.toggle-list');
    playlist.classList.toggle('show');
    toggleBtn.innerText = playlist.classList.contains('show') ? "> HIDE_PLAYLIST" : "> VIEW_PLAYLIST";
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}