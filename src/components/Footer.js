import React, { useState, useRef, useEffect } from "react";

const Footer = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => {
    // Update the year when the component mounts
    setYear(new Date().getFullYear());
  }, []);
  return (
    <div className="disclaimer footer">
      <a href="mailto:rja@paperprisons.org">rja@paperprisons.org</a>
      <p>{`© ${year}. Paper Prisons Initiative.`} </p>
      <p>Last Modified Date: June 17, 2024</p>
      <p>
        <a href="https://paperprisons.org/privacypolicy.html">Privacy Policy</a>{" "}
        |{" "}
        <a href="https://paperprisons.org/termsandconditions.html">
          Terms and Conditions
        </a>{" "}
        | <a href="https://paperprisons.org/cookiepolicy.html">Cookie Policy</a>
      </p>
    </div>
  );
};
export default Footer;
