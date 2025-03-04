// Smooth scrolling for navigation links
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

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll Down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll Up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to your server
        console.log('Form submitted:', data);
        
        // Show success message
        alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
        this.reset();
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-out');
    observer.observe(section);
});

// Add CSS for fade animations
const style = document.createElement('style');
style.textContent = `
    .fade-out {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .fade-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .header {
        transition: transform 0.3s ease;
    }
    
    .header.scroll-down {
        transform: translateY(-100%);
    }
    
    .header.scroll-up {
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Tech Slider Functionality
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.tech-slider');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    const sliderDots = document.querySelector('.slider-dots');
    
    if (!slider || !prevArrow || !nextArrow || !sliderDots) return;
    
    const items = slider.querySelectorAll('.tech-card');
    const totalItems = items.length;
    let currentIndex = 0;
    
    // Calculate how many items are visible based on screen width
    function getVisibleItems() {
        if (window.innerWidth >= 1200) {
            return 4; // Show 4 items on large screens
        } else if (window.innerWidth >= 992) {
            return 3; // Show 3 items on medium screens
        } else if (window.innerWidth >= 768) {
            return 2; // Show 2 items on small screens
        } else {
            return 1; // Show 1 item on mobile
        }
    }
    
    // Calculate total number of possible positions
    function getTotalPositions() {
        const visibleItems = getVisibleItems();
        return Math.max(0, totalItems - visibleItems);
    }
    
    // Create dots based on total positions
    function createDots() {
        // Clear existing dots
        sliderDots.innerHTML = '';
        
        const totalPositions = getTotalPositions() + 1;
        
        for (let i = 0; i < totalPositions; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToPosition(i);
            });
            sliderDots.appendChild(dot);
        }
    }
    
    // Update dots
    function updateDots() {
        const dots = sliderDots.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Go to position
    function goToPosition(index) {
        const totalPositions = getTotalPositions();
        currentIndex = Math.max(0, Math.min(index, totalPositions));
        
        const itemWidth = items[0].offsetWidth + 20; // Including gap
        const offset = -currentIndex * itemWidth;
        slider.style.transform = `translateX(${offset}px)`;
        
        updateDots();
        updateArrows();
    }
    
    // Update arrows state
    function updateArrows() {
        const totalPositions = getTotalPositions();
        
        prevArrow.disabled = currentIndex === 0;
        nextArrow.disabled = currentIndex >= totalPositions;
        
        prevArrow.style.opacity = prevArrow.disabled ? '0.5' : '1';
        nextArrow.style.opacity = nextArrow.disabled ? '0.5' : '1';
    }
    
    // Previous slide
    prevArrow.addEventListener('click', () => {
        if (currentIndex > 0) {
            goToPosition(currentIndex - 1);
        }
    });
    
    // Next slide
    nextArrow.addEventListener('click', () => {
        const totalPositions = getTotalPositions();
        if (currentIndex < totalPositions) {
            goToPosition(currentIndex + 1);
        }
    });
    
    // Initialize
    createDots();
    goToPosition(0);
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            createDots();
            goToPosition(Math.min(currentIndex, getTotalPositions()));
        }, 200);
    });
}); 