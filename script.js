// Header Scroll Effect
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for sticky header
                behavior: 'smooth'
            });
        }
    });
});

// Add a simple fade-in intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply initial styles and observe elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .section-title');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });
});

// ==========================================
// Booking Modal Logic
// ==========================================
const bookingModal = document.getElementById('booking-modal');
const openModalBtns = document.querySelectorAll('.open-booking-modal');
const closeModalBtn = document.querySelector('.close-modal-btn');
const serviceSelect = document.getElementById('b-service');
const priceEstimate = document.getElementById('price-estimate');
const estValue = document.getElementById('est-value');

// Prices mapped to service values
const prices = {
    'bridal': '$250+',
    'party': '$150+',
    'festival': '$40+'
};

// Open Modal
openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
});

// Close Modal
const closeModal = () => {
    bookingModal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore background scrolling
    
    // Optional: Reset form on close
    // document.getElementById('booking-form').reset();
    // priceEstimate.style.display = 'none';
};

closeModalBtn.addEventListener('click', closeModal);

// Close on outside click
bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
        closeModal();
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
        closeModal();
    }
});

// Dynamic Price Change
serviceSelect.addEventListener('change', (e) => {
    const selectedService = e.target.value;
    if (prices[selectedService]) {
        estValue.textContent = prices[selectedService];
        priceEstimate.style.display = 'block';
        // Add a small animation effect
        estValue.style.animation = 'none';
        estValue.offsetHeight; /* trigger reflow */
        estValue.style.animation = 'slowPulse 0.5s ease';
    } else {
        priceEstimate.style.display = 'none';
    }
});

// Handle form submission (Mock)
document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    
    btn.textContent = 'Sending Request...';
    btn.style.opacity = '0.8';
    
    // Mock API call
    setTimeout(() => {
        btn.textContent = 'Request Sent Successfully!';
        btn.style.background = '#4CAF50';
        
        // Reset and close after a delay
        setTimeout(() => {
            closeModal();
            e.target.reset();
            priceEstimate.style.display = 'none';
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.opacity = '1';
        }, 2000);
    }, 1500);
});

// ==========================================
// Stain Reveal Slider Logic
// ==========================================
const sliderContainer = document.querySelector('.slider-container');
const sliderHandle = document.getElementById('slider-handle');
const sliderFg = document.getElementById('slider-fg');

if (sliderContainer && sliderHandle && sliderFg) {
    let isDragging = false;
    
    const slide = (xPos) => {
        const bounds = sliderContainer.getBoundingClientRect();
        let pos = xPos - bounds.left;
        pos = Math.max(0, Math.min(pos, bounds.width));
        
        const percentage = (pos / bounds.width) * 100;
        
        sliderFg.style.width = `${percentage}%`;
        sliderHandle.style.left = `${percentage}%`;
    };

    // Mouse Events
    sliderHandle.addEventListener('mousedown', () => { isDragging = true; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        slide(e.pageX);
    });

    // Touch Events for Mobile
    sliderHandle.addEventListener('touchstart', () => { isDragging = true; }, {passive: true});
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        slide(e.touches[0].pageX);
    }, {passive: true});
    
    // Allow clicking anywhere to jump
    sliderContainer.addEventListener('click', (e) => {
        slide(e.pageX);
    });
    
    // Fix image sizing
    const fgImg = sliderFg.querySelector('img');
    const resizeImage = () => {
        fgImg.style.width = `${sliderContainer.offsetWidth}px`;
    };
    
    window.addEventListener('resize', resizeImage);
    resizeImage();
}

// ==========================================
// Custom Cursor & Gold Dust Animations
// ==========================================
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

if (cursorDot && cursorOutline) {
    // Check if on a mobile device where custom cursors are not needed
    if (window.matchMedia("(pointer: fine)").matches) {
        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly move the dot
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
            
            // Let the outline trail slightly via requestAnimationFrame or transition
            // Here we use absolute position updates with CSS transition fallback
            cursorOutline.style.left = `${mouseX}px`;
            cursorOutline.style.top = `${mouseY}px`;
            
            // Randomly create gold dust particles when moving
            if (Math.random() < 0.15) {
                createDustParticle(e.pageX, e.pageY);
            }
        });

        // Add hover effect to interactive elements
        const interactables = document.querySelectorAll('a, button, input, select, .slider-handle, .project-card, .gallery-item');
        
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(212, 175, 55, 0.15)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.backgroundColor = 'rgba(212, 175, 55, 0.05)';
            });
        });

        function createDustParticle(x, y) {
            const particle = document.createElement('div');
            particle.classList.add('gold-dust');
            
            const offsetX = (Math.random() - 0.5) * 40;
            const offsetY = (Math.random() - 0.5) * 40;
            
            particle.style.left = `${x + offsetX}px`;
            particle.style.top = `${y + offsetY}px`;
            
            document.body.appendChild(particle);
            
            const animation = particle.animate([
                { opacity: 0.8, transform: 'translate(0, 0) scale(1)' },
                { opacity: 0, transform: `translate(0, ${Math.random() * 50 + 20}px) scale(0)` }
            ], {
                duration: Math.random() * 1000 + 1000,
                easing: 'ease-out',
                fill: 'forwards'
            });
            
            animation.onfinish = () => {
                particle.remove();
            };
        }
    } else {
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
    }
}

// ==========================================
// FAQ Accordion Logic
// ==========================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', () => {
        // Toggle current item
        const isActive = item.classList.contains('active');
        
        // Close all others
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-answer').style.maxHeight = null;
        });
        
        // Determine whether to open current
        if (!isActive) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});
