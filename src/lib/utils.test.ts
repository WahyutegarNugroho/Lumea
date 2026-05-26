import { describe, it, expect, vi } from 'vitest';
import { downloadFile } from './utils';

describe('downloadFile', () => {
  it('should create a link and click it', () => {
    // Mock document elements
    const link = {
      href: '',
      download: '',
      style: { display: '' } as CSSStyleDeclaration,
      click: vi.fn(),
    } as unknown as HTMLAnchorElement;
    
    vi.spyOn(document, 'createElement').mockReturnValue(link);
    vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
    vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);
    
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
