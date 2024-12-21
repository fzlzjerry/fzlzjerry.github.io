/* 确保这个文件被放在正确的目录下 */
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.fade-in');
    const footer = document.querySelector('footer');
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>Back to Top';
    backToTopButton.setAttribute('aria-label', 'Back to Top');
    document.body.appendChild(backToTopButton);

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        const triggerHeight = window.innerHeight / 1.2;

        sections.forEach(section => {
            const top = section.getBoundingClientRect().top;

            if (top < triggerHeight) {
                section.classList.add('visible');
            }
        });

        const footerTop = footer.getBoundingClientRect().top;

        if (footerTop < triggerHeight) {
            footer.classList.add('visible');
        }

        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    const initialCheck = () => {
        const triggerHeight = window.innerHeight / 1.2;

        sections.forEach(section => {
            const top = section.getBoundingClientRect().top;

            if (top < triggerHeight) {
                section.classList.add('visible');
            }
        });

        const footerTop = footer.getBoundingClientRect().top;

        if (footerTop < triggerHeight) {
            footer.classList.add('visible');
        }
    };

    initialCheck();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.transitionDelay = `${entry.target.dataset.delay || 0}ms`;
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    sections.forEach((section, index) => {
        section.dataset.delay = index * 200;
        observer.observe(section);
    });

    // Smooth scroll for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 简化鼠标移动视差效果
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const moveX = (e.clientX - rect.left - rect.width/2) * 0.005;
                const moveY = (e.clientY - rect.top - rect.height/2) * 0.005;
                section.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    });

    // 添加防抖
    document.addEventListener('mouseleave', () => {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.transform = 'translate(0, 0)';
            section.style.transition = 'transform 0.3s ease-out';
        });
    });

    // 优化点击动画
    document.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', function() {
            this.style.animation = 'none';
            this.offsetHeight; // 触发重绘
            this.style.animation = 'pulse 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // 添加鼠标悬停效果
    document.querySelectorAll('section').forEach(section => {
        section.addEventListener('mousemove', (e) => {
            const rect = section.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            section.style.background = `
                radial-gradient(
                    circle at ${x}px ${y}px,
                    rgba(255,255,255,0.1) 0%,
                    transparent 50%
                ),
                var(--section-bg)
            `;
        });

        section.addEventListener('mouseleave', () => {
            section.style.background = 'var(--section-bg)';
        });
    });

    // 为图标添加悬浮动画
    document.querySelectorAll('i').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.classList.add('animate__animated', 'animate__rubberBand');
        });
        
        icon.addEventListener('animationend', function() {
            this.classList.remove('animate__animated', 'animate__rubberBand');
        });
    });

    // 移除图标的动画效果
    document.querySelectorAll('i').forEach(icon => {
        icon.classList.remove('animate__animated', 'animate__rubberBand', 'animate__swing', 'animate__pulse', 'animate__infinite');
    });

    // 简化鼠标悬停效果
    document.querySelectorAll('section').forEach(section => {
        section.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        section.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // 移除原有的鼠标移动视差效果
    document.removeEventListener('mousemove', () => {});

    // 优化滚动动画
    const smoothScroll = (target, duration) => {
        const targetPosition = target.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    };

    // 优化滚动触发
    const scrollTrigger = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 添加延迟，错开动画触发时间
                setTimeout(() => {
                    entry.target.style.animation = 'fadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards';
                }, index * 100); // 每个元素错开100ms
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '20px'
    });

    document.querySelectorAll('section, li').forEach(el => {
        scrollTrigger.observe(el);
    });

    // 优化列表项颜色过渡
    document.querySelectorAll('li').forEach(li => {
        li.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transition = 'color 0.3s ease, transform 0.3s ease';
            }
        });
        
        li.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transition = 'color 0.3s ease, transform 0.3s ease';
            }
        });
    });

    // 添加渐变背景过渡
    document.querySelectorAll('section').forEach(section => {
        section.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // 添加鼠标跟随效果
    const cursor = document.createElement('div');
    cursor.className = 'cursor-effect';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    });

    // 增强hover效果
    document.querySelectorAll('section, li').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.opacity = '0.5';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.opacity = '1';
        });
    });

    // 移除复杂的视差滚动，改为简单的淡入效果
    const simpleScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'var(--transition-smooth)';
        simpleScrollObserver.observe(section);
    });

    // 添加鼠标轨迹效果
    const createTrail = () => {
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 500);
        return trail;
    };

    let lastX = 0;
    let lastY = 0;
    
    document.addEventListener('mousemove', (e) => {
        if (Math.abs(e.clientX - lastX) + Math.abs(e.clientY - lastY) > 20) {
            const trail = createTrail();
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });

    // 添加元素进入视图时的高级动画
    const advancedObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.index * 100;
                
                element.style.animation = `
                    fadeInUp 0.6s ${delay}ms cubic-bezier(0.22, 1, 0.36, 1) forwards,
                    float 4s ${delay + 600}ms ease-in-out infinite
                `;
            }
        });
    }, {
        threshold: 0.2
    });

    document.querySelectorAll('section, li').forEach((el, index) => {
        el.dataset.index = index;
        advancedObserver.observe(el);
    });

    // 添加按钮点击波纹效果
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size/2;
            const y = e.clientY - rect.top - size/2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // 优化翻转卡片动画
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            this.classList.remove('hover');
        });
    });
});