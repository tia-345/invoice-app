import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function History() {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("invoiceHistory") || "[]");
        setHistory(saved);
    }, []);

    const openHistory = (historyItem) => {
        navigate("/invoice", { state: { historyItem } });
    };

    const deleteHistory = (id) => {
        const updated = history.filter(item => item.id !== id);
        setHistory(updated);
        localStorage.setItem("invoiceHistory", JSON.stringify(updated));
    };

    return (
        <div className="home-bg" style={{ overflowY: 'auto' }}>
            <div className="home-card" style={{ maxWidth: '800px', width: '90%', margin: '40px auto' }}>
                <button className="no-print back-btn" onClick={() => navigate("/")} style={{ alignSelf: 'flex-start', marginBottom: '20px' }}>
                    ← Back to Home
                </button>

                <div className="home-content">
                    <h1 className="home-title" style={{ fontSize: '32px' }}>
                        <span className="text-gradient">Invoice History</span>
                    </h1>

                    {history.length === 0 ? (
                        <p className="home-subtitle" style={{ marginTop: '30px' }}>
                            No saved invoices yet. Try creating one first!
                        </p>
                    ) : (
                        <div style={{ marginTop: '40px', textAlign: 'left' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {history.map((item) => (
                                    <div key={item.id} style={{
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        padding: '20px',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <div
                                            style={{ cursor: 'pointer', flex: 1 }}
                                            onClick={() => openHistory(item)}
                                        >
                                            <strong style={{ color: '#fff', fontSize: '1.2em' }}>{item.clientName || 'Unknown Client'}</strong>
                                            <div style={{ color: '#aaa', fontSize: '1em', marginTop: '8px' }}>
                                                Bill No: {item.billNo || 'N/A'} • Date: {item.billDate ? new Date(item.billDate).toLocaleDateString() : 'No date'} • Total: ₹{item.grandTotal || 0}
                                            </div>
                                            <div style={{ color: '#888', fontSize: '0.85em', marginTop: '4px' }}>
                                                Saved At: {new Date(item.savedAt).toLocaleString()}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => openHistory(item)}
                                                style={{
                                                    background: 'rgba(79, 172, 254, 0.2)',
                                                    border: '1px solid rgba(79, 172, 254, 0.5)',
                                                    color: '#4facfe',
                                                    padding: '8px 16px',
                                                    cursor: 'pointer',
                                                    borderRadius: '6px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteHistory(item.id)}
                                                style={{
                                                    background: 'rgba(255, 68, 68, 0.2)',
                                                    border: '1px solid rgba(255, 68, 68, 0.5)',
                                                    color: '#ff4444',
                                                    padding: '8px 16px',
                                                    cursor: 'pointer',
                                                    borderRadius: '6px',
                                                    fontWeight: 'bold'
                                                }}
                                                title="Delete Invoice"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default History;
