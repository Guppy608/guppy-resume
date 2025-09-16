// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {

    // 获取所有需要的元素
    const langToggle = document.getElementById('langToggle');

    // 全局变量
    let currentLang = 'zh'; // 默认中文

    // 语言切换功能
    function switchLanguage() {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';

        // 更新按钮文字
        langToggle.textContent = currentLang === 'zh' ? 'EN' : '中文';

        // 更新页面语言属性
        document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';

        // 更新所有带有语言属性的元素
        const elementsWithLang = document.querySelectorAll('[data-zh][data-en]');
        elementsWithLang.forEach(element => {
            const text = currentLang === 'zh' ? element.getAttribute('data-zh') : element.getAttribute('data-en');
            if (element.tagName === 'INPUT') {
                element.placeholder = text;
            } else {
                element.innerHTML = text;
            }
        });

        // 保存语言设置到本地存储
        localStorage.setItem('language', currentLang);

        // 添加切换动画效果
        document.body.style.opacity = '0.8';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 200);
    }

    // 语言切换按钮事件
    langToggle.addEventListener('click', switchLanguage);

    // 页面加载时恢复语言设置
    const savedLang = localStorage.getItem('language');
    if (savedLang && savedLang !== currentLang) {
        switchLanguage();
    }

    // 主题切换功能（保留但简化）
    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // 页面加载时恢复主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + D 切换主题
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleTheme();
        }
        // Ctrl/Cmd + L 切换语言
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            switchLanguage();
        }
    });

    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 技能标签悬停效果
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });

        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 成就卡片点击效果
    document.querySelectorAll('.achievement-card').forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // 联系链接点击统计（可选）
    document.querySelectorAll('.contact-link').forEach(link => {
        link.addEventListener('click', function() {
            const linkType = this.classList.contains('github') ? 'GitHub' :
                           this.classList.contains('zhihu') ? 'Zhihu' : 'Discussion';
            console.log(`🔗 用户点击了 ${linkType} 链接`);
        });
    });

    // 头像点击彩蛋
    const avatar = document.querySelector('.avatar-img');
    if (avatar) {
        let clickCount = 0;
        avatar.addEventListener('click', function() {
            clickCount++;
            this.style.transform = 'scale(0.9) rotate(10deg)';
            setTimeout(() => {
                this.style.transform = 'scale(1) rotate(0deg)';
            }, 200);

            if (clickCount === 5) {
                alert(currentLang === 'zh' ? '你发现了一个彩蛋！' : 'You found an easter egg!');
                clickCount = 0;
            }
        });
    }



    // 页面滚动效果
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('header');

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动，隐藏导航栏
            header.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动，显示导航栏
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // 元素进入视口动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 观察所有卡片元素
    document.querySelectorAll('.about-card, .achievement-card, .timeline-item, .skill-category').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // 图片加载错误处理
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            console.warn('图片加载失败:', this.src);
            // 可以设置默认图片或隐藏
        });
    });

    // 页面加载完成提示
    console.log('🐱 点击头像5次有彩蛋哦！');
});
