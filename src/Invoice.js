import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Invoice() {
  const navigate = useNavigate();

  const [billNo, setBillNo] = useState("");
  const [billDate, setBillDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [specification, setSpecification] = useState("");

  const [items, setItems] = useState([
    {
      partName: "",
      width: "",
      height: "",
      quantity: "",
      rate: "",
      rateType: "sqft",
      isEditing: true
    }
  ]);

  const addRowAfter = (index) => {
    const newItems = [...items];
    newItems.splice(index + 1, 0, {
      partName: "",
      width: "",
      height: "",
      quantity: "",
      rate: "",
      rateType: "sqft",
      isEditing: true
    });
    setItems(newItems);
  };

  const removeRow = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const toggleEdit = (index, value) => {
    const newItems = [...items];
    newItems[index].isEditing = value;
    setItems(newItems);
  };

  const grandTotal = items.reduce((total, item) => {
    const sqft =
      item.rateType === "sqft" && item.width && item.height
        ? (item.width * item.height) / 92903
        : 0;

    const amount =
      item.rateType === "sqft"
        ? Math.round(sqft * item.quantity * item.rate)
        : Math.round(item.rate * item.quantity);

    return total + (amount || 0);
  }, 0);

  return (
    <>
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

              {!item.isEditing && (
                <>
                  <strong>{index + 1}. {item.partName}</strong>
                  <p>
                    {item.width} × {item.height} mm | Qty {item.quantity} | Rate {item.rate}
                  </p>

                  <button className="add-item" onClick={() => toggleEdit(index, true)}>
                    Edit
                  </button>

                  <button
                    className="add-item"
                    onClick={() => addRowAfter(index)}
                    style={{ marginLeft: "6px" }}
                  >
                    +
                  </button>
                </>
              )}

              {item.isEditing && (
                <>
                  <label>Particulars</label>
                  <input
                    value={item.partName}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].partName = e.target.value;
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

                  <label>Rate</label>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].rate = e.target.value;
                      setItems(newItems);
                    }}
                  />

                  <button
                    className="print-btn"
                    onClick={() => toggleEdit(index, false)}
                  >
                    Done
                  </button>

                  {items.length > 1 && (
                    <button
                      className="remove-item"
                      onClick={() => removeRow(index)}
                      style={{ marginLeft: "8px" }}
                    >
                      ✕
                    </button>
                  )}
                </>
              )}
            </div>
          ))}

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

      {/* PRINT VIEW */}
      <section className="print-only">
        <div className="app">

          <header className="invoice-header">
            <img src="/logo.png" alt="Janus Logo" className="company-logo" />
          </header>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>SI</th>
                  <th>Particulars</th>
                  <th>W</th>
                  <th>H</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const sqft =
                    item.rateType === "sqft"
                      ? (item.width * item.height) / 92903
                      : 0;

                  const amount =
                    item.rateType === "sqft"
                      ? Math.round(sqft * item.quantity * item.rate)
                      : Math.round(item.rate * item.quantity);

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.partName}</td>
                      <td>{item.width}</td>
                      <td>{item.height}</td>
                      <td>{item.quantity}</td>
                      <td>{item.rate}</td>
                      <td>₹{amount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grand-total">
            Grand Total: ₹{grandTotal}
          </div>
        </div>
      </section>
    </>
  );
}

export default Invoice;
