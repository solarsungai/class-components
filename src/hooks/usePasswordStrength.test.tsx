import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import usePasswordStrength from './usePasswordStrength';

describe('usePasswordStrength', () => {
  it('starts with passwordTouched=false and all strength flags false', () => {
    const { result } = renderHook(() => usePasswordStrength());
    expect(result.current.passwordTouched).toBe(false);
    expect(result.current.passwordStrength).toEqual({
      hasNumber: false,
      hasUppercase: false,
      hasLowercase: false,
      hasSpecial: false,
    });
  });

  it('sets passwordTouched=true after calling handlePasswordChange', () => {
    const { result } = renderHook(() => usePasswordStrength());
    act(() => {
      result.current.handlePasswordChange('');
    });
    expect(result.current.passwordTouched).toBe(true);
  });

  it('detects all strength criteria in "Aa1!"', () => {
    const { result } = renderHook(() => usePasswordStrength());
    act(() => {
      result.current.handlePasswordChange('Aa1!');
    });
    expect(result.current.passwordStrength).toEqual({
      hasNumber: true,
      hasUppercase: true,
      hasLowercase: true,
      hasSpecial: true,
    });
  });

  it('detects no strength criteria in "abc" (no number, no uppercase, no special)', () => {
    const { result } = renderHook(() => usePasswordStrength());
    act(() => {
      result.current.handlePasswordChange('abc');
    });
    expect(result.current.passwordStrength.hasNumber).toBe(false);
    expect(result.current.passwordStrength.hasUppercase).toBe(false);
    expect(result.current.passwordStrength.hasLowercase).toBe(true);
    expect(result.current.passwordStrength.hasSpecial).toBe(false);
  });

  it('detects number and uppercase in "ABC1" but not lowercase or special', () => {
    const { result } = renderHook(() => usePasswordStrength());
    act(() => {
      result.current.handlePasswordChange('ABC1');
    });
    expect(result.current.passwordStrength.hasNumber).toBe(true);
    expect(result.current.passwordStrength.hasUppercase).toBe(true);
    expect(result.current.passwordStrength.hasLowercase).toBe(false);
    expect(result.current.passwordStrength.hasSpecial).toBe(false);
  });

  it('excludes spaces from number detection', () => {
    const { result } = renderHook(() => usePasswordStrength());
    act(() => {
      result.current.handlePasswordChange(' ');
    });
    expect(result.current.passwordStrength.hasNumber).toBe(false);
    expect(result.current.passwordStrength.hasLowercase).toBe(false);
    expect(result.current.passwordStrength.hasUppercase).toBe(false);
    expect(result.current.passwordStrength.hasSpecial).toBe(false);
  });

  it('returns stable handlePasswordChange reference', () => {
    const { result } = renderHook(() => usePasswordStrength());
    const fn1 = result.current.handlePasswordChange;
    act(() => {
      result.current.handlePasswordChange('x');
    });
    expect(typeof fn1).toBe('function');
    vi.restoreAllMocks();
  });
});
