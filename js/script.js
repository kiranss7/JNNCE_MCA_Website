// JNNCE Master of Computer Applications - Main JavaScript

document.addEventListener('DOMContentLoaded', () => {

    // ── Shell iframe detection ──────────────────────────────────────────────
    // When this page is loaded inside shell.html's iframe, hide the page-level
    // music button (the shell's button handles everything) and silence this
    // page's own audio element so there is no conflict or double-playback.
    if (window.self !== window.top) {
        const pageBtn   = document.getElementById('musicToggleBtn');
        const pageAudio = document.getElementById('bgMusic');
        if (pageBtn)   pageBtn.style.display = 'none';
        if (pageAudio) { pageAudio.pause(); pageAudio.removeAttribute('src'); pageAudio.load(); }
    }
    // ───────────────────────────────────────────────────────────────────────


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
                const caption = item.querySelector('.facilities-overlay span').innerText;

                lightboxImg.src = img.src;
                lightboxCaption.innerText = caption;
                lightbox.classList.add('active');
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
            const caption = item.querySelector('.facilities-overlay span').innerText;
            lightboxImg.src = img.src;
            lightboxCaption.innerText = caption;
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
                if (modalResume) modalResume.src = resumeSrc;

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

    // 10. Background Music Player
    const musicBtn  = document.getElementById('musicToggleBtn');
    let bgMusic     = document.getElementById('bgMusic');

    // If not in shell and no audio element exists, create one
    if (window.self === window.top && !bgMusic && musicBtn) {
        bgMusic = document.createElement('audio');
        bgMusic.id = 'bgMusic';
        bgMusic.src = 'music.mpeg';
        bgMusic.preload = 'auto';
        bgMusic.loop = true;
        document.body.appendChild(bgMusic);
    }

    if (musicBtn && bgMusic) {
        // Restore play state across page navigations
        const wasPlaying = sessionStorage.getItem('bgMusicPlaying') === 'true';
        const savedTime  = parseFloat(sessionStorage.getItem('bgMusicTime') || '0');

        bgMusic.loop   = true;
        bgMusic.volume = 0.45;

        // Seek to saved position before playing
        bgMusic.addEventListener('canplay', () => {
            if (savedTime > 0) bgMusic.currentTime = savedTime;
        }, { once: true });

        function setPlayingState(playing) {
            if (playing) {
                bgMusic.play().catch(() => {}); // handle autoplay policy gracefully
                musicBtn.classList.add('playing');
                musicBtn.innerHTML = '<i class="fa-solid fa-pause music-icon"></i>';
                musicBtn.setAttribute('data-tooltip', 'Pause Music');
                sessionStorage.setItem('bgMusicPlaying', 'true');
            } else {
                bgMusic.pause();
                musicBtn.classList.remove('playing');
                musicBtn.innerHTML = '<i class="fa-solid fa-music music-icon"></i>';
                musicBtn.setAttribute('data-tooltip', 'Play Music');
                sessionStorage.setItem('bgMusicPlaying', 'false');
            }
        }

        // Initialise to saved state
        setPlayingState(wasPlaying);

        // Toggle on button click
        musicBtn.addEventListener('click', () => {
            setPlayingState(bgMusic.paused);
        });

        // Save playback position periodically so it survives navigation
        setInterval(() => {
            if (!bgMusic.paused) {
                sessionStorage.setItem('bgMusicTime', bgMusic.currentTime.toString());
            }
        }, 1000);
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
        if (pdfDownload) { pdfDownload.href = src; pdfDownload.download = name || 'resume.pdf'; }
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

});
