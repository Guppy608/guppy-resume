document.addEventListener('DOMContentLoaded', function() {

    // ===== Global State =====
    const langToggle = document.getElementById('langToggle');
    const themeToggle = document.getElementById('themeToggle');
    let currentLang = 'zh';

    // ===== Particle Network Animation =====
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };
        let animationId;

        function resizeCanvas() {
            const hero = canvas.parentElement;
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
            initParticles();
        }

        function getParticleCount() {
            const w = canvas.width;
            if (w < 480) return 30;
            if (w < 768) return 45;
            return 70;
        }

        function initParticles() {
            particles = [];
            const count = getParticleCount();
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    r: Math.random() * 2 + 1
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isDark = document.body.classList.contains('dark-theme');
            const baseColor = isDark ? '229,231,235' : '26,26,42';
            const greenColor = isDark ? '16,185,129' : '14,165,233';

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                // Move
                p.x += p.vx;
                p.y += p.vy;
                // Bounce
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                // Mouse attraction
                if (mouse.x !== null) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        p.vx += dx * 0.0003;
                        p.vy += dy * 0.0003;
                    }
                }

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + baseColor + ',0.5)';
                ctx.fill();

                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const alpha = (1 - dist / 120) * 0.3;
                        let nearMouse = false;
                        if (mouse.x !== null) {
                            const mx = (p.x + p2.x) / 2 - mouse.x;
                            const my = (p.y + p2.y) / 2 - mouse.y;
                            nearMouse = Math.sqrt(mx * mx + my * my) < 150;
                        }
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = nearMouse
                            ? 'rgba(' + greenColor + ',' + alpha + ')'
                            : 'rgba(' + baseColor + ',' + alpha + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            animationId = requestAnimationFrame(drawParticles);
        }

        canvas.parentElement.addEventListener('mousemove', function(e) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            canvas.style.pointerEvents = 'auto';
        });

        canvas.parentElement.addEventListener('mouseleave', function() {
            mouse.x = null;
            mouse.y = null;
            canvas.style.pointerEvents = 'none';
        });

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        drawParticles();
    }

    // ===== Typewriter Effect =====
    const typingEl = document.querySelector('.typing-text');
    const titles = {
        zh: 'AI产品经理',
        en: 'AI Product Manager'
    };
    let typeTimer = null;

    function typeWriter(text, el, callback) {
        if (typeTimer) clearTimeout(typeTimer);
        el.textContent = '';
        let i = 0;
        function type() {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                typeTimer = setTimeout(type, 60);
            } else if (callback) {
                callback();
            }
        }
        type();
    }

    if (typingEl) {
        typeWriter(titles[currentLang], typingEl);
    }

    // ===== Language Toggle =====
    function switchLanguage() {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        langToggle.textContent = currentLang === 'zh' ? 'EN' : '中文';
        document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';

        const elementsWithLang = document.querySelectorAll('[data-zh][data-en]');
        elementsWithLang.forEach(function(element) {
            const text = currentLang === 'zh' ? element.getAttribute('data-zh') : element.getAttribute('data-en');
            if (element.tagName === 'INPUT') {
                element.placeholder = text;
            } else {
                element.innerHTML = text;
            }
        });

        // Re-trigger typewriter
        if (typingEl) {
            typeWriter(titles[currentLang], typingEl);
        }

        localStorage.setItem('language', currentLang);
    }

    langToggle.addEventListener('click', switchLanguage);

    const savedLang = localStorage.getItem('language');
    if (savedLang && savedLang !== currentLang) {
        switchLanguage();
    }

    // ===== Theme Toggle =====
    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        const icon = themeToggle.querySelector('.theme-icon');
        if (icon) icon.textContent = isDark ? '☀' : '☽';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const icon = themeToggle && themeToggle.querySelector('.theme-icon');
        if (icon) icon.textContent = '☀';
    }

    // ===== Keyboard Shortcuts =====
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleTheme();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            switchLanguage();
        }
    });

    // ===== Smooth Scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== Scroll Header Hide/Show =====
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('header');
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // ===== Intersection Observer with Staggered Delay =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedEls = document.querySelectorAll('.about-card, .achievement-card, .timeline-item, .skill-category');
    animatedEls.forEach(function(el, index) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.5s ease ' + (index % 4) * 100 + 'ms, transform 0.5s ease ' + (index % 4) * 100 + 'ms';
        observer.observe(el);
    });

    // ===== Avatar Easter Egg =====
    const avatar = document.querySelector('.avatar-img');
    if (avatar) {
        let clickCount = 0;
        avatar.addEventListener('click', function() {
            clickCount++;
            this.style.transform = 'scale(0.9) rotate(10deg)';
            setTimeout(function() {
                avatar.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
            if (clickCount === 5) {
                alert(currentLang === 'zh' ? '你发现了一个彩蛋！' : 'You found an easter egg!');
                clickCount = 0;
            }
        });
    }

    // ===== Image Error Handling =====
    document.querySelectorAll('img').forEach(function(img) {
        img.addEventListener('error', function() {
            console.warn('Image failed to load:', this.src);
        });
    });

});