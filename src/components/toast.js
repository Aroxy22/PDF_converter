// Toast notification component
let toastContainer = null;

function getContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = 'info', duration = 4000) {
  const container = getContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };

  toast.innerHTML = `
    <span style="font-size:18px">${icons[type] || icons.info}</span>
    <span>${message}</span>
    <button class="toast-close" aria-label="Close">✕</button>
  `;

  const closeBtn = toast.querySelector('.toast-close');
  const dismiss = () => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 300);
  };

  closeBtn.addEventListener('click', dismiss);
  container.appendChild(toast);

  if (duration > 0) setTimeout(dismiss, duration);
  return dismiss;
}
