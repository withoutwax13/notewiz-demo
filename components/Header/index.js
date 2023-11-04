const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="app-logo">NoteWiz Demo</h1>
          <div className="header-right">
            <a
              href="https://www.github.com/withoutwax13"
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-btn"
            >
              Visit Developer's Github
            </a>
            <button className="primary-btn">Subscribe For Full App Early Access</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
