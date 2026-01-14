import { useState, useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Calling backend API...');
      
      // ✅ CALL YOUR ACTUAL BACKEND
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password
        }),
      });

      const data = await response.json();
      console.log('Backend response:', data);

      if (data.success) {
        // ✅ Save to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // ✅ Update state
        setIsLoggedIn(true);
        setUserData(data.user);
        
        console.log('Login successful!');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Cannot connect to server. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear everything
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserData(null);
    setEmail('');
    setPassword('');
  };

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            color: '#333',
            marginBottom: '30px'
          }}>
            Login to Survey Dashboard
          </h2>
          
          {error && (
            <div style={{
              backgroundColor: '#fee',
              color: '#c00',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              ⚠️ {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                color: '#555',
                fontWeight: '500'
              }}>
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: error ? '1px solid #c00' : '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                color: '#555',
                fontWeight: '500'
              }}>
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: error ? '1px solid #c00' : '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: loading ? '#aaa' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#5a67d8')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#667eea')}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div style={{ 
            marginTop: '30px', 
            textAlign: 'center',
            color: '#666',
            fontSize: '14px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px'
          }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: '600' }}>
              🔧 Test Credentials (From MongoDB):
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Email:</strong> shivanshu@gmail.com
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Password:</strong> 123456
            </p>
            <button
              onClick={() => {
                setEmail('shivanshu@gmail.com');
                setPassword('123456');
              }}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#e9ecef',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Auto-fill Test Credentials
            </button>
          </div>
          
          <div style={{ 
            marginTop: '20px', 
            textAlign: 'center',
            color: '#666',
            fontSize: '13px'
          }}>
            <p>Backend running on: http://localhost:5000</p>
            <p>Make sure MongoDB and backend server are running!</p>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD PAGE (after login)
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: 'white',
        padding: '20px 40px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            color: '#333',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Survey Dashboard
          </h1>
          {userData && (
            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
              Welcome, {userData.name} ({userData.email})
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px' 
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#333', marginBottom: '10px' }}>
            Welcome to Survey Dashboard! 🎉
          </h2>
          <p style={{ color: '#666', fontSize: '18px' }}>
            You are now logged in successfully.
          </p>
          {userData && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              display: 'inline-block'
            }}>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                <strong>User ID:</strong> {userData.id}
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                <strong>Account Created:</strong> {new Date(userData.created_AT).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Rest of your dashboard content remains the same */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>📊</div>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Total Surveys</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>24</p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>✅</div>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Completed</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#48bb78' }}>18</p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>⏳</div>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>In Progress</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ed8936' }}>6</p>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ color: '#333', marginBottom: '20px' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              borderLeft: '4px solid #667eea'
            }}>
              <strong>Customer Survey</strong> - 156 responses
            </div>
            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              borderLeft: '4px solid #48bb78'
            }}>
              <strong>Employee Feedback</strong> - 89 responses
            </div>
            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              borderLeft: '4px solid #ed8936'
            }}>
              <strong>Product Review</strong> - 42 responses
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;