// Dynamic Converter page rendering & orchestration
import { showToast } from '../components/toast';
import { imageToPdf } from '../converters/imageToPdf';
import { pdfToImage, renderPageToCanvas } from '../converters/pdfToImage';
import { textToPdf } from '../converters/textToPdf';
import { mergePdfs } from '../converters/mergePdf';
import { splitPdf } from '../converters/splitPdf';
import { compressPdf, formatBytes } from '../converters/compressPdf';
import { pdfToTxt } from '../converters/pdfToOthers';

// File Cache Manager (stores in browser localStorage with inactivity timer)
const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

function cacheFileMetadata(toolId, files) {
  try {
    const fileData = files.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    const cacheObj = {
      toolId,
      files: fileData,
      timestamp: Date.now(),
    };
    localStorage.setItem('pdflyCache', JSON.stringify(cacheObj));
    resetInactivityTimer();
  } catch (e) {
    console.warn('Cache write failed:', e);
  }
}

function restoreCachedFileMetadata(toolId) {
  try {
    const cached = localStorage.getItem('pdflyCache');
    if (!cached) return null;

    const cacheObj = JSON.parse(cached);
    const age = Date.now() - cacheObj.timestamp;

    // Clear if expired (older than inactivity timeout)
    if (age > INACTIVITY_TIMEOUT) {
      clearCache();
      return null;
    }

    // Only restore if same tool
    if (cacheObj.toolId !== toolId) return null;

    return cacheObj.files;
  } catch (e) {
    console.warn('Cache read failed:', e);
    return null;
  }
}

function clearCache() {
  localStorage.removeItem('pdflyCache');
  clearTimeout(window.pdflyCacheTimer);
  window.pdflyCacheTimer = null;
}

let inactivityTimerId = null;
function resetInactivityTimer() {
  if (inactivityTimerId) clearTimeout(inactivityTimerId);
  inactivityTimerId = setTimeout(() => {
    clearCache();
    showToast('Cached files cleared due to inactivity', 'info');
  }, INACTIVITY_TIMEOUT);
  window.pdflyCacheTimer = inactivityTimerId;
}

const TOOL_CONFIGS = {
  'image-to-pdf': {
    title: 'Image to PDF',
    label: 'Convert',
    accepts: '.jpg,.jpeg,.png,.webp,.gif,.bmp',
    multiple: true,
    options: `
      <div class="option-group">
        <label for="opt-pagesize">Page Size</label>
        <select id="opt-pagesize">
          <option value="a4">A4 (210 × 297mm)</option>
          <option value="letter">Letter (8.5" × 11")</option>
          <option value="a3">A3</option>
          <option value="legal">Legal</option>
        </select>
      </div>
      <div class="option-group">
        <label for="opt-orientation">Orientation</label>
        <select id="opt-orientation">
          <option value="auto">Auto (Match Image)</option>
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </div>
      <div class="option-group">
        <label for="opt-fit">Fit Mode</label>
        <select id="opt-fit">
          <option value="fit">Fit Margin (Aspect Ratio)</option>
          <option value="fill">Fill Page</option>
          <option value="original">Original Size</option>
        </select>
      </div>
      <div class="option-group">
        <label for="opt-margin">Margin (mm)</label>
        <input type="number" id="opt-margin" value="10" min="0" max="50">
      </div>
    `,
  },
  'pdf-to-image': {
    title: 'PDF to Image',
    label: 'Convert',
    accepts: '.pdf',
    multiple: false,
    options: `
      <div class="option-group">
        <label for="opt-format">Image Format</label>
        <select id="opt-format">
          <option value="jpeg">JPEG (.jpg)</option>
          <option value="png">PNG (.png)</option>
        </select>
      </div>
      <div class="option-group">
        <label for="opt-scale">Resolution Scale</label>
        <select id="opt-scale">
          <option value="1.5">Standard (1.5x)</option>
          <option value="2" selected>High Detail (2x)</option>
          <option value="3">Ultra HD (3x)</option>
        </select>
      </div>
    `,
  },
  
  'text-to-pdf': {
    title: 'Text to PDF',
    label: 'Convert',
    accepts: '.txt',
    multiple: false,
    options: `
      <div class="option-group">
        <label for="opt-pagesize">Page Size</label>
        <select id="opt-pagesize">
          <option value="a4" selected>A4</option>
          <option value="letter">Letter</option>
        </select>
      </div>
      <div class="option-group">
        <label for="opt-fontfamily">Font Family</label>
        <select id="opt-fontfamily">
          <option value="courier">Monospace (Courier)</option>
          <option value="helvetica">Sans-serif (Helvetica)</option>
        </select>
      </div>
      <div class="option-group">
        <label for="opt-fontsize">Font Size</label>
        <input type="number" id="opt-fontsize" value="11" min="6" max="24">
      </div>
    `,
  },
  'html-to-pdf': {
    title: 'HTML to PDF',
    label: 'Convert',
    accepts: '.html,.htm',
    multiple: false,
    options: ``,
  },
  'merge-pdf': {
    title: 'Merge PDFs',
    label: 'Merge',
    accepts: '.pdf',
    multiple: true,
    options: `<p style="font-size:0.8rem; color:var(--text-secondary)">Drag and drop multiple PDF files. You can merge them in the order they are listed below.</p>`,
  },
  'split-pdf': {
    title: 'Split PDF',
    label: 'Split',
    accepts: '.pdf',
    multiple: false,
    options: ``,
  },
  'compress-pdf': {
    title: 'Compress PDF',
    label: 'Compress',
    accepts: '.pdf',
    multiple: false,
    options: `
      <div class="option-group">
        <label for="opt-compress-level">Compression Level</label>
        <select id="opt-compress-level">
          <option value="medium" selected>Medium (Good Quality & Size)</option>
          <option value="high">High (Maximum Compression)</option>
          <option value="low">Low (High Quality, Low compression)</option>
        </select>
      </div>
    `,
  },
  'pdf-to-txt': {
    title: 'PDF to Text',
    label: 'Convert',
    accepts: '.pdf',
    multiple: false,
    options: `<p style="font-size:0.8rem; color:var(--text-secondary)">Scan text blocks throughout this PDF and save them as a raw plain text file (.txt).</p>`,
  },
};

export function renderConverterPage(container, navigateTo, params) {
  const toolId = params?.toolId;
  const config = TOOL_CONFIGS[toolId];

  if (!config) {
    navigateTo('home');
    return;
  }

  let selectedFiles = [];
  let splitSelectedPages = new Set();
  let convertedBlob = null;
  let convertedResults = []; // array of {blob, name} (used by split/pdfToImage)
  let splitResultSelectedPages = new Set(); // tracks which result pages are checked for download

  container.innerHTML = `
    <div class="page" id="converter-page">
      <div class="converter-page">
        <!-- Back and Header -->
        <div class="converter-header">
          <button class="back-btn" id="btn-back" title="Go back to home">←</button>
          <div class="converter-title-block">
            <div class="converter-label">PDFly Tool</div>
            <h2>${config.title}</h2>
          </div>
        </div>

        <!-- Dropzone -->
        <div class="dropzone" id="dropzone">
          <span class="dropzone-icon">📥</span>
          <h3>Drag & Drop files here</h3>
          <p>or click to select files from your computer</p>
          <span class="dropzone-accepted">Accepted files: ${config.accepts.toUpperCase()}</span>
          <input type="file" id="file-input" ${config.multiple ? 'multiple' : ''} accept="${config.accepts}">
        </div>

        <!-- File List -->
        <div class="file-list" id="file-list"></div>

        <!-- Options Panel -->
        <div class="options-panel" id="options-panel" style="display:none;">
          <h4>Options & Settings</h4>
          <div class="options-grid">
            ${config.options}
          </div>
        </div>

        <!-- Progress Track -->
        <div class="progress-container" id="progress-container">
          <div class="progress-label">
            <span class="progress-text" id="progress-text">Processing...</span>
            <span class="progress-pct" id="progress-pct">0%</span>
          </div>
          <div class="progress-track">
            <div class="progress-bar" id="progress-bar"></div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-bar" id="action-bar" style="display:none;">
          <button class="btn btn-primary" id="btn-action">
            <span>🚀 ${config.label} File</span>
          </button>
          <button class="btn btn-secondary" id="btn-clear">Clear</button>
        </div>

        <!-- Result Card -->
        <div class="result-area" id="result-area">
          <!-- Standard single/multi result card (non-split) -->
          <div class="result-card" id="result-card-standard">
            <div class="result-icon">🎉</div>
            <div class="result-info">
              <h4 id="result-title">Conversion Complete!</h4>
              <p id="result-subtitle">Your output is ready for download.</p>
            </div>
            <div class="result-actions" id="result-actions">
              <!-- Dynamically populated download button -->
            </div>
          </div>

          <!-- Split PDF result gallery -->
          <div id="split-result-gallery" style="display:none;">
            <div class="split-gallery-header">
              <div class="split-gallery-title-block">
                <span class="split-gallery-icon">✂️</span>
                <div>
                  <h4 id="split-gallery-title">Split Complete!</h4>
                  <p id="split-gallery-subtitle">Select the pages you want to download.</p>
                </div>
              </div>
              <div class="split-gallery-actions">
                <button class="btn btn-ghost" id="btn-select-all-pages">☑ Select All</button>
                <button class="btn btn-ghost" id="btn-deselect-all-pages">☐ Deselect All</button>
                <button class="btn btn-success" id="btn-download-selected" disabled>📥 Download Selected (<span id="selected-count">0</span>)</button>
              </div>
            </div>
            <div class="split-pages-gallery" id="split-pages-gallery"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // UI elements
  const btnBack = document.getElementById('btn-back');
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const fileList = document.getElementById('file-list');
  const optionsPanel = document.getElementById('options-panel');
  const actionBar = document.getElementById('action-bar');
  const btnAction = document.getElementById('btn-action');
  const btnClear = document.getElementById('btn-clear');
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const progressPct = document.getElementById('progress-pct');
  const resultArea = document.getElementById('result-area');
  const resultActions = document.getElementById('result-actions');

  // Restore cached files on page load if available
  const cachedMeta = restoreCachedFileMetadata(toolId);
  if (cachedMeta && cachedMeta.length > 0) {
    // Create mock File objects for display (files can be re-selected)
    const mockFiles = cachedMeta.map(meta => ({
      name: meta.name,
      size: meta.size,
      type: meta.type,
    }));
    // Update file list to show cached files visually
    fileList.innerHTML = mockFiles.map((file, idx) => `
      <div class="file-item">
        <div class="file-item-icon">${getFileIcon(file.name)}</div>
        <div class="file-item-info">
          <div class="file-item-name">${file.name}</div>
          <div class="file-item-size">${formatBytes(file.size)}</div>
          <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">📋 Cached</div>
        </div>
        <button class="file-item-remove" data-index="${idx}" aria-label="Remove File">✕</button>
      </div>
    `).join('');
    optionsPanel.style.display = 'block';
    actionBar.style.display = 'flex';
  }

  // Reset inactivity timer on user interactions (clicks, changes, etc.)
  function setupActivityTracking() {
    const trackActivity = () => resetInactivityTimer();
    document.getElementById('opt-pagesize')?.addEventListener('change', trackActivity);
    document.getElementById('opt-orientation')?.addEventListener('change', trackActivity);
    document.getElementById('opt-format')?.addEventListener('change', trackActivity);
    document.getElementById('opt-scale')?.addEventListener('change', trackActivity);
    document.getElementById('opt-margin')?.addEventListener('change', trackActivity);
    document.getElementById('opt-fontfamily')?.addEventListener('change', trackActivity);
    document.getElementById('opt-fontsize')?.addEventListener('change', trackActivity);
    document.getElementById('opt-compress-level')?.addEventListener('change', trackActivity);
    document.getElementById('opt-headers')?.addEventListener('change', trackActivity);
    document.getElementById('opt-fit')?.addEventListener('change', trackActivity);
    btnAction?.addEventListener('click', trackActivity);
  }
  setupActivityTracking();

  // Navigation handlers
  btnBack.addEventListener('click', () => navigateTo('home'));

  // Drag and Drop handlers
  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('drag-over');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    if (e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFilesSelected(e.target.files);
    }
  });

  function handleFilesSelected(fileListObj) {
    const filesArray = Array.from(fileListObj);
    const validFiles = filesArray.filter(file => {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      const match = config.accepts.toLowerCase().includes(ext);
      if (!match) {
        showToast(`File type ${ext} not supported for this converter.`, 'error');
      }
      return match;
    });

    if (validFiles.length === 0) return;

    if (config.multiple) {
      selectedFiles = [...selectedFiles, ...validFiles];
    } else {
      selectedFiles = [validFiles[0]];
    }

    // Cache file metadata for persistence across refreshes
    cacheFileMetadata(toolId, selectedFiles);

    renderFileList();
    resultArea.classList.remove('visible');
    progressContainer.classList.remove('visible');

    // Reset inactivity timer on file selection (user activity)
    resetInactivityTimer();

    // Trigger specific rendering if needed (e.g. Split PDF pages)
    if (toolId === 'split-pdf') {
      setupSplitPdfPagePreviews();
    }
  }

  function renderFileList() {
    if (selectedFiles.length === 0) {
      fileList.innerHTML = '';
      optionsPanel.style.display = 'none';
      if (splitPreviewPanel) splitPreviewPanel.style.display = 'none';
      actionBar.style.display = 'none';
      return;
    }

    fileList.innerHTML = selectedFiles.map((file, idx) => `
      <div class="file-item">
        <div class="file-item-icon">${getFileIcon(file.name)}</div>
        <div class="file-item-info">
          <div class="file-item-name">${file.name}</div>
          <div class="file-item-size">${formatBytes(file.size)}</div>
        </div>
        <button class="file-item-remove" data-index="${idx}" aria-label="Remove File">✕</button>
      </div>
    `).join('');

    // Wire up delete buttons
    document.querySelectorAll('.file-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.dataset.index);
        selectedFiles.splice(idx, 1);
        renderFileList();
        if (toolId === 'split-pdf') {
          setupSplitPdfPagePreviews();
        }
      });
    });

    optionsPanel.style.display = 'block';
    actionBar.style.display = 'flex';
    if (toolId === 'split-pdf') {
      if (splitPreviewPanel) splitPreviewPanel.style.display = 'block';
    } else {
      if (splitPreviewPanel) splitPreviewPanel.style.display = 'none';
    }
  }

  function getFileIcon(name) {
    const ext = name.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'].includes(ext)) return '🖼️';
    if (ext === 'pdf') return '📄';
    if (ext === 'docx') return '📝';
    if (['xlsx', 'xls', 'csv'].includes(ext)) return '📊';
    if (ext === 'txt') return '📃';
    if (['html', 'htm'].includes(ext)) return '🌐';
    return '📁';
  }



  async function setupSplitPdfPagePreviews() {
    const panel = document.getElementById('split-preview-panel');
    const grid = document.getElementById('pages-preview-grid');
    if (!grid || !panel) return;
    panel.style.display = 'block';
    grid.innerHTML = '<div style="color:var(--text-secondary); font-size:0.85rem">Loading page count...</div>';
    splitSelectedPages.clear();

    if (selectedFiles.length === 0) {
      panel.style.display = 'none';
      return;
    }

    try {
      // Use getPdfPageCount (pdf-lib based) — no PDF.js worker needed
      const { getPdfPageCount } = await import('../converters/splitPdf.js');
      const numPages = await getPdfPageCount(selectedFiles[0]);
      const blobUrl = URL.createObjectURL(selectedFiles[0]);

      grid.innerHTML = '';
      for (let i = 1; i <= numPages; i++) {
        const thumbDiv = document.createElement('div');
        thumbDiv.className = 'pdf-page-thumb';
        thumbDiv.dataset.page = i;

        // Native embed preview — uses browser PDF renderer, no PDF.js
        thumbDiv.innerHTML = `
          <embed
            src="${blobUrl}#page=${i}&toolbar=0&navpanes=0&scrollbar=0&view=FitH"
            type="application/pdf"
            style="width:100%;height:120px;border:none;pointer-events:none;border-radius:4px;background:#fff;"
          />
          <div class="page-num">Page ${i}</div>
        `;
        grid.appendChild(thumbDiv);

        thumbDiv.addEventListener('click', () => {
          if (splitSelectedPages.has(i)) {
            splitSelectedPages.delete(i);
            thumbDiv.classList.remove('selected');
          } else {
            splitSelectedPages.add(i);
            thumbDiv.classList.add('selected');
          }
        });
      }
    } catch (err) {
      panel.style.display = 'block';
      grid.innerHTML = `<div style="color:#ef4444; font-size:0.85rem">Could not load preview: ${err.message}</div>`;
    }
  }

  // Action Conversion logic
  btnAction.addEventListener('click', async () => {
    if (selectedFiles.length === 0) return;

    btnAction.disabled = true;
    progressContainer.classList.add('visible');
    resultArea.classList.remove('visible');

    const updateProgress = (pct) => {
      progressBar.style.width = pct + '%';
      progressPct.textContent = pct + '%';
    };

    updateProgress(0);
    progressText.textContent = 'Processing files...';

    try {
      if (toolId === 'image-to-pdf') {
        const pageSize = document.getElementById('opt-pagesize').value;
        const orientation = document.getElementById('opt-orientation').value;
        const fitMode = document.getElementById('opt-fit').value;
        const margin = document.getElementById('opt-margin').value;

        convertedBlob = await imageToPdf(selectedFiles, { pageSize, orientation, fitMode, margin }, updateProgress);
        setupSingleDownload(convertedBlob, 'converted.pdf');
      }
      else if (toolId === 'pdf-to-image') {
        const format = document.getElementById('opt-format').value;
        const scale = parseFloat(document.getElementById('opt-scale').value);

        convertedResults = await pdfToImage(selectedFiles[0], { format, scale }, updateProgress);
        setupMultiDownloads(convertedResults);
      }
      
      else if (toolId === 'text-to-pdf') {
        const pageSize = document.getElementById('opt-pagesize').value;
        const fontFamily = document.getElementById('opt-fontfamily').value;
        const fontSize = parseInt(document.getElementById('opt-fontsize').value);

        convertedBlob = await textToPdf(selectedFiles[0], { pageSize, fontFamily, fontSize }, updateProgress);
        setupSingleDownload(convertedBlob, selectedFiles[0].name.replace(/\.txt$/i, '.pdf'));
      }
      else if (toolId === 'html-to-pdf') {
        const pageSize = document.getElementById('opt-pagesize').value;

        convertedBlob = await htmlToPdf(selectedFiles[0], { pageSize }, updateProgress);
        setupSingleDownload(convertedBlob, selectedFiles[0].name.replace(/\.(html|htm)$/i, '.pdf'));
      }
      else if (toolId === 'merge-pdf') {
        convertedBlob = await mergePdfs(selectedFiles, updateProgress);
        setupSingleDownload(convertedBlob, 'merged.pdf');
      }
      else if (toolId === 'split-pdf') {
        let pgs = 'all';
        if (splitSelectedPages.size > 0) {
          pgs = Array.from(splitSelectedPages).sort((a, b) => a - b);
        }
        convertedResults = await splitPdf(selectedFiles[0], pgs, updateProgress);
        // Determine the actual page numbers that were extracted
        const extractedPageNums = pgs === 'all'
          ? convertedResults.map((_, i) => i + 1)
          : pgs;
        await setupSplitResultGallery(convertedResults, selectedFiles[0], extractedPageNums);
      }
      else if (toolId === 'compress-pdf') {
        const level = document.getElementById('opt-compress-level').value;
        const res = await compressPdf(selectedFiles[0], { level }, updateProgress);

        convertedBlob = res.blob;
        document.getElementById('result-subtitle').textContent = `Size reduced from ${formatBytes(res.originalSize)} to ${formatBytes(res.newSize)} (${res.savings}% saved).`;
        setupSingleDownload(convertedBlob, selectedFiles[0].name.replace(/\.pdf$/i, '_compressed.pdf'));
      }
      else if (toolId === 'pdf-to-txt') {
        convertedBlob = await pdfToTxt(selectedFiles[0], updateProgress);
        setupSingleDownload(convertedBlob, selectedFiles[0].name.replace(/\.pdf$/i, '.txt'));
      }

      showToast('Conversion completed successfully!', 'success');
      resultArea.classList.add('visible');
    } catch (err) {
      showToast(err.message || 'Conversion failed.', 'error');
      console.error(err);
    } finally {
      btnAction.disabled = false;
    }
  });

  btnClear.addEventListener('click', () => {
    selectedFiles = [];
    splitSelectedPages.clear();
    convertedBlob = null;
    convertedResults = [];
    clearCache(); // Clear browser cache when user clears files
    renderFileList();
    resultArea.classList.remove('visible');
    progressContainer.classList.remove('visible');
    showToast('Cleared files and cache', 'info');
  });

  function setupSingleDownload(blob, filename) {
    resultActions.innerHTML = '';
    // Make sure standard card is shown, gallery is hidden
    const standardCard = document.getElementById('result-card-standard');
    const galleryEl = document.getElementById('split-result-gallery');
    if (standardCard) standardCard.style.display = 'flex';
    if (galleryEl) galleryEl.style.display = 'none';

    const link = document.createElement('a');
    link.className = 'btn btn-success';
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.innerHTML = `<span>📥 Download</span>`;
    resultActions.appendChild(link);
  }

  function setupMultiDownloads(results) {
    // Used for PDF-to-image results (non-split)
    resultActions.innerHTML = '';
    document.getElementById('result-card-standard').style.display = 'flex';
    document.getElementById('split-result-gallery').style.display = 'none';
    document.getElementById('result-subtitle').textContent = `Extracted ${results.length} files successfully.`;

    if (results.length === 1) {
      setupSingleDownload(results[0].blob, results[0].name);
      return;
    }

    results.forEach(res => {
      const link = document.createElement('a');
      link.className = 'btn btn-secondary';
      link.href = URL.createObjectURL(res.blob);
      link.download = res.name;
      link.style.padding = '8px 14px';
      link.style.fontSize = '0.8rem';
      link.innerHTML = `<span>${res.name}</span>`;
      resultActions.appendChild(link);
    });

    const downloadAll = document.createElement('button');
    downloadAll.className = 'btn btn-success';
    downloadAll.innerHTML = '📥 Download All';
    downloadAll.addEventListener('click', () => {
      results.forEach((res, i) => {
        setTimeout(() => {
          const l = document.createElement('a');
          l.href = URL.createObjectURL(res.blob);
          l.download = res.name;
          l.click();
        }, i * 200);
      });
    });
    resultActions.insertBefore(downloadAll, resultActions.firstChild);
  }

  async function setupSplitResultGallery(results, originalFile, pageNums) {
    // Hide the standard card, show the gallery
    document.getElementById('result-card-standard').style.display = 'none';
    const galleryEl = document.getElementById('split-result-gallery');
    galleryEl.style.display = 'block';

    const galleryGrid = document.getElementById('split-pages-gallery');
    const titleEl = document.getElementById('split-gallery-title');
    const subtitleEl = document.getElementById('split-gallery-subtitle');
    const countEl = document.getElementById('selected-count');
    const btnDownloadSelected = document.getElementById('btn-download-selected');
    const btnSelectAll = document.getElementById('btn-select-all-pages');
    const btnDeselectAll = document.getElementById('btn-deselect-all-pages');

    titleEl.textContent = `Split Complete — ${results.length} page${results.length !== 1 ? 's' : ''} extracted!`;
    subtitleEl.textContent = `Click pages to select, then download your chosen pages.`;
    splitResultSelectedPages.clear();
    galleryGrid.innerHTML = '';

    const updateSelectionUI = () => {
      countEl.textContent = splitResultSelectedPages.size;
      btnDownloadSelected.disabled = splitResultSelectedPages.size === 0;
      btnDownloadSelected.textContent = `📥 Download Selected (${splitResultSelectedPages.size})`;
    };

    // Build all cards immediately using native <embed> for previews
    // Browser's built-in PDF renderer — no PDF.js canvas needed, always works
    results.forEach((res, idx) => {
      const pageNum = pageNums?.[idx] ?? (idx + 1);
      const blobUrl = URL.createObjectURL(res.blob);

      const card = document.createElement('div');
      card.className = 'split-result-card';
      card.dataset.idx = idx;

      // Checkbox
      const checkbox = document.createElement('div');
      checkbox.className = 'split-result-checkbox';
      checkbox.innerHTML = `<span class="checkbox-icon">☐</span>`;

      // Thumbnail — native <embed> preview, instant, no JS rendering needed
      const thumbArea = document.createElement('div');
      thumbArea.className = 'split-result-thumb';
      thumbArea.innerHTML = `
        <embed
          src="${blobUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH"
          type="application/pdf"
          class="split-embed-preview"
        />
      `;

      // Label
      const label = document.createElement('div');
      label.className = 'split-result-label';
      label.innerHTML = `
        <span class="split-page-number">Page ${pageNum}</span>
        <span class="split-page-name">${res.name}</span>
      `;

      // Per-card download button
      const dlBtn = document.createElement('a');
      dlBtn.className = 'split-result-dl-btn';
      dlBtn.href = blobUrl;
      dlBtn.download = res.name;
      dlBtn.innerHTML = '↓ Download';
      dlBtn.title = `Download ${res.name}`;
      dlBtn.addEventListener('click', e => e.stopPropagation());

      card.appendChild(checkbox);
      card.appendChild(thumbArea);
      card.appendChild(label);
      card.appendChild(dlBtn);
      galleryGrid.appendChild(card);

      // Toggle selection
      card.addEventListener('click', () => {
        if (splitResultSelectedPages.has(idx)) {
          splitResultSelectedPages.delete(idx);
          card.classList.remove('selected');
          checkbox.querySelector('.checkbox-icon').textContent = '☐';
        } else {
          splitResultSelectedPages.add(idx);
          card.classList.add('selected');
          checkbox.querySelector('.checkbox-icon').textContent = '☑';
        }
        updateSelectionUI();
      });
    });

    // Select All
    btnSelectAll.addEventListener('click', () => {
      splitResultSelectedPages.clear();
      document.querySelectorAll('.split-result-card').forEach((card, idx) => {
        splitResultSelectedPages.add(idx);
        card.classList.add('selected');
        card.querySelector('.checkbox-icon').textContent = '☑';
      });
      updateSelectionUI();
    });

    // Deselect All
    btnDeselectAll.addEventListener('click', () => {
      splitResultSelectedPages.clear();
      document.querySelectorAll('.split-result-card').forEach(card => {
        card.classList.remove('selected');
        card.querySelector('.checkbox-icon').textContent = '☐';
      });
      updateSelectionUI();
    });

    // Download Selected
    btnDownloadSelected.addEventListener('click', () => {
      const toDownload = Array.from(splitResultSelectedPages).sort((a, b) => a - b);
      toDownload.forEach((idx, i) => {
        setTimeout(() => {
          const l = document.createElement('a');
          l.href = URL.createObjectURL(results[idx].blob);
          l.download = results[idx].name;
          document.body.appendChild(l);
          l.click();
          document.body.removeChild(l);
        }, i * 300);
      });
      showToast(`Downloading ${toDownload.length} page${toDownload.length !== 1 ? 's' : ''}...`, 'success');
    });

    updateSelectionUI();
  }
}
