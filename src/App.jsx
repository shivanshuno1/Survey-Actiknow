import { useState, useEffect } from 'react';

// Sidebar Item Component
const SidebarItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      padding: '12px 20px',
      backgroundColor: active ? '#e3f2fd' : 'transparent',
      color: active ? '#007bff' : '#666',
      border: 'none',
      borderLeft: active ? '4px solid #007bff' : '4px solid transparent',
      cursor: 'pointer',
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: active ? '600' : '400',
      transition: 'all 0.2s',
      ':hover': {
        backgroundColor: '#f8f9fa'
      }
    }}
  >
    <span style={{ fontSize: '18px' }}>{icon}</span>
    {label}
  </button>
);

function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);

  // Dashboard State
  const [activeSection, setActiveSection] = useState('surveys');
  const [surveys, setSurveys] = useState([
    { id: 1, name: 'Leadership Assessment', description: 'Evaluate leadership competencies' },
    { id: 2, name: 'Technical Skills Review', description: 'Assess technical capabilities' },
    { id: 3, name: '360 Degree Feedback', description: 'Comprehensive performance review' }
  ]);

  const [competencies, setCompetencies] = useState([
    { id: 1, name: 'Communication', category: 'Behavioral', questionsCount: 8 },
    { id: 2, name: 'JavaScript Proficiency', category: 'Technical', questionsCount: 12 },
    { id: 3, name: 'Team Leadership', category: 'Leadership', questionsCount: 10 }
  ]);

  const [questions, setQuestions] = useState([
    { id: 1, text: 'How effectively does the team communicate?', type: 'Rating Scale', competency: 'Communication' },
    { id: 2, text: 'Rate proficiency in React.js', type: 'Multiple Choice', competency: 'JavaScript Proficiency' }
  ]);

  const [availableUsers, setAvailableUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', department: 'Sales' }
  ]);

  const [assessments, setAssessments] = useState([
    { id: 1, name: 'Q1 Performance Review', user: 'John Doe', status: 'Completed' },
    { id: 2, name: 'Leadership Assessment', user: 'Jane Smith', status: 'In Progress' },
    { id: 3, name: 'Technical Evaluation', user: 'Bob Johnson', status: 'Pending' }
  ]);

  // Check if user is already logged in
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
      console.log('Calling backend API for login...');
      
      // ✅ CALL YOUR BACKEND LOGIN ENDPOINT
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
      console.log('Login response:', data);

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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      console.log('Calling backend API for registration...');
      
      // ✅ CALL YOUR BACKEND REGISTER ENDPOINT
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password
        }),
      });

      const data = await response.json();
      console.log('Register response:', data);

      if (data.success) {
        alert('Registration successful! You can now login.');
        // Switch to login mode
        setIsRegisterMode(false);
        // Clear form
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError('Cannot connect to server. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserData(null);
    setEmail('');
    setPassword('');
  };

  // LOGIN/REGISTER PAGE
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
          {/* Toggle buttons */}
          <div style={{
            display: 'flex',
            marginBottom: '30px',
            borderBottom: '2px solid #eee'
          }}>
            <button
              onClick={() => setIsRegisterMode(false)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: !isRegisterMode ? '#667eea' : 'transparent',
                color: !isRegisterMode ? 'white' : '#666',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: '6px 6px 0 0',
                transition: 'all 0.3s'
              }}
            >
              Login
            </button>
            <button
              onClick={() => setIsRegisterMode(true)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: isRegisterMode ? '#48bb78' : 'transparent',
                color: isRegisterMode ? 'white' : '#666',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: '6px 6px 0 0',
                transition: 'all 0.3s'
              }}
            >
              Register
            </button>
          </div>

          <h2 style={{ 
            textAlign: 'center', 
            color: '#333',
            marginBottom: '30px'
          }}>
            {isRegisterMode ? 'Create Account' : 'Login to Survey Dashboard'}
          </h2>
          
          {error && (
            <div style={{
              backgroundColor: '#fee',
              color: '#c00',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              ⚠️ {error}
            </div>
          )}
          
          <form onSubmit={isRegisterMode ? handleRegister : handleLogin}>
            {/* Name field only for registration */}
            {isRegisterMode && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  color: '#555',
                  fontWeight: '500'
                }}>
                  Full Name:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required={isRegisterMode}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}
            
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
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
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
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            {/* Confirm Password field only for registration */}
            {isRegisterMode && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  color: '#555',
                  fontWeight: '500'
                }}>
                  Confirm Password:
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required={isRegisterMode}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}
            
            {/* Single submit button - changes based on mode */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: loading ? '#aaa' : (isRegisterMode ? '#48bb78' : '#667eea'),
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => !loading && (
                e.target.style.backgroundColor = isRegisterMode ? '#38a169' : '#5a67d8'
              )}
              onMouseOut={(e) => !loading && (
                e.target.style.backgroundColor = isRegisterMode ? '#48bb78' : '#667eea'
              )}
            >
              {loading ? (
                <>
                  <span style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px',
                    verticalAlign: 'middle'
                  }}></span>
                  {isRegisterMode ? 'Creating Account...' : 'Logging in...'}
                </>
              ) : (
                isRegisterMode ? 'Create Account' : 'Login'
              )}
            </button>
          </form>
          
          <div style={{ 
            marginTop: '20px', 
            textAlign: 'center',
            color: '#666',
            fontSize: '14px'
          }}>
            {isRegisterMode ? (
              <p>
                Already have an account?{' '}
                <button 
                  onClick={() => {
                    setIsRegisterMode(false);
                    setError('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#667eea',
                    cursor: 'pointer',
                    fontWeight: '600',
                    textDecoration: 'underline',
                    fontSize: '14px'
                  }}
                >
                  Login here
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button 
                  onClick={() => {
                    setIsRegisterMode(true);
                    setError('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#48bb78',
                    cursor: 'pointer',
                    fontWeight: '600',
                    textDecoration: 'underline',
                    fontSize: '14px'
                  }}
                >
                  Register here
                </button>
              </p>
            )}
            
            {!isRegisterMode && (
              <div style={{ 
                marginTop: '15px', 
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                fontSize: '12px'
              }}>
                <p><strong>For testing:</strong></p>
                <p>Backend: http://localhost:5000</p>
                <p>Make sure MongoDB is running</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD PAGE (after login) - Keep your existing dashboard code
// DASHBOARD PAGE (after login)
return (
  <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex' }}>
    {/* Sidebar Navigation */}
    <div style={{
      width: '250px',
      backgroundColor: 'white',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
      padding: '20px 0',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #eee' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Admin Dashboard</h3>
        {userData && (
          <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
            {userData.name} ({userData.role || 'Admin'})
          </p>
        )}
      </div>

      <div style={{ flex: 1, padding: '20px 0' }}>
        <SidebarItem 
          icon="📊" 
          label="Surveys" 
          active={activeSection === 'surveys'}
          onClick={() => setActiveSection('surveys')}
        />
        <SidebarItem 
          icon="🎯" 
          label="Competencies" 
          active={activeSection === 'competencies'}
          onClick={() => setActiveSection('competencies')}
        />
        <SidebarItem 
          icon="❓" 
          label="Questions" 
          active={activeSection === 'questions'}
          onClick={() => setActiveSection('questions')}
        />
        <SidebarItem 
          icon="👥" 
          label="Users" 
          active={activeSection === 'users'}
          onClick={() => setActiveSection('users')}
        />
        <SidebarItem 
          icon="📝" 
          label="Assessment" 
          active={activeSection === 'assessment'}
          onClick={() => setActiveSection('assessment')}
        />
        <SidebarItem 
          icon="⚙️" 
          label="Settings" 
          active={activeSection === 'settings'}
          onClick={() => setActiveSection('settings')}
        />
      </div>

      <div style={{ padding: '20px', borderTop: '1px solid #eee' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>

    {/* Main Content Area */}
    <div style={{ flex: 1 }}>
      {/* Top Navigation */}
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
            WebkitTextFillColor: 'transparent',
            fontSize: '24px'
          }}>
            {activeSection === 'surveys' && 'Survey Management'}
            {activeSection === 'competencies' && 'Competency Management'}
            {activeSection === 'questions' && 'Question Bank'}
            {activeSection === 'users' && 'User Management'}
            {activeSection === 'assessment' && 'Assessment Section'}
            {activeSection === 'settings' && 'Settings'}
          </h1>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
            {activeSection === 'surveys' && 'Create and manage different surveys'}
            {activeSection === 'competencies' && 'Define and organize competencies'}
            {activeSection === 'questions' && 'Manage questions for each competency'}
            {activeSection === 'users' && 'Select users for surveys'}
            {activeSection === 'assessment' && 'Conduct and view assessments'}
            {activeSection === 'settings' && 'Configure system settings'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#666' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </nav>

      {/* Dynamic Content Based on Selection */}
      <main style={{ 
        padding: '30px' 
      }}>
        {activeSection === 'surveys' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ margin: 0, color: '#333' }}>Available Surveys</h2>
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}>
                + Create New Survey
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {surveys.map(survey => (
                <div key={survey.id} style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ marginTop: 0 }}>{survey.name}</h3>
                  <p style={{ color: '#666' }}>{survey.description}</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button style={{
                      padding: '8px 15px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>
                      Edit
                    </button>
                    <button style={{
                      padding: '8px 15px',
                      backgroundColor: '#ffc107',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>
                      Assign
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'competencies' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ margin: 0, color: '#333' }}>Competencies</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px'
                }}>
                  <option>Select Category</option>
                  <option>Technical</option>
                  <option>Behavioral</option>
                  <option>Leadership</option>
                </select>
                <button style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>
                  + Add Competency
                </button>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Competency</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Category</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Questions</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {competencies.map(comp => (
                    <tr key={comp.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px' }}>{comp.name}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          padding: '5px 10px',
                          backgroundColor: comp.category === 'Technical' ? '#e3f2fd' : 
                                         comp.category === 'Behavioral' ? '#f3e5f5' : '#e8f5e8',
                          borderRadius: '20px',
                          fontSize: '12px'
                        }}>
                          {comp.category}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>{comp.questionsCount}</td>
                      <td style={{ padding: '15px' }}>
                        <button style={{
                          padding: '5px 10px',
                          backgroundColor: '#17a2b8',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginRight: '5px'
                        }}>
                          View Questions
                        </button>
                        <button style={{
                          padding: '5px 10px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'questions' && (
          <div>
            <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>Question Bank</h2>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '20px', 
                  borderRadius: '10px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  marginBottom: '20px'
                }}>
                  <h3 style={{ marginTop: 0 }}>Add New Question</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <select style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}>
                      <option>Select Competency</option>
                      {competencies.map(comp => (
                        <option key={comp.id} value={comp.id}>{comp.name}</option>
                      ))}
                    </select>
                    <textarea 
                      placeholder="Enter question text..."
                      style={{ 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '6px',
                        minHeight: '100px',
                        resize: 'vertical'
                      }}
                    />
                    <select style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}>
                      <option>Question Type</option>
                      <option>Multiple Choice</option>
                      <option>Rating Scale</option>
                      <option>Text Response</option>
                    </select>
                    <button style={{
                      padding: '10px 20px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      alignSelf: 'flex-start'
                    }}>
                      Add Question
                    </button>
                  </div>
                </div>
              </div>
              
              <div style={{ flex: 2 }}>
                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '20px', 
                  borderRadius: '10px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ marginTop: 0 }}>Existing Questions</h3>
                  {questions.map((q, index) => (
                    <div key={q.id} style={{ 
                      padding: '15px', 
                      borderBottom: '1px solid #eee',
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>{q.text}</strong>
                        <span style={{ 
                          padding: '3px 8px',
                          backgroundColor: '#eee',
                          borderRadius: '10px',
                          fontSize: '12px'
                        }}>
                          {q.type}
                        </span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginTop: '10px',
                        fontSize: '14px',
                        color: '#666'
                      }}>
                        <span>Competency: {q.competency}</span>
                        <div>
                          <button style={{
                            padding: '5px 10px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '5px',
                            fontSize: '12px'
                          }}>
                            Edit
                          </button>
                          <button style={{
                            padding: '5px 10px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ margin: 0, color: '#333' }}>Available Users for Survey</h2>
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>👤</span> Add New User
              </button>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <select style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  width: '300px'
                }}>
                  <option>Select Survey to Assign Users</option>
                  {surveys.map(survey => (
                    <option key={survey.id} value={survey.id}>{survey.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: '15px'
              }}>
                {availableUsers.map(user => (
                  <div key={user.id} style={{
                    padding: '15px',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#007bff',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}>
                      {user.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{user.email}</div>
                      <div style={{ fontSize: '11px', color: '#888' }}>{user.department}</div>
                    </div>
                    <div>
                      <input 
                        type="radio" 
                        name="selectedUser" 
                        value={user.id}
                        style={{ transform: 'scale(1.2)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ 
                marginTop: '30px', 
                paddingTop: '20px', 
                borderTop: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>Selected Users:</strong>
                  <span style={{ marginLeft: '10px', color: '#666' }}>0 users selected</span>
                </div>
                <button style={{
                  padding: '10px 30px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>
                  Assign Selected Users
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'assessment' && (
          <div>
            <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>Assessment Section</h2>
            
            <div style={{ 
              backgroundColor: 'white', 
              padding: '25px', 
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h3 style={{ marginTop: 0, color: '#333' }}>Active Assessments</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {assessments.map(assessment => (
                  <div key={assessment.id} style={{
                    padding: '20px',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    backgroundColor: assessment.status === 'Completed' ? '#f8fff8' : 
                                   assessment.status === 'In Progress' ? '#fff8e1' : '#f8f9fa'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0 }}>{assessment.name}</h4>
                      <span style={{
                        padding: '3px 10px',
                        backgroundColor: assessment.status === 'Completed' ? '#28a745' : 
                                       assessment.status === 'In Progress' ? '#ffc107' : '#6c757d',
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '12px'
                      }}>
                        {assessment.status}
                      </span>
                    </div>
                    <p style={{ color: '#666', fontSize: '14px', margin: '10px 0' }}>
                      User: {assessment.user}
                    </p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      <button style={{
                        padding: '8px 15px',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}>
                        View Details
                      </button>
                      {assessment.status === 'Pending' && (
                        <button style={{
                          padding: '8px 15px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}>
                          Start Assessment
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '25px', 
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginTop: 0, color: '#333' }}>Create New Assessment</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Select Survey</label>
                  <select style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '6px' 
                  }}>
                    <option>Choose a survey...</option>
                    {surveys.map(survey => (
                      <option key={survey.id} value={survey.id}>{survey.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Select User</label>
                  <select style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '6px' 
                  }}>
                    <option>Choose a user...</option>
                    {availableUsers.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button style={{
                marginTop: '20px',
                padding: '12px 30px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px'
              }}>
                Create Assessment
              </button>
            </div>
          </div>
        )}

        {activeSection === 'settings' && (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '30px', 
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>Settings</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div>
                <h3 style={{ color: '#333' }}>System Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Default Assessment Duration (days)</label>
                    <input 
                      type="number" 
                      defaultValue="7"
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '6px' 
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Notification Email</label>
                    <input 
                      type="email" 
                      defaultValue="admin@example.com"
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '6px' 
                      }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 style={{ color: '#333' }}>User Preferences</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input type="checkbox" defaultChecked />
                      Email notifications for new assessments
                    </label>
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input type="checkbox" defaultChecked />
                      Auto-save assessment progress
                    </label>
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input type="checkbox" />
                      Require assessment approval
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <button style={{
              marginTop: '30px',
              padding: '12px 30px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Save Settings
            </button>
          </div>
        )}
      </main>
    </div>
  </div>
);
}

export default App;