import { Link } from "react-router-dom";
import "./App.css";

function Home() {
  return (
    <div className="home-bg" style={{ overflowY: 'auto' }}>
      <div className="home-card" style={{ maxWidth: '600px', width: '90%', margin: '40px auto' }}>
        <div className="home-content">
          <h1 className="home-title">
            <span className="text-gradient">Janus</span><br />
            Invoice Generator
          </h1>

          <p className="home-subtitle">
            A simple, professional construction billing tool for WPC & UPVC works.
            Create beautifully styled invoices and effortlessly export to PDF.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <Link to="/invoice" style={{ textDecoration: 'none' }}>
              <button className="cta-button">
                Create New Invoice
                <span className="arrow">→</span>
              </button>
            </Link>

            <Link to="/history" style={{ textDecoration: 'none' }}>
              <button className="cta-button" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: 'none'
              }}>
                View Saved History
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
