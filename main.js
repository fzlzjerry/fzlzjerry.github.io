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