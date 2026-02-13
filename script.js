/* --- DATA --- */
const flowersData = [
    { label: 'For Strength', type: 'rose', color: '#ff6b6b', icon: 'fa-heart', memory: 'You are stronger than you realize.' },
    { label: 'For Smiles', type: 'tulip', color: '#ff9ff3', icon: 'fa-smile', memory: 'Your energy makes even boring days fun.' },
    { label: 'For Kindness', type: 'daisy', color: '#54a0ff', icon: 'fa-star', memory: 'Your kindness never goes unnoticed.' },
    { label: 'For Support', type: 'lily', color: '#e1bee7', icon: 'fa-hands-helping', memory: 'Thank you for always being there for me.' },
    { label: 'For Joy', type: 'sunflower', color: '#feca57', icon: 'fa-sun', memory: 'Life is brighter with you in it.' }
];

const loveLetterText = `
Hey Bestie,

I wanted to send you some virtual flowers to brighten your day.

Thank you for all the laughs, the deep talks, and the endless support. 

You are appreciated more than you know. 

Never forget how amazing, capable, and beautiful you are.

Forever your friend,
`;

/* --- DOM ELEMENTS --- */
const steps = {
    1: document.getElementById('step-1'),
    2: document.getElementById('step-2'),
    3: document.getElementById('step-3')
};
const unwrapBtn = document.getElementById('unwrap-btn');
const bouquetContainer = document.getElementById('bouquet');
const nextStepBtn = document.getElementById('next-step-btn');
const openLetterBtn = document.getElementById('open-letter-btn');
const letterView = document.getElementById('letter-view');
const typingElement = document.getElementById('typing-text');
const audio = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
const themeBtn = document.getElementById('theme-btn');
const memoryModal = document.getElementById('memory-display');
const memoryText = document.getElementById('memory-text');
const closeMemory = document.querySelector('.close-memory');
const flowerPopupLayer = document.getElementById('flower-popup-layer');

/* --- STATE --- */
let currentThemeIndex = 0;
const themes = ['', 'theme-red', 'theme-violet', 'theme-gold'];
let flowersClicked = 0;
let isLetterOpen = false; // BUG FIX: Track if letter is already opened

/* --- INITIALIZATION --- */
window.addEventListener('DOMContentLoaded', () => {
    updateGreeting();
    createPetals(); // Starts the raining petals animation
});

/* --- FUNCTIONS --- */

// 1. Time-based Greeting
function updateGreeting() {
    const hour = new Date().getHours();
    const el = document.getElementById('time-greeting');
    if (hour < 12) el.innerText = "Good Morning Bestie";
    else if (hour < 18) el.innerText = "Good Afternoon Bestie";
    else el.innerText = "Good Evening Bestie";
}

// 2. Step 1 -> Step 2
unwrapBtn.addEventListener('click', () => {
    steps[1].classList.add('hidden');
    steps[1].classList.remove('active');
    
    setTimeout(() => {
        steps[2].classList.remove('hidden');
        steps[2].classList.add('active');
        spawnRandomCircles(); 
    }, 800);
});

// Step 2 -> Step 3
nextStepBtn.addEventListener('click', () => {
    steps[2].classList.add('hidden');
    steps[2].classList.remove('active');

    setTimeout(() => {
        steps[3].classList.remove('hidden');
        steps[3].classList.add('active');
    }, 800);
});

// 3. Spawn BIG RANDOM CIRCLES (Step 2)
function spawnRandomCircles() {
    flowersData.forEach((flower, index) => {
        const flowerEl = document.createElement('div');
        flowerEl.classList.add('flower');
        
        // Random Position Logic (10% to 80% to avoid edges)
        const randomLeft = Math.floor(Math.random() * 70) + 10; 
        const randomTop = Math.floor(Math.random() * 60) + 10;
        
        flowerEl.style.left = `${randomLeft}%`;
        flowerEl.style.top = `${randomTop}%`;
        
        flowerEl.innerHTML = `
            <div class="flower-head" style="background-color: ${flower.color}">
                <i class="fas ${flower.icon} flower-icon"></i>
                <div class="flower-label">${flower.label}</div>
                <div class="click-hint">Click Me</div>
            </div>
        `;

        setTimeout(() => {
            flowerEl.classList.add('bloomed');
        }, index * 200);

        flowerEl.addEventListener('click', () => {
            showMemory(flower.memory);
            createSparkles(flowerEl.getBoundingClientRect());
            flowersClicked++;
            if(flowersClicked >= 3) {
                nextStepBtn.classList.remove('hidden');
            }
        });

        bouquetContainer.appendChild(flowerEl);
    });
}

// 4. Memory Modal
function showMemory(text) {
    memoryText.innerText = text;
    memoryModal.classList.remove('hidden');
}

closeMemory.addEventListener('click', () => {
    memoryModal.classList.add('hidden');
});

// 5. Letter & Real Flowers Sequence (Step 3) - BUG FIXED HERE
openLetterBtn.addEventListener('click', () => {
    // FIX: Check if already opened. If yes, stop here.
    if (isLetterOpen) return;
    isLetterOpen = true; // Lock it immediately

    document.querySelector('.envelope').classList.add('open');
    
    // 1. Trigger Flower Popup
    triggerFlowerPopup();
    
    // 2. Wait 3-5 Seconds, then show Letter and push flowers to back
    setTimeout(() => {
        // We add a class to dim the flowers so the letter is easy to read
        document.querySelectorAll('.pop-up-flower').forEach(el => el.classList.add('fade-out'));
        
        openLetterBtn.classList.add('hidden');
        letterView.classList.remove('hidden');
        typeWriterEffect(loveLetterText, typingElement);
    }, 4000); 
});

function triggerFlowerPopup() {
    const flowerImages = [
        "https://gallery.yopriceville.com/downloadfullsize/send/5305", 
        "https://cdn.creazilla.com/cliparts/7814063/rose-bouquet-clipart-original.png"
    ];

    flowerImages.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('pop-up-flower');
        flowerPopupLayer.appendChild(img);

        setTimeout(() => {
            img.classList.add('show');
        }, i * 300);
    });
}

function typeWriterEffect(text, element) {
    let i = 0;
    element.innerHTML = "";
    function type() {
        if (i < text.length) {
            if (text.charAt(i) === '\n') {
                element.innerHTML += '<br>';
            } else {
                element.innerHTML += text.charAt(i);
            }
            i++;
            setTimeout(type, 50);
        }
    }
    type();
}

/* --- UTILITIES & EFFECTS --- */

// Audio Toggle
musicBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audio.pause();
        musicBtn.innerHTML = '<i class="fas fa-music"></i>';
    }
});

// Theme Switcher
themeBtn.addEventListener('click', () => {
    document.body.classList.remove(themes[currentThemeIndex]);
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];
    if(newTheme) document.body.classList.add(newTheme);
});

// RAINING PETALS ANIMATION
function createPetals() {
    const container = document.getElementById('petal-container');
    
    // Create a new petal every 300ms
    setInterval(() => {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        // Random horizontal position
        petal.style.left = Math.random() * 100 + 'vw';
        
        // Random animation speed (between 2s and 5s)
        petal.style.animationDuration = Math.random() * 3 + 2 + 's';
        
        // Random opacity
        petal.style.opacity = Math.random();
        
        container.appendChild(petal);
        
        // Remove petal from DOM after animation finishes to prevent memory leaks
        setTimeout(() => {
            petal.remove();
        }, 5000);
    }, 300);
}

// Sparkle Effect on Click
function createSparkles(rect) {
    for(let i=0; i<10; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = (rect.left + rect.width/2) + 'px';
        sparkle.style.top = (rect.top + rect.height/2) + 'px';
        sparkle.style.width = '6px';
        sparkle.style.height = '6px';
        sparkle.style.background = 'gold';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        document.body.appendChild(sparkle);

        const x = (Math.random() - 0.5) * 150;
        const y = (Math.random() - 0.5) * 150;

        sparkle.animate([
            { transform: 'translate(0,0)', opacity: 1 },
            { transform: `translate(${x}px, ${y}px)`, opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        });

        setTimeout(() => sparkle.remove(), 800);
    }
}