/**
 * ZEPLAO.VN - Cyber Portfolio Logic
 */

// --- 1. Hiệu ứng Typewriter (Đánh máy) ---
const message = "Cyber Security Enthusiast | CTF Player | Researcher";
let typeIndex = 0;

function typewriter() {
    const typewriterElement = document.getElementById("typewriter");
    if (typewriterElement && typeIndex < message.length) {
        typewriterElement.innerHTML += message.charAt(typeIndex);
        typeIndex++;
        setTimeout(typewriter, 60); // Tốc độ 60ms
    }
}

// --- 2. Hiệu ứng Matrix Rain ---
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
let columns, drops;
const letters = "0101010101010101ABCDEFHIJKLMNOPQRSTUVWXYZ";
const fontSize = 16;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
}

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 8, 0, 0.15)"; // Tạo hiệu ứng đuôi mờ
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#00ff41"; // Màu neon đặc trưng
    ctx.font = fontSize + "px monospace";
    
    for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Reset drop khi chạm đáy hoặc ngẫu nhiên sau khi chạm đáy
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// --- 3. Accordion Kỹ năng (Skills) ---
function toggleSkill(header) {
    const item = header.parentElement;
    const content = header.nextElementSibling;
    const icon = header.querySelector('.icon');
    
    const isOpen = item.classList.contains('active');
    
    // Đóng tất cả các mục khác (nếu muốn hiệu ứng chỉ mở 1 mục duy nhất)
    document.querySelectorAll('.skill-item').forEach(el => {
        el.classList.remove('active');
        el.querySelector('.skill-content').style.maxHeight = null;
        el.querySelector('.icon').innerText = '▼';
    });

    if (!isOpen) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
        icon.innerText = '▲';
        header.setAttribute('aria-expanded', 'true');
    } else {
        header.setAttribute('aria-expanded', 'false');
    }
}

// --- 4. Music Player Logic ---
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

function loadTrack(index) {
    currentTrackIndex = index;
    // Đảm bảo đường dẫn assets/ khớp với cấu trúc thư mục của bạn
    music.src = `assets/${tracks[index].file}`;
    trackName.innerText = tracks[index].name;
    
    // Reset animation scrolling text
    trackName.style.animation = 'none';
    trackName.offsetHeight; 
    trackName.style.animation = null;

    // Cập nhật giao diện playlist
    updatePlaylistUI();
}

function updatePlaylistUI() {
    const items = playlistElement.querySelectorAll("li");
    items.forEach((li, i) => {
        if (i === currentTrackIndex) {
            li.classList.add("active-track");
            li.style.color = "var(--neon-green)";
        } else {
            li.classList.remove("active-track");
            li.style.color = "#fff";
        }
    });
}
// Thêm hàm này vào script.js
function togglePlaylist() {
    const playlist = document.getElementById('playlist');
    playlist.classList.toggle('show');
    
    // Đổi text nút khi nhấn (tùy chọn)
    const toggleBtn = document.querySelector('.toggle-list');
    if (playlist.classList.contains('show')) {
        toggleBtn.innerText = "> HIDE_PLAYLIST";
    } else {
        toggleBtn.innerText = "> VIEW_PLAYLIST";
    }
}
function updateUI(isPlaying) {
    if (isPlaying) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        statusText.innerText = "SYSTEM ONLINE";
        statusText.classList.remove("blink"); // Ngừng nháy khi đang chạy
        statusText.style.color = "var(--neon-green)";
    } else {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        statusText.innerText = "SYSTEM OFFLINE";
        statusText.classList.add("blink");
        statusText.style.color = "#ff4141"; // Đỏ khi offline
    }
}

function toggleMusic() {
    if (music.paused) {
        music.play().then(() => updateUI(true)).catch(err => console.log("User interaction required"));
    } else {
        music.pause();
        updateUI(false);
    }
}

function togglePlaylist() {
    const playlist = document.getElementById('playlist');
    playlist.classList.toggle('show');
    
    // Đổi text nút khi nhấn (tùy chọn)
    const toggleBtn = document.querySelector('.toggle-list');
    if (playlist.classList.contains('show')) {
        toggleBtn.innerText = "> HIDE_PLAYLIST";
    } else {
        toggleBtn.innerText = "> VIEW_PLAYLIST";
    }
}


// Thêm hàm này vào script.js
function togglePlaylist() {
    const playlist = document.getElementById('playlist');
    playlist.classList.toggle('show');
    
    // Đổi text nút khi nhấn (tùy chọn)
    const toggleBtn = document.querySelector('.toggle-list');
    if (playlist.classList.contains('show')) {
        toggleBtn.innerText = "> HIDE_PLAYLIST";
    } else {
        toggleBtn.innerText = "> VIEW_PLAYLIST";
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
    if (music.duration) {
        music.currentTime = (clickX / width) * music.duration;
    }
}

function togglePlayer() {
    const player = document.getElementById('mainPlayer');
    const minBtn = document.querySelector('.minimize-btn');
    player.classList.toggle('minimized');
    minBtn.innerText = player.classList.contains('minimized') ? "[ + ]" : "[ _ ]";
}

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

// --- 5. Event Listeners & Initialization ---

// Theo dõi tiến trình bài hát
music.ontimeupdate = () => {
    if (music.duration) {
        const progressPercent = (music.currentTime / music.duration) * 100;
        progressBar.style.width = progressPercent + "%";
    }
};

// Tự động chuyển bài
music.onended = nextTrack;

// Khởi chạy khi Window load
window.addEventListener('resize', resize);

window.addEventListener('load', () => {
    // 1. Matrix
    resize();
    setInterval(drawMatrix, 50);
    
    // 2. Typewriter
    setTimeout(typewriter, 1000); // Đợi 1s sau khi load rồi mới đánh máy
    
    // 3. Music Player
    initPlaylist();
    loadTrack(0);
});