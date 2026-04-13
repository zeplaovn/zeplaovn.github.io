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
    { name: "〒160-0014 Tokyo '82", file: "〒160-0014 tokyo '82.mp3" },
    { name: "Deep Thinking Lofi", file: "absolutesound-deep-thinking-lofi-music-510766.mp3" },
    { name: "Late Night Lofi", file: "absolutesound-late-night-lofi-497896.mp3" },
    { name: "Aventure Lofi Vlog", file: "aventure-lofi-vlog-chill-beat-508265.mp3" },
    { name: "Good Night Lofi", file: "fassounds-good-night-lofi-cozy-chill-music-160166.mp3" },
    { name: "Lofi Study Calm", file: "fassounds-lofi-study-calm-peaceful-chill-hop-112191.mp3" },
    { name: "Coffee Lofi", file: "lofi_music_library-coffee-lofi-lofi-music-chill-ambient-458900.mp3" },
    { name: "Lofi Girl Chill", file: "monume-lofi-lofi-girl-lofi-chill-509453.mp3" },
    { name: "Lofi Chill Girl", file: "paulyudin-lofi-lofi-chill-lofi-girl-482399.mp3" },
    { name: "The Mountain Lofi", file: "the_mountain-lofi-lofi-music-496553.mp3" }
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
    // resize();
    keepPlayerInBounds(); 
});

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

/**
 * Đảm bảo Player luôn nằm trong vùng hiển thị khi thay đổi kích thước màn hình
 */
function keepPlayerInBounds() {
    const rect = player.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;

    // Lấy vị trí hiện tại
    let currentX = rect.left;
    let currentY = rect.top;

    // Kiểm tra và điều chỉnh nếu vượt quá biên phải hoặc biên dưới
    let newX = Math.max(0, Math.min(currentX, maxX));
    let newY = Math.max(0, Math.min(currentY, maxY));

    // Cập nhật lại vị trí
    player.style.left = `${newX}px`;
    player.style.top = `${newY}px`;
    
    // Xóa thuộc tính right/bottom để tránh xung đột với left/top khi resize
    player.style.right = 'auto';
    player.style.bottom = 'auto';
}

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

const startDrag = (e) => {
    // Kiểm tra nếu bấm vào nút hoặc thanh progress thì không kéo
    if (e.target.closest('button') || e.target.closest('.progress-container') || e.target.closest('.playlist')) return;

    isDragging = true;
    const rect = player.getBoundingClientRect();
    
    // Lấy tọa độ (hỗ trợ cả Touch và Mouse)
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
    player.style.transition = 'none';
};

const dragging = (e) => {
    if (!isDragging) return;
    
    // Ngăn chặn cuộn trang trên mobile khi đang kéo
    if (e.type === 'touchmove') e.preventDefault();

    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    let x = clientX - offsetX;
    let y = clientY - offsetY;

    const maxX = window.innerWidth - player.offsetWidth;
    const maxY = window.innerHeight - player.offsetHeight;
    
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    player.style.left = `${x}px`;
    player.style.top = `${y + 65}px`;
    player.style.right = 'auto';
};

const stopDrag = () => {
    if (isDragging) {
        isDragging = false;
        player.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    }
};

// Sự kiện Chuột
player.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', dragging);
document.addEventListener('mouseup', stopDrag);

// Sự kiện Chạm (Mobile)
player.addEventListener('touchstart', startDrag, { passive: false });
document.addEventListener('touchmove', dragging, { passive: false });
document.addEventListener('touchend', stopDrag);