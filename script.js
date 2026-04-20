// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initNavigation();
    initScrollAnimations();
    initSubtitleRotation();
    initScrollProgress();
    initGalleryModal();
});

/* =========================================
   Three.js Background Animation
========================================= */
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Particles/Stars
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x0bf4c8, // Primary color
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Rotate entire particle system slowly
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.02;

        // Smoothly move towards mouse position
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

        renderer.render(scene, camera);
    }
    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* =========================================
   Navigation & Mobile Menu
========================================= */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    // Scroll Effect for Navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Scrollspy for active links
    const sections = document.querySelectorAll('.section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* =========================================
   Scroll Reveal Animations
========================================= */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Optional: stop observing once shown
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.scroll-animate');
    animateElements.forEach(el => observer.observe(el));
}

/* =========================================
   Hero Subtitle Rotation
========================================= */
function initSubtitleRotation() {
    const subtitles = document.querySelectorAll('.subtitle');
    if (subtitles.length === 0) return;

    let currentIndex = 0;

    setInterval(() => {
        subtitles[currentIndex].classList.remove('active');
        
        currentIndex = (currentIndex + 1) % subtitles.length;
        
        subtitles[currentIndex].classList.add('active');
    }, 3000); // Change text every 3 seconds
}


/* =========================================
   Scroll Progress & Back to Top Logic
 ========================================= */
function initScrollProgress() {
    const progressLine = document.querySelector('.scroll-progress');
    const backToTop = document.getElementById('back-to-top');
    
    if (!progressLine && !backToTop) return;

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        // Progress Bar
        if (progressLine) {
            const scrolled = (winScroll / height) * 100;
            progressLine.style.width = scrolled + "%";
        }

        // Back to Top Visibility
        if (backToTop) {
            if (winScroll > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
    });

    // Scroll to top on click
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/* =========================================
   Gallery Modal Logic
 ========================================= */
function initGalleryModal() {
    const modal = document.getElementById('accessModal');
    const openBtn = document.getElementById('requestAccessBtn');
    const closeBtn = document.querySelector('.close-modal');
    
    // Passcode System Elements
    const unlockBtn = document.getElementById('unlockBtn');
    const passcodeInput = document.getElementById('passcodeInput');
    const passcodeError = document.getElementById('passcodeError');
    const lockedMsg = document.getElementById('galleryLockedMsg');
    const actualGallery = document.getElementById('actualGallery');
    
    // Default secret passcode to unlock images 
    const SECRET_PASSCODE = 'BISHAL2026';

    if (unlockBtn && passcodeInput) {
        unlockBtn.addEventListener('click', () => {
            if (passcodeInput.value.trim().toUpperCase() === SECRET_PASSCODE) {
                // Passcode Successful!
                passcodeError.style.display = 'none';
                
                // Hide lock UI
                lockedMsg.style.display = 'none';
                
                // Unblur images
                actualGallery.classList.add('unlocked');
                const images = actualGallery.querySelectorAll('.gallery-img');
                images.forEach(img => img.classList.remove('blur-img'));
                
            } else {
                // Passcode Failed
                passcodeError.style.display = 'block';
                passcodeInput.value = '';
                
                // Shake animation for error
                passcodeInput.parentElement.animate([
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-10px)' },
                    { transform: 'translateX(10px)' },
                    { transform: 'translateX(-10px)' },
                    { transform: 'translateX(10px)' },
                    { transform: 'translateX(0)' }
                ], { duration: 400 });
            }
        });
        
        // Allow pressing Enter in passcode input
        passcodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') unlockBtn.click();
        });
    }

    if (!modal || !openBtn || !closeBtn) return;

    // Open modal
    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent background scrolling
    });

    // Close modal via button
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close modal when clicking outside form
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}
