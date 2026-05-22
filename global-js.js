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

      .h5p-question-check-answer {
        display: none !important;
      }
    `;

    iframeDoc.head.appendChild(style);
  }, 500);
});