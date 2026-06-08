import { describe, it, expect, vi, afterEach } from 'vitest';
import toBase64 from './toBase64';

describe('toBase64', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('resolves with base64 string on success', async () => {
    const mockResult = 'data:image/png;base64,abc123';

    class MockFileReader {
      result = mockResult;
      onload: (() => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      readAsDataURL() {
        if (this.onload) this.onload();
      }
    }

    vi.stubGlobal('FileReader', MockFileReader);

    const file = new File(['content'], 'test.png', { type: 'image/png' });
    const result = await toBase64(file);
    expect(result).toBe(mockResult);
  });

  it('rejects with error on read failure', async () => {
    const mockError = new Error('read error');

    class MockFileReader {
      result = null;
      onload: (() => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      readAsDataURL() {
        if (this.onerror) this.onerror(mockError);
      }
    }

    vi.stubGlobal('FileReader', MockFileReader);

    const file = new File(['content'], 'test.png', { type: 'image/png' });
    await expect(toBase64(file)).rejects.toEqual(mockError);
  });
});
