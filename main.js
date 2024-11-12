// ...existing code...

function loadBlogPost(postName) {
    fetch(`/assets/md/${postName}.md`)
        .then(response => response.text())
        .then(markdown => {
            const content = marked.parse(markdown);
            document.getElementById('blog-post').innerHTML = content;
            // Initialize Highlight.js
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block);
            });
            // Initialize line numbers
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.lineNumbersBlock(block);
            });
            // Initialize MathJax
            if (typeof MathJax !== 'undefined') {
                MathJax.typesetPromise();
            }
            // Refresh Tocbot
            tocbot.refresh();
        })
        .catch(error => {
            console.error('Error loading markdown file:', error);
        });
}

// ...existing code...

// Initialize AOS
AOS.init({
    duration: 1000, // Animation duration in milliseconds
    easing: 'ease-in-out', // Easing function
    once: false, // Allow animations to repeat on scroll
    mirror: false, // Disable mirror effect
});

// Scroll to Top Button functionality
var scrollTopBtn = document.getElementById("scrollTop");

window.onscroll = function() {
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        scrollTopBtn.style.display = "block";
    } else {
        scrollTopBtn.style.display = "none";
    }
}

function topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Remove any AOS.init if present
// <!-- 
/*
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: false,
    mirror: false,
});
*/
// -->