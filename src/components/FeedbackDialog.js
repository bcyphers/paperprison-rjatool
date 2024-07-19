import React, { useState } from 'react';

const FeedbackDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/submit-feedback-to-sheet', {
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
      setSubmitting(false);
    }
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  return (
    <>
      {/* Feedback icon */}
      <span
        onClick={openDialog}
        className="feedback-icon"
        role="button"
        aria-label="Provide feedback"
      >
        💬
      </span>

      {/* Feedback dialog */}
      {isOpen && (
        <div className="feedback-dialog-overlay">
          <div className="feedback-dialog">
            <h2>Drop us a line!</h2>
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
                <label htmlFor="feedback">Message:</label>
                <textarea
                  id="feedback"
                  placeholder="Enter your message"
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
