document.addEventListener('DOMContentLoaded', function() {
    var langToggle = document.getElementById('langToggle');
    var currentLang = 'zh';
    var typingEl = document.querySelector('.typing-text');
    var typeTimer = null;

    function typeWriter(text, el) {
        if (!el) return;
        if (typeTimer) clearTimeout(typeTimer);

        el.textContent = '';
        var i = 0;

        function type() {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                typeTimer = setTimeout(type, 58);
            }
        }

        type();
    }

    function renderLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            var content = CV_CONTENT[key];

            if (!content || !content[lang]) return;

            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = content[lang];
            } else {
                el.innerHTML = content[lang];
            }
        });

        typeWriter(CV_CONTENT['hero.typing'][lang], typingEl);
    }

    function switchLanguage() {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
        if (langToggle) {
            langToggle.textContent = currentLang === 'zh' ? 'EN' : '中文';
        }
        renderLanguage(currentLang);
        localStorage.setItem('language', currentLang);
    }

    if (langToggle) {
        langToggle.addEventListener('click', switchLanguage);
    }

    var savedLang = localStorage.getItem('language');
    if (savedLang === 'en') {
        currentLang = 'en';
        document.documentElement.lang = 'en';
        if (langToggle) langToggle.textContent = '中文';
    }
    renderLanguage(currentLang);

    document.querySelectorAll('.map-pin').forEach(function(pin) {
        pin.addEventListener('click', function() {
            var country = this.getAttribute('data-country');

            document.querySelectorAll('.map-pin').forEach(function(item) {
                item.classList.toggle('is-active', item === pin);
            });

            document.querySelectorAll('[data-travel-card]').forEach(function(card) {
                card.classList.toggle('is-active', card.getAttribute('data-travel-card') === country);
            });
        });
    });

    var animElements = document.querySelectorAll('.animate-on-scroll');
    if ('IntersectionObserver' in window) {
        var animObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.12 });

        animElements.forEach(function(el) {
            animObserver.observe(el);
        });
    } else {
        animElements.forEach(function(el) {
            el.classList.add('visible');
        });
    }

    document.querySelectorAll('img').forEach(function(img) {
        img.addEventListener('error', function() {
            console.warn('Image failed to load:', this.src);
        });
    });
});
