// Signature Drawing Tool
import { showToast } from '../components/toast';

export function renderSignaturePage(container, navigateTo) {
  container.innerHTML = `
    <div class="page" id="signature-page">
      <div style="max-width:900px; margin:0 auto; padding:24px;">
        <!-- Header -->
        <div class="converter-header" style="margin-bottom:32px;">
          <button class="back-btn" id="btn-back" title="Go back to home">←</button>
          <div class="converter-title-block">
            <div class="converter-label">PDFly Tool</div>
            <h2>✍️ Draw Signature</h2>
          </div>
        </div>

        <!-- Main Container -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; align-items:start;">
          
          <!-- Canvas Area -->
          <div style="background:var(--bg-card); border:2px solid var(--border); border-radius:var(--radius-lg); padding:16px; display:flex; flex-direction:column; gap:12px;">
            <div>
              <h3 style="margin:0 0 8px 0; font-size:0.95rem; font-weight:600;">Your Signature</h3>
              <p style="margin:0; font-size:0.8rem; color:var(--text-secondary);">Draw or write your signature below</p>
            </div>
            
            <!-- Canvas -->
            <canvas id="signature-canvas" 
              style="
                border:2px solid var(--border);
                border-radius:var(--radius-md);
                background:white;
                cursor:crosshair;
                display:block;
                width:100%;
                height:300px;
              "></canvas>

            <!-- Canvas Controls -->
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <button class="btn btn-secondary" id="btn-clear-canvas" title="Clear the canvas">🗑️ Clear</button>
              <button class="btn btn-secondary" id="btn-undo" title="Undo last stroke">↶ Undo</button>
            </div>
          </div>

          <!-- Controls Sidebar -->
          <div style="display:flex; flex-direction:column; gap:16px;">
            
            <!-- Pen Size -->
            <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px;">
              <label style="display:block; font-size:0.9rem; font-weight:600; margin-bottom:8px;">Brush Size</label>
              <input type="range" id="pen-size" min="1" max="10" value="2" style="width:100%; cursor:pointer;">
              <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:6px;">Size: <span id="pen-size-display">2</span>px</div>
            </div>

            <!-- Pen Color -->
            <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px;">
              <label style="display:block; font-size:0.9rem; font-weight:600; margin-bottom:12px;">Color Palette</label>
              <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; margin-bottom:12px;">
                <button class="color-swatch" data-color="#000000" style="background:#000000; width:100%; height:40px; border:2px solid transparent; border-radius:var(--radius-md); cursor:pointer;" title="Black"></button>
                <button class="color-swatch" data-color="#1e40af" style="background:#1e40af; width:100%; height:40px; border:2px solid transparent; border-radius:var(--radius-md); cursor:pointer;" title="Blue"></button>
                <button class="color-swatch" data-color="#dc2626" style="background:#dc2626; width:100%; height:40px; border:2px solid transparent; border-radius:var(--radius-md); cursor:pointer;" title="Red"></button>
                <button class="color-swatch" data-color="#15803d" style="background:#15803d; width:100%; height:40px; border:2px solid transparent; border-radius:var(--radius-md); cursor:pointer;" title="Green"></button>
                <button class="color-swatch" data-color="#7c3aed" style="background:#7c3aed; width:100%; height:40px; border:2px solid transparent; border-radius:var(--radius-md); cursor:pointer;" title="Purple"></button>
                <button class="color-swatch" data-color="#ea580c" style="background:#ea580c; width:100%; height:40px; border:2px solid transparent; border-radius:var(--radius-md); cursor:pointer;" title="Orange"></button>
                <button class="color-swatch" data-color="#0891b2" style="background:#0891b2; width:100%; height:40px; border:2px solid transparent; border-radius:var(--radius-md); cursor:pointer;" title="Cyan"></button>
                <button class="color-swatch" data-color="#d946ef" style="background:#d946ef; width:100%; height:40px; border:2px solid transparent; border-radius:var(--radius-md); cursor:pointer;" title="Magenta"></button>
                <button class="color-swatch" data-color="#f59e0b" style="background:#f59e0b; width:100%; height:40px; border:2px solid transparent; border-radius:var(--radius-md); cursor:pointer;" title="Amber"></button>
                <button class="color-swatch" data-color="#ec4899" style="background:#ec4899; width:100%; height:40px; border:2px solid transparent; border-radius:var(--radius-md); cursor:pointer;" title="Pink"></button>
                <button class="color-swatch" data-color="#3b82f6" style="background:#3b82f6; width:100%; height:40px; border:2px solid transparent; border-radius:var(--radius-md); cursor:pointer;" title="Sky Blue"></button>
                <button class="color-swatch" data-color="#10b981" style="background:#10b981; width:100%; height:40px; border:2px solid transparent; border-radius:var(--radius-md); cursor:pointer;" title="Emerald"></button>
                <button class="color-swatch" data-color="#6366f1" style="background:#6366f1; width:100%; height:40px; border:2px solid transparent; border-radius:var(--radius-md); cursor:pointer;" title="Indigo"></button>
                <button class="color-swatch" data-color="#ef4444" style="background:#ef4444; width:100%; height:40px; border:2px solid transparent; border-radius:var(--radius-md); cursor:pointer;" title="Bright Red"></button>
                <button class="color-swatch" data-color="#8b5cf6" style="background:#8b5cf6; width:100%; height:40px; border:2px solid transparent; border-radius:var(--radius-md); cursor:pointer;" title="Violet"></button>
                <button class="color-swatch" data-color="#06b6d4" style="background:#06b6d4; width:100%; height:40px; border:2px solid transparent; border-radius:var(--radius-md); cursor:pointer;" title="Light Cyan"></button>
              </div>
              <label style="display:flex; gap:8px; align-items:center; font-size:0.85rem;">
                <span>Custom:</span>
                <input type="color" id="custom-color" value="#000000" style="width:50px; height:40px; border:1px solid var(--border); border-radius:var(--radius-md); cursor:pointer;">
              </label>
            </div>

            <!-- Download Options -->
            <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px;">
              <label style="display:block; font-size:0.9rem; font-weight:600; margin-bottom:12px;">Download as</label>
              <div style="display:flex; flex-direction:column; gap:8px;">
                <button class="btn btn-success" id="btn-download-png" style="width:100%;">📥 Download PNG</button>
                <button class="btn btn-secondary" id="btn-download-svg" style="width:100%;">📥 Download SVG</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `;

  // Canvas setup
  const canvas = document.getElementById('signature-canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const btnBack = document.getElementById('btn-back');
  const penSizeInput = document.getElementById('pen-size');
  const penSizeDisplay = document.getElementById('pen-size-display');
  const customColorInput = document.getElementById('custom-color');
  const colorSwatches = document.querySelectorAll('.color-swatch');
  const btnClear = document.getElementById('btn-clear-canvas');
  const btnUndo = document.getElementById('btn-undo');
  const btnDownloadPNG = document.getElementById('btn-download-png');
  const btnDownloadSVG = document.getElementById('btn-download-svg');

  // Canvas state
  let isDrawing = false;
  let currentColor = '#000000';
  let currentSize = 2;
  let strokes = []; // Store strokes for undo
  let currentStroke = [];

  // Resize canvas to match display size
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    redrawCanvas();
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Redraw all strokes
  function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach(stroke => {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      stroke.points.forEach((point, idx) => {
        if (idx === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
  }

  // Pen size control
  penSizeInput.addEventListener('input', (e) => {
    currentSize = e.target.value;
    penSizeDisplay.textContent = currentSize;
  });

  // Color selection
  colorSwatches.forEach(btn => {
    btn.addEventListener('click', () => {
      currentColor = btn.dataset.color;
      customColorInput.value = currentColor;
      colorSwatches.forEach(b => b.style.borderColor = 'transparent');
      btn.style.borderColor = '#fff';
      btn.style.boxShadow = '0 0 0 2px var(--accent-blue)';
    });
  });

  // Custom color
  customColorInput.addEventListener('change', (e) => {
    currentColor = e.target.value;
    colorSwatches.forEach(b => b.style.borderColor = 'transparent');
    colorSwatches.forEach(b => b.style.boxShadow = 'none');
  });

  // Set initial color
  colorSwatches[0].style.borderColor = '#fff';
  colorSwatches[0].style.boxShadow = '0 0 0 2px var(--accent-blue)';

  // Canvas drawing
  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  }

  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    currentStroke = [];
    const coords = getCanvasCoords(e);
    currentStroke.push(coords);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const coords = getCanvasCoords(e);
    currentStroke.push(coords);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  });

  canvas.addEventListener('mouseup', () => {
    if (isDrawing && currentStroke.length > 0) {
      strokes.push({ points: currentStroke, color: currentColor, size: currentSize });
    }
    isDrawing = false;
  });

  canvas.addEventListener('mouseleave', () => {
    isDrawing = false;
  });

  // Touch support
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDrawing = true;
    currentStroke = [];
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const coords = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    currentStroke.push(coords);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const coords = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    currentStroke.push(coords);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  });

  canvas.addEventListener('touchend', () => {
    if (isDrawing && currentStroke.length > 0) {
      strokes.push({ points: currentStroke, color: currentColor, size: currentSize });
    }
    isDrawing = false;
  });

  // Clear canvas
  btnClear.addEventListener('click', () => {
    strokes = [];
    currentStroke = [];
    redrawCanvas();
    showToast('Canvas cleared', 'info');
  });

  // Undo
  btnUndo.addEventListener('click', () => {
    if (strokes.length > 0) {
      strokes.pop();
      redrawCanvas();
      showToast('Stroke undone', 'info');
    }
  });

  // Download PNG
  btnDownloadPNG.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `signature_${Date.now()}.png`;
    link.click();
    showToast('PNG downloaded', 'success');
  });

  // Download SVG
  btnDownloadSVG.addEventListener('click', () => {
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">`;
    svgContent += `<rect width="${canvas.width}" height="${canvas.height}" fill="white"/>`;
    
    strokes.forEach(stroke => {
      let pathData = '';
      stroke.points.forEach((point, idx) => {
        if (idx === 0) {
          pathData += `M ${point.x} ${point.y}`;
        } else {
          pathData += ` L ${point.x} ${point.y}`;
        }
      });
      svgContent += `<path d="${pathData}" stroke="${stroke.color}" stroke-width="${stroke.size}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    });
    svgContent += `</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `signature_${Date.now()}.svg`;
    link.click();
    showToast('SVG downloaded', 'success');
  });


  // Back button
  btnBack.addEventListener('click', () => navigateTo('home'));
}
