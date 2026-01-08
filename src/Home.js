import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-bg">
      <div className="app">
        <h1 style={{ color: "#1f7a8c" }}>Invoice Generator</h1>

        <p style={{ fontSize: "15px", marginTop: "10px" }}>
          A simple construction billing tool for WPC & UPVC works.
          Create professional invoices and export them as PDF.
        </p>

        <Link to="/invoice">
          <button
            style={{
              marginTop: "20px",
              backgroundColor: "#1f7a8c",
              color: "white",
              padding: "10px 18px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Create Invoice
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
