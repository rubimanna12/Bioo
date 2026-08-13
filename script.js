document.addEventListener('DOMContentLoaded', () => {
    // 1. Populate Profile Data
    document.getElementById('profile-img').src = config.profile.avatar;
    document.getElementById('profile-name').textContent = config.profile.name;
    document.getElementById('profile-username').textContent = config.profile.username;
    document.getElementById('profile-bio').textContent = config.profile.bio;
    document.getElementById('footer-name').textContent = config.profile.name;
    document.getElementById('year').textContent = new Date().getFullYear();

    if (config.profile.verified) {
        document.getElementById('verified-badge').classList.remove('hidden');
    }

    if (config.profile.location) {
        const loc = document.getElementById('profile-location');
        loc.classList.remove('hidden');
        document.getElementById('location-text').textContent = config.profile.location;
    }

    // 2. Populate Social Icons
    const socialGrid = document.getElementById('social-grid');
    config.socials.forEach(social => {
        const a = document.createElement('a');
        a.href = social.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "w-12 h-12 rounded-full glass-btn flex items-center justify-center text-xl text-gray-300 hover:text-white transition-all duration-300";
        a.setAttribute('aria-label', social.platform);
        a.innerHTML = `<i class="${social.icon}"></i>`;
        socialGrid.appendChild(a);
    });

    // 3. Populate Link Buttons
    const linksContainer = document.getElementById('links-container');
    config.links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        
        let baseClass = "glass-btn w-full p-4 rounded-2xl flex items-center justify-between text-gray-200 transition-all duration-300 group";
        if (link.highlight) baseClass += " highlight";
        
        a.className = baseClass;
        a.innerHTML = `
            <div class="flex items-center gap-4">
                <i class="${link.icon} text-neon text-lg group-hover:scale-110 transition-transform duration-300"></i>
                <span class="font-medium tracking-wide">${link.title}</span>
            </div>
            <i class="fas fa-chevron-right text-xs opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"></i>
        `;
        linksContainer.appendChild(a);
    });

    // 4. Share Functionality
    document.getElementById('share-btn').addEventListener('click', async () => {
        const shareData = {
            title: config.profile.name,
            text: config.profile.bio,
            url: window.location.href
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    });

    // 5. Custom Cursor (Desktop Only)
    const cursor = document.getElementById('cursor');
    const dot = document.getElementById('cursor-dot');
    
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            dot.style.left = e.clientX + 'px';
            dot.style.top = e.clientY + 'px';
        });

        // Hover effects for interactive elements
        const interactables = document.querySelectorAll('a, button');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('scale-150', 'bg-neon', 'bg-opacity-20'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('scale-150', 'bg-neon', 'bg-opacity-20'));
        });
    }

    // 6. Floating Particles System
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < config.settings.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initParticles();
    animateParticles();
});
