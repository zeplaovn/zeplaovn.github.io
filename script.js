// --- Matrix Rain Effect ---
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const letters = "01010101010101010101ABCDEFHIJKLMNOPQRSTUVWXYZ"; // Binary xen kẽ ký tự
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function draw() {
    ctx.fillStyle = "rgba(0, 8, 0, 0.1)"; // Nền tối hơn
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
setInterval(draw, 40);

// --- Typewriter Effect ---
const textElement = document.getElementById("typewriter");
const message = "Cyber Security Enthusiast | CTF Player | Security Researcher";
let index = 0;

function typeWriter() {
    if (index < message.length) {
        textElement.innerHTML += message.charAt(index);
        index++;
        setTimeout(typeWriter, 50);
    }
}
// Chạy hiệu ứng khi load trang
window.onload = typeWriter;

// --- Music Player Logic ---
const music = document.getElementById("bgMusic");
const statusText = document.getElementById("status");
const btn = document.getElementById("playBtn");

function toggleMusic() {
    if (music.paused) {
        music.play().catch(e => console.log("Audio play blocked by browser"));
        btn.innerText = "[ PAUSE AUDIO ]";
        statusText.innerText = "ONLINE";
        statusText.style.color = "#00ff41";
        statusText.classList.add("blink");
    } else {
        music.pause();
        btn.innerText = "[ PLAY AUDIO ]";
        statusText.innerText = "OFFLINE";
        statusText.style.color = "red";
        statusText.classList.remove("blink");
    }
}