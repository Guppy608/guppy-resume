document.addEventListener('DOMContentLoaded', function() {

    // ===== Global State =====
    const langToggle = document.getElementById('langToggle');
    const themeToggle = document.getElementById('themeToggle');
    let currentLang = 'zh';

    // ===== Typewriter Effect =====
    const typingEl = document.querySelector('.typing-text');
    const titles = {
        zh: 'AI 产品经理',
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

    const animatedEls = document.querySelectorAll('.about-card, .video-showcase, .timeline-item, .skill-category');
    animatedEls.forEach(function(el, index) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.5s ease ' + (index % 4) * 100 + 'ms, transform 0.5s ease ' + (index % 4) * 100 + 'ms';
        observer.observe(el);
    });

    // ===== Video Lazy Load =====
    const videoEl = document.querySelector('.video-wrapper video');
    if (videoEl) {
        const videoObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    videoEl.preload = 'auto';
                    videoObserver.unobserve(videoEl);
                }
            });
        }, { threshold: 0.25 });
        videoObserver.observe(videoEl);
    }

    // ===== Image Error Handling =====
    document.querySelectorAll('img').forEach(function(img) {
        img.addEventListener('error', function() {
            console.warn('Image failed to load:', this.src);
        });
    });

});