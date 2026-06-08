import type { SubmissionType } from '../store/submissionsSlice';

interface SubmissionItemProps {
  submission: SubmissionType;
  isNew: boolean;
}

function SubmissionItem({ submission, isNew }: SubmissionItemProps) {
  return (
    <div className={`submission-card ${isNew ? 'new-submission-highlight' : ''}`}>
      <img src={submission.image} alt="User" className="card-image" />
      <div className="card-content">
        <div className="card-header">
          <h3>{submission.name}</h3>
        </div>
        <p className="card-text">
          Email: {submission.email} <br />
          Country: {submission.country} | Age: {submission.age}
        </p>
        <div className="card-meta">
          <span>Gender: {submission.gender}</span>
        </div>
      </div>
    </div>
  );
}

export default SubmissionItem;
