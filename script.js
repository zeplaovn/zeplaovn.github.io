// --- Matrix Rain ---
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

const letters = "0101010101010101ABCDEFHIJKLMNOPQRSTUVWXYZ";
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 8, 0, 0.1)";
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
setInterval(drawMatrix, 40);

// --- Typewriter ---
const message = "Cyber Security Enthusiast | CTF Player | Security Researcher";
let index = 0;
function type() {
    if (index < message.length) {
        document.getElementById("typewriter").innerHTML += message.charAt(index);
        index++;
        setTimeout(type, 50);
    }
}
window.onload = type;

// --- Accordion Skill ---
function toggleSkill(element) {
    const content = element.nextElementSibling;
    const icon = element.querySelector('.icon');
    const title = element.querySelector('span');

    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.style.paddingBottom = "0";
        icon.style.transform = "rotate(0deg)";
        title.innerText = title.innerText.replace('[-]', '[+]');
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.paddingBottom = "15px";
        icon.style.transform = "rotate(180deg)";
        title.innerText = title.innerText.replace('[+]', '[-]');
    }
}

// --- Music Player ---
const music = document.getElementById("bgMusic");
const statusText = document.getElementById("status");
const btn = document.getElementById("playBtn");
function toggleMusic() {
    if (music.paused) {
        music.play().catch(e => console.log("Blocked"));
        btn.innerText = "[ PAUSE AUDIO ]";
        statusText.innerText = "ONLINE";
        statusText.style.color = "#00ff41";
    } else {
        music.pause();
        btn.innerText = "[ PLAY AUDIO ]";
        statusText.innerText = "OFFLINE";
        statusText.style.color = "red";
    }
}