import { useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { useStellar } from './hooks/useStellar'

// Enter your Soroban Contract ID here
const CONTRACT_ID = "";

function App() {
  const { 
    loading, 
    error, 
    circleStatus, 
    fetchStatus, 
    handleContribute, 
    handleReleasePayout 
  } = useStellar(CONTRACT_ID);

  useEffect(() => {
    if (CONTRACT_ID) {
      fetchStatus();
    }
  }, [fetchStatus]);

  return (
    <div className="app-container">
      <Navbar />
      
      <main className="main-content">
        <header className="page-header">
          <h1>Trust Circles</h1>
          <p>Secure, transparent savings circles powered by Stellar Soroban.</p>
        </header>

        <div className="dashboard-grid">
          <div className="main-col">
            <section className="card">
              <div className="card-title">
                <span>Circle Dashboard</span>
                {circleStatus && (
                  <span className={`status-badge ${circleStatus.active ? 'status-active' : 'status-pending'}`}>
                    {circleStatus.active ? 'Active' : 'Pending'}
                  </span>
                )}
              </div>
              
              {!CONTRACT_ID ? (
                <div style={{ padding: '20px', textAlign: 'center', border: '2px dashed #e5e7eb', borderRadius: '12px' }}>
                  <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                    Welcome! To get started, please provide a Soroban Contract ID in <code>src/App.jsx</code>.
                  </p>
                  <a 
                    href="/create" 
                    className="btn btn-primary"
                    style={{ textDecoration: 'none' }}
                  >
                    Create New Circle
                  </a>
                </div>
              ) : (
                <>
                  {loading && <p>Loading contract state...</p>}
                  {error && <div style={{ padding: '12px', background: '#FEF2F2', color: '#B91C1C', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}
                  
                  {!loading && circleStatus ? (
                    <div className="stats-container">
                      <div className="stat-item">
                        <span className="stat-label">Total Pool</span>
                        <span className="stat-value">{circleStatus.balance || '0.00'} XLM</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Your Contribution</span>
                        <span className="stat-value">100 XLM</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Members</span>
                        <span className="stat-value">8 / 12</span>
                      </div>
                    </div>
                  ) : (
                    !loading && <p style={{ color: '#6b7280', margin: '20px 0' }}>Searching for circle...</p>
                  )}

                  <div className="button-group">
                    <button 
                      className="btn btn-primary"
                      onClick={handleContribute}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Contribute Now'}
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={handleReleasePayout}
                      disabled={loading}
                    >
                      Request Payout
                    </button>
                  </div>
                </>
              )}
            </section>
          </div>

          <aside className="side-col">
            <div className="info-box">
              <h3>How it works</h3>
              <p>
                Trust Circles allow you to save with friends. Every month, members contribute a set amount, 
                and one member receives the full payout. Everything is governed by a secure Soroban smart contract.
              </p>
              <ul style={{ paddingLeft: '20px', marginTop: '12px', fontSize: '14px', color: '#4338CA' }}>
                <li>Automatic payouts</li>
                <li>Verifiable reputation</li>
                <li>Zero-fee management</li>
              </ul>
            </div>
            
            {CONTRACT_ID && (
              <div style={{ marginTop: '24px', padding: '20px', border: '1px dashed #d1d5db', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '14px' }}>Contract Info</h4>
                <code style={{ fontSize: '11px', wordBreak: 'break-all', display: 'block', background: '#f3f4f6' }}>
                  {CONTRACT_ID}
                </code>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}

export default App
