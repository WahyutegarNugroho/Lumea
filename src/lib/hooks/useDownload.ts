import { useCallback, useEffect, useRef } from 'react';
import { downloadFile } from '../utils';

interface UseDownloadResult {
  download: (source: Blob | string, filename: string) => string;
}

export function useDownload(): UseDownloadResult {
  const objectUrls = useRef<string[]>([]);

  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const download = useCallback((source: Blob | string, filename: string) => {
    const isBlob = source instanceof Blob;
    const url = isBlob ? URL.createObjectURL(source) : source;
    if (isBlob) {
      objectUrls.current.push(url);
      setTimeout(() => {
        URL.revokeObjectURL(url);
        objectUrls.current = objectUrls.current.filter((u) => u !== url);
      }, 10000);
    }
    downloadFile(url, filename);
    return url;
  }, []);

  return { download };
}
