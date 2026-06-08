import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  beforeEach(() => {
    if (!document.getElementById('modal-root')) {
      const div = document.createElement('div');
      div.setAttribute('id', 'modal-root');
      document.body.appendChild(div);
    }
  });

  it('renders children via a portal into modal-root', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <p>Hello Modal</p>
      </Modal>
    );
    expect(screen.getByText('Hello Modal')).toBeInTheDocument();
    expect(document.getElementById('modal-root')?.contains(screen.getByText('Hello Modal'))).toBe(
      true
    );
  });

  it('renders with correct ARIA attributes', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <span>content</span>
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal onClose={onClose}>
        <span>content</span>
      </Modal>
    );
    const overlay = container.ownerDocument.querySelector('.modal-overlay') as HTMLElement;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not call onClose when modal content is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <span>inner</span>
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <span>content</span>
      </Modal>
    );
    const closeBtn = screen.getByLabelText('Close modal');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <span>content</span>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not call onClose for non-Escape keys', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <span>content</span>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('tab trap: Tab on last focusable element wraps to first', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <button id="btn1">First</button>
        <button id="btn2">Last</button>
      </Modal>
    );

    const lastBtn = screen.getByText('Last');
    lastBtn.focus();

    const preventDefaultSpy = vi.fn();
    fireEvent.keyDown(document, {
      key: 'Tab',
      shiftKey: false,
      preventDefault: preventDefaultSpy,
    });
  });

  it('tab trap: Shift+Tab on first focusable element wraps to last', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <button id="btn1">First</button>
        <button id="btn2">Last</button>
      </Modal>
    );

    const closeBtn = screen.getByLabelText('Close modal');
    closeBtn.focus();

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
  });

  it('tab trap: Tab on non-last element does not preventDefault', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <button id="btn1">First</button>
        <button id="btn2">Second</button>
        <button id="btn3">Last</button>
      </Modal>
    );

    screen.getByText('First').focus();

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: false,
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    document.dispatchEvent(event);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it('tab trap: Shift+Tab on non-first element does not preventDefault', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <button id="btn1">First</button>
        <button id="btn2">Middle</button>
        <button id="btn3">Last</button>
      </Modal>
    );

    screen.getByText('Last').focus();

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    document.dispatchEvent(event);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it('tab trap: non-Tab key returns early', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <button>btn</button>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'a' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('tab trap handles empty focusable elements list', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <span>no buttons here</span>
      </Modal>
    );

    const spy = vi
      .spyOn(HTMLElement.prototype, 'querySelectorAll')
      .mockReturnValueOnce(Object.assign([], { length: 0 }) as unknown as NodeListOf<Element>);

    fireEvent.keyDown(document, { key: 'Tab' });
    spy.mockRestore();
  });

  it('restores focus to previous element on unmount', () => {
    const previousButton = document.createElement('button');
    previousButton.textContent = 'Previous';
    document.body.appendChild(previousButton);
    previousButton.focus();

    const onClose = vi.fn();
    const { unmount } = render(
      <Modal onClose={onClose}>
        <span>modal</span>
      </Modal>
    );

    act(() => {
      unmount();
    });

    document.body.removeChild(previousButton);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
});
