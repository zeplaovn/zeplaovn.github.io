// Hiệu ứng Matrix Rain (Phiên bản giảm mỏi mắt)
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Tập hợp ký tự (có thể dùng Hiragana để vibe Matrix gốc)
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*こんにちは世界の";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function draw() {
    // 1. Tạo lớp nền mờ dần (trail effect)
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 2. Thiết lập CHỈNH ĐỂ GIẢM MỎI MẮT
    // Tạo độ mờ ảo (Glow) cho ký tự
    ctx.shadowBlur = 5; // Độ rộng của vùng mờ (tăng để mờ hơn)
    ctx.shadowColor = "#00ff41"; // Màu của vùng mờ
    
    // Giảm độ sáng của ký tự gốc một chút
    ctx.fillStyle = "rgba(0, 255, 65, 0.8)"; // 80% độ đục
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        // Lấy ký tự ngẫu nhiên
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        
        // Vẽ ký tự
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Trả ký tự về đầu khi chạm đáy hoặc ngẫu nhiên
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
    
    // 3. Reset shadowBlur sau khi vẽ để không ảnh hưởng đến các phần khác của Canvas (nếu có)
    ctx.shadowBlur = 0;
}

// Tốc độ rơi (35ms một khung hình)
setInterval(draw, 35);

// --- Trình phát nhạc (Giữ nguyên) ---
const music = document.getElementById("bgMusic");
const statusText = document.getElementById("status");
const btn = document.getElementById("playBtn");

function toggleMusic() {
    if (music.paused) {
        music.play();
        btn.innerText = "PAUSE AUDIO";
        statusText.innerText = "ONLINE";
        statusText.style.color = "#00ff41";
    } else {
        music.pause();
        btn.innerText = "PLAY AUDIO";
        statusText.innerText = "OFFLINE";
        statusText.style.color = "red";
    }
}