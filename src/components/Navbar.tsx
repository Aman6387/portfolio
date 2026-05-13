import { portfolio } from "../content/portfolio";
import "./Navbar.css";

const Navbar = () => {
  return (
    <>
      <header className="header">
        <a href="#" className="navbar-title">
          {portfolio.initials}.
        </a>
        <a href={`mailto:${portfolio.email}`} className="navbar-connect">
          {portfolio.email}
        </a>
        <ul>
          <li>
            <a href="#about">ABOUT</a>
          </li>
          <li>
            <a href="#work">WORK</a>
          </li>
          <li>
            <a href="#contact">CONTACT</a>
          </li>
        </ul>
      </header>
      <div className="landing-circle1" aria-hidden="true" />
      <div className="landing-circle2" aria-hidden="true" />
      <div className="nav-fade" aria-hidden="true" />
    </>
  );
};

export default Navbar;
