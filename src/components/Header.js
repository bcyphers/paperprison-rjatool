import React from "react";

const Header = () => {
  return (
    <div className="rja-tool-header">
      <div className="left">
        <a href="https://paperprisons.org">
          <img
            src="https://paperprisons.org/images/logo.png"
            alt="Paper Prisons RJA Tool"
            className="logo"
          />
        </a>
        <p className="website-name">
          <span className="large-initial">R</span>acial{" "}
          <span className="large-initial">J</span>ustice{" "}
          <span className="large-initial">A</span>ct Tool
        </p>
      </div>
      <div className="right">
        <a href="https://paperprisons.org/about.html">About</a>
        <a href="https://paperprisons.org/states.html">State Reports</a>
        <a href="https://paperprisons.org/news.html">News</a>
        <a href="https://paperprisons.org/blog.html">Blog</a>
        <a href="https://paperprisons.org/diary.html">Diary</a>
      </div>
    </div>
  );
};

export default Header;
