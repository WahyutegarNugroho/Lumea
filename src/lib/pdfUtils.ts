type PdfJsLib = typeof import('pdfjs-dist');

let pdfjsInstance: Promise<PdfJsLib> | null = null;

export async function loadPdfjs(): Promise<PdfJsLib> {
  if (!pdfjsInstance) {
    pdfjsInstance = import('pdfjs-dist').then((lib) => {
      lib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${lib.version}/build/pdf.worker.min.mjs`;
      return lib;
    });
  }
  return pdfjsInstance;
}

export async function loadPdfDocument(file: File) {
  const pdfjsLib = await loadPdfjs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  return pdf;
}

export async function renderPageToDataUrl(
  page: import('pdfjs-dist').PDFPageProxy,
  scale: number,
  format?: { type?: string; quality?: number }
): Promise<string> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  if (!context) throw new Error('Failed to get canvas context');
  await page.render({ canvasContext: context, viewport, canvas: canvas }).promise;
  return canvas.toDataURL(format?.type, format?.quality);
}
