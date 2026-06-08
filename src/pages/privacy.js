// Privacy Policy page
export function renderPrivacyPage(container, navigateTo) {
  container.innerHTML = `
    <div class="page" id="privacy-page">
      <div style="max-width:900px; margin:0 auto; padding:40px 24px;">
        <!-- Header -->
        <div style="margin-bottom:40px;">
          <button class="back-btn" id="btn-back" title="Go back to home" style="margin-bottom:24px;">←</button>
          <h1 style="margin:0 0 8px 0;">Privacy Policy</h1>
          <p style="margin:0; font-size:0.95rem; color:var(--text-secondary);">Last updated: June 8, 2026</p>
        </div>

        <!-- Content -->
        <div style="line-height:1.8; color:var(--text-primary);">
          
          <section style="margin-bottom:32px;">
            <h2 style="font-size:1.3rem; font-weight:700; margin:0 0 12px 0;">1. Introduction</h2>
            <p>PDFly ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we handle your information when you use our website and services.</p>
            <p>PDFly is a browser-based PDF conversion tool that prioritizes your privacy and security above all else.</p>
          </section>

          <section style="margin-bottom:32px;">
            <h2 style="font-size:1.3rem; font-weight:700; margin:0 0 12px 0;">2. How We Protect Your Data</h2>
            <p><strong>100% Browser-Based Processing:</strong> All file conversions happen locally on your device using your browser. We never process your files on our servers.</p>
            <p><strong>No File Upload:</strong> Your files never leave your device or get transmitted to our servers. Everything stays on your computer.</p>
            <p><strong>No Data Storage:</strong> We do not store, access, or retain any of your files or documents. After you close the browser, all data is gone.</p>
            <p><strong>No Account Required:</strong> PDFly works without registration, login, or any personal information collection.</p>
          </section>

          <section style="margin-bottom:32px;">
            <h2 style="font-size:1.3rem; font-weight:700; margin:0 0 12px 0;">3. What Information We Collect</h2>
            <p><strong>Browser Cache Only:</strong> PDFly temporarily stores file metadata (filename, file size, type) in your browser's localStorage for 10 minutes to enable the caching feature. This data is:</p>
            <ul style="margin:12px 0; padding-left:24px;">
              <li>Stored only on your device</li>
              <li>Automatically deleted after 10 minutes of inactivity</li>
              <li>Never transmitted to our servers</li>
              <li>Never shared with third parties</li>
            </ul>
          </section>

          <section style="margin-bottom:32px;">
            <h2 style="font-size:1.3rem; font-weight:700; margin:0 0 12px 0;">4. Third-Party Libraries</h2>
            <p>PDFly uses open-source JavaScript libraries for PDF processing, including pdf-lib, pdfjs, and others. These libraries:</p>
            <ul style="margin:12px 0; padding-left:24px;">
              <li>Run entirely in your browser</li>
              <li>Process files locally without external communication</li>
              <li>Do not collect or transmit any personal data</li>
            </ul>
          </section>

          <section style="margin-bottom:32px;">
            <h2 style="font-size:1.3rem; font-weight:700; margin:0 0 12px 0;">5. Cookies & Tracking</h2>
            <p>PDFly does not:</p>
            <ul style="margin:12px 0; padding-left:24px;">
              <li>Use tracking cookies</li>
              <li>Track user behavior or analytics</li>
              <li>Use Google Analytics or similar tracking services</li>
              <li>Collect analytics on file conversions</li>
              <li>Share data with advertisers</li>
            </ul>
          </section>

          <section style="margin-bottom:32px;">
            <h2 style="font-size:1.3rem; font-weight:700; margin:0 0 12px 0;">6. Offline Functionality</h2>
            <p>PDFly works completely offline. Once you've loaded the website in your browser, you can use all tools without an internet connection. This means:</p>
            <ul style="margin:12px 0; padding-left:24px;">
              <li>No data is ever transmitted over the internet</li>
              <li>Your files are completely isolated from any network</li>
              <li>You have full control over your data at all times</li>
            </ul>
          </section>

          <section style="margin-bottom:32px;">
            <h2 style="font-size:1.3rem; font-weight:700; margin:0 0 12px 0;">7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated "Last updated" date. We encourage you to review this policy periodically.</p>
          </section>

          <section style="margin-bottom:32px;">
            <h2 style="font-size:1.3rem; font-weight:700; margin:0 0 12px 0;">8. Questions or Concerns</h2>
            <p>If you have any questions about this Privacy Policy or how we handle your data, please contact us. Your privacy is our top priority.</p>
          </section>

          <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; margin-top:32px;">
            <p style="margin:0; font-size:0.9rem; color:var(--text-secondary);"><strong>Summary:</strong> PDFly processes everything in your browser. Your files never leave your device. We don't store, track, or share your data. Period.</p>
          </div>

        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-back').addEventListener('click', () => navigateTo('home'));
}
