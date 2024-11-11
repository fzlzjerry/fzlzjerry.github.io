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
            articleContent.innerHTML = marked.parse(content);
        });
        articlesList.appendChild(articleItem);
    }

    function loadArticles() {
        // Implementation similar to blog.html's fetchAndDisplayArticles
    }
}

// No additional changes needed for collapsible functionality as Bootstrap handles it.