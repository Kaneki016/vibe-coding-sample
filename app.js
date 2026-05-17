/* -------------------------------------------------------------
   VIBE CODE - INTERACTIVE LOGIC CONTROLLER
   Features: Particle Canvas, Interactive Sandbox Widgets, typing AI,
             ROI slider calculation, Confetti Engine, and form validation
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GENERAL INTERACTIVE EFFECTS ---
    setupCursorGlow();
    setupParticlesBg();
    setupMagneticButtons();
    setupNavigation();

    // --- 2. VIBE TERMINAL PLAYGROUND ---
    setupVibeTerminal();

    // --- 3. CURRICULUM ACCORDION ---
    setupCurriculumAccordion();

    // --- 4. ROI ACCELERATION CALCULATOR ---
    setupROICalculator();

    // --- 5. APPLICATION FORM & CONFETTI ---
    setupApplicationForm();
    setupFAQAccordion();
});

/* ==========================================
   1. GENERAL INTERACTIVE EFFECTS
   ========================================== */

// Spot-glow cursor tracker
function setupCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    
    window.addEventListener('mousemove', (e) => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
    });
}

// Background HTML5 Canvas Particles Net
function setupParticlesBg() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const particles = [];
    const maxParticles = 60;
    const connectionDist = 130;
    
    let mouse = { x: null, y: null, radius: 150 };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(167, 139, 250, 0.4)'; // Cyan or Purple
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Boundary bounce
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
            
            // Mouse repeller push
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 1.5;
                    this.y += Math.sin(angle) * force * 1.5;
                }
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 4;
            ctx.shadowColor = this.color;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.shadowBlur = 0; // reset shadow for lines
        
        // Draw lines
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.update();
            p1.draw();
            
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.hypot(dx, dy);
                
                if (dist < connectionDist) {
                    const alpha = (1 - (dist / connectionDist)) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Magnetic hover button mechanics
function setupMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-magnetic');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Pull button in mouse direction slightly
            btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}

// Responsive Sticky Navbar & Hamburger drawer styled as side-drawer with backdrop blur
function setupNavigation() {
    const navbar = document.getElementById('main-nav');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-btn');
    
    // Scroll state header shadow
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Toggle mobile drawer
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mobileDrawer.classList.toggle('open');
        if (mobileOverlay) mobileOverlay.classList.toggle('open');
        
        // Animated bars
        const bars = mobileToggle.querySelectorAll('.bar');
        if (mobileDrawer.classList.contains('open')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    const closeMenu = () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('open');
        const bars = mobileToggle.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    };

    // Close mobile drawer on navigation click
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on overlay click
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMenu);
    }
}


/* ==========================================
   2. VIBE TERMINAL PLAYGROUND SYSTEM
   ========================================== */

const promptBlueprints = {
    card: {
        prompt: "Create a 3D glass card with mouse-tilt mechanics and cyber neon glowing borders.",
        logs: [
            "Initializing workspace context on node branch-3...",
            "Context synchronized successfully. Active agents: Architect, Stylist.",
            "Analyzing target style guidelines: glassmorphic backdrop filters, border glows...",
            "Writing semantic structures: designing card face elements & credit grid details...",
            "Applying premium CSS: card dimension 280x170px, backdrop-filter: blur(12px)...",
            "Synthesizing dynamic javascript: configuring 3D perspective tilting listener..."
        ],
        code: `/* CSS Compiled by AI Swarm */
<span class="selector">.payment-card-3d</span> {
  <span class="property">width</span>: <span class="value">280</span><span class="unit">px</span>;
  <span class="property">height</span>: <span class="value">170</span><span class="unit">px</span>;
  <span class="property">border-radius</span>: <span class="value">15</span><span class="unit">px</span>;
  <span class="property">background</span>: <span class="value">rgba(255, 255, 255, 0.05)</span>;
  <span class="property">border</span>: <span class="value">1px solid rgba(255, 255, 255, 0.1)</span>;
  <span class="property">backdrop-filter</span>: <span class="value">blur(12px)</span>;
  <span class="property">box-shadow</span>: <span class="value">0 20px 50px rgba(0,0,0,0.5)</span>;
  <span class="property">transform-style</span>: <span class="value">preserve-3d</span>;
  <span class="property">perspective</span>: <span class="value">1000</span><span class="unit">px</span>;
  <span class="property">transition</span>: <span class="value">transform 0.1s ease</span>;
}

<span class="selector">.card-glow-reflection</span> {
  <span class="property">background</span>: <span class="value">radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 60%)</span>;
}`,
        widgetHtml: `
            <div class="sandbox-preview-widget sandbox-card-3d" id="sandbox-card-3d">
                <div class="card-top">
                    <div class="card-chip"></div>
                    <span class="card-brand">VIBE//PASS</span>
                </div>
                <div class="card-number">4000 8276 9081 2026</div>
                <div class="card-bottom">
                    <div class="card-info">
                        <div>Cardholder</div>
                        <span class="card-holder">Vibe Conductor</span>
                    </div>
                    <div class="card-info">
                        <div>Expires</div>
                        <span class="card-holder">12/29</span>
                    </div>
                </div>
            </div>
        `,
        widgetSetup: () => {
            const card = document.getElementById('sandbox-card-3d');
            if (!card) return;
            
            card.parentNode.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const parentRect = card.parentNode.getBoundingClientRect();
                
                // Calculate position relative to container
                const xVal = e.clientX - rect.left - rect.width / 2;
                const yVal = e.clientY - rect.top - rect.height / 2;
                
                const tiltX = -(yVal / 8).toFixed(1);
                const tiltY = (xVal / 8).toFixed(1);
                
                card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
            });
            
            card.parentNode.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            });
        }
    },
    synth: {
        prompt: "Create a cyberpunk synthwave audio visualizer widget with animated frequency bars.",
        logs: [
            "Loading digital audio matrix components...",
            "Deploying sound module layout subagent...",
            "Constructing modular neon frame with border-color #ec4899...",
            "Adding aesthetic visualizer array: setting up 9 distinct bounce bars...",
            "Defining CSS animations: bounce-bar keyframes with alternate offsets...",
            "Binding play interface listeners: configuring interactive audio toggles..."
        ],
        code: `/* Synthwave Theme Grid */
<span class="selector">.synth-player</span> {
  <span class="property">width</span>: <span class="value">300</span><span class="unit">px</span>;
  <span class="property">background</span>: <span class="value">#0d0614</span>;
  <span class="property">border</span>: <span class="value">1px solid #ec4899</span>;
  <span class="property">box-shadow</span>: <span class="value">0 0 20px rgba(236,72,153,0.3)</span>;
  <span class="property">border-radius</span>: <span class="value">12</span><span class="unit">px</span>;
  <span class="property">padding</span>: <span class="value">1</span><span class="unit">rem</span>;
}

<span class="selector">.vis-bar.animating</span> {
  <span class="property">animation</span>: <span class="value">bounce-bar 0.8s ease-in-out infinite alternate</span>;
}

<span class="selector">@keyframes bounce-bar</span> {
  <span class="selector">0%</span> { <span class="property">height</span>: <span class="value">10%</span>; }
  <span class="selector">100%</span> { <span class="property">height</span>: <span class="value">90%</span>; }
}`,
        widgetHtml: `
            <div class="sandbox-preview-widget synth-player">
                <div class="player-info">
                    <div class="player-cover">🎧</div>
                    <div class="player-meta">
                        <span class="player-title">NEON HARBOR (VIBE)</span>
                        <span class="player-artist">RETROCONDUCTOR</span>
                    </div>
                </div>
                <div class="player-visualizer" id="visualizer-bars">
                    <div class="vis-bar animating"></div>
                    <div class="vis-bar animating"></div>
                    <div class="vis-bar animating"></div>
                    <div class="vis-bar animating"></div>
                    <div class="vis-bar animating"></div>
                    <div class="vis-bar animating"></div>
                    <div class="vis-bar animating"></div>
                    <div class="vis-bar animating"></div>
                    <div class="vis-bar animating"></div>
                </div>
                <div class="player-controls">
                    <button class="btn-ctrl">⏮</button>
                    <button class="btn-ctrl play-btn" id="play-pause-btn">⏸</button>
                    <button class="btn-ctrl">⏭</button>
                </div>
            </div>
        `,
        widgetSetup: () => {
            const playBtn = document.getElementById('play-pause-btn');
            const bars = document.querySelectorAll('#visualizer-bars .vis-bar');
            
            if (!playBtn) return;
            
            playBtn.addEventListener('click', () => {
                const isPlaying = playBtn.innerText === '⏸';
                if (isPlaying) {
                    playBtn.innerText = '▶';
                    bars.forEach(bar => bar.classList.remove('animating'));
                } else {
                    playBtn.innerText = '⏸';
                    bars.forEach(bar => bar.classList.add('animating'));
                }
            });
        }
    },
    chart: {
        prompt: "Generate a premium glassmorphic dashboard analytics widget with a gradient bar chart and floating stats.",
        logs: [
            "Initializing responsive workspace schema...",
            "Loading glass dashboard modules: creating 290px overlay matrix...",
            "Calculating trend reports: compiling emerald indicators...",
            "Constructing svg grid layout with customized linear-gradients...",
            "Establishing bar items: setting 5 interactive column targets...",
            "Designing hover tooltip nodes: binding absolute value labels..."
        ],
        code: `/* Glass Chart styling */
<span class="selector">.sandbox-chart-widget</span> {
  <span class="property">width</span>: <span class="value">290</span><span class="unit">px</span>;
  <span class="property">background</span>: <span class="value">rgba(255,255,255,0.03)</span>;
  <span class="property">border</span>: <span class="value">1px solid rgba(255,255,255,0.08)</span>;
  <span class="property">backdrop-filter</span>: <span class="value">blur(16px)</span>;
  <span class="property">border-radius</span>: <span class="value">12</span><span class="unit">px</span>;
  <span class="property">padding</span>: <span class="value">1</span><span class="unit">rem</span>;
}

<span class="selector">.chart-bar-fill</span> {
  <span class="property">background</span>: <span class="value">linear-gradient(to top, var(--primary), var(--accent-cyan))</span>;
  <span class="property">transition</span>: <span class="value">height 1s ease</span>;
}`,
        widgetHtml: `
            <div class="sandbox-preview-widget sandbox-chart-widget">
                <div class="chart-header">
                    <span class="chart-title">DEV_VELOCITY</span>
                    <span class="chart-trend">▲ +320%</span>
                </div>
                <span class="chart-value">12,480 hrs</span>
                <div class="chart-bars">
                    <div class="chart-bar-col">
                        <div class="chart-bar-fill" style="height: 40%;" data-value="+120%">
                            <span class="chart-tooltip">+120%</span>
                        </div>
                        <span class="chart-label">M1</span>
                    </div>
                    <div class="chart-bar-col">
                        <div class="chart-bar-fill" style="height: 85%;" data-value="+240%">
                            <span class="chart-tooltip">+240%</span>
                        </div>
                        <span class="chart-label">M2</span>
                    </div>
                    <div class="chart-bar-col">
                        <div class="chart-bar-fill" style="height: 60%;" data-value="+180%">
                            <span class="chart-tooltip">+180%</span>
                        </div>
                        <span class="chart-label">M3</span>
                    </div>
                    <div class="chart-bar-col">
                        <div class="chart-bar-fill" style="height: 95%;" data-value="+320%">
                            <span class="chart-tooltip">+320%</span>
                        </div>
                        <span class="chart-label">M4</span>
                    </div>
                    <div class="chart-bar-col">
                        <div class="chart-bar-fill" style="height: 70%;" data-value="+280%">
                            <span class="chart-tooltip">+280%</span>
                        </div>
                        <span class="chart-label">M5</span>
                    </div>
                </div>
            </div>
        `,
        widgetSetup: () => {
            // Bars are animated on load
            const barFills = document.querySelectorAll('.chart-bar-fill');
            barFills.forEach(bar => {
                const targetH = bar.style.height;
                bar.style.height = '0%';
                setTimeout(() => {
                    bar.style.height = targetH;
                }, 100);
            });
        }
    }
};

let activeTypewriter = null;

function setupVibeTerminal() {
    const btns = document.querySelectorAll('#vibe-terminal .tree-file[data-prompt]');
    const inputDisplay = document.getElementById('terminal-input-display');
    const thinkingConsole = document.getElementById('thinking-console');
    const codeDisplay = document.getElementById('code-content-display');
    const previewContainer = document.getElementById('sandbox-preview-container');
    
    if (!inputDisplay || !thinkingConsole) return;
    
    // Click triggers tab switch
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) return;
            
            // Update active state
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const promptKey = btn.dataset.prompt;
            runAISequence(promptKey);
        });
    });

    // Auto-run first sequence
    runAISequence('card');

    // Sidebar & Split View Toggle Functionality
    const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
    const togglePreviewBtn = document.getElementById('toggle-preview-btn');
    const ideSidebar = document.querySelector('.terminal-ide-sidebar');
    const terminalWorkspace = document.querySelector('.terminal-workspace');
    const explorerBtn = document.querySelector('.activity-btn[title="Explorer"]');

    if (toggleSidebarBtn && ideSidebar) {
        const toggleSidebar = () => {
            ideSidebar.classList.toggle('collapsed');
            toggleSidebarBtn.classList.toggle('active');
            if (explorerBtn) {
                if (ideSidebar.classList.contains('collapsed')) {
                    explorerBtn.classList.remove('active');
                } else {
                    explorerBtn.classList.add('active');
                }
            }
        };

        toggleSidebarBtn.addEventListener('click', toggleSidebar);
        
        // Activity explorer button acts as toggle as well
        if (explorerBtn) {
            explorerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleSidebar();
            });
        }

        // Support standard Ctrl+B shortcut for premium feel!
        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
                const terminalVisible = document.getElementById('vibe-terminal');
                if (terminalVisible && terminalVisible.getBoundingClientRect().top < window.innerHeight && terminalVisible.getBoundingClientRect().bottom > 0) {
                    e.preventDefault();
                    toggleSidebar();
                }
            }
        });
    }

    if (togglePreviewBtn && terminalWorkspace) {
        togglePreviewBtn.addEventListener('click', () => {
            terminalWorkspace.classList.toggle('full-width-code');
            togglePreviewBtn.classList.toggle('active');
        });
    }
}

// Sequence compiler simulation
function runAISequence(key) {
    const data = promptBlueprints[key];
    if (!data) return;

    const inputDisplay = document.getElementById('terminal-input-display');
    const thinkingConsole = document.getElementById('thinking-console');
    const codeDisplay = document.getElementById('code-content-display');
    const previewContainer = document.getElementById('sandbox-preview-container');
    
    // Clear previous typewriter runs
    if (activeTypewriter) {
        clearInterval(activeTypewriter);
    }
    
    // Reset contents
    inputDisplay.innerText = '';
    thinkingConsole.innerHTML = '';
    codeDisplay.innerHTML = '// Constructing agent outputs...';
    previewContainer.innerHTML = `
        <div style="font-family: monospace; font-size: 0.8rem; color: var(--text-muted); display:flex; flex-direction:column; align-items:center; gap: 10px;">
            <div class="pulse-indicator" style="background-color: var(--accent-cyan); box-shadow: 0 0 10px var(--accent-cyan-glow);"></div>
            <span>Agent compiling assets...</span>
        </div>
    `;

    // 1. Type input query
    typeText(inputDisplay, data.prompt, 20, () => {
        // 2. Play thinking logs sequentially
        playThinkingLogs(thinkingConsole, data.logs, () => {
            // 3. Render and type CSS
            typeHTMLCode(codeDisplay, data.code, () => {
                // 4. Render Widget & bind interactive listeners
                previewContainer.innerHTML = data.widgetHtml;
                data.widgetSetup();
            });
        });
    });
}

// Basic character typing using textContent to preserve formatting and white spaces
function typeText(element, text, speed, callback) {
    let index = 0;
    element.textContent = '';
    
    activeTypewriter = setInterval(() => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(activeTypewriter);
            if (callback) callback();
        }
    }, speed);
}

// Thinking Log generator simulation
function playThinkingLogs(container, logs, callback) {
    let logIndex = 0;
    
    function addLog() {
        if (logIndex < logs.length) {
            const date = new Date();
            const timeStr = `${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
            const logType = logIndex === logs.length - 1 ? 'done' : (logIndex === 0 ? 'plan' : 'exec');
            const typeLabel = logType === 'done' ? 'SUCCESS' : (logType === 'plan' ? 'START' : 'COMPILING');
            
            const logEl = document.createElement('div');
            logEl.className = 'thinking-log';
            logEl.innerHTML = `
                <span class="log-time">[${timeStr}]</span>
                <span class="log-status ${logType === 'done' ? 'done' : (logType === 'plan' ? 'plan' : '')}">[${typeLabel}]</span>
                <span>${logs[logIndex]}</span>
            `;
            
            container.appendChild(logEl);
            container.scrollTop = container.scrollHeight;
            
            logIndex++;
            setTimeout(addLog, 500); // 500ms delay between logs
        } else {
            if (callback) callback();
        }
    }
    
    addLog();
}

// HTML typing maintaining code span nodes
function typeHTMLCode(container, html, callback) {
    container.innerHTML = '';
    
    // Create a temporary element to hold parsed nodes
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const nodes = Array.from(tempDiv.childNodes);
    let nodeIdx = 0;
    
    function typeNode() {
        if (nodeIdx < nodes.length) {
            const node = nodes[nodeIdx];
            
            if (node.nodeType === Node.TEXT_NODE) {
                // Type text node char-by-char
                const textVal = node.textContent;
                let charIdx = 0;
                const textSpan = document.createTextNode('');
                container.appendChild(textSpan);
                
                function typeChar() {
                    if (charIdx < textVal.length) {
                        textSpan.textContent += textVal.charAt(charIdx);
                        charIdx++;
                        setTimeout(typeChar, 5); // very fast char speed
                    } else {
                        nodeIdx++;
                        typeNode();
                    }
                }
                typeChar();
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Instantly append colored span wrapper but type its content
                const originalText = node.innerText;
                const elementCopy = document.createElement(node.tagName);
                elementCopy.className = node.className;
                container.appendChild(elementCopy);
                
                let charIdx = 0;
                function typeElChar() {
                    if (charIdx < originalText.length) {
                        elementCopy.innerText += originalText.charAt(charIdx);
                        charIdx++;
                        setTimeout(typeElChar, 5);
                    } else {
                        nodeIdx++;
                        typeNode();
                    }
                }
                typeElChar();
            } else {
                nodeIdx++;
                typeNode();
            }
        } else {
            if (callback) callback();
        }
    }
    
    typeNode();
}


/* ==========================================
   3. CURRICULUM ACCORDION SYSTEM
   ========================================== */

function setupCurriculumAccordion() {
    const items = document.querySelectorAll('.curriculum-accordion .accordion-item');
    
    items.forEach((item, index) => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        // Open the first module by default
        if (index === 0) {
            item.classList.add('active');
            content.style.maxHeight = `${content.scrollHeight}px`;
        }
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            items.forEach(it => {
                it.classList.remove('active');
                it.querySelector('.accordion-content').style.maxHeight = '0px';
            });
            
            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = `${content.scrollHeight}px`;
            }
        });
    });
}


/* ==========================================
   4. ROI ACCELERATION CALCULATOR
   ========================================== */

function setupROICalculator() {
    const hoursSlider = document.getElementById('hours-slider');
    const speedupSlider = document.getElementById('speedup-slider');
    const hoursDisplay = document.getElementById('hours-display');
    const speedupDisplay = document.getElementById('speedup-display');
    
    const timeSavedVal = document.getElementById('time-saved-val');
    const productivityVal = document.getElementById('productivity-val');
    const yearlySavingsVal = document.getElementById('yearly-savings-val');
    
    if (!hoursSlider || !speedupSlider) return;
    
    function updateCalculations() {
        const hours = parseInt(hoursSlider.value);
        const speedup = parseInt(speedupSlider.value);
        
        // Update slider texts
        hoursDisplay.innerText = hours;
        speedupDisplay.innerText = speedup;
        
        // Calculations
        // Formula: Time Reclaimed = Current Hours * (1 - 1 / Speedup multiplier)
        const timeSaved = hours * (1 - 1 / speedup);
        const productivityPercent = speedup * 100;
        
        // Financial estimate: Reclaimed hours * 52 weeks * average tech wage ($75/hr)
        const yearlyValue = Math.round(timeSaved * 52 * 75);
        
        // Format outputs
        timeSavedVal.innerText = timeSaved.toFixed(1);
        productivityVal.innerText = `${productivityPercent}%`;
        yearlySavingsVal.innerText = `$${yearlyValue.toLocaleString()}`;
    }
    
    hoursSlider.addEventListener('input', updateCalculations);
    speedupSlider.addEventListener('input', updateCalculations);
    
    // Initial run
    updateCalculations();
}


/* ==========================================
   5. APPLICATION FORM & CONFETTI ENGINE
   ========================================== */

// Physics Confetti engine
const confettiCanvas = document.getElementById('confetti-canvas');
let confettiCtx = null;
let confettiParticles = [];
let confettiAnimationId = null;

if (confettiCanvas) {
    confettiCtx = confettiCanvas.getContext('2d');
}

class ConfettiParticle {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = Math.random() * 8 + 6;
        this.color = this.getRandomColor();
        this.rotation = Math.random() * Math.PI;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.gravity = 0.25;
        this.opacity = 1;
    }
    
    getRandomColor() {
        const colors = ['#06b6d4', '#7c3aed', '#ec4899', '#10b981', '#fbbf24', '#3b82f6'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.vx *= 0.99; // subtle air drag
        
        if (this.y > window.innerHeight) {
            this.opacity = 0; // ready for removal
        }
    }
    
    draw() {
        confettiCtx.save();
        confettiCtx.translate(this.x, this.y);
        confettiCtx.rotate(this.rotation);
        confettiCtx.fillStyle = this.color;
        confettiCtx.globalAlpha = this.opacity;
        
        // Draw little squares
        confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        confettiCtx.restore();
    }
}

function launchConfetti() {
    if (!confettiCanvas) return;
    
    // Reset canvas dimensions
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    
    confettiParticles = [];
    
    // Shoot from bottom-left corner
    for (let i = 0; i < 70; i++) {
        confettiParticles.push(new ConfettiParticle(
            0, 
            window.innerHeight, 
            Math.random() * 15 + 10, // speed right
            -(Math.random() * 15 + 15) // speed up
        ));
    }
    
    // Shoot from bottom-right corner
    for (let i = 0; i < 70; i++) {
        confettiParticles.push(new ConfettiParticle(
            window.innerWidth, 
            window.innerHeight, 
            -(Math.random() * 15 + 10), // speed left
            -(Math.random() * 15 + 15) // speed up
        ));
    }
    
    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
    }
    
    animateConfetti();
}

function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    let active = false;
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
        const p = confettiParticles[i];
        p.update();
        if (p.opacity > 0) {
            p.draw();
            active = true;
        } else {
            confettiParticles.splice(i, 1);
        }
    }
    
    if (active) {
        confettiAnimationId = requestAnimationFrame(animateConfetti);
    }
}

// Application form handlers & error checks
function setupApplicationForm() {
    const form = document.getElementById('application-form');
    const submitBtn = document.getElementById('submit-application');
    const successModal = document.getElementById('success-modal');
    const modalClose = document.getElementById('modal-close-btn');
    
    if (!form || !submitBtn) return;
    
    // Intercept clicks on pricing cards to select track
    const pricingCtaBtns = document.querySelectorAll('.pricing-card .btn');
    pricingCtaBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const plan = btn.dataset.plan;
            if (plan) {
                const planSelect = document.getElementById('form-plan');
                if (planSelect) {
                    planSelect.value = plan === 'Self-Paced' ? 'Self-Paced' : 'Conductor';
                    // clear plan errors if selected
                    planSelect.parentNode.classList.remove('error');
                }
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const planSelect = document.getElementById('form-plan');
        const experienceInput = document.getElementById('form-experience');
        
        let isValid = true;
        
        // 1. Name Check
        if (!nameInput.value.trim()) {
            nameInput.parentNode.classList.add('error');
            isValid = false;
        } else {
            nameInput.parentNode.classList.remove('error');
        }
        
        // 2. Email Check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            emailInput.parentNode.classList.add('error');
            isValid = false;
        } else {
            emailInput.parentNode.classList.remove('error');
        }
        
        // 3. Plan Check
        if (!planSelect.value) {
            planSelect.parentNode.classList.add('error');
            isValid = false;
        } else {
            planSelect.parentNode.classList.remove('error');
        }
        
        // 4. Experience Text Check
        if (!experienceInput.value.trim()) {
            experienceInput.parentNode.classList.add('error');
            isValid = false;
        } else {
            experienceInput.parentNode.classList.remove('error');
        }
        
        if (isValid) {
            // Trigger loading simulation
            submitBtn.disabled = true;
            submitBtn.innerText = "Synchronizing Swarms...";
            
            setTimeout(() => {
                // Success actions
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerText = "Submit Application ⚡";
                
                // Show modal & shoot confetti!
                successModal.classList.add('open');
                launchConfetti();
                
            }, 1500);
        }
    });

    // Clear error tags on input/change events
    form.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('input', () => {
            el.parentNode.classList.remove('error');
        });
        el.addEventListener('change', () => {
            el.parentNode.classList.remove('error');
        });
    });

    // Close success overlay
    if (modalClose && successModal) {
        modalClose.addEventListener('click', () => {
            successModal.classList.remove('open');
        });
        
        // Close modal clicking outside
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('open');
            }
        });
    }

    // Newsletter sign up mock
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMsg = document.getElementById('newsletter-msg');
    
    if (newsletterForm && newsletterMsg) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                newsletterMsg.innerText = "⚠️ Enter a valid email address.";
                newsletterMsg.className = "newsletter-msg error";
                return;
            }
            
            newsletterMsg.innerText = "⚡ Connection established! Check your inbox.";
            newsletterMsg.className = "newsletter-msg success";
            emailInput.value = '';
            
            setTimeout(() => {
                newsletterMsg.innerText = '';
            }, 5000);
        });
    }
}

/* ==========================================
   6. FAQ ACCORDION SYSTEM
   ========================================== */

function setupFAQAccordion() {
    const items = document.querySelectorAll('.faq-list .faq-item');
    
    items.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQs
            items.forEach(it => {
                it.classList.remove('active');
                it.querySelector('.faq-answer').style.maxHeight = '0px';
            });
            
            // Open this one if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = `${answer.scrollHeight}px`;
            }
        });
    });
}
