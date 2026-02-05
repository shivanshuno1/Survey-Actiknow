import { useState, useEffect } from 'react';
import './App.css';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [apiToken, setApiToken] = useState('');

  // Dashboard State
  const [activeSection, setActiveSection] = useState('surveys');
  const [logViewMode, setLogViewMode] = useState('all'); // 'all', 'my', 'assigned'
  
  // Notification State
  const [notification, setNotification] = useState(null);
  
  // Selected Log State
  const [selectedLog, setSelectedLog] = useState(null);
  
  // Surveys
  const [surveys, setSurveys] = useState([
    { 
      id: 1, 
      name: 'Leadership Assessment', 
      description: 'Evaluate leadership competencies', 
      assignedTo: [1, 2],
      competencies: [1, 3]
    },
    { 
      id: 2, 
      name: 'Technical Skills Review', 
      description: 'Assess technical capabilities', 
      assignedTo: [2],
      competencies: [2]
    },
    { 
      id: 3, 
      name: '360 Degree Feedback', 
      description: 'Comprehensive performance review', 
      assignedTo: [],
      competencies: [1, 2, 3]
    }
  ]);
  const [newSurvey, setNewSurvey] = useState({ 
    name: '', 
    description: '' 
  });
  const [selectedCompetencies, setSelectedCompetencies] = useState([]);

  // Competencies
  const [competencies, setCompetencies] = useState([
    { 
      id: 1, 
      name: 'Communication Skills', 
      category: 'Behavioral', 
      questionsCount: 4,
      description: 'Ability to convey information clearly and effectively'
    },
    { 
      id: 2, 
      name: 'JavaScript Proficiency', 
      category: 'Technical', 
      questionsCount: 5,
      description: 'Proficiency in JavaScript programming language'
    },
    { 
      id: 3, 
      name: 'Team Leadership', 
      category: 'Leadership', 
      questionsCount: 6,
      description: 'Ability to lead and motivate team members'
    },
    { 
      id: 4, 
      name: 'Problem Solving', 
      category: 'Analytical', 
      questionsCount: 4,
      description: 'Ability to analyze complex issues and find effective solutions'
    },
    { 
      id: 5, 
      name: 'Time Management', 
      category: 'Interpersonal', 
      questionsCount: 3,
      description: 'Ability to prioritize tasks and manage time efficiently'
    }
  ]);
  const [newCompetency, setNewCompetency] = useState({ 
    name: '', 
    category: 'Technical',
    description: '' 
  });

  // Questions
  const [questions, setQuestions] = useState([
    // Questions for Communication Skills (competencyId: 1)
    { 
      id: 1, 
      text: 'How effectively does the candidate express ideas in written reports?', 
      type: 'Rating Scale', 
      competencyId: 1,
      competencyName: 'Communication Skills'
    },
    { 
      id: 2, 
      text: 'Rate the candidate\'s ability to present complex information clearly to stakeholders.', 
      type: 'Rating Scale', 
      competencyId: 1,
      competencyName: 'Communication Skills'
    },
    { 
      id: 3, 
      text: 'How well does the candidate listen and respond to feedback during discussions?', 
      type: 'Multiple Choice', 
      competencyId: 1,
      competencyName: 'Communication Skills'
    },
    { 
      id: 4, 
      text: 'Describe an instance where the candidate demonstrated exceptional communication skills.', 
      type: 'Text Response', 
      competencyId: 1,
      competencyName: 'Communication Skills'
    },

    // Questions for JavaScript Proficiency (competencyId: 2)
    { 
      id: 5, 
      text: 'How would you rate the candidate\'s knowledge of JavaScript ES6+ features?', 
      type: 'Rating Scale', 
      competencyId: 2,
      competencyName: 'JavaScript Proficiency'
    },
    { 
      id: 6, 
      text: 'Can the candidate effectively debug and troubleshoot JavaScript errors?', 
      type: 'Yes/No', 
      competencyId: 2,
      competencyName: 'JavaScript Proficiency'
    },
    { 
      id: 7, 
      text: 'Rate the candidate\'s proficiency with React.js or similar frontend frameworks.', 
      type: 'Rating Scale', 
      competencyId: 2,
      competencyName: 'JavaScript Proficiency'
    },
    { 
      id: 8, 
      text: 'How experienced is the candidate with state management in modern JavaScript applications?', 
      type: 'Multiple Choice', 
      competencyId: 2,
      competencyName: 'JavaScript Proficiency'
    },
    { 
      id: 9, 
      text: 'Describe the candidate\'s experience with testing JavaScript applications.', 
      type: 'Text Response', 
      competencyId: 2,
      competencyName: 'JavaScript Proficiency'
    },

    // Questions for Team Leadership (competencyId: 3)
    { 
      id: 10, 
      text: 'How effectively does the candidate delegate tasks and responsibilities to team members?', 
      type: 'Rating Scale', 
      competencyId: 3,
      competencyName: 'Team Leadership'
    },
    { 
      id: 11, 
      text: 'Rate the candidate\'s ability to motivate team members during challenging projects.', 
      type: 'Rating Scale', 
      competencyId: 3,
      competencyName: 'Team Leadership'
    },
    { 
      id: 12, 
      text: 'How well does the candidate handle conflicts between team members?', 
      type: 'Multiple Choice', 
      competencyId: 3,
      competencyName: 'Team Leadership'
    },
    { 
      id: 13, 
      text: 'Does the candidate set clear goals and expectations for the team?', 
      type: 'Yes/No', 
      competencyId: 3,
      competencyName: 'Team Leadership'
    },
    { 
      id: 14, 
      text: 'How effective is the candidate in mentoring junior team members?', 
      type: 'Rating Scale', 
      competencyId: 3,
      competencyName: 'Team Leadership'
    },
    { 
      id: 15, 
      text: 'Describe the candidate\'s approach to team building and collaboration.', 
      type: 'Text Response', 
      competencyId: 3,
      competencyName: 'Team Leadership'
    },

    // Questions for Problem Solving (competencyId: 4)
    { 
      id: 16, 
      text: 'How effectively does the candidate analyze complex problems before proposing solutions?', 
      type: 'Rating Scale', 
      competencyId: 4,
      competencyName: 'Problem Solving'
    },
    { 
      id: 17, 
      text: 'Rate the candidate\'s creativity in finding innovative solutions to challenges.', 
      type: 'Rating Scale', 
      competencyId: 4,
      competencyName: 'Problem Solving'
    },
    { 
      id: 18, 
      text: 'How well does the candidate break down large problems into manageable parts?', 
      type: 'Multiple Choice', 
      competencyId: 4,
      competencyName: 'Problem Solving'
    },
    { 
      id: 19, 
      text: 'Describe a challenging problem the candidate solved and their approach.', 
      type: 'Text Response', 
      competencyId: 4,
      competencyName: 'Problem Solving'
    },

    // Questions for Time Management (competencyId: 5)
    { 
      id: 20, 
      text: 'How effectively does the candidate prioritize tasks based on importance and urgency?', 
      type: 'Rating Scale', 
      competencyId: 5,
      competencyName: 'Time Management'
    },
    { 
      id: 21, 
      text: 'Rate the candidate\'s ability to meet deadlines consistently.', 
      type: 'Rating Scale', 
      competencyId: 5,
      competencyName: 'Time Management'
    },
    { 
      id: 22, 
      text: 'How well does the candidate manage multiple projects simultaneously?', 
      type: 'Multiple Choice', 
      competencyId: 5,
      competencyName: 'Time Management'
    }
  ]);
  const [newQuestion, setNewQuestion] = useState({ 
    text: '', 
    type: 'Multiple Choice', 
    competencyId: '' 
  });

  // Users - Loaded from Database
  const [availableUsers, setAvailableUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', department: '' });
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedSurveyForAssignment, setSelectedSurveyForAssignment] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState('');

  // Assessments
  const [assessments, setAssessments] = useState([
    { 
      id: 1, 
      name: 'Q1 Performance Review', 
      userId: 1, 
      userName: 'John Doe', 
      status: 'Completed', 
      surveyId: 1,
      assignedBy: 'admin1',
      assignedByName: 'Admin User',
      assignedAt: '2024-01-15T10:30:00Z'
    },
    { 
      id: 2, 
      name: 'Leadership Assessment', 
      userId: 2, 
      userName: 'Jane Smith', 
      status: 'In Progress', 
      surveyId: 1,
      assignedBy: 'admin1',
      assignedByName: 'Admin User',
      assignedAt: '2024-01-20T14:45:00Z'
    },
    { 
      id: 3, 
      name: 'Technical Evaluation', 
      userId: 3, 
      userName: 'Bob Johnson', 
      status: 'Pending', 
      surveyId: 2,
      assignedBy: 'admin2',
      assignedByName: 'Supervisor',
      assignedAt: '2024-01-25T09:15:00Z'
    }
  ]);
  const [newAssessment, setNewAssessment] = useState({ surveyId: '', userId: '' });

  // Assessment Logs
  const [assessmentLogs, setAssessmentLogs] = useState([
    {
      id: 1,
      assessmentId: 1,
      assessmentName: 'Q1 Performance Review',
      userName: 'John Doe',
      userId: 1,
      surveyId: 1,
      surveyName: 'Leadership Assessment',
      submittedAt: '2024-01-20T15:30:00Z',
      responses: {
        1: '4',
        2: '5',
        3: 'Option A',
        4: 'Excellent communication demonstrated in the quarterly report.'
      },
      totalQuestions: 4,
      answeredQuestions: 4,
      assignedBy: 'admin1',
      assignedByName: 'Admin User'
    },
    {
      id: 2,
      assessmentId: 2,
      assessmentName: 'Technical Evaluation',
      userName: 'Bob Johnson',
      userId: 3,
      surveyId: 2,
      surveyName: 'Technical Skills Review',
      submittedAt: '2024-01-26T11:20:00Z',
      responses: {
        5: '5',
        6: 'Yes',
        7: '4',
        8: 'Option B',
        9: 'Extensive experience with Jest and React Testing Library.'
      },
      totalQuestions: 5,
      answeredQuestions: 5,
      assignedBy: 'admin2',
      assignedByName: 'Supervisor'
    }
  ]);

  // Settings
  const [settings, setSettings] = useState({
    defaultDuration: 7,
    notificationEmail: 'admin@example.com',
    emailNotifications: true,
    autoSave: true,
    requireApproval: false
  });

  // API Base URL - Use environment variable or fallback to local
  const API_BASE_URL = import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : 'http://localhost:5000/api';

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(storedUser));
      setApiToken(token);
    }
  }, []);

  // Load users from database when logged in
  useEffect(() => {
    if (isLoggedIn && apiToken) {
      fetchUsersFromDatabase();
    }
  }, [isLoggedIn, apiToken]);

  // Load initial data from localStorage
  useEffect(() => {
    if (isLoggedIn) {
      const savedSurveys = localStorage.getItem('surveys');
      const savedCompetencies = localStorage.getItem('competencies');
      const savedQuestions = localStorage.getItem('questions');
      const savedAssessments = localStorage.getItem('assessments');
      const savedSettings = localStorage.getItem('settings');
      const savedLogs = localStorage.getItem('assessmentLogs');

      if (savedSurveys) setSurveys(JSON.parse(savedSurveys));
      if (savedCompetencies) setCompetencies(JSON.parse(savedCompetencies));
      if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
      if (savedAssessments) setAssessments(JSON.parse(savedAssessments));
      if (savedSettings) setSettings(JSON.parse(savedSettings));
      if (savedLogs) setAssessmentLogs(JSON.parse(savedLogs));
    }
  }, [isLoggedIn]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('surveys', JSON.stringify(surveys));
      localStorage.setItem('competencies', JSON.stringify(competencies));
      localStorage.setItem('questions', JSON.stringify(questions));
      localStorage.setItem('assessments', JSON.stringify(assessments));
      localStorage.setItem('settings', JSON.stringify(settings));
      localStorage.setItem('assessmentLogs', JSON.stringify(assessmentLogs));
    }
  }, [surveys, competencies, questions, assessments, settings, assessmentLogs, isLoggedIn]);

  // Handle assessment completion
  useEffect(() => {
    console.log('Completion effect triggered. location.state:', location.state);
    
    if (location.state?.assessmentCompleted) {
      console.log('Assessment completion detected');
      const { assessmentId, responses } = location.state;
      
      console.log('Current assessmentLogs:', assessmentLogs);
      
      // Check if we already have a log for this assessment that was just created (within last 5 seconds)
      const recentLog = assessmentLogs.find(log => 
        log.assessmentId === assessmentId && 
        new Date() - new Date(log.submittedAt) < 5000
      );
      
      if (recentLog) {
        console.log('Recent log found, skipping');
        return; // Already processed this submission
      }
      
      // Find the assessment to get its details
      const completedAssessment = assessments.find(a => a.id === assessmentId);
      console.log('Completed assessment:', completedAssessment);
      
      if (completedAssessment) {
        // Create a log entry for this assessment submission
        const logEntry = {
          id: Date.now(),
          assessmentId: assessmentId,
          assessmentName: completedAssessment.name,
          userName: completedAssessment.userName,
          userId: completedAssessment.userId,
          surveyId: completedAssessment.surveyId,
          surveyName: surveys.find(s => s.id === completedAssessment.surveyId)?.name,
          submittedAt: new Date().toISOString(),
          responses: responses,
          totalQuestions: Object.keys(responses).length,
          answeredQuestions: Object.values(responses).filter(r => r !== '' && r !== null && r !== undefined).length,
          // Store who assigned this assessment
          assignedBy: completedAssessment.assignedBy,
          assignedByName: completedAssessment.assignedByName
        };
        
        console.log('Creating log entry:', logEntry);
        
        // Add log entry
        setAssessmentLogs(prev => {
          console.log('Previous logs:', prev);
          const newLogs = [logEntry, ...prev];
          console.log('New logs:', newLogs);
          return newLogs;
        });
      }
      
      // Update assessment status to "Completed"
      setAssessments(prev => 
        prev.map(a => 
          a.id === assessmentId 
            ? { ...a, status: 'Completed', responses: responses }
            : a
        )
      );
      
      // Show success notification
      setNotification({
        type: 'success',
        message: 'Assessment submitted successfully!',
        show: true
      });
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(prev => prev ? { ...prev, show: false } : null);
      }, 5000);
   
      // Clear the location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.assessmentCompleted, assessments, surveys]);

  // Fetch users from database
  const fetchUsersFromDatabase = async () => {
    setLoadingUsers(true);
    setUserError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setAvailableUsers(data.users || []);
      } else {
        setUserError(data.message || 'Failed to load users');
        // Fallback to demo data if API fails
        setAvailableUsers([
          { _id: '1', name: 'John Doe', email: 'john@example.com', department: 'Engineering' },
          { _id: '2', name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing' },
          { _id: '3', name: 'Bob Johnson', email: 'bob@example.com', department: 'Sales' },
          { _id: '4', name: 'Alice Brown', email: 'alice@example.com', department: 'HR' },
          { _id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', department: 'Finance' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setUserError('Cannot connect to server. Using demo data.');
      // Fallback to demo data
      setAvailableUsers([
        { _id: '1', name: 'John Doe', email: 'john@example.com', department: 'Engineering' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing' },
        { _id: '3', name: 'Bob Johnson', email: 'bob@example.com', department: 'Sales' },
        { _id: '4', name: 'Alice Brown', email: 'alice@example.com', department: 'HR' },
        { _id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', department: 'Finance' }
      ]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
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

      if (data.success) {
        const token = data.token;
        const user = data.user;
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update state
        setIsLoggedIn(true);
        setUserData(user);
        setApiToken(token);
        setError('');
        
        // Fetch users from database after login
        fetchUsersFromDatabase();
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
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
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

      if (data.success) {
        alert('Registration successful! You can now login.');
        setIsRegisterMode(false);
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
    setApiToken('');
    setEmail('');
    setPassword('');
    setAvailableUsers([]);
  };

  // Add new user to database
  const handleCreateUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      alert('Please enter name and email');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      const data = await response.json();

      if (data.success) {
        // Refresh users list from database
        fetchUsersFromDatabase();
        setNewUser({ name: '', email: '', department: '' });
        alert('User added successfully!');
      } else {
        alert(data.message || 'Failed to add user');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      alert('Cannot connect to server. User not saved.');
    }
  };

  // Survey Functions
  const handleCreateSurvey = () => {
    if (!newSurvey.name.trim()) {
      alert('Please enter survey name');
      return;
    }

    if (selectedCompetencies.length === 0) {
      alert('Please select at least one competency');
      return;
    }

    const newSurveyObj = {
      id: surveys.length + 1,
      name: newSurvey.name,
      description: newSurvey.description,
      assignedTo: [],
      competencies: selectedCompetencies
    };

    setSurveys([...surveys, newSurveyObj]);
    setNewSurvey({ name: '', description: '' });
    setSelectedCompetencies([]);
    alert('Survey created successfully!');
  };

  // Function to handle viewing assessment details
  const handleViewAssessment = (assessment) => {
    console.log('Opening assessment:', assessment.id);
    
    // Check authorization - only allow if user is assigned OR user is admin
    const isAssignedUser = assessment.userId === userData._id || assessment.userId === userData.id;
    const isAdmin = userData.role === 'Admin' || userData.role === 'admin';
    
    if (!isAssignedUser && !isAdmin) {
      setNotification({
        type: 'error',
        message: 'You are not authorized to access this assessment!',
        show: true
      });
      setTimeout(() => {
        setNotification(prev => prev ? { ...prev, show: false } : null);
      }, 4000);
      return;
    }
    
    // Find the survey for this assessment
    const survey = surveys.find(s => s.id === assessment.surveyId);
    
    if (!survey) {
      alert('Survey not found for this assessment');
      return;
    }
    
    // Get all competencies for this survey
    const surveyCompetencies = competencies.filter(comp => 
      survey.competencies.includes(comp.id)
    );
    
    if (surveyCompetencies.length === 0) {
      alert('No competencies found for this survey');
      return;
    }
    
    // Get all questions for these competencies
    const questionsForAssessment = [];
    surveyCompetencies.forEach(comp => {
      const compQuestions = questions.filter(q => q.competencyId === comp.id);
      questionsForAssessment.push(...compQuestions);
    });
    
    if (questionsForAssessment.length === 0) {
      alert('No questions found for this assessment');
      return;
    }
    
    console.log(`Found ${questionsForAssessment.length} questions for assessment`);
    
    // Initialize responses object
    const initialResponses = {};
    questionsForAssessment.forEach(q => {
      initialResponses[q.id] = '';
    });
    
    // Navigate to assessment page with state
    navigate(`/assessment/${assessment.id}`, {
      state: {
        assessment: assessment,
        survey: survey,
        competencies: surveyCompetencies,
        questions: questionsForAssessment,
        responses: initialResponses,
        userName: assessment.userName,
        currentUser: userData
      }
    });
    
    // Update assessment status to "In Progress"
    if (assessment.status === 'Pending') {
      handleUpdateAssessmentStatus(assessment.id, 'In Progress');
    }
  };

  const handleDeleteSurvey = (id) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      setSurveys(surveys.filter(survey => survey.id !== id));
      setAssessments(assessments.filter(assessment => assessment.surveyId !== id));
    }
  };

  // Competency Functions
  const handleCreateCompetency = () => {
    if (!newCompetency.name.trim()) {
      alert('Please enter competency name');
      return;
    }

    const newCompetencyObj = {
      id: competencies.length + 1,
      name: newCompetency.name,
      category: newCompetency.category,
      description: newCompetency.description,
      questionsCount: 0
    };

    setCompetencies([...competencies, newCompetencyObj]);
    setNewCompetency({ name: '', category: 'Technical', description: '' });
    alert('Competency created successfully!');
  };

  const handleDeleteCompetency = (id) => {
    if (window.confirm('Are you sure you want to delete this competency?')) {
      setCompetencies(competencies.filter(comp => comp.id !== id));
      // Also remove questions for this competency
      setQuestions(questions.filter(q => q.competencyId !== id));
      // Remove from surveys that include this competency
      setSurveys(surveys.map(survey => ({
        ...survey,
        competencies: survey.competencies.filter(compId => compId !== id)
      })));
    }
  };

  const handleUpdateAssessmentStatus = (assessmentId, newStatus) => {
    console.log('Updating assessment:', assessmentId, 'to status:', newStatus);
    
    if (newStatus === 'Completed') {
      // Use functional update to ensure we have the latest state
      setAssessments(prevAssessments => {
        const updated = prevAssessments.filter(assessment => assessment.id !== assessmentId);
        console.log(`Removed assessment ${assessmentId}. Before: ${prevAssessments.length}, After: ${updated.length}`);
        return updated;
      });
      
      // Optional: Show a temporary message
      setTimeout(() => {
        alert('Assessment completed and removed!');
      }, 100);
    } else {
      // Use functional update for status changes too
      setAssessments(prevAssessments => 
        prevAssessments.map(assessment => 
          assessment.id === assessmentId 
            ? { ...assessment, status: newStatus }
            : assessment
        )
      );
    }
  };

  // Question Functions
  const handleCreateQuestion = () => {
    if (!newQuestion.text.trim()) {
      alert('Please enter question text');
      return;
    }

    if (!newQuestion.competencyId) {
      alert('Please select a competency');
      return;
    }

    const competency = competencies.find(c => c.id === parseInt(newQuestion.competencyId));
    
    const newQuestionObj = {
      id: questions.length + 1,
      text: newQuestion.text,
      type: newQuestion.type,
      competencyId: competency.id,
      competencyName: competency.name
    };

    setQuestions([...questions, newQuestionObj]);
    
    // Update question count for competency
    setCompetencies(competencies.map(comp => 
      comp.id === parseInt(newQuestion.competencyId) 
        ? { ...comp, questionsCount: comp.questionsCount + 1 }
        : comp
    ));

    setNewQuestion({ text: '', type: 'Multiple Choice', competencyId: '' });
    alert('Question added successfully!');
  };

  const handleDeleteQuestion = (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const questionToDelete = questions.find(q => q.id === id);
      setQuestions(questions.filter(q => q.id !== id));
      
      // Update question count for competency
      if (questionToDelete) {
        setCompetencies(competencies.map(comp => 
          comp.id === questionToDelete.competencyId && comp.questionsCount > 0
            ? { ...comp, questionsCount: comp.questionsCount - 1 }
            : comp
        ));
      }
    }
  };

  const handleUserSelection = (userId) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle assigning users to survey (with assigner tracking)
  const handleAssignUsersToSurvey = () => {
    if (!selectedSurveyForAssignment) {
      alert('Please select a survey first');
      return;
    }

    if (selectedUserIds.length === 0) {
      alert('Please select at least one user');
      return;
    }

    // Update survey's assigned users
    setSurveys(surveys.map(survey => 
      survey.id === parseInt(selectedSurveyForAssignment)
        ? { ...survey, assignedTo: [...new Set([...survey.assignedTo, ...selectedUserIds])] }
        : survey
    ));

    // Create assessments for ALL assigned users
    const survey = surveys.find(s => s.id === parseInt(selectedSurveyForAssignment));
    const newAssessments = [];

    // Get the highest current assessment ID
    const maxAssessmentId = assessments.length > 0 
      ? Math.max(...assessments.map(a => a.id))
      : 0;

    selectedUserIds.forEach((userId, index) => {
      const user = availableUsers.find(u => u._id === userId);
      const existingAssessment = assessments.find(a => 
        a.userId === userId && a.surveyId === parseInt(selectedSurveyForAssignment)
      );

      if (!existingAssessment && user) {
        // Generate unique ID - starting from maxAssessmentId + 1
        const newAssessmentId = maxAssessmentId + index + 1;

        const newAssessmentObj = {
          id: newAssessmentId,
          name: `${survey.name} - ${user.name}`,
          userId: userId,
          userName: user.name,
          status: 'Pending',
          surveyId: survey.id,
          // Store who assigned this assessment
          assignedBy: userData._id || userData.id,
          assignedByName: userData.name,
          assignedAt: new Date().toISOString()
        };
        newAssessments.push(newAssessmentObj);
      }
    });

    // Add all new assessments at once
    if (newAssessments.length > 0) {
      setAssessments(prevAssessments => [...prevAssessments, ...newAssessments]);
    }

    setSelectedUserIds([]);
    alert(`Users assigned successfully! ${newAssessments.length} new assessment(s) created.`);
  };

  // Create assessment (with assigner tracking)
  const handleCreateAssessment = () => {
    if (!newAssessment.surveyId || !newAssessment.userId) {
      alert('Please select both survey and user');
      return;
    }

    const survey = surveys.find(s => s.id === parseInt(newAssessment.surveyId));
    const user = availableUsers.find(u => u._id === newAssessment.userId);

    if (!survey || !user) {
      alert('Invalid survey or user selection');
      return;
    }

    // Check if assessment already exists for this user and survey
    const existingAssessment = assessments.find(a => 
      a.userId === user._id && a.surveyId === survey.id
    );

    if (existingAssessment) {
      alert(`Assessment already exists for ${user.name} on ${survey.name}`);
      return;
    }

    // Generate unique ID
    const maxAssessmentId = assessments.length > 0 
      ? Math.max(...assessments.map(a => a.id))
      : 0;
    const newAssessmentId = maxAssessmentId + 1;

    const newAssessmentObj = {
      id: newAssessmentId,
      name: `${survey.name} - ${user.name}`,
      userId: user._id,
      userName: user.name,
      status: 'Pending',
      surveyId: survey.id,
      // Store who assigned this assessment
      assignedBy: userData._id || userData.id,
      assignedByName: userData.name,
      assignedAt: new Date().toISOString()
    };

    setAssessments(prev => [...prev, newAssessmentObj]);
    setNewAssessment({ surveyId: '', userId: '' });
    
    // Update survey's assigned users
    setSurveys(prevSurveys => prevSurveys.map(s => 
      s.id === survey.id 
        ? { ...s, assignedTo: [...new Set([...s.assignedTo, user._id])] }
        : s
    ));

    alert('Assessment created successfully!');
  };

  // Settings Functions
  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
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
                  onClick={() => setIsRegisterMode(false)}
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
                  onClick={() => setIsRegisterMode(true)}
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
            
            <div style={{ 
              marginTop: '15px', 
              padding: '10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              fontSize: '12px'
            }}>
              <p><strong>Backend Requirements:</strong></p>
              <p>Make sure backend is running on http://localhost:5000</p>
              <p>Backend should have:</p>
              <ul style={{ textAlign: 'left', margin: '5px 0', paddingLeft: '20px' }}>
                <li>POST /api/auth/login</li>
                <li>POST /api/auth/register</li>
                <li>GET /api/users (protected)</li>
                <li>POST /api/users (protected)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD PAGE (after login)
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex' }}>
      {/* Notification Toast */}
      {notification?.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '16px 24px',
          backgroundColor: notification.type === 'success' ? '#28a745' : '#dc3545',
          color: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '400px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <span style={{ fontSize: '20px' }}>
            {notification.type === 'success' ? '✓' : '✕'}
          </span>
          <span style={{ fontWeight: '500' }}>
            {notification.message}
          </span>
          <button
            onClick={() => setNotification(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '18px',
              marginLeft: 'auto',
              padding: '0',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            ×
          </button>
        </div>
      )}
      
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

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
            icon="📋" 
            label="Logs" 
            active={activeSection === 'logs'}
            onClick={() => setActiveSection('logs')}
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
              {activeSection === 'logs' && 'Assessment Logs'}
              {activeSection === 'settings' && 'Settings'}
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
              {activeSection === 'surveys' && 'Create and manage different surveys'}
              {activeSection === 'competencies' && 'Define and organize competencies'}
              {activeSection === 'questions' && 'Manage questions for each competency'}
              {activeSection === 'users' && 'Select users for surveys'}
              {activeSection === 'assessment' && 'Conduct and view assessments'}
              {activeSection === 'logs' && 'View all assessment submissions and responses'}
              {activeSection === 'settings' && 'Configure system settings'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: '#666' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </nav>

        {/* Dynamic Content Based on Selection */}
        <main style={{ padding: '30px' }}>
          {activeSection === 'surveys' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>Available Surveys</h2>
                <div>
                  <button 
                    onClick={handleCreateSurvey}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    + Create New Survey
                  </button>
                </div>
              </div>

              {/* Create Survey Form */}
              <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '20px'
              }}>
                <h3 style={{ marginTop: 0 }}>Create New Survey</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Survey Name</label>
                    <input
                      type="text"
                      value={newSurvey.name}
                      onChange={(e) => setNewSurvey({...newSurvey, name: e.target.value})}
                      placeholder="Enter survey name"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
                    <input
                      type="text"
                      value={newSurvey.description}
                      onChange={(e) => setNewSurvey({...newSurvey, description: e.target.value})}
                      placeholder="Enter description"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                </div>
                
                {/* Competency Selection for Survey */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Select Competencies to Include:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {competencies.map(comp => (
                      <label key={comp.id} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '5px',
                        padding: '8px 12px',
                        backgroundColor: selectedCompetencies.includes(comp.id) ? '#e3f2fd' : '#f8f9fa',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          checked={selectedCompetencies.includes(comp.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCompetencies([...selectedCompetencies, comp.id]);
                            } else {
                              setSelectedCompetencies(selectedCompetencies.filter(id => id !== comp.id));
                            }
                          }}
                          style={{ marginRight: '5px' }}
                        />
                        <span>
                          {comp.name} 
                          <span style={{ 
                            marginLeft: '5px', 
                            fontSize: '12px', 
                            color: '#666',
                            backgroundColor: comp.category === 'Technical' ? '#e3f2fd' : 
                                           comp.category === 'Behavioral' ? '#f3e5f5' : 
                                           comp.category === 'Leadership' ? '#e8f5e8' :
                                           comp.category === 'Analytical' ? '#fff3cd' : '#f8d7da',
                            padding: '2px 6px',
                            borderRadius: '10px'
                          }}>
                            {comp.category}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={handleCreateSurvey}
                  disabled={!newSurvey.name.trim() || selectedCompetencies.length === 0}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: !newSurvey.name.trim() || selectedCompetencies.length === 0 ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: !newSurvey.name.trim() || selectedCompetencies.length === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Create Survey
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {surveys.map(survey => {
                  // Get competencies for this survey
                  const surveyCompetencies = competencies.filter(comp => 
                    survey.competencies.includes(comp.id)
                  );
                  
                  return (
                    <div key={survey.id} style={{
                      backgroundColor: 'white',
                      padding: '20px',
                      borderRadius: '10px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>
                      <h3 style={{ marginTop: 0 }}>{survey.name}</h3>
                      <p style={{ color: '#666' }}>{survey.description}</p>
                      
                      {/* Display competencies for this survey */}
                      <div style={{ margin: '10px 0' }}>
                        <strong style={{ fontSize: '14px' }}>Competencies Assessed:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                          {surveyCompetencies.map(comp => (
                            <span key={comp.id} style={{
                              padding: '3px 8px',
                              backgroundColor: comp.category === 'Technical' ? '#e3f2fd' : 
                                             comp.category === 'Behavioral' ? '#f3e5f5' : 
                                             comp.category === 'Leadership' ? '#e8f5e8' :
                                             comp.category === 'Analytical' ? '#fff3cd' : '#f8d7da',
                              borderRadius: '12px',
                              fontSize: '12px'
                            }}>
                              {comp.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <p style={{ fontSize: '14px', color: '#888' }}>
                        Questions: {surveyCompetencies.reduce((total, comp) => total + comp.questionsCount, 0)} total
                      </p>
                      <p style={{ fontSize: '14px', color: '#888' }}>
                        Assigned to: {survey.assignedTo.length} user(s)
                      </p>
                      
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
                        }}
                        onClick={() => {
                          setActiveSection('users');
                          setSelectedSurveyForAssignment(survey.id);
                        }}
                        >
                          Assign Users
                        </button>
                        <button 
                          onClick={() => handleDeleteSurvey(survey.id)}
                          style={{
                            padding: '8px 15px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection === 'competencies' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>Competencies</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={handleCreateCompetency}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    + Add Competency
                  </button>
                </div>
              </div>

              {/* Create Competency Form */}
              <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '20px'
              }}>
                <h3 style={{ marginTop: 0 }}>Add New Competency</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Competency Name</label>
                    <input
                      type="text"
                      value={newCompetency.name}
                      onChange={(e) => setNewCompetency({...newCompetency, name: e.target.value})}
                      placeholder="Enter competency name"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Category</label>
                    <select 
                      value={newCompetency.category}
                      onChange={(e) => setNewCompetency({...newCompetency, category: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px'
                      }}
                    >
                      <option value="Technical">Technical</option>
                      <option value="Behavioral">Behavioral</option>
                      <option value="Leadership">Leadership</option>
                      <option value="Analytical">Analytical</option>
                      <option value="Interpersonal">Interpersonal</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
                  <textarea
                    value={newCompetency.description}
                    onChange={(e) => setNewCompetency({...newCompetency, description: e.target.value})}
                    placeholder="Describe what this competency assesses"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                <button 
                  onClick={handleCreateCompetency}
                  disabled={!newCompetency.name.trim()}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: !newCompetency.name.trim() ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: !newCompetency.name.trim() ? 'not-allowed' : 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Add Competency
                </button>
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
                    {competencies.map(comp => {
                      // Get questions for this specific competency
                      const competencyQuestions = questions.filter(q => q.competencyId === comp.id);
                      
                      return (
                        <tr key={comp.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '15px' }}>
                            <div style={{ fontWeight: '600' }}>{comp.name}</div>
                            {comp.description && (
                              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                {comp.description}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '15px' }}>
                            <span style={{
                              padding: '5px 10px',
                              backgroundColor: 
                                comp.category === 'Technical' ? '#e3f2fd' : 
                                comp.category === 'Behavioral' ? '#f3e5f5' : 
                                comp.category === 'Leadership' ? '#e8f5e8' :
                                comp.category === 'Analytical' ? '#fff3cd' : '#f8d7da',
                              color: 
                                comp.category === 'Analytical' ? '#856404' : 
                                comp.category === 'Interpersonal' ? '#721c24' : 'inherit',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {comp.category}
                            </span>
                          </td>
                          <td style={{ padding: '15px' }}>
                            <div>{comp.questionsCount} questions</div>
                            {competencyQuestions.length > 0 && (
                              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                Sample: {competencyQuestions[0].text.substring(0, 50)}...
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                              <button style={{
                                padding: '5px 10px',
                                backgroundColor: '#17a2b8',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                width: '100%'
                              }}
                              onClick={() => {
                                setActiveSection('questions');
                                setNewQuestion({...newQuestion, competencyId: comp.id.toString()});
                              }}
                              >
                                📋 View Questions ({comp.questionsCount})
                              </button>
                              
                              <button style={{
                                padding: '5px 10px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                width: '100%'
                              }}
                              onClick={() => {
                                setActiveSection('questions');
                                setNewQuestion({
                                  text: '',
                                  type: 'Multiple Choice',
                                  competencyId: comp.id.toString()
                                });
                              }}
                              >
                                ➕ Add Question
                              </button>
                              
                              <button 
                                onClick={() => handleDeleteCompetency(comp.id)}
                                style={{
                                  padding: '5px 10px',
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  width: '100%'
                                }}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'questions' && (
            <div>
              <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>Question Bank</h2>
              
              {/* Competency Filter */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Filter by Competency:
                </label>
                <select 
                  value={newQuestion.competencyId}
                  onChange={(e) => setNewQuestion({...newQuestion, competencyId: e.target.value})}
                  style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    width: '300px'
                  }}
                >
                  <option value="">All Competencies</option>
                  {competencies.map(comp => (
                    <option key={comp.id} value={comp.id}>{comp.name} ({comp.category})</option>
                  ))}
                </select>
              </div>
              
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
                      <select 
                        value={newQuestion.competencyId}
                        onChange={(e) => setNewQuestion({...newQuestion, competencyId: e.target.value})}
                        style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                      >
                        <option value="">Select Competency</option>
                        {competencies.map(comp => (
                          <option key={comp.id} value={comp.id}>
                            {comp.name} ({comp.category})
                          </option>
                        ))}
                      </select>
                      
                      <textarea 
                        placeholder="Enter question text..."
                        value={newQuestion.text}
                        onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                        style={{ 
                          padding: '10px', 
                          border: '1px solid #ddd', 
                          borderRadius: '6px',
                          minHeight: '100px',
                          resize: 'vertical'
                        }}
                      />
                      
                      <select 
                        value={newQuestion.type}
                        onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value})}
                        style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                      >
                        <option value="Multiple Choice">Multiple Choice</option>
                        <option value="Rating Scale">Rating Scale</option>
                        <option value="Yes/No">Yes/No</option>
                        <option value="Text Response">Text Response</option>
                      </select>
                      
                      <button 
                        onClick={handleCreateQuestion}
                        disabled={!newQuestion.text.trim() || !newQuestion.competencyId}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: !newQuestion.text.trim() || !newQuestion.competencyId ? '#ccc' : '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: !newQuestion.text.trim() || !newQuestion.competencyId ? 'not-allowed' : 'pointer',
                          fontWeight: '600',
                          alignSelf: 'flex-start'
                        }}
                      >
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
                    <h3 style={{ marginTop: 0 }}>Questions by Competency</h3>
                    
                    {/* Group questions by competency */}
                    {competencies
                      .filter(comp => !newQuestion.competencyId || comp.id === parseInt(newQuestion.competencyId))
                      .map(comp => {
                        const compQuestions = questions.filter(q => q.competencyId === comp.id);
                        
                        return compQuestions.length > 0 ? (
                          <div key={comp.id} style={{ marginBottom: '20px' }}>
                            <h4 style={{ 
                              margin: '0 0 10px 0', 
                              paddingBottom: '5px',
                              borderBottom: '2px solid #eee',
                              color: '#333'
                            }}>
                              {comp.name} ({comp.category})
                              <span style={{ 
                                marginLeft: '10px',
                                fontSize: '14px',
                                color: '#666',
                                fontWeight: 'normal'
                              }}>
                                {compQuestions.length} questions
                              </span>
                            </h4>
                            
                            {compQuestions.map((q, index) => (
                              <div key={q.id} style={{ 
                                padding: '10px 15px', 
                                borderBottom: '1px solid #eee',
                                backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                                marginLeft: '10px'
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div>
                                    <strong>{q.text}</strong>
                                    <div style={{ 
                                      display: 'flex', 
                                      gap: '10px',
                                      marginTop: '5px',
                                      fontSize: '14px',
                                      color: '#666'
                                    }}>
                                      <span style={{ 
                                        padding: '2px 6px',
                                        backgroundColor: '#eee',
                                        borderRadius: '10px',
                                        fontSize: '12px'
                                      }}>
                                        {q.type}
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <button 
                                      onClick={() => handleDeleteQuestion(q.id)}
                                      style={{
                                        padding: '5px 10px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null;
                      })}
                    
                    {/* Show message if no questions found */}
                    {questions.filter(q => !newQuestion.competencyId || q.competencyId === parseInt(newQuestion.competencyId)).length === 0 && (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                        <p>No questions found for this competency.</p>
                        <p>Add questions using the form on the left.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>Available Users for Survey</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => fetchUsersFromDatabase()}
                    disabled={loadingUsers}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: loadingUsers ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>🔄</span> Refresh Users
                  </button>
                  <button 
                    onClick={handleCreateUser}
                    style={{
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
                    }}
                  >
                    <span>👤</span> Add New User
                  </button>
                </div>
              </div>

              {userError && (
                <div style={{
                  backgroundColor: '#fff3cd',
                  color: '#856404',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  fontSize: '14px',
                  border: '1px solid #ffeaa7'
                }}>
                  ⚠️ {userError}
                </div>
              )}

              {/* Add User Form */}
              <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '20px'
              }}>
                <h3 style={{ marginTop: 0 }}>Add New User</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      placeholder="Enter full name"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="Enter email"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Department</label>
                    <input
                      type="text"
                      value={newUser.department}
                      onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                      placeholder="Enter department"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Select Survey to Assign Users</label>
                  <select 
                    value={selectedSurveyForAssignment}
                    onChange={(e) => setSelectedSurveyForAssignment(e.target.value)}
                    style={{
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      width: '300px'
                    }}
                  >
                    <option value="">Select Survey</option>
                    {surveys.map(survey => (
                      <option key={survey.id} value={survey.id}>{survey.name}</option>
                    ))}
                  </select>
                </div>

                {loadingUsers ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{
                      display: 'inline-block',
                      width: '40px',
                      height: '40px',
                      border: '4px solid #f3f3f3',
                      borderTop: '4px solid #007bff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ marginTop: '10px', color: '#666' }}>Loading users from database...</p>
                  </div>
                ) : (
                  <>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                      gap: '15px'
                    }}>
                      {availableUsers.map(user => (
                        <div key={user._id} style={{
                          padding: '15px',
                          border: '1px solid #eee',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '15px',
                          backgroundColor: selectedUserIds.includes(user._id) ? '#e8f4ff' : 'white'
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
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600' }}>{user.name}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>{user.email}</div>
                            <div style={{ fontSize: '11px', color: '#888' }}>{user.department || 'No department'}</div>
                          </div>
                          <div>
                            <input 
                              type="checkbox" 
                              checked={selectedUserIds.includes(user._id)}
                              onChange={() => handleUserSelection(user._id)}
                              style={{ transform: 'scale(1.2)' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {availableUsers.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                        <p>No users found in database.</p>
                        <p>Add users using the form above or check your backend connection.</p>
                      </div>
                    )}

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
                        <span style={{ marginLeft: '10px', color: '#666' }}>
                          {selectedUserIds.length} user(s) selected
                        </span>
                      </div>
                      <button 
                        onClick={handleAssignUsersToSurvey}
                        disabled={!selectedSurveyForAssignment || selectedUserIds.length === 0}
                        style={{
                          padding: '10px 30px',
                          backgroundColor: !selectedSurveyForAssignment || selectedUserIds.length === 0 ? '#ccc' : '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: !selectedSurveyForAssignment || selectedUserIds.length === 0 ? 'not-allowed' : 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Assign Selected Users
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeSection === 'assessment' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>Assessment Section</h2>
                <button 
                  onClick={() => {
                    // Force a re-render to show all assessments
                    setAssessments([...assessments]);
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>🔄</span> Refresh Assessments
                </button>
              </div>
              
              <div style={{ 
                backgroundColor: 'white', 
                padding: '25px', 
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '20px'
              }}>
                <h3 style={{ marginTop: 0, color: '#333' }}>
                  {userData.role === 'Admin' || userData.role === 'admin' ? 'All Assessments' : 'Your Assessments'}
                </h3>
                
                {(() => {
                  // Filter assessments based on user role
                  let displayedAssessments = assessments;
                  
                  if (userData.role !== 'Admin' && userData.role !== 'admin') {
                    // Regular users only see their own assessments
                    displayedAssessments = assessments.filter(a => a.userId === userData._id || a.userId === userData.id);
                  }
                  // Admins see all assessments
                  
                  return displayedAssessments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      <p>
                        {userData.role === 'Admin' || userData.role === 'admin' 
                          ? 'No assessments found. Create assessments by assigning users to surveys or using the form below.'
                          : '📭 No assessments assigned to you yet.'}
                      </p>
                      {(userData.role !== 'Admin' && userData.role !== 'admin') && (
                        <p style={{ fontSize: '14px', color: '#999' }}>Wait for your administrator to assign assessments to you.</p>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                      {displayedAssessments.map(assessment => (
                        <div key={assessment.id} style={{
                          padding: '20px',
                          border: '1px solid #eee',
                          borderRadius: '8px',
                          backgroundColor: assessment.status === 'Completed' ? '#f8fff8' : 
                                       assessment.status === 'In Progress' ? '#fff8e1' : '#f8f9fa'
                        }}>
                          <h4 style={{ marginTop: 0, marginBottom: '10px' }}>{assessment.name}</h4>
                          <p style={{ margin: '5px 0', fontSize: '14px' }}>User: {assessment.userName}</p>
                          <p style={{ margin: '5px 0', fontSize: '14px' }}>Survey: {surveys.find(s => s.id === assessment.surveyId)?.name}</p>
                          <p style={{ margin: '5px 0', fontSize: '14px' }}>Assigned by: {assessment.assignedByName}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                            <span style={{
                              padding: '5px 12px',
                              backgroundColor: assessment.status === 'Completed' ? '#28a745' :
                                           assessment.status === 'In Progress' ? '#ffc107' : '#6c757d',
                              color: 'white',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {assessment.status}
                            </span>
                            {assessment.status !== 'Completed' && (
                              <button 
                                onClick={() => handleViewAssessment(assessment)}
                                style={{
                                  padding: '8px 5px',
                                  backgroundColor: '#17a2b8',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  height: '54px',
                                  width: '85px'
                                }}
                              >
                                Take Assessment
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
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
                    <select 
                      value={newAssessment.surveyId}
                      onChange={(e) => setNewAssessment({...newAssessment, surveyId: e.target.value})}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '6px' 
                      }}
                    >
                      <option value="">Choose a survey...</option>
                      {surveys.map(survey => (
                        <option key={survey.id} value={survey.id}>{survey.name}</option>
                      ))}
                    </select>
                    
                    {/* Display competencies for selected survey */}
                    {newAssessment.surveyId && (
                      <div style={{ marginTop: '10px' }}>
                        <strong style={{ fontSize: '14px' }}>Survey Competencies:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                          {(() => {
                            const selectedSurvey = surveys.find(s => s.id === parseInt(newAssessment.surveyId));
                            if (!selectedSurvey) return null;
                            
                            return competencies
                              .filter(comp => selectedSurvey.competencies.includes(comp.id))
                              .map(comp => (
                                <span key={comp.id} style={{
                                  padding: '3px 8px',
                                  backgroundColor: comp.category === 'Technical' ? '#e3f2fd' : 
                                                 comp.category === 'Behavioral' ? '#f3e5f5' : 
                                                 comp.category === 'Leadership' ? '#e8f5e8' :
                                                 comp.category === 'Analytical' ? '#fff3cd' : '#f8d7da',
                                  borderRadius: '12px',
                                  fontSize: '12px'
                                }}>
                                  {comp.name}
                                </span>
                              ));
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Select User</label>
                    <select 
                      value={newAssessment.userId}
                      onChange={(e) => setNewAssessment({...newAssessment, userId: e.target.value})}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '6px' 
                      }}
                    >
                      <option value="">Choose a user...</option>
                      {availableUsers.map(user => (
                        <option key={user._id} value={user._id}>{user.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Display total questions for selected survey */}
                {newAssessment.surveyId && (
                  <div style={{ 
                    backgroundColor: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '6px',
                    marginBottom: '20px'
                  }}>
                    <strong>Assessment Details:</strong>
                    <div style={{ marginTop: '10px', fontSize: '14px' }}>
                      {(() => {
                        const selectedSurvey = surveys.find(s => s.id === parseInt(newAssessment.surveyId));
                        if (!selectedSurvey) return null;
                        
                        const surveyCompetencies = competencies.filter(comp => 
                          selectedSurvey.competencies.includes(comp.id)
                        );
                        const totalQuestions = surveyCompetencies.reduce((total, comp) => 
                          total + comp.questionsCount, 0
                        );
                        const totalCompetencies = surveyCompetencies.length;
                        
                        return (
                          <>
                            <div>• Total Competencies: {totalCompetencies}</div>
                            <div>• Total Questions: {totalQuestions}</div>
                            <div>• Estimated Time: {Math.ceil(totalQuestions * 2)} minutes</div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={handleCreateAssessment}
                  disabled={!newAssessment.surveyId || !newAssessment.userId}
                  style={{
                    marginTop: '20px',
                    padding: '12px 30px',
                    backgroundColor: !newAssessment.surveyId || !newAssessment.userId ? '#ccc' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: !newAssessment.surveyId || !newAssessment.userId ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}
                >
                  Create Assessment
                </button>
              </div>
            </div>
          )}

          {activeSection === 'logs' && (
            <div style={{ 
              backgroundColor: 'white', 
              padding: '30px', 
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Assessment Submission Logs</h2>
              
                {(() => {
                const isAdmin = userData.role === 'Admin' || userData.role === 'admin';
                const userLogsCount = assessmentLogs.filter(log => 
                  log.userId === userData._id || log.userId === userData.id
                ).length;
                
                const logsToCheck = isAdmin ? assessmentLogs.length : userLogsCount;
                
                return logsToCheck > 0 && (
                <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                  <button 
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${isAdmin ? 'ALL logs' : 'your logs'}? This action cannot be undone.`)) {
                        let updatedLogs;
                        if (isAdmin) {
                          updatedLogs = [];
                        } else {
                          // Regular users only delete their own logs
                          updatedLogs = assessmentLogs.filter(log => 
                            log.userId !== userData._id && log.userId !== userData.id
                          );
                        }
                        setAssessmentLogs(updatedLogs);
                        localStorage.setItem('assessmentLogs', JSON.stringify(updatedLogs));
                        
                        setNotification({
                          type: 'success',
                          message: `${isAdmin ? 'All logs' : 'Your logs'} deleted successfully!`,
                          show: true
                        });
                        setTimeout(() => {
                          setNotification(prev => prev ? { ...prev, show: false } : null);
                        }, 3000);
                      }
                    }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    🗑️ Delete All Logs
                  </button>
                </div>
                );
              })()}

              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  borderBottom: '2px solid #eee',
                  marginBottom: '20px'
                }}>
                  <button
                    onClick={() => setLogViewMode('all')}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: logViewMode === 'all' ? '#007bff' : 'transparent',
                      color: logViewMode === 'all' ? 'white' : '#666',
                      border: 'none',
                      borderBottom: logViewMode === 'all' ? '2px solid #007bff' : 'none',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    All Assessments
                  </button>
                  <button
                    onClick={() => setLogViewMode('my')}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: logViewMode === 'my' ? '#007bff' : 'transparent',
                      color: logViewMode === 'my' ? 'white' : '#666',
                      border: 'none',
                      borderBottom: logViewMode === 'my' ? '2px solid #007bff' : 'none',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    My Submissions
                  </button>
                  <button
                    onClick={() => setLogViewMode('assigned')}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: logViewMode === 'assigned' ? '#007bff' : 'transparent',
                      color: logViewMode === 'assigned' ? 'white' : '#666',
                      border: 'none',
                      borderBottom: logViewMode === 'assigned' ? '2px solid #007bff' : 'none',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    {userData.role === 'Admin' || userData.role === 'admin' ? 'Assigned by Me' : 'Assignments I Created'}
                  </button>
                </div>
              </div>
              
              {(() => {
                // Filter logs based on selected view mode
                let displayedLogs = assessmentLogs;
                
                if (logViewMode === 'my') {
                  // Show only logs where user is the one who took the assessment
                  displayedLogs = assessmentLogs.filter(log => 
                    log.userId === (userData._id || userData.id)
                  );
                } else if (logViewMode === 'assigned') {
                  // Show logs where user assigned the assessment to others
                  displayedLogs = assessmentLogs.filter(log => 
                    log.assignedBy === (userData._id || userData.id)
                  );
                }
                // 'all' mode shows all logs
                
                return displayedLogs.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px 20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    color: '#666'
                  }}>
                    <p>
                      {logViewMode === 'my' 
                        ? '📭 No submissions for your assessments yet'
                        : logViewMode === 'assigned'
                          ? '📭 No assessments assigned by you have been completed yet'
                          : '📭 No assessment submissions yet'
                      }
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ 
                      width: '100%', 
                      borderCollapse: 'collapse',
                      backgroundColor: '#fff'
                    }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Assessment</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333' }}>User</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Survey</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Submitted At</th>
                          {logViewMode === 'assigned' && (
                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Assigned By</th>
                          )}
                          <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#333' }}>Questions</th>
                          <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#333' }}>Answered</th>
                          <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#333' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedLogs.map((log, index) => (
                          <tr key={log.id} style={{ 
                            borderBottom: '1px solid #eee',
                            backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa'
                          }}>
                            <td style={{ padding: '12px', color: '#333' }}>{log.assessmentName}</td>
                            <td style={{ padding: '12px', color: '#333' }}>{log.userName}</td>
                            <td style={{ padding: '12px', color: '#333' }}>{log.surveyName}</td>
                            <td style={{ padding: '12px', color: '#666', fontSize: '14px' }}>
                              {new Date(log.submittedAt).toLocaleString()}
                            </td>
                            {logViewMode === 'assigned' && (
                              <td style={{ padding: '12px', color: '#28a745', fontWeight: '500' }}>
                                You
                              </td>
                            )}
                            <td style={{ padding: '12px', textAlign: 'center', color: '#333' }}>
                              {log.totalQuestions}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', color: '#28a745', fontWeight: '600' }}>
                              {log.answeredQuestions}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              <button 
                                onClick={() => setSelectedLog(log)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#007bff',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  marginRight: '8px'
                                }}
                              >
                                View
                              </button>

                              <button 
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this log?')) {
                                  const updatedLogs = assessmentLogs.filter(l => l.id !== log.id);
                                  setAssessmentLogs(updatedLogs);
                                  localStorage.setItem('assessmentLogs', JSON.stringify(updatedLogs));
                                  
                                  setNotification({
                                    type: 'success',
                                    message: 'Log deleted successfully!',
                                    show: true
                                  });
                                  setTimeout(() => {
                                    setNotification(prev => prev ? { ...prev, show: false } : null);
                                  }, 3000);
                                }
                              }}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Delete
                            </button>
                              
         
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
              
              {/* Detailed Log View Modal */}
              {selectedLog && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10000
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    padding: '30px',
                    maxWidth: '900px',
                    width: '90%',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h2 style={{ margin: 0, color: '#333' }}>Assessment Responses</h2>
                      <button 
                        onClick={() => setSelectedLog(null)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '28px',
                          cursor: 'pointer',
                          color: '#666'
                        }}
                      >
                        ×
                      </button>
                    </div>
                    
                    <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '2px solid #eee' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                          <strong style={{ color: '#666', fontSize: '14px' }}>Assessment:</strong>
                          <p style={{ margin: '5px 0 0 0', color: '#333' }}>{selectedLog.assessmentName}</p>
                        </div>
                        <div>
                          <strong style={{ color: '#666', fontSize: '14px' }}>User:</strong>
                          <p style={{ margin: '5px 0 0 0', color: '#333' }}>{selectedLog.userName}</p>
                        </div>
                        <div>
                          <strong style={{ color: '#666', fontSize: '14px' }}>Survey:</strong>
                          <p style={{ margin: '5px 0 0 0', color: '#333' }}>{selectedLog.surveyName}</p>
                        </div>
                        <div>
                          <strong style={{ color: '#666', fontSize: '14px' }}>Submitted:</strong>
                          <p style={{ margin: '5px 0 0 0', color: '#333' }}>{new Date(selectedLog.submittedAt).toLocaleString()}</p>
                        </div>
                        <div>
                          <strong style={{ color: '#666', fontSize: '14px' }}>Assigned By:</strong>
                          <p style={{ margin: '5px 0 0 0', color: '#28a745', fontWeight: '600' }}>
                            {selectedLog.assignedByName}
                          </p>
                        </div>
                        <div>
                          <strong style={{ color: '#666', fontSize: '14px' }}>Progress:</strong>
                          <p style={{ margin: '5px 0 0 0', color: '#28a745', fontWeight: '600' }}>
                            {selectedLog.answeredQuestions}/{selectedLog.totalQuestions} Answered
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <h3 style={{ color: '#333', marginBottom: '15px' }}>Detailed Responses:</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {Object.entries(selectedLog.responses).map(([questionId, response], index) => {
                        const question = questions.find(q => q.id === parseInt(questionId));
                        return (
                          <div key={questionId} style={{
                            padding: '15px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            border: '1px solid #eee'
                          }}>
                            <div style={{ marginBottom: '10px', wordBreak: 'break-word' }}>
                              <strong style={{ color: '#333', display: 'block', marginBottom: '5px' }}>Q{index + 1}: {question?.text}</strong>
                              <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '13px', wordBreak: 'break-word' }}>
                                Type: {question?.type} | Competency: {question?.competencyName}
                              </p>
                            </div>
                            <div style={{
                              padding: '12px',
                              backgroundColor: 'white',
                              borderRadius: '6px',
                              border: '1px solid #ddd',
                              color: response ? '#333' : '#999',
                              fontStyle: response ? 'normal' : 'italic',
                              wordBreak: 'break-word',
                              whiteSpace: 'pre-wrap',
                              maxHeight: '200px',
                              overflowY: 'auto'
                            }}>
                              {response || '(No response)'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <button 
                      onClick={() => setSelectedLog(null)}
                      style={{
                        marginTop: '20px',
                        padding: '12px 30px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
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
                        value={settings.defaultDuration}
                        onChange={(e) => setSettings({...settings, defaultDuration: parseInt(e.target.value)})}
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
                        value={settings.notificationEmail}
                        onChange={(e) => setSettings({...settings, notificationEmail: e.target.value})}
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
                        <input 
                          type="checkbox" 
                          checked={settings.emailNotifications}
                          onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                        />
                        Email notifications for new assessments
                      </label>
                    </div>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input 
                          type="checkbox" 
                          checked={settings.autoSave}
                          onChange={(e) => setSettings({...settings, autoSave: e.target.checked})}
                        />
                        Auto-save assessment progress
                      </label>
                    </div>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input 
                          type="checkbox" 
                          checked={settings.requireApproval}
                          onChange={(e) => setSettings({...settings, requireApproval: e.target.checked})}
                        />
                        Require assessment approval
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleSaveSettings}
                style={{
                  marginTop: '30px',
                  padding: '12px 30px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
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