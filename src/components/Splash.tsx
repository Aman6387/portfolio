import { portfolio } from "../content/portfolio";
import "./Splash.css";

const Splash = () => {
  return (
    <div className="splash" aria-hidden="true">
      <div className="splash-inner">
        <span className="splash-tag">LOADING</span>
        <h1 className="splash-title">{portfolio.initials}</h1>
        <div className="splash-bar">
          <span className="splash-bar-fill" />
        </div>
      </div>
    </div>
  );
};

export default Splash;
