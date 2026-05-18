/* ================================================================
   LUMIÈRE — Interactive Logic
   Features: Ambient Canvas, Cursor Glow, Parallax Hero,
             Scroll Reveal, Animated Counters, Property Filter,
             3D Card Tilt, Contact Form + Toast
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initAmbientCanvas();
    initCursorGlow();
    initNavbar();
    initMobileMenu();
    initHeroParallax();
    initScrollReveal();
    initCounters();
    initPropertyFilter();
    initPropertyTilt();
    initContactForm();
});


/* ================================================================
   1. AMBIENT CANVAS — Slow rising gold dust particles
   ================================================================ */

function initAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const particles = Array.from({ length: 40 }, () => createParticle(canvas));

    function createParticle(canvas, fromBottom = false) {
        return {
            x:       Math.random() * canvas.width,
            y:       fromBottom ? canvas.height + 10 : Math.random() * canvas.height,
            size:    Math.random() * 1.6 + 0.4,
            vx:      (Math.random() - 0.5) * 0.25,
            vy:      -(Math.random() * 0.35 + 0.08),
            opacity: Math.random() * 0.45 + 0.05,
            drift:   Math.random() * Math.PI * 2,
            driftSpeed: Math.random() * 0.008 + 0.003,
        };
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.drift += p.driftSpeed;
            p.x += p.vx + Math.sin(p.drift) * 0.15;
            p.y += p.vy;
            p.opacity += (Math.random() - 0.5) * 0.012;
            p.opacity = Math.max(0.03, Math.min(0.55, p.opacity));

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201, 148, 58, ${p.opacity})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = `rgba(201, 148, 58, ${p.opacity * 0.5})`;
            ctx.fill();
            ctx.shadowBlur = 0;

            if (p.y < -10) {
                particles[i] = createParticle(canvas, true);
            }
        });

        requestAnimationFrame(draw);
    }

    draw();
}


/* ================================================================
   2. CURSOR GLOW
   ================================================================ */

function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    let cx = 0, cy = 0;
    let tx = 0, ty = 0;

    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });

    // Smooth lagging follow
    (function animate() {
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;
        glow.style.left = `${cx}px`;
        glow.style.top  = `${cy}px`;
        requestAnimationFrame(animate);
    })();

    // Expand on interactive elements
    document.querySelectorAll('a, button, .property-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            glow.style.width  = '650px';
            glow.style.height = '650px';
        });
        el.addEventListener('mouseleave', () => {
            glow.style.width  = '480px';
            glow.style.height = '480px';
        });
    });
}


/* ================================================================
   3. NAVBAR — Scroll opacity
   ================================================================ */

function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
}


/* ================================================================
   4. MOBILE MENU
   ================================================================ */

function initMobileMenu() {
    const toggle  = document.getElementById('mobile-toggle');
    const nav     = document.getElementById('mobile-nav');
    const overlay = document.getElementById('mobile-overlay');
    const bars    = toggle.querySelectorAll('span');

    const close = () => {
        nav.classList.remove('open');
        overlay.classList.remove('open');
        bars[0].style.transform = 'none';
        bars[1].style.opacity   = '1';
        bars[2].style.transform = 'none';
    };

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        overlay.classList.toggle('open', isOpen);
        if (isOpen) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity   = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            close();
        }
    });

    overlay.addEventListener('click', close);
    nav.querySelectorAll('.mobile-link, .mobile-cta').forEach(l => l.addEventListener('click', close));
}


/* ================================================================
   5. HERO PARALLAX — Architectural scene drifts slowly on scroll
   ================================================================ */

function initHeroParallax() {
    const backdrop = document.getElementById('hero-backdrop');
    if (!backdrop) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            backdrop.style.transform = `translateY(${scrolled * 0.28}px)`;
        }
    }, { passive: true });
}


/* ================================================================
   6. SCROLL REVEAL — IntersectionObserver fade-up
   ================================================================ */

function initScrollReveal() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
}


/* ================================================================
   7. ANIMATED COUNTERS — Triggered when stats strip enters view
   ================================================================ */

function initCounters() {
    const nums = document.querySelectorAll('.stat-num[data-target]');
    const DURATION = 1900;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);

            const el     = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const start  = performance.now();

            function step(now) {
                const elapsed  = now - start;
                const progress = Math.min(elapsed / DURATION, 1);
                // Ease-out cubic
                const eased    = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(eased * target).toLocaleString();
                if (progress < 1) requestAnimationFrame(step);
            }

            requestAnimationFrame(step);
        });
    }, { threshold: 0.5 });

    nums.forEach(n => observer.observe(n));
}


/* ================================================================
   8. PROPERTY FILTER TABS
   ================================================================ */

function initPropertyFilter() {
    const btns  = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.property-card');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            cards.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                // Animate out/in
                if (match) {
                    card.classList.remove('hidden');
                    card.style.animation = 'none';
                    card.offsetHeight;          // reflow
                    card.style.animation = '';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}


/* ================================================================
   9. 3D TILT ON PROPERTY CARDS
   ================================================================ */

function initPropertyTilt() {
    document.querySelectorAll('.property-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x    = e.clientX - rect.left - rect.width  / 2;
            const y    = e.clientY - rect.top  - rect.height / 2;
            const tX   = -(y / rect.height) * 9;
            const tY   =  (x / rect.width)  * 9;
            card.style.transform = `translateY(-8px) rotateX(${tX}deg) rotateY(${tY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
    });
}


/* ================================================================
   10. CONTACT FORM — Validation + success toast
   ================================================================ */

function initContactForm() {
    const form      = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const toast     = document.getElementById('success-toast');
    if (!form) return;

    // Clear error on input
    form.querySelectorAll('input, select, textarea').forEach(el => {
        ['input', 'change'].forEach(ev =>
            el.addEventListener(ev, () => el.closest('.form-group')?.classList.remove('error'))
        );
    });

    function validate(id, test) {
        const el    = document.getElementById(id);
        const group = el?.closest('.form-group');
        const ok    = test(el?.value?.trim() ?? '');
        group?.classList.toggle('error', !ok);
        return ok;
    }

    form.addEventListener('submit', e => {
        e.preventDefault();

        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const valid = [
            validate('f-first',   v => v.length > 0),
            validate('f-last',    v => v.length > 0),
            validate('f-email',   v => emailRe.test(v)),
            validate('f-budget',  v => v.length > 0),
            validate('f-message', v => v.length > 0),
        ].every(Boolean);

        if (!valid) return;

        submitBtn.disabled    = true;
        submitBtn.textContent = 'Submitting…';

        // Simulate async submission
        setTimeout(() => {
            form.reset();
            submitBtn.disabled    = false;
            submitBtn.textContent = 'Submit Enquiry';

            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 5500);
        }, 1600);
    });
}
