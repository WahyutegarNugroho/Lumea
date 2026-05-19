/**
 * Shared utilities for Lumea App.
 */

/**
 * Downloads a file from a given URL seamlessly.
 * Designed to replace repeated patterns in tools like PdfMerge, PdfSplit, etc.
 * 
 * @param url The object URL or data URL to download
 * @param filename Target file name
 * @param waitMs Time to wait before cleaning up the element
 */
export function downloadFile(url: string, filename: string, waitMs: number = 3000) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  
  setTimeout(() => {
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, waitMs);
  }, 100);
}
