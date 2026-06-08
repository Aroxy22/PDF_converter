// Home page — landing with tool cards grid
export function renderHomePage(container, navigateTo) {
  const tools = [
    {
      id: 'image-to-pdf',
      icon: '🖼️',
      title: 'Image → PDF',
      desc: 'Convert JPG, PNG, WebP images to a PDF document',
      theme: 'purple',
      accepts: '.jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff',
    },
    {
      id: 'pdf-to-image',
      icon: '📄',
      title: 'PDF → Image',
      desc: 'Export every PDF page as JPG or PNG images',
      theme: 'blue',
      accepts: '.pdf',
    },
    {
      id: 'text-to-pdf',
      icon: '📃',
      title: 'Text → PDF',
      desc: 'Convert plain .txt files to formatted PDF documents',
      theme: 'orange',
      accepts: '.txt',
    },
    {
      id: 'merge-pdf',
      icon: '🔗',
      title: 'Merge PDFs',
      desc: 'Combine multiple PDFs into one single document',
      theme: 'teal',
      accepts: '.pdf',
    },
    {
      id: 'split-pdf',
      icon: '✂️',
      title: 'Split PDF',
      desc: 'Extract individual pages from a PDF file',
      theme: 'red',
      accepts: '.pdf',
    },
    {
      id: 'compress-pdf',
      icon: '🗜️',
      title: 'Compress PDF',
      desc: 'Reduce PDF file size while keeping quality',
      theme: 'purple',
      accepts: '.pdf',
    },
    {
      id: 'pdf-to-txt',
      icon: '📄',
      title: 'PDF → Text',
      desc: 'Extract clean plain text from PDF files',
      theme: 'green',
      accepts: '.pdf',
    },
  ];

  container.innerHTML = `
    <div class="page" id="home-page">
      <!-- Hero -->
      <section class="hero">
        <div class="hero-badge">⚡ Free • No Signup • 100% Private</div>
        <h1>Convert <span class="gradient-text">Any File</span><br>to PDF Instantly</h1>
        <p>Powerful PDF tools that run entirely in your browser. Your files never leave your device — lightning fast, completely free.</p>
        <div class="hero-stats">
          <div class="hero-stat">
            <div class="stat-num">7+</div>
            <div class="stat-label">Tools & Features</div>
          </div>
          <div class="hero-stat">
            <div class="stat-num">100%</div>
            <div class="stat-label">Browser-Based</div>
          </div>
          <div class="hero-stat">
            <div class="stat-num">∞</div>
            <div class="stat-label">Files Free</div>
          </div>
          <div class="hero-stat">
            <div class="stat-num">0</div>
            <div class="stat-label">Data Uploaded</div>
          </div>
        </div>
      </section>

      <!-- Features Strip -->
      <div class="features-strip">
        <div class="feature-item">
          <span class="feat-icon">🔒</span>
          <span>Files stay on your device</span>
        </div>
        <div class="feature-item">
          <span class="feat-icon">⚡</span>
          <span>Instant conversion</span>
        </div>
        <div class="feature-item">
          <span class="feat-icon">🆓</span>
          <span>Always free, no limits</span>
        </div>
        <div class="feature-item">
          <span class="feat-icon">📱</span>
          <span>Works on mobile</span>
        </div>
        <div class="feature-item">
          <span class="feat-icon">🌍</span>
          <span>No account needed</span>
        </div>
      </div>

      <!-- Tools Grid -->
      <section class="section">
        <h2 class="section-title">All Conversion Tools</h2>
        <p class="section-subtitle">Choose a tool to get started — no registration required</p>
        <div class="tool-grid" id="tool-grid">
          ${tools.map((t, i) => `
            <div class="tool-card theme-${t.theme}" 
                 data-tool="${t.id}" 
                 style="animation-delay:${i * 0.05}s"
                 role="button"
                 tabindex="0"
                 id="tool-${t.id}">
              <div class="card-icon">${t.icon}</div>
              <div class="card-title">${t.title}</div>
              <div class="card-desc">${t.desc}</div>
              <div class="card-arrow">→</div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Special Features Section -->
      <section class="section">
        <div class="divider"></div>
        <h2 class="section-title">✍️ Special Features</h2>
        <p class="section-subtitle">Advanced tools for professional use</p>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <div class="tool-card theme-cyan" 
               data-feature="signature"
               style="cursor:pointer; transition:all 0.3s ease;"
               role="button"
               tabindex="0"
               id="tool-signature">
            <div class="card-icon" style="font-size:3rem;">✍️</div>
            <div class="card-title">Draw Signature</div>
            <div class="card-desc">Create professional digital signatures with 16+ color palettes and adjustable brush sizes. Download as PNG or SVG.</div>
            <div class="card-arrow">→</div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="divider"></div>
        <h2 class="section-title">How It Works</h2>
        <p class="section-subtitle">Three simple steps to convert your files</p>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
          ${[
            { n: '01', icon: '📁', t: 'Drop Your File', d: 'Drag & drop or click to browse. Supports batch upload for multiple files.' },
            { n: '02', icon: '⚙️', t: 'Choose Options', d: 'Set page size, orientation, quality, and other conversion settings.' },
            { n: '03', icon: '⬇️', t: 'Download PDF', d: 'Click Convert and instantly download your file. No waiting, no email.' },
          ].map(s => `
            <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; position:relative; overflow:hidden;">
              <div style="font-size:3rem; opacity:0.07; position:absolute; top:10px; right:16px; font-weight:900; line-height:1;">${s.n}</div>
              <div style="font-size:32px; margin-bottom:14px;">${s.icon}</div>
              <div style="font-weight:700; margin-bottom:8px;">${s.t}</div>
              <div style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">${s.d}</div>
            </div>
          `).join('')}
        </div>
      </section>

      <footer class="footer">
        <p>PDFly — Free Online PDF Converter &nbsp;•&nbsp; Built with ❤️ for everyone &nbsp;•&nbsp; <a href="#" id="link-privacy-policy" style="cursor:pointer;">Privacy Policy</a></p>
      </footer>
    </div>
  `;

  // Wire up clicks
  document.querySelectorAll('.tool-card').forEach(card => {
    const toolId = card.dataset.tool;
    const featureId = card.dataset.feature;
    
    const handler = () => {
      if (toolId) {
        navigateTo('converter', { toolId });
      } else if (featureId === 'signature') {
        navigateTo('signature');
      }
    };
    
    card.addEventListener('click', handler);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') handler(); });
  });

  // Privacy Policy link
  const privacyLink = document.getElementById('link-privacy-policy');
  if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('privacy');
    });
  }
}
