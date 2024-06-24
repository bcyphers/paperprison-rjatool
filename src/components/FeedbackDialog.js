import React, { useState } from 'react';

const FeedbackDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false); // State to manage submission status

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); // Set submitting state to true during submission

    try {
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, feedback }),
      });

      if (response.ok) {
        alert('Feedback submitted successfully!');
        setIsOpen(false);
        setName('');
        setEmail('');
        setFeedback('');
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    } finally {
      setSubmitting(false); // Reset submitting state
    }
  };

  return (
    <>
      {/* Feedback button */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="feedback-button"
        aria-label="Provide feedback"
      >
        <span role="img" aria-hidden="true" className="feedback-icon">💬</span>
        <span>Feedback</span>
      </button>

      {/* Feedback dialog */}
      {isOpen && (
        <div className="feedback-dialog-overlay">
          <div className="feedback-dialog">
            <h2>Provide Feedback</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="feedback">Feedback:</label>
                <textarea
                  id="feedback"
                  placeholder="Enter your feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                />
              </div>
              <div className="button-group">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="feedback-button feedback-button-cancel"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="feedback-button feedback-button-submit"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackDialog;
