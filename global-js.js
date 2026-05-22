window.addEventListener("load", () => {
  const interval = setInterval(() => {
    const iframe = document.querySelector(".h5p-iframe");

    if (!iframe) return;

    const iframeDoc =
      iframe.contentDocument ||
      iframe.contentWindow?.document;

    if (!iframeDoc) return;

    clearInterval(interval);

    const style =
      iframeDoc.createElement("style");

    style.innerHTML = `
      .h5p-content {
        font-size: clamp(12px, 1vw + 0.5rem, 18px) !important;
        line-height: 1.6 !important;
      }

      .h5p-question-check-answer {
        display: none !important;
      }

      .h5p-container {
        width: 100vw !important;
        height: 100vh !important;
      }
    `;

    iframeDoc.head.appendChild(style);
  }, 500);
});