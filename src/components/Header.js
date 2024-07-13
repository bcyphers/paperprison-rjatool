import React, { useState, useEffect, useRef } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    if (window.innerWidth <= 845) {
      setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          hamburgerRef.current && !hamburgerRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      if (scrollTop > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [isMenuOpen]);

  return (
    <div className="rja-tool-header">
      <div className="header-left">
        <a href="https://paperprisons.org" className="logo-link">
          <img
            src="https://paperprisons.org/images/logo.png"
            alt="Paper Prisons RJA Tool"
            className="logo"
          />
        </a>
      </div>
      <div className="header-center">
        <h1 className="website-name">Racial Justice Act Tool <span className="beta">[beta]</span></h1>
      </div>
      <div className="header-right">
        {(isScrolled && !isMenuOpen) ? null : (
          <button ref={hamburgerRef} className="hamburger-menu" onClick={toggleMenu}>
            ☰
          </button>
        )}
        <nav ref={menuRef} className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
          <span className={`nav dropbtn ${activeDropdown === 'about' ? 'active' : ''}`} onClick={() => toggleDropdown('about')}>
            <a className="mr-5 hover:text-gray-900 nav dropbtn" href="https://paperprisons.org/about.html">About</a>
            <div className="dropdown-content">
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/SecondChanceGap.html">What is the Second Chance Gap?</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/team.html">Team</a>
              <p><strong><u>Research Papers:</u> &nbsp;&nbsp;&nbsp;</strong></p>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/PaperPrisons.html">- The Second Chance Gap Paper</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/LossOfEarnings.html">- Loss of Earnings Paper</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/ProvingRacialDisparity.html">- Proving Racial Disparity Paper</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/RJATool.html">- RJA Data Tool Paper</a>
            </div>
          </span>
          <span className={`nav dropbtn ${activeDropdown === 'news' ? 'active' : ''}`} onClick={() => toggleDropdown('news')}>
            <a className="mr-5 hover:text-gray-900 nav dropbtn" href="https://paperprisons.org/blog.html?source=rja">News/Blog</a>
            <div className="dropdown-content">
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/news.html?source=rja">News</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/blog.html?source=rja">Blog</a>
            </div>
          </span>
          <span className="nav dropbtn">
            <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/diary.html?source=rja">Diary</a>
          </span>
          <span className="nav dropbtn">
            <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/RJA">RJA <span className="text-gray-900">[beta]</span></a>
          </span>
        </nav>
      </div>
    </div>
  );
}

export default Header;