// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initNavigation();
    initScrollAnimations();
    initSubtitleRotation();
    initScrollProgress();
    initGalleryModal();
    initCVGift();
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
/* =========================================
   CV Download Gift PDF
 ========================================= */
/* =========================================
   Premium CV Download Experience
 ========================================= */
function initCVGift() {
    const downloadBtns = document.querySelectorAll('a[href="assets/resume.pdf"]');
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Check if we should override (we do for the premium experience)
            e.preventDefault();
            generatePremiumCV();
        });
    });

    async function generatePremiumCV() {
        const element = document.getElementById('premium-cv-template');
        if (!element) return;

        // Show a loading state or toast if needed
        const originalText = "Generating Your Gift...";
        
        // Configuration for html2pdf
        const opt = {
            margin:       0,
            filename:     'Bishal_Khadka_Premium_CV.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#050505' },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: 'css', before: '.cv-main' }
        };

        // Make the template visible briefly for the capture
        element.style.display = 'block';

        try {
            // Generate the PDF
            await html2pdf().set(opt).from(element).save();
            
            // Hide it again
            element.style.display = 'none';
            
            // Optional: Show success notification
        } catch (error) {
            console.error("PDF Generation failed:", error);
            element.style.display = 'none';
            // Fallback: try direct download if file exists
            window.location.href = 'assets/resume.pdf';
        }
    }
}
/* =========================================
   Gallery Logic
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
    
    // Lightbox Elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    
    const SECRET_PASSCODE = "981470";

    // Debug help - to be removed after confirmation
    console.log("Gallery system ready. Target code length:", SECRET_PASSCODE.length);

    // Check for existing access
    if (localStorage.getItem('galleryAccess') === 'true') {
        unlockGallery(true);
    }

    function unlockGallery(immediate = false) {
        if (immediate) {
            if (lockedMsg) lockedMsg.style.display = 'none';
            if (actualGallery) {
                actualGallery.classList.add('unlocked');
                const images = actualGallery.querySelectorAll('.gallery-img');
                images.forEach(img => img.classList.remove('blur-img'));
            }
            return;
        }

        // Animated unlock
        if (typeof gsap !== 'undefined') {
            gsap.to(lockedMsg, {
                opacity: 0,
                y: -50,
                duration: 0.8,
                onComplete: () => {
                    lockedMsg.style.display = 'none';
                    actualGallery.classList.add('unlocked');
                    const images = actualGallery.querySelectorAll('.gallery-img');
                    images.forEach((img, i) => {
                        gsap.to(img, { filter: 'blur(0px)', opacity: 1, duration: 1, delay: i * 0.1 });
                        img.classList.remove('blur-img');
                    });
                }
            });
        } else {
            lockedMsg.style.display = 'none';
            actualGallery.classList.add('unlocked');
            actualGallery.querySelectorAll('.gallery-img').forEach(img => img.classList.remove('blur-img'));
        }
        localStorage.setItem('galleryAccess', 'true');
    }

    if (unlockBtn && passcodeInput) {
        const handleUnlock = () => {
            const entered = passcodeInput.value.trim();
            
            // Log entry for debugging if it's failing
            console.log("Attempting unlock with code:", entered);

            if (entered === SECRET_PASSCODE) {
                console.log("Passcode correct! Unlocking...");
                passcodeError.style.display = 'none';
                unlockGallery();
            } else {
                console.warn("Incorrect passcode entered:", entered);
                passcodeError.style.display = 'block';
                passcodeError.textContent = "Incorrect passcode. Please try again.";
                passcodeInput.value = '';
                
                // Shake
                if (typeof gsap !== 'undefined') {
                    gsap.to(passcodeInput.parentElement, { x: 10, repeat: 5, yoyo: true, duration: 0.05 });
                }
            }
        };

        unlockBtn.addEventListener('click', handleUnlock);
        passcodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUnlock();
        });
    }

    // Lightbox Logic
    if (actualGallery) {
        actualGallery.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-img') && !e.target.classList.contains('blur-img')) {
                lightboxImg.src = e.target.src;
                lightboxCaption.textContent = e.target.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            if (modal) modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Modal Logic
    if (!modal || !openBtn || !closeBtn) return;

    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}
