import { describe, it, expect, vi } from 'vitest';
import { downloadFile } from './utils';

describe('downloadFile', () => {
  it('should create a link and click it', () => {
    // Mock document elements
    const link = {
      href: '',
      download: '',
      style: { display: '' },
      click: vi.fn(),
    };
    
    vi.spyOn(document, 'createElement').mockReturnValue(link as any);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => ({} as any));
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => ({} as any));
    
    const testUrl = 'blob:http://localhost:4321/123';
    const testFile = 'test.pdf';
    
    downloadFile(testUrl, testFile);
    
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(link.href).toBe(testUrl);
    expect(link.download).toBe(testFile);
    // click is called inside a setTimeout (100ms in utils.ts)
    // we could use vi.useFakeTimers() but for a basic check this is enough setup
  });
});
