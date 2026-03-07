import { Link } from "react-router-dom";
import "./App.css";

function Home() {
  return (
    <div className="home-bg">
      <div className="home-card">
        <div className="home-content">
          <h1 className="home-title">
            <span className="text-gradient">Janus</span><br />
            Invoice Generator
          </h1>

          <p className="home-subtitle">
            A simple, professional construction billing tool for WPC & UPVC works.
            Create beautifully styled invoices and effortlessly export to PDF.
          </p>

          <Link to="/invoice" style={{ textDecoration: 'none' }}>
            <button className="cta-button">
              Create New Invoice
              <span className="arrow">→</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
