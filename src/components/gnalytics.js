import ReactGA from "react-ga";

export const initGA = () => {
  ReactGA.initialize('G-TRXSCTQ2BC');
};

export const logPageView = () => {
  ReactGA.pageview(window.location.pathname + window.location.search);
};