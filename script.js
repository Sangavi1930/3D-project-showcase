document.addEventListener('DOMContentLoaded', () => {
    const product3D = document.querySelector('.product-3d');
    const controlBtns = document.querySelectorAll('.control-btn');
    let currentRotation = 0;
    let isAnimating = false;
    let rafId = null;

    // Optimize rotation function with requestAnimationFrame
    function rotateProduct(direction) {
        if (isAnimating) return;
        isAnimating = true;

        const rotationAmount = direction === 'left' ? -90 : 90;
        currentRotation += rotationAmount;

        if (rafId) {
            cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame(() => {
            product3D.style.transform = `rotateY(${currentRotation}deg)`;
        });

        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    // Optimize event listeners with passive option
    controlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const direction = btn.dataset.direction;
            rotateProduct(direction);
        }, { passive: true });
    });

    // Optimize drag functionality
    let isDragging = false;
    let startX;
    let currentX;
    let lastX;

    const handleDrag = (clientX) => {
        if (!isDragging) return;

        currentX = clientX;
        const diff = currentX - startX;
        const rotation = currentRotation + (diff * 0.5);

        if (rafId) {
            cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame(() => {
            product3D.style.transform = `rotateY(${rotation}deg)`;
        });
    };

    // Optimize mouse events
    product3D.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        lastX = e.clientX;
        product3D.style.cursor = 'grabbing';
    }, { passive: true });

    document.addEventListener('mousemove', (e) => {
        handleDrag(e.clientX);
    }, { passive: true });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        
        isDragging = false;
        product3D.style.cursor = 'grab';
        
        const snapRotation = Math.round(currentRotation / 90) * 90;
        currentRotation = snapRotation;
        
        if (rafId) {
            cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame(() => {
            product3D.style.transform = `rotateY(${currentRotation}deg)`;
        });
    }, { passive: true });

    // Optimize touch events
    product3D.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        lastX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        handleDrag(e.touches[0].clientX);
    }, { passive: true });

    document.addEventListener('touchend', () => {
        if (!isDragging) return;
        
        isDragging = false;
        
        const snapRotation = Math.round(currentRotation / 90) * 90;
        currentRotation = snapRotation;
        
        if (rafId) {
            cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame(() => {
            product3D.style.transform = `rotateY(${currentRotation}deg)`;
        });
    }, { passive: true });

    // Optimize scroll handling
    const scrollOptions = {
        behavior: 'smooth',
        block: 'start'
    };

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView(scrollOptions);
            }
        }, { passive: true });
    });

    // Optimize intersection observer
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '50px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translate3d(0, 0, 0)';
                });
            }
        });
    }, observerOptions);

    // Optimize feature animations
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        feature.style.opacity = '0';
        feature.style.transform = 'translate3d(0, 20px, 0)';
        feature.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(feature);
    });

    // Cleanup
    window.addEventListener('unload', () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
        observer.disconnect();
    });
}); 