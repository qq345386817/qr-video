document.querySelectorAll('[data-preview-button]').forEach((button) => {
  button.addEventListener('click', () => {
    const image = document.querySelector('#app-preview');
    if (!image) return;
    document.querySelectorAll('[data-preview-button]').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    image.src = button.dataset.previewSrc;
    image.alt = button.dataset.previewAlt;
    const status = document.querySelector('#preview-status');
    if (status) status.textContent = button.textContent.trim();
  });
});
