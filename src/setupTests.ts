import '@testing-library/jest-dom';

// Add modal-root portal target for all tests
const modalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'modal-root');
document.body.appendChild(modalRoot);
