import React from "react";

const Header = () => {
  return (
    <div className="rja-tool-header">
      <div className="left">
        <a href="https://paperprisons.orghttps://paperprisons.org">
          <img
            src="https://paperprisons.org/images/logo.png"
            alt="Paper Prisons RJA Tool"
            className="logo"
          />
        </a>
      </div>
      <div className="center">
        <p className="website-name">Racial Justice Act Tool <span className="beta">[beta]</span></p>
      </div>
      <div className="container mx-auto px-4">
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <span className="nav dropbtn">
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
          <span className="nav dropbtn">
            <a className="mr-5 hover:text-gray-900 nav dropbtn" href="https://paperprisons.org/blog.html?source=rja">News/Blog</a>
            <div className="dropdown-content">
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/news.html?source=rja">News</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/blog.html?source=rja">Blog</a>
            </div>
          </span>
          <span className="nav dropbtn">
          <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/rja-diary.html">Diary</a>
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

