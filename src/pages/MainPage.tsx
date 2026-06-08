import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import UncontrolledForm from '../components/UncontrolledForm';
import RHFForm from '../components/RHFForm';

export function MainPage() {
  const [formType, setFormType] = useState<'uncontrolled' | 'rhf' | null>(null);
  const submissions = [1, 2, 3];
  const handleClose = () => setFormType(null);

  return (
    <>
      {formType !== null && (
        <Modal onClose={handleClose}>
          {formType === 'uncontrolled' ? (
            <UncontrolledForm onClose={handleClose} />
          ) : (
            <RHFForm onClose={handleClose} />
          )}
        </Modal>
      )}
      <div className="app-wrapper">
        <Header />
        <main className="page-container">
          <section className="buttons-section">
            <h1>Choose your form</h1>
            <h2>Here you can choose the form you like to send</h2>

            <div className="button-wrapper">
              <button
                type="button"
                className="choose-form-button"
                onClick={() => setFormType('uncontrolled')}
              >
                <div className="choose-form-button-bg" />
                <span className="choose-form-button-label">Basic</span>
              </button>
              <button
                type="button"
                className="choose-form-button"
                onClick={() => setFormType('rhf')}
              >
                <div className="choose-form-button-bg" />
                <span className="choose-form-button-label">Advanced</span>
              </button>
            </div>
          </section>
          <div className="divider" />
          <section className="submissions-section">
            <h1>Submissions</h1>
            <h2>Successful submissions history</h2>

            {submissions.length === 0 ? (
              <div className="submissions-empty">
                <h3>No submissions yet</h3>
                <p>Fill out some form and the results will appear here.</p>
              </div>
            ) : (
              <div className="submissions-grid">
                {submissions.map((_, index) => (
                  <SubmissionItem key={index} />
                ))}
              </div>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

function SubmissionItem() {
  return (
    <div className="submission-card">
      <img
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop"
        alt="User"
        className="card-image"
      />
      <div className="card-content">
        <div className="card-header">
          <h3>Sophie Bennett</h3>
          <span className="verified-badge">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </span>
        </div>
        <p className="card-text">
          Profile update request:
          <br />
          Updated job title and location.
        </p>
        <div className="card-meta">
          <span>Profile Update | Accepted</span>
        </div>
        <button type="button" className="card-btn">
          Details
        </button>
      </div>
    </div>
  );
}

export default MainPage;
