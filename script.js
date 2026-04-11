// Hiệu ứng Matrix Rain
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#00ff41";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}
setInterval(draw, 35);

// Trình phát nhạc
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