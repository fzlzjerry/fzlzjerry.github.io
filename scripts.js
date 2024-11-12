// Check if running in a browser environment
if (typeof window !== 'undefined') {
    // Initialize AOS with unified settings
    AOS.init({
        duration: 1000, // Animation duration in milliseconds
        easing: 'ease-in-out', // Easing function
        once: false, // Allow animations to repeat on scroll
        mirror: false, // Disable mirror effect
    });

    // Scroll to Top Button
    var scrollTopBtn = document.getElementById("scrollTop");
    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
        if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
            scrollTopBtn.style.display = "block"; 
        } else {
            scrollTopBtn.style.display = "none";
        }
    }

    function topFunction() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Initialize Typed.js
    var typed = new Typed('#typed', {
        strings: [
            "A passionate teenage open-source developer from China",
            "A Python enthusiast",
            "An AI and Machine Learning lover"
        ],
        typeSpeed: 50,
        backSpeed: 25,
        loop: true,
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Function to animate a single progress bar
    function animateProgressBar(bar) {
        const targetWidth = bar.getAttribute('data-width');
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = targetWidth + '%';
        }, 100); // Slight delay to ensure transition
    }

    // Function to reset a single progress bar
    function resetProgressBar(bar) {
        bar.style.transition = 'none';
        bar.style.width = '0%';
        // Force reflow to apply the change immediately
        void bar.offsetWidth;
        bar.style.transition = 'width 2s ease';
    }

    // Select all progress bars
    const progressBars = document.querySelectorAll('.progress-bar');

    // Create an IntersectionObserver for each progress bar
    const observerOptions = {
        threshold: 0.5
    };

    const progressBarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBar(entry.target);
            } else {
                resetProgressBar(entry.target);
            }
        });
    }, observerOptions);

    // Observe each progress bar
    progressBars.forEach(bar => {
        progressBarObserver.observe(bar);
    });

    // Blog Page Scripts
    if (window.location.pathname.endsWith('/blog.html')) {
        // Handle Markdown uploads and rendering
        const uploadForm = document.getElementById('uploadForm');
        const articlesList = document.getElementById('articlesList');
        const articleContent = document.getElementById('articleContent');

        /*
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fileInput = document.getElementById('markdownFile');
            const file = fileInput.files[0];
            if (file && file.name.endsWith('.md')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const content = e.target.result;
                    addArticle(file.name, content);
                };
                reader.readAsText(file);
            } else {
                alert('Please upload a valid Markdown (.md) file.');
            }
        });
        */

        function addArticle(title, content) {
            const articleItem = document.createElement('a');
            articleItem.href = "#";
            articleItem.className = "list-group-item list-group-item-action";
            articleItem.textContent = title;
            articleItem.addEventListener('click', function(e) {
                e.preventDefault();
                displayArticle(title, content);
            });
            articlesList.appendChild(articleItem);
        }

        // Custom marker: handle mathematical formulas
        const mathExtension = {
            name: 'math',
            level: 'inline', // Level: inline or block
            start(src) {
                const match = src.match(/(\${1,2})/);
                return match ? match.index : -1;
            },
            tokenizer(src, tokens) {
                const match = src.match(/^(\${1,2})([^$]+?)\1/);
                if (match) {
                    return {
                        type: 'math',
                        raw: match[0],
                        text: match[2],
                        displayMode: match[1] === '$$'
                    };
                }
                return;
            },
            renderer(token) {
                if (token.displayMode) {
                    // Display mode formula
                    return `$$${token.text}$$`;
                } else {
                    // Inline formula
                    return `$${token.text}$`;
                }
            }
        };

        // Use custom marker
        marked.use({ extensions: [mathExtension] });

        // Modify displayArticle function
        function displayArticle(title, content) {
            // Use marked.js to parse content
            const htmlContent = marked.parse(content);

            // Insert content into the page
            document.getElementById('articleContent').innerHTML = htmlContent;

            // Reinitialize Highlight.js
            document.querySelectorAll('#articleContent pre code').forEach((block) => {
                hljs.highlightElement(block);
            });

            // Initialize MathJax
            if (typeof MathJax !== 'undefined') {
                MathJax.typesetPromise();
            }

            // Refresh Tocbot
            tocbot.refresh();
        }

        function loadArticles() {
            // Implementation similar to blog.html's fetchAndDisplayArticles
        }

        // Object containing all markdown articles
        const articlesContent = {
            'Hello World': `
# Hello World

Welcome to my blog! This is my first post.

<!-- ...rest of the content... -->
`,
            'Machine Learning Solution for Global Multi-Port Commodities Flow Problem': `
# Machine Learning Solution for Global Multi-Port Commodities Flow Problem

In this article, we explore solutions to optimize global commodity flows.

<!-- ...rest of the content... -->
`,
            // Add more articles here
        };

        // Updated list of articles
        const articles = [
            { title: 'Hello World', content: articlesContent['Hello World'] },
            { title: 'Machine Learning Solution for Global Multi-Port Commodities Flow Problem', content: articlesContent['Machine Learning Solution for Global Multi-Port Commodities Flow Problem'] },
            // Add more articles here
        ];

        // Modify fetchAndDisplayArticles function
        function fetchAndDisplayArticles() {
            const articlesList = document.getElementById('articlesList');
            articles.forEach(article => {
                const articleItem = document.createElement('a');
                articleItem.href = "#";
                articleItem.className = "list-group-item list-group-item-action";
                articleItem.textContent = article.title;
                articleItem.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.getElementById('articleContent').innerHTML = marked.parse(article.content);
                    // Initialize Highlight.js
                    document.querySelectorAll('pre code').forEach((block) => {
                        hljs.highlightElement(block);
                    });
                    // Initialize MathJax
                    if (typeof MathJax !== 'undefined') {
                        MathJax.typesetPromise();
                    }
                    // Refresh Tocbot if necessary
                    if (window.tocbot) {
                        tocbot.refresh();
                    }
                });
                articlesList.appendChild(articleItem);
            });
        }

        // Initialize articles on page load
        document.addEventListener('DOMContentLoaded', fetchAndDisplayArticles);
    }

    // Update Highlight.js initialization
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize Highlight.js
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    });

    const carouselElement = document.getElementById('testimonialCarousel');
    const carousel = new bootstrap.Carousel(carouselElement, {
        interval: 3000,
        wrap: true,
        touch: true,
    });

    // Add a timer variable to manage the pause duration
    let carouselResumeTimer;

    // Modify the wheel event listener
    carouselElement.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (e.deltaY < 0) {
            carousel.prev();
        } else {
            carousel.next();
        }
        carousel.pause(); // Pause carousel after manual switch

        // Clear any existing timer to prevent multiple timers
        if (carouselResumeTimer) {
            clearTimeout(carouselResumeTimer);
        }

        // Set a new timer to resume carousel cycling after 10 seconds
        carouselResumeTimer = setTimeout(() => {
            carousel.cycle(); // Resume auto-sliding
        }, 10000); // 10000 milliseconds = 10 seconds
    });
}

// Removed Node.js-specific code for updating RSS XML
// const fs = require('fs');
// const path = require('path');

/**
 * Update RSS feed
 * This function needs to be executed on the server side, such as using Node.js
 */
// function updateRSS() {
//     const rssPath = path.join(__dirname, 'rss.xml');
//     // ...rest of the function...
// }

// // If called from the command line, execute the update
// if (require.main === module) {
//     const args = process.argv.slice(2);
//     if (args.includes('update-rss')) {
//         updateRSS();
//     }
// }

// module.exports = { updateRSS };