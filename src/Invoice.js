import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./App.css";

function Invoice() {
  const navigate = useNavigate();
  const location = useLocation();

  const historyData = location.state?.historyItem;

  const [billNo, setBillNo] = useState(historyData?.billNo || "");
  const [billDate, setBillDate] = useState(historyData?.billDate || "");
  const [clientName, setClientName] = useState(historyData?.clientName || "");
  const [clientAddress, setClientAddress] = useState(historyData?.clientAddress || "");
  const [specification, setSpecification] = useState(historyData?.specification || "");

  const [items, setItems] = useState(historyData?.items || [
    {
      partName: "",
      unit: "mm",
      glassThickness: "",
      glassType: "",
      customGlassType: "",
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
      unit: "mm",
      glassThickness: "",
      glassType: "",
      customGlassType: "",
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
    let sqft = 0;
    if (item.rateType === "sqft" && item.width && item.height) {
      if (item.unit === "ft") {
        sqft = item.width * item.height;
      } else {
        sqft = (item.width * item.height) / 92903;
      }
    }

    const amount =
      item.rateType === "sqft"
        ? Math.round(sqft * item.quantity * item.rate)
        : Math.round(item.rate * item.quantity);

    return total + (amount || 0);
  }, 0);

  const saveToHistory = () => {
    const invoiceData = {
      id: historyData?.id || Date.now().toString(),
      billNo,
      billDate,
      clientName,
      clientAddress,
      specification,
      items,
      grandTotal,
      savedAt: new Date().toISOString()
    };

    const existingHistory = JSON.parse(localStorage.getItem('invoiceHistory') || '[]');
    const existingIndex = existingHistory.findIndex(item => item.id === invoiceData.id);

    if (existingIndex !== -1) {
      existingHistory[existingIndex] = invoiceData;
    } else {
      existingHistory.unshift(invoiceData); // Add to beginning
    }

    localStorage.setItem('invoiceHistory', JSON.stringify(existingHistory));
    alert("Invoice saved to history!");
  };

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
          <h2 className="text-gradient" style={{ marginTop: 0 }}>Bill Details</h2>

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

          <h3 className="text-gradient">Items</h3>

          {items.map((item, index) => (
            <div key={index} className="item-row">

              {!item.isEditing && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong>
                      {index + 1}. {item.partName}{" "}
                      {item.glassType ? ` - ${item.glassType === "Other" ? item.customGlassType : item.glassType}` : ""}{" "}
                      {item.glassThickness ? ` (${item.glassThickness})` : ""}
                    </strong>
                    <p>
                      {item.width} × {item.height} {item.unit || "mm"}{" "}
                      {item.rateType === "sqft" && item.width && item.height
                        ? `| Sqft: ${item.unit === "ft" ? (item.width * item.height).toFixed(2) : ((item.width * item.height) / 92903).toFixed(2)} `
                        : ""}
                      | Qty {item.quantity} | Rate {item.rate} ({item.rateType})
                    </p>
                  </div>
                  <div style={{ display: "flex" }}>
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
                  </div>
                </div>
              )}

              {item.isEditing && (
                <div className="edit-grid">
                  <div className="edit-row">
                    <div className="input-group">
                      <label>Particulars</label>
                      <input
                        value={item.partName}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].partName = e.target.value;
                          setItems(newItems);
                        }}
                        placeholder="Window, Door, etc."
                      />
                    </div>
                  </div>

                  <div className="edit-row multi-col">
                    <div className="input-group">
                      <label>Glass Type</label>
                      <select
                        value={item.glassType || ""}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].glassType = e.target.value;
                          if (e.target.value !== "Other") {
                            newItems[index].customGlassType = "";
                          }
                          setItems(newItems);
                        }}
                        className="custom-select"
                      >
                        <option value="">None</option>
                        <option value="Plane">Plane</option>
                        <option value="Toughened">Toughened</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {item.glassType === "Other" && (
                      <div className="input-group">
                        <label>Custom Glass</label>
                        <input
                          value={item.customGlassType || ""}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].customGlassType = e.target.value;
                            setItems(newItems);
                          }}
                          placeholder="Type glass name"
                        />
                      </div>
                    )}

                    <div className="input-group">
                      <label>Thickness</label>
                      <input
                        value={item.glassThickness || ""}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].glassThickness = e.target.value;
                          setItems(newItems);
                        }}
                        placeholder="e.g. 5mm"
                      />
                    </div>
                  </div>

                  <div className="edit-row multi-col">
                    <div className="input-group">
                      <label>Unit</label>
                      <select
                        value={item.unit || "mm"}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].unit = e.target.value;
                          setItems(newItems);
                        }}
                        className="custom-select"
                      >
                        <option value="mm">mm</option>
                        <option value="ft">feet</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Width</label>
                      <input
                        type="number"
                        value={item.width}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].width = e.target.value;
                          setItems(newItems);
                        }}
                      />
                    </div>

                    <div className="input-group">
                      <label>Height</label>
                      <input
                        type="number"
                        value={item.height}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].height = e.target.value;
                          setItems(newItems);
                        }}
                      />
                    </div>
                  </div>

                  <div className="edit-row multi-col">
                    <div className="input-group">
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
                    </div>

                    <div className="input-group">
                      <label>Rate Type</label>
                      <select
                        value={item.rateType || "sqft"}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].rateType = e.target.value;
                          setItems(newItems);
                        }}
                        className="custom-select"
                      >
                        <option value="sqft">Per Sqft</option>
                        <option value="piece">Per Piece</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Rate (₹)</label>
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
                  </div>

                  <div className="edit-actions">
                    <button
                      className="print-btn"
                      onClick={() => toggleEdit(index, false)}
                      style={{ marginBottom: 0 }}
                    >
                      Done
                    </button>

                    {items.length > 1 && (
                      <button
                        className="remove-item flex-center"
                        onClick={() => removeRow(index)}
                        style={{ marginLeft: "8px" }}
                        title="Remove Item"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          <h3 className="text-gradient">Specification / Terms</h3>
          <textarea
            rows="5"
            value={specification}
            onChange={(e) => setSpecification(e.target.value)}
          />
        </section>

        <div className="no-print" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button className="print-btn" onClick={() => window.print()} style={{ flex: 1 }}>
            Download / Print Invoice
          </button>
          <button className="print-btn" onClick={saveToHistory} style={{ flex: 1, backgroundColor: '#4CAF50' }}>
            Save to History
          </button>
        </div>
      </div>

      {/* PRINT VIEW */}
      <section className="print-only">
        <div className="app">

          <header className="invoice-header">
            <img src="/logo.png" alt="Janus Logo" className="company-logo" />
          </header>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', marginTop: '10px' }}>
            <div>
              <strong style={{ fontSize: '1.1em' }}>To:</strong><br />
              <strong>{clientName}</strong><br />
              <div style={{ whiteSpace: 'pre-wrap', marginTop: '5px' }}>{clientAddress}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong>Bill No:</strong> {billNo}<br />
              <strong>Date:</strong> {billDate ? new Date(billDate).toLocaleDateString() : ''}
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>SI</th>
                  <th>Particulars</th>
                  <th>Glass</th>
                  <th>W</th>
                  <th>H</th>
                  <th>Unit</th>
                  <th>Sqft</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  let sqft = 0;
                  if (item.rateType === "sqft" && item.width && item.height) {
                    if (item.unit === "ft") {
                      sqft = item.width * item.height;
                    } else {
                      sqft = (item.width * item.height) / 92903;
                    }
                  }

                  const amount =
                    item.rateType === "sqft"
                      ? Math.round(sqft * item.quantity * item.rate)
                      : Math.round(item.rate * item.quantity);

                  const glassName = item.glassType === "Other" ? item.customGlassType : item.glassType;
                  const glassText = [glassName, item.glassThickness].filter(Boolean).join(" - ");

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.partName}</td>
                      <td>{glassText}</td>
                      <td>{item.width}</td>
                      <td>{item.height}</td>
                      <td>{item.unit || "mm"}</td>
                      <td>{item.rateType === "sqft" && item.width && item.height ? sqft.toFixed(2) : "-"}</td>
                      <td>{item.quantity}</td>
                      <td>{item.rateType === "sqft" ? `${item.rate}/sqft` : item.rate}</td>
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

          {specification && (
            <div className="print-specifications">
              <strong>Specification / Terms:</strong>
              <p style={{ whiteSpace: "pre-wrap", margin: "5px 0 0 0" }}>{specification}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Invoice;
