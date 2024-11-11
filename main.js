// ...existing code...

function loadBlogPost(postName) {
    fetch(`/assets/md/${postName}.md`)
        .then(response => response.text())
        .then(markdown => {
            // Function to render markdown content
            renderMarkdown(markdown);
        })
        .catch(error => {
            console.error('Error loading markdown file:', error);
        });
}

// Ensure renderMarkdown function exists
function renderMarkdown(markdown) {
    const blogPost = document.getElementById('blog-post');
    blogPost.innerHTML = marked.parse(markdown);
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