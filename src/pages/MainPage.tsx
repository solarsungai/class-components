import { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import SubmissionItem from '../components/SubmissionItem';
import UncontrolledForm from '../components/UncontrolledForm';
import RHFForm from '../components/RHFForm';
import type { RootState } from '../store';

export function MainPage() {
  const [formType, setFormType] = useState<'uncontrolled' | 'rhf' | null>(null);
  const submissions = useSelector((state: RootState) => state.submissions);
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
                <span className="choose-form-button-label">Uncontrolled</span>
              </button>
              <button
                type="button"
                className="choose-form-button"
                onClick={() => setFormType('rhf')}
              >
                <div className="choose-form-button-bg" />
                <span className="choose-form-button-label">React Hook Form</span>
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
                {submissions.map((submission, index) => (
                  <SubmissionItem
                    key={submission.email}
                    submission={submission}
                    isNew={index === submissions.length - 1}
                  />
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

export default MainPage;
