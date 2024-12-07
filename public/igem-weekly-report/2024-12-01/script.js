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
});