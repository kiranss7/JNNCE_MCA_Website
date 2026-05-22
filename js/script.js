// JNNCE Master of Computer Applications - Main JavaScript

document.addEventListener('DOMContentLoaded', () => {



    // 1. Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 800); // Small delay to show off the loader
    }

    // 2. Sticky Navbar & Active Link Switching
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            if (backToTopBtn) backToTopBtn.classList.add('show');
        } else {
            navbar.classList.remove('scrolled');
            if (backToTopBtn) backToTopBtn.classList.remove('show');
        }
    });

    // 4. Back to Top Button
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 5. Facilities Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    let currentLightboxIndex = 0;
    let currentLightboxItems = [];

    if (lightbox) {
        // Event delegation to support dynamically added items
        document.addEventListener('click', (e) => {
            const item = e.target.closest('.facilities-item');
            if (item) {
                currentLightboxItems = Array.from(document.querySelectorAll('.facilities-item'));
                currentLightboxIndex = currentLightboxItems.indexOf(item);
                
                const img = item.querySelector('img');
                const caption = item.querySelector('.facilities-overlay span')?.innerText || '';

                if (img) {
                    lightboxImg.src = img.src;
                    lightboxCaption.innerText = caption;
                    lightbox.classList.add('active');
                }
            }
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                lightbox.classList.remove('active');
            } else if (e.key === 'ArrowRight') {
                currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxItems.length;
                updateLightbox();
            } else if (e.key === 'ArrowLeft') {
                currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxItems.length) % currentLightboxItems.length;
                updateLightbox();
            }
        });

        function updateLightbox() {
            if (currentLightboxItems.length === 0) return;
            const item = currentLightboxItems[currentLightboxIndex];
            const img = item.querySelector('img');
            const caption = item.querySelector('.facilities-overlay span')?.innerText || '';
            if (img && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxCaption.innerText = caption;
            }
        }
    }
    // 7. Live Time Footer
    function updateLiveTime() {
        const timeElements = document.querySelectorAll('.live-time');
        const footerTimeEls = document.querySelectorAll('.live-time-footer');
        
        if (timeElements.length === 0 && footerTimeEls.length === 0) return;

        const now = new Date();
        const options = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true
        };
        const formattedTime = now.toLocaleDateString('en-US', options);

        const day = now.getDay();
        const hour = now.getHours();
        let statusText = "";

        // Open hours: Mon-Sat 9 AM - 5 PM
        if (day === 0) {
            statusText = " <span style='color: #ff6b6b; font-weight: 600;'>(Closed - Holiday)</span>";
        } else if (hour >= 9 && hour < 17) {
            statusText = " <span style='color: #4CAF50; font-weight: 600;'>(Opened)</span>";
        } else {
            statusText = " <span style='color: #ff6b6b; font-weight: 600;'>(Closed)</span>";
        }

        // Update all time elements
        timeElements.forEach(el => {
            if (el.hasAttribute('data-no-icon')) {
                el.innerHTML = formattedTime + statusText;
            } else {
                el.innerHTML = `<i class="fa-solid fa-clock"></i> ${formattedTime}${statusText}`;
            }
        });

        footerTimeEls.forEach(el => {
            el.textContent = formattedTime;
        });
    }

    setInterval(updateLiveTime, 1000);
    updateLiveTime();

    // 8. Faculty Modal Logic
    const facultyCards = document.querySelectorAll('.faculty-card');
    const facultyModal = document.getElementById('facultyModal');
    const facultyModalClose = document.querySelector('.faculty-modal-close');

    if (facultyModal && facultyCards.length > 0) {
        // Modal Elements
        const modalImg = document.getElementById('modal-img');
        const modalName = document.getElementById('modal-name');
        const modalDesignation = document.getElementById('modal-designation');
        const modalQualification = document.getElementById('modal-qualification');

        facultyCards.forEach(card => {
            if (card.classList.contains('no-modal')) return;

            // Make cards clickable
            card.style.cursor = 'pointer';

            card.addEventListener('click', () => {
                // Extract info from the card
                const img = card.querySelector('.faculty-img img').src;
                const name = card.querySelector('h3').innerText;
                const designation = card.querySelector('.faculty-designation').innerText;
                const qualification = card.querySelector('.faculty-qualification').innerText;

                // Defaults
                let aboutText = "<p>Faculty detailed information goes here. Please add a <code>&lt;div class='faculty-details' style='display:none;'&gt;</code> inside this card to specify custom details.</p>";
                let resumeSrc = "about:blank"; // Fallback for PDF iframe

                // Extract custom details if provided
                const detailsDiv = card.querySelector('.faculty-details');
                if (detailsDiv) {
                    const aboutElem = detailsDiv.querySelector('.about-text');
                    const resumeElem = detailsDiv.querySelector('.resume-link');
                    if (aboutElem) aboutText = aboutElem.innerHTML;
                    if (resumeElem) resumeSrc = resumeElem.href;
                }

                // Populate Modal
                if (modalImg) modalImg.src = img;
                if (modalName) modalName.innerText = name;
                if (modalDesignation) modalDesignation.innerText = designation;
                if (modalQualification) modalQualification.innerText = qualification;

                const modalAbout = document.getElementById('modal-about');
                const modalResume = document.getElementById('modal-resume'); // This is now an iframe

                if (modalAbout) modalAbout.innerHTML = aboutText;
                if (modalResume) {
                    const url = new URL(resumeSrc, window.location.href);
                    url.hash = 'toolbar=0';
                    modalResume.src = url.toString();
                }

                // Show Modal
                facultyModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });

        // Close Modal
        if (facultyModalClose) {
            facultyModalClose.addEventListener('click', () => {
                facultyModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close on outside click
        facultyModal.addEventListener('click', (e) => {
            if (e.target === facultyModal) {
                facultyModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // 9. Hero Slideshow
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // Change image every 5 seconds
    }


    // 11. Full-Screen PDF Viewer
    const pdfOverlay    = document.getElementById('pdfFullscreenOverlay');
    const pdfFrame      = document.getElementById('pdfFullscreenFrame');
    const pdfTitle      = document.getElementById('pdfFullscreenTitle');
    const pdfCloseBtn   = document.getElementById('pdfFullscreenClose');
    const pdfDownload   = document.getElementById('pdfFullscreenDownload');
    const pdfExpandBtn  = document.getElementById('pdfExpandBtn');

    function openPdfFullscreen(src, name) {
        if (!pdfOverlay || !pdfFrame) return;
        pdfFrame.src = src;
        if (pdfTitle)    pdfTitle.textContent = name || 'Resume / CV';

        pdfOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePdfFullscreen() {
        if (!pdfOverlay) return;
        pdfOverlay.classList.remove('active');
        
        // Only re-enable scrolling if the faculty modal is also not active
        const facultyModal = document.getElementById('facultyModal');
        if (!facultyModal || !facultyModal.classList.contains('active')) {
            document.body.style.overflow = '';
        }
        
        // Small delay before clearing src to avoid flash
        setTimeout(() => { if (pdfFrame) pdfFrame.src = 'about:blank'; }, 300);
    }

    if (pdfExpandBtn) {
        pdfExpandBtn.addEventListener('click', () => {
            const modalResume = document.getElementById('modal-resume');
            const modalName   = document.getElementById('modal-name');
            if (modalResume && modalResume.src && modalResume.src !== 'about:blank') {
                openPdfFullscreen(modalResume.src, (modalName ? modalName.innerText + ' — Resume' : 'Resume'));
            }
        });
    }

    if (pdfCloseBtn) {
        pdfCloseBtn.addEventListener('click', closePdfFullscreen);
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pdfOverlay && pdfOverlay.classList.contains('active')) {
            closePdfFullscreen();
        }
    });

    // 12. Global Collapsible/Dropdown Logic
    const toggleHeaders = document.querySelectorAll('.toggle-header');
    toggleHeaders.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');
            const targetId = this.getAttribute('data-target');
            const content = document.getElementById(targetId);
            if (content) {
                content.classList.toggle('expanded');
                
                // Smooth scroll if expanding
                if (this.classList.contains('active')) {
                    setTimeout(() => {
                        this.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
            }
        });
    });

    // 13. Contact Form Submission Prevent
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span>Sent Successfully!</span> <i class="fa-solid fa-check"></i>';
            btn.style.backgroundColor = '#10b981';
            
            setTimeout(() => {
                contactForm.reset();
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
            }, 3000);
        });
    }

});
