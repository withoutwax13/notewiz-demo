const pdfjsLib = require("pdfjs-dist/build/pdf");
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const loadPdf = async (file) => {
  const uri = URL.createObjectURL(file);
  const pdf = await pdfjsLib.getDocument({ url: uri }).promise;

  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    pages.push(page);
  }
  return pages;
};

const renderPageToImage = async (page, scale = 3) => {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!canvas || !context) {
    throw new Error("Canvas or context is null.");
  }

  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = viewport.width * pixelRatio;
  canvas.height = viewport.height * pixelRatio;
  context.scale(pixelRatio, pixelRatio);

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
    enableWebGL: false,
  };

  const renderTask = page.render(renderContext);

  await renderTask.promise;

  return canvas.toDataURL();
};

const pdfToImg = async (file) => {
  try {
    const pages = await loadPdf(file);
    const images = [];

    for (const page of pages) {
      const image = await renderPageToImage(page);
      images.push(image);
    }

    return images;
  } catch (error) {
    console.error("PDF error:", error);
    return [];
  }
};

module.exports = { pdfToImg };
