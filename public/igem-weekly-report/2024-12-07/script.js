document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.fade-in');
    const footer = document.querySelector('footer');
    const backToTopButton = document.createElement('button');
    backToTopButton.textContent = '⬆ 返回顶部';
    backToTopButton.style.display = 'none';
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
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
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

    // 优化鼠标移动视差效果
    let rafId = null;
    document.addEventListener('mousemove', (e) => {
        if (rafId) {
            cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame(() => {
            const sections = document.querySelectorAll('section');
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // 减小移动系数
                const moveX = (mouseX - centerX) * 0.003;
                const moveY = (mouseY - centerY) * 0.003;

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
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards';
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
});