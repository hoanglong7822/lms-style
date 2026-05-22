const iframe = document.querySelector(".h5p-iframe");

iframe.addEventListener("load", () => {
  const iframeDoc =
    iframe.contentDocument ||
    iframe.contentWindow.document;

  const style =
    iframeDoc.createElement("style");

  style.innerHTML = `
    .h5p-content {
      font-size: 10px !important;
      line-height: 1.5 !important;
    }

    .h5p-question-check-answer {
      display: none !important;
    }
  `;

  iframeDoc.head.appendChild(style);
});