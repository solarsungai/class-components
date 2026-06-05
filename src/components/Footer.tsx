export function Footer() {
  return (
    <footer className="app-footer">
      <a 
        href="https://github.com/solarsungai" 
        target="_blank" 
        rel="noreferrer" 
        className="footer-link"
      >
        GitHub
      </a>
      
      <a 
        href="https://rs.school/" 
        target="_blank" 
        rel="noreferrer" 
        className="footer-logo-link"
        aria-label="RS School"
      >
        RSschool
      </a>
      
      <span className="footer-year">2026</span>
    </footer>
  );
}

export default Footer;