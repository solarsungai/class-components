import { describe, it, expect } from 'vitest';
import schema from './schema';

const validFile = new File(['x'.repeat(100)], 'photo.png', { type: 'image/png' });

const validData = {
  name: 'John',
  age: 25,
  email: 'john@example.com',
  gender: 'male' as const,
  country: 'Germany',
  image: validFile,
  password: 'Pass1!',
  confirmPassword: 'Pass1!',
  terms: true,
};

describe('validation schema', () => {
  it('passes with valid data', () => {
    expect(schema.safeParse(validData).success).toBe(true);
  });

  it('rejects empty name', () => {
    expect(schema.safeParse({ ...validData, name: '' }).success).toBe(false);
  });

  it('rejects name not starting with uppercase', () => {
    const result = schema.safeParse({ ...validData, name: 'john' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.issues.find((i) => i.path[0] === 'name');
      expect(nameError?.message).toMatch(/uppercase/i);
    }
  });

  it('rejects negative age', () => {
    const result = schema.safeParse({ ...validData, age: -1 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const ageError = result.error.issues.find((i) => i.path[0] === 'age');
      expect(ageError).toBeDefined();
    }
  });

  it('accepts age of 0', () => {
    expect(schema.safeParse({ ...validData, age: 0 }).success).toBe(true);
  });

  it('rejects email with no @', () => {
    const result = schema.safeParse({ ...validData, email: 'notanemail' });
    expect(result.success).toBe(false);
  });

  it('rejects email with multiple @', () => {
    const result = schema.safeParse({ ...validData, email: 'a@b@c.com' });
    expect(result.success).toBe(false);
  });

  it('rejects email with empty local part', () => {
    const result = schema.safeParse({ ...validData, email: '@domain.com' });
    expect(result.success).toBe(false);
  });

  it('rejects email without dot in domain', () => {
    const result = schema.safeParse({ ...validData, email: 'user@domain' });
    expect(result.success).toBe(false);
  });

  it('accepts valid email', () => {
    expect(schema.safeParse({ ...validData, email: 'user@domain.com' }).success).toBe(true);
  });

  it('rejects invalid gender', () => {
    const result = schema.safeParse({ ...validData, gender: 'other' });
    expect(result.success).toBe(false);
  });

  it('accepts female gender', () => {
    expect(schema.safeParse({ ...validData, gender: 'female' }).success).toBe(true);
  });

  it('rejects country not in list', () => {
    const result = schema.safeParse({ ...validData, country: 'Narnia' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const err = result.error.issues.find((i) => i.path[0] === 'country');
      expect(err?.message).toMatch(/list/i);
    }
  });

  it('rejects image exceeding 2MB', () => {
    const largeFile = new File(['x'.repeat(3 * 1024 * 1024)], 'big.png', {
      type: 'image/png',
    });
    const result = schema.safeParse({ ...validData, image: largeFile });
    expect(result.success).toBe(false);
    if (!result.success) {
      const err = result.error.issues.find((i) => i.path[0] === 'image');
      expect(err?.message).toMatch(/2MB/);
    }
  });

  it('rejects unsupported image type', () => {
    const gifFile = new File(['content'], 'anim.gif', { type: 'image/gif' });
    const result = schema.safeParse({ ...validData, image: gifFile });
    expect(result.success).toBe(false);
    if (!result.success) {
      const err = result.error.issues.find((i) => i.path[0] === 'image');
      expect(err?.message).toMatch(/png/i);
    }
  });

  it('accepts jpeg image', () => {
    const jpegFile = new File(['content'], 'photo.jpg', { type: 'image/jpeg' });
    expect(schema.safeParse({ ...validData, image: jpegFile }).success).toBe(true);
  });

  it('rejects empty password', () => {
    const result = schema.safeParse({ ...validData, password: '', confirmPassword: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const err = result.error.issues.find((i) => i.path[0] === 'password');
      expect(err).toBeDefined();
    }
  });

  it('rejects empty confirmPassword', () => {
    const result = schema.safeParse({ ...validData, confirmPassword: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const err = result.error.issues.find((i) => i.path[0] === 'confirmPassword');
      expect(err).toBeDefined();
    }
  });

  it('rejects when passwords do not match', () => {
    const result = schema.safeParse({ ...validData, password: 'abc', confirmPassword: 'xyz' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const err = result.error.issues.find((i) => i.path[0] === 'confirmPassword');
      expect(err?.message).toMatch(/match/i);
    }
  });

  it('rejects terms=false', () => {
    const result = schema.safeParse({ ...validData, terms: false });
    expect(result.success).toBe(false);
    if (!result.success) {
      const err = result.error.issues.find((i) => i.path[0] === 'terms');
      expect(err?.message).toMatch(/Terms/i);
    }
  });
});
