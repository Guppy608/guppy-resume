document.addEventListener('DOMContentLoaded', function() {

    // ===== Global State =====
    var langToggle = document.getElementById('langToggle');
    var currentLang = 'zh';

    // ===== Typewriter Effect =====
    var typingEl = document.querySelector('.typing-text');
    var typeTimer = null;

    function typeWriter(text, el, callback) {
        if (typeTimer) clearTimeout(typeTimer);
        el.textContent = '';
        var i = 0;
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
        typeWriter(CV_CONTENT['hero.typing'][currentLang], typingEl);
    }

    // ===== Summary Detection =====
    function updateSummaryStates() {
        document.querySelectorAll('.exp-desc').forEach(function(desc) {
            var summary = desc.querySelector('.exp-desc-summary');
            if (summary && summary.textContent.trim()) {
                desc.classList.add('has-summary');
            } else {
                desc.classList.remove('has-summary');
            }
        });
    }

    function renderLanguage(lang) {
        var elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            var content = CV_CONTENT[key];
            if (content && content[lang]) {
                if (el.tagName === 'INPUT') {
                    el.placeholder = content[lang];
                } else {
                    el.innerHTML = content[lang];
                }
            }
        });
        updateSummaryStates();
    }

    // ===== Language Toggle =====
    function switchLanguage() {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        langToggle.textContent = currentLang === 'zh' ? 'EN' : '中文';
        document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';

        renderLanguage(currentLang);

        // Re-trigger typewriter
        if (typingEl) {
            typeWriter(CV_CONTENT['hero.typing'][currentLang], typingEl);
        }

        // Update expand buttons to match current state
        document.querySelectorAll('.expand-btn').forEach(function(btn) {
            var desc = btn.parentElement.querySelector('.exp-desc');
            if (desc && desc.classList.contains('expanded')) {
                btn.innerHTML = CV_CONTENT['exp.collapse'][currentLang];
            } else {
                btn.innerHTML = CV_CONTENT['exp.expand'][currentLang];
            }
        });

        localStorage.setItem('language', currentLang);
    }

    langToggle.addEventListener('click', switchLanguage);

    var savedLang = localStorage.getItem('language');
    if (savedLang && savedLang !== currentLang) {
        switchLanguage();
    } else {
        renderLanguage(currentLang);
    }

    // ===== Page Dots Indicator =====
    var sections = [
        document.querySelector('.hero-page'),
        document.querySelector('.speaking-page'),
        document.querySelector('.timeline-section'),
        document.querySelector('.contact-page')
    ];
    var dots = document.querySelectorAll('.dot');

    function updateDots() {
        var scrollTop = window.scrollY;
        var windowHeight = window.innerHeight;
        var activeIndex = 0;

        for (var i = sections.length - 1; i >= 0; i--) {
            if (sections[i] && scrollTop >= sections[i].offsetTop - windowHeight * 0.4) {
                activeIndex = i;
                break;
            }
        }

        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === activeIndex);
        });
    }

    window.addEventListener('scroll', updateDots, { passive: true });

    dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            var index = parseInt(this.getAttribute('data-index'));
            if (sections[index]) {
                sections[index].scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== Expand / Collapse =====
    document.querySelectorAll('.expand-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var desc = this.parentElement.querySelector('.exp-desc');
            if (!desc) return;

            var isExpanded = desc.classList.toggle('expanded');
            var key = isExpanded ? 'exp.collapse' : 'exp.expand';
            this.innerHTML = CV_CONTENT[key][currentLang];
        });
    });

    // ===== Scroll Animations (IntersectionObserver) =====
    var animElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        var animObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15 });

        animElements.forEach(function(el) {
            animObserver.observe(el);
        });
    } else {
        animElements.forEach(function(el) {
            el.classList.add('visible');
        });
    }

    // ===== Hero Parallax =====
    var heroBg = document.querySelector('.hero-bg');
    var heroPage = document.querySelector('.hero-page');

    function updateParallax() {
        if (!heroBg || !heroPage) return;
        var scrollTop = window.scrollY;
        var heroHeight = heroPage.offsetHeight;
        if (scrollTop < heroHeight) {
            heroBg.style.transform = 'translateY(' + (scrollTop * 0.25) + 'px)';
        }
    }

    window.addEventListener('scroll', updateParallax, { passive: true });

    // ===== Timeline Line Growth =====
    var timelineSection = document.querySelector('.timeline-section');
    var timelineLine = document.querySelector('.timeline-line');

    function updateTimelineLine() {
        if (!timelineSection || !timelineLine) return;

        var rect = timelineSection.getBoundingClientRect();
        var sectionHeight = timelineSection.offsetHeight;
        var windowHeight = window.innerHeight;

        if (rect.top >= windowHeight || rect.bottom <= 0) {
            timelineLine.style.clipPath = 'inset(0 0 100% 0)';
            return;
        }

        var scrolledInto = windowHeight - rect.top;
        var totalScrollable = sectionHeight + windowHeight;
        var progress = Math.max(0, Math.min(1, scrolledInto / totalScrollable));

        var revealPercent = (1 - progress) * 100;
        timelineLine.style.clipPath = 'inset(0 0 ' + revealPercent + '% 0)';
    }

    window.addEventListener('scroll', updateTimelineLine, { passive: true });
    updateTimelineLine();

    // ===== Video Lazy Load & Last Frame Poster =====
    var videoEl = document.querySelector('.video-wrapper video');
    if (videoEl) {
        videoEl.addEventListener('loadedmetadata', function() {
            videoEl.currentTime = videoEl.duration;
        });

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
