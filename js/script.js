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

        var elementsWithLang = document.querySelectorAll('[data-zh][data-en]');
        elementsWithLang.forEach(function(element) {
            var text = currentLang === 'zh' ? element.getAttribute('data-zh') : element.getAttribute('data-en');
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

    var savedLang = localStorage.getItem('language');
    if (savedLang && savedLang !== currentLang) {
        switchLanguage();
    }

    // ===== Theme Toggle =====
    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        var isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        var icon = themeToggle.querySelector('.theme-icon');
        if (icon) icon.textContent = isDark ? '☀' : '☽';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        var icon = themeToggle && themeToggle.querySelector('.theme-icon');
        if (icon) icon.textContent = '☽';
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

    // ===== Page Dots Indicator =====
    var pages = document.querySelectorAll('.snap-page');
    var dots = document.querySelectorAll('.dot');

    function updateDots() {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var windowHeight = window.innerHeight;
        var currentIndex = Math.round(scrollTop / windowHeight);
        currentIndex = Math.max(0, Math.min(currentIndex, pages.length - 1));

        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    window.addEventListener('scroll', updateDots);

    dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            var index = parseInt(this.getAttribute('data-index'));
            pages[index].scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ===== Video Lazy Load =====
    var videoEl = document.querySelector('.video-wrapper video');
    if (videoEl) {
        var videoObserver = new IntersectionObserver(function(entries) {
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
