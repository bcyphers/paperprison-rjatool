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
            <a className="mr-5 hover:text-gray-900 nav dropbtn" href="https://paperprisons.org/states.html">State Reports</a>
            <div className="dropdown-content states-dropdown">
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/methodology.html">Methodology</a>
              <p><strong><u>50-State Summary:</u></strong></p>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/statistics.html">Statistics</a>
              <p><strong><u>States with Reports:</u></strong></p>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/AL.html">Alabama</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/AK.html">Alaska</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/AZ.html">Arizona</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/AR.html">Arkansas</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/CA.html">California</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/CO.html">Colorado</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/CT.html">Connecticut</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/DE.html">Delaware</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/FL.html">Florida</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/GA.html">Georgia</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/HI.html">Hawaii</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/ID.html">Idaho</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/IL.html">Illinois</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/IN.html">Indiana</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/IA.html">Iowa</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/KS.html">Kansas</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/KY.html">Kentucky</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/LA.html">Louisiana</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/ME.html">Maine</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/MD.html">Maryland</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/MA.html">Massachusetts</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/MI.html">Michigan</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/MN.html">Minnesota</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/MS.html">Mississippi</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/MO.html">Missouri</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/MT.html">Montana</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/NE.html">Nebraska</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/NV.html">Nevada</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/NH.html">New Hampshire</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/NJ.html">New Jersey</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/NM.html">New Mexico</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/NY.html">New York</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/NC.html">North Carolina</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/ND.html">North Dakota</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/OH.html">Ohio</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/OK.html">Oklahoma</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/OR.html">Oregon</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/PA.html">Pennsylvania</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/RI.html">Rhode Island</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/SC.html">South Carolina</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/SD.html">South Dakota</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/TN.html">Tennessee</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/TX.html">Texas</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/UT.html">Utah</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/VT.html">Vermont</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/VA.html">Virginia</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/WA.html">Washington</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/WV.html">West Virginia</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/WI.html">Wisconsin</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/states/WY.html">Wyoming</a>
            </div>
          </span>
          <span className="nav dropbtn">
            <a className="mr-5 hover:text-gray-900 nav dropbtn" href="https://paperprisons.org#">News/Blog</a>
            <div className="dropdown-content">
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/news.html">News</a>
              <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/blog.html?source=rja">Blog</a>
            </div>
          </span>
          <span className="nav dropbtn">
          <a className="mr-5 hover:text-gray-900 nav" href="https://paperprisons.org/diary.html">Diary</a>
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

