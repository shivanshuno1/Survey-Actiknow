import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login:', email);
      
      // ✅ CALL YOUR BACKEND API
      const response = await fetch('https://survey-actiknow-3.onrender.com/api/auth/LOGIN', {
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
      console.log('API Response:', data);

      if (data.success) {
        // ✅ Save token to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('Login successful! Redirecting to dashboard...');
        
        // ✅ Redirect to dashboard (or home)
        navigate('/'); // or navigate('/') if that's your dashboard
        
        // If using window.location instead:
        // window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Login</h2>
      
      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ 
            display: 'block', 
            width: '100%',
            margin: '10px 0', 
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ 
            display: 'block', 
            width: '100%',
            margin: '10px 0', 
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '12px 24px', 
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
            marginTop: '10px'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>Don't have an account?</p>
        <button 
          onClick={() => navigate('/register')} 
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go to Register
        </button>
      </div>
      
      {/* Debug info */}
     
    </div>
  );
}

export default Login;

