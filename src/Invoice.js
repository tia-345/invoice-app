import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Invoice() {
  const navigate = useNavigate();

  // Bill details
  const [billNo, setBillNo] = useState("");
  const [billDate, setBillDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [specification, setSpecification] = useState("");

  // Items
  const [items, setItems] = useState([
    {
      partName: "",
      height: "",          // mm (always recorded)
      width: "",           // mm (always recorded)
      glassThickness: "",
      glassType: "Plain",
      quantity: "",
      rate: "",
      rateType: "sqft"     // sqft | fixed
    }
  ]);

  const addRow = () => {
    setItems([
      ...items,
      {
        partName: "",
        height: "",
        width: "",
        glassThickness: "",
        glassType: "Plain",
        quantity: "",
        rate: "",
        rateType: "sqft"
      }
    ]);
  };

  const removeRow = (indexToRemove) => {
    if (items.length === 1) return;
    setItems(items.filter((_, index) => index !== indexToRemove));
  };

  // Grand total (rounded)
  const grandTotal = items.reduce((total, item) => {
    const sqft =
      item.rateType === "sqft" && item.height && item.width
        ? (item.height * item.width) / 92903
        : 0;

    const amount =
      item.rateType === "sqft"
        ? Math.round(sqft * item.quantity * item.rate)
        : Math.round(item.rate * item.quantity);

    return total + amount;
  }, 0);

  return (
    <>
      {/* ================= SCREEN VIEW ================= */}
      <div className="app">

        <button className="no-print back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        <header className="invoice-header">
          <img src="/logo.png" alt="Janus Logo" className="company-logo" />
        </header>

        <section className="no-print">
          <h2>Bill Details</h2>

          <label>Bill Number</label>
          <input value={billNo} onChange={(e) => setBillNo(e.target.value)} />

          <label>Date</label>
          <input type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} />

          <label>To (Client Name)</label>
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} />

          <label>Client Address</label>
          <textarea
            rows="3"
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
          />

          <h3>Items</h3>

          {items.map((item, index) => (
            <div key={index} className="item-row">

              {items.length > 1 && (
                <button
                  className="remove-item"
                  onClick={() => removeRow(index)}
                  style={{ float: "right" }}
                >
                  ✕
                </button>
              )}

              <label>Part Name</label>
              <input
                value={item.partName}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].partName = e.target.value;
                  setItems(newItems);
                }}
              />

              <label>Calculation Type</label>
              <select
                value={item.rateType}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].rateType = e.target.value;
                  setItems(newItems);
                }}
              >
                <option value="sqft">Per Sqft</option>
                <option value="fixed">Fixed Amount</option>
              </select>

              {/* HEIGHT & WIDTH ALWAYS SHOWN */}
              <label>Height (mm)</label>
              <input
                type="number"
                value={item.height}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].height = e.target.value;
                  setItems(newItems);
                }}
              />

              <label>Width (mm)</label>
              <input
                type="number"
                value={item.width}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].width = e.target.value;
                  setItems(newItems);
                }}
              />

              <label>Glass Thickness (mm)</label>
              <input
                type="number"
                value={item.glassThickness}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].glassThickness = e.target.value;
                  setItems(newItems);
                }}
              />

              <label>Glass Type</label>
              <select
                value={item.glassType}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].glassType = e.target.value;
                  setItems(newItems);
                }}
              >
                <option value="Plain">Plain</option>
                <option value="Toughened">Toughened</option>
              </select>

              <label>Quantity</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].quantity = e.target.value;
                  setItems(newItems);
                }}
              />

              <label>
                {item.rateType === "sqft" ? "Rate (per sqft)" : "Fixed Amount"}
              </label>
              <input
                type="number"
                value={item.rate}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].rate = e.target.value;
                  setItems(newItems);
                }}
              />
            </div>
          ))}

          <button className="add-item" onClick={addRow}>
            + Add item
          </button>

          <h3>Specification / Terms</h3>
          <textarea
            rows="5"
            value={specification}
            onChange={(e) => setSpecification(e.target.value)}
          />
        </section>

        <button className="no-print print-btn" onClick={() => window.print()}>
          Download / Print Invoice
        </button>
      </div>

      {/* ================= PRINT VIEW ================= */}
      <section className="print-only">
        <div className="app">

          <header className="invoice-header">
            <img src="/logo.png" alt="Janus Logo" className="company-logo" />
          </header>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <strong>To:</strong>
              <p>{clientName}</p>
              <p style={{ whiteSpace: "pre-line" }}>{clientAddress}</p>
            </div>

            <div style={{ textAlign: "right" }}>
              <p><strong>Bill No:</strong> {billNo}</p>
              <p><strong>Date:</strong> {billDate}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Part</th>
                <th>Calc</th>
                <th>H (mm)</th>
                <th>W (mm)</th>
                <th>Glass</th>
                <th>Type</th>
                <th>Sqft</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const sqft =
                  item.rateType === "sqft" && item.height && item.width
                    ? (item.height * item.width) / 92903
                    : null;

                const amount =
                  item.rateType === "sqft"
                    ? Math.round((sqft || 0) * item.quantity * item.rate)
                    : Math.round(item.rate * item.quantity);

                return (
                  <tr key={index}>
                    <td>{item.partName}</td>
                    <td>{item.rateType === "sqft" ? "Sqft" : "Fixed"}</td>
                    <td>{item.height}</td>
                    <td>{item.width}</td>
                    <td>{item.glassThickness || "-"}</td>
                    <td>{item.glassType}</td>
                    <td>{sqft ? sqft.toFixed(2) : "—"}</td>
                    <td>{item.quantity}</td>
                    <td>{item.rate}</td>
                    <td>₹{amount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="grand-total">
            Grand Total: ₹{grandTotal}
          </div>

          <div className="spec-box">
            <strong>Specifications & Terms</strong>
            <p style={{ whiteSpace: "pre-line" }}>{specification}</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Invoice;
