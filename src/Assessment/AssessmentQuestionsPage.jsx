// Assessment/AssessmentQuestionsPage.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function AssessmentQuestionsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract data from location state
  const { 
    assessment, 
    questions: initialQuestions = [], 
    responses: initialResponses = {},
    competencies = [],
    userName = '',
    currentUser = null
  } = location.state || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentResponse, setCurrentResponse] = useState('');
  const [responses, setResponses] = useState(initialResponses);
  const [questions, setQuestions] = useState(initialQuestions);

  useEffect(() => {
    // Initialize current response when question changes
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      setCurrentResponse(responses[currentQuestion.id] || '');
    }
  }, [currentQuestionIndex, questions, responses]);

  const handleResponseChange = (questionId, response) => {
    setResponses({
      ...responses,
      [questionId]: response
    });
  };

  const handleNext = () => {
    // Save current response
    const currentQuestion = questions[currentQuestionIndex];
    handleResponseChange(currentQuestion.id, currentResponse);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, complete assessment
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      handleResponseChange(currentQuestion.id, currentResponse);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleComplete = () => {
    // Save final response before completing
    const currentQuestion = questions[currentQuestionIndex];
    const finalResponses = {
      ...responses,
      [currentQuestion.id]: currentResponse
    };
    
    console.log('Assessment completed with responses:', finalResponses);
    
    // Navigate back with completion data
    navigate('/', {
      state: {
        assessmentCompleted: true,
        assessmentId: assessment.id,
        responses: finalResponses,
        submittedAt: new Date().toISOString(),
        submittedBy: currentUser
      }
    });
  };

  const handleClose = () => {
    navigate('/');
  };

  if (!assessment || questions.length === 0) {
    return (
      <div>
        <h3>No assessment data</h3>
        <button onClick={handleClose}>Go Back</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{assessment.name}</h2>
        <button onClick={handleClose}>Exit</button>
      </div>
      
      <div style={{ margin: '20px 0' }}>
        <div>Progress: {currentQuestionIndex + 1} of {questions.length}</div>
        <div style={{ 
          height: '10px', 
          backgroundColor: '#e0e0e0', 
          borderRadius: '5px',
          marginTop: '5px'
        }}>
          <div style={{ 
            width: `${progress}%`, 
            height: '100%', 
            backgroundColor: '#007bff',
            borderRadius: '5px'
          }}></div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>Question {currentQuestionIndex + 1}: {currentQuestion.text}</h3>
        <p>Type: {currentQuestion.type}</p>
        <p>Competency: {currentQuestion.competencyName}</p>
        
        {/* Response input based on question type */}
        {currentQuestion.type === 'Rating Scale' && (
          <div>
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                onClick={() => setCurrentResponse(rating.toString())}
                style={{ 
                  marginRight: '10px',
                  marginBottom: '10px',
                  padding: '10px 15px',
                  backgroundColor: currentResponse === rating.toString() ? '#007bff' : '#e9ecef',
                  color: currentResponse === rating.toString() ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {rating}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'Multiple Choice' && (
          <div style={{ marginTop: '15px' }}>
            {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map((option) => (
              <div 
                key={option}
                style={{ marginBottom: '12px' }}
              >
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  padding: '10px',
                  backgroundColor: currentResponse === option ? '#e3f2fd' : 'transparent',
                  borderRadius: '4px',
                  border: currentResponse === option ? '2px solid #007bff' : '1px solid #ddd'
                }}>
                  <input 
                    type="radio" 
                    name="mcq"
                    value={option}
                    checked={currentResponse === option}
                    onChange={(e) => setCurrentResponse(e.target.value)}
                    style={{ marginRight: '10px', cursor: 'pointer' }}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
        )}

        {currentQuestion.type === 'Yes/No' && (
          <div style={{ marginTop: '15px', display: 'flex', gap: '15px' }}>
            {['Yes', 'No'].map((option) => (
              <button
                key={option}
                onClick={() => setCurrentResponse(option)}
                style={{ 
                  padding: '12px 30px',
                  backgroundColor: currentResponse === option ? '#007bff' : '#e9ecef',
                  color: currentResponse === option ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'Text Response' && (
          <div style={{ marginTop: '15px' }}>
            <textarea
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              placeholder="Enter your response here..."
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif'
              }}
            />
          </div>
        )}
        
        {!['Rating Scale', 'Multiple Choice', 'Yes/No', 'Text Response'].includes(currentQuestion.type) && (
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#fff3cd',
            borderRadius: '4px',
            marginTop: '15px'
          }}>
            <p>Please provide your response for this question.</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button 
          onClick={handlePrev} 
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        
        <button 
          onClick={handleNext}
          disabled={!currentResponse}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default AssessmentQuestionsPage;