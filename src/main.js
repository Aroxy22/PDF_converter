import './style.css';
import { renderHomePage } from './pages/home';
import { renderConverterPage } from './pages/converter';
import { renderSignaturePage } from './pages/signature';

// App Router / Page Controller
const mainContent = document.getElementById('main-content');
const navLogo = document.getElementById('nav-logo');
const linkHome = document.getElementById('link-home');
const linkAbout = document.getElementById('link-about');

let currentState = {
  page: 'home',
  params: null
};

function navigateTo(page, params = null) {
  currentState.page = page;
  currentState.params = params;
  renderState();
}

function renderState() {
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Update navigation links highlighting
  if (currentState.page === 'home') {
    linkHome.classList.add('active');
    linkAbout.classList.remove('active');
    renderHomePage(mainContent, navigateTo);
  } else if (currentState.page === 'converter') {
    linkHome.classList.remove('active');
    linkAbout.classList.remove('active');
    renderConverterPage(mainContent, navigateTo, currentState.params);
  } else if (currentState.page === 'signature') {
    linkHome.classList.remove('active');
    linkAbout.classList.remove('active');
    renderSignaturePage(mainContent, navigateTo);
  } else if (currentState.page === 'about') {
    linkHome.classList.remove('active');
    linkAbout.classList.add('active');
    renderAboutPage(mainContent);
  }
}

function renderAboutPage(container) {
  container.innerHTML = `
    <div class="page" style="max-width:800px; margin:0 auto; padding:60px 24px;">
      <h2 style="font-size:2.2rem; font-weight:800; margin-bottom:12px; background:var(--accent-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">About PDFly</h2>
      <p style="color:var(--text-secondary); margin-bottom:24px; font-size:1.1rem;">PDFly is a collection of browser-side document utilities designed for lightning-fast, high-privacy conversions.</p>
      
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:32px; margin-bottom:24px; display:flex; flex-direction:column; gap:16px;">
        <div style="font-weight:700; font-size:1.2rem;">🔒 Why Choose Client-Side Tools?</div>
        <p style="font-size:0.95rem; color:var(--text-secondary);">Traditional PDF websites upload your sensitive files (contracts, resumes, financial sheets) to their servers, converting them remotely. This risks data leaks and creates massive server hosting costs.</p>
        <p style="font-size:0.95rem; color:var(--text-secondary);">PDFly processes every single calculation, rendering pass, and PDF manipulation **entirely inside your browser's V8 engine**. Your data never leaves your computer, making it 100% secure, safe from data interception, and infinitely scalable.</p>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px;">
        <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px;">
          <div style="font-weight:600; margin-bottom:8px;">⚙️ Zero Server Cost</div>
          <div style="font-size:0.85rem; color:var(--text-secondary);">Because all conversion load runs client-side, the app costs $0/mo to host. This makes it permanently free with zero ads or subscriptions.</div>
        </div>
        <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px;">
          <div style="font-weight:600; margin-bottom:8px;">🚀 Lightning Speed</div>
          <div style="font-size:0.85rem; color:var(--text-secondary);">No file upload queues or download waiting times. Conversion is limited only by your local CPU and browser speeds.</div>
        </div>
      </div>

      <button class="btn btn-primary" id="btn-about-back">Start Converting Now</button>
    </div>
  `;
  document.getElementById('btn-about-back').addEventListener('click', () => navigateTo('home'));
}

// Navigation links setup
navLogo.addEventListener('click', () => navigateTo('home'));
linkHome.addEventListener('click', () => navigateTo('home'));
linkAbout.addEventListener('click', () => navigateTo('about'));

// Theme Toggle logic
const themeToggleBtn = document.getElementById('btn-theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'light';

if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeToggleBtn.classList.add('active');
} else {
  document.body.classList.remove('dark');
  themeToggleBtn.classList.remove('active');
}

themeToggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggleBtn.classList.toggle('active', isDark);
});

// Start app
navigateTo('home');
