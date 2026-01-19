// Assessment/AssessmentQuestionsPage.jsx
import { useState, useEffect } from 'react';

function AssessmentQuestionsPage({ 
  assessment, 
  questions, 
  responses, 
  onResponseChange, 
  onComplete, 
  onClose 
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentResponse, setCurrentResponse] = useState('');

  useEffect(() => {
    // Initialize current response when question changes
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      setCurrentResponse(responses[currentQuestion.id] || '');
    }
  }, [currentQuestionIndex, questions, responses]);

  const handleNext = () => {
    // Save current response
    const currentQuestion = questions[currentQuestionIndex];
    onResponseChange(currentQuestion.id, currentResponse);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, complete assessment
      onComplete(responses);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (!assessment || questions.length === 0) {
    return (
      <div>
        <h3>No assessment data</h3>
        <button onClick={onClose}>Go Back</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{assessment.name}</h2>
        <button onClick={onClose}>Exit</button>
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
                  padding: '10px',
                  backgroundColor: currentResponse === rating.toString() ? '#007bff' : '#e9ecef'
                }}
              >
                {rating}
              </button>
            ))}
          </div>
        )}
        
        {/* Add more question type handlers as needed */}
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