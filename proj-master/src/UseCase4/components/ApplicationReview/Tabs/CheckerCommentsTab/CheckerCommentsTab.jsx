import React from 'react';

export default function CheckerCommentsTab({ application }) {
  const checkerComments = application?.checkerComments || [];

  if (!checkerComments.length) {
    return (
      <div className="tab-content active">
        <div className="text-center py-4 text-muted">No checker comments yet.</div>
      </div>
    );
  }

  return (
    <div className="tab-content active">
      <div className="section">
        <h3>Checker Comments</h3>
        <div className="comments-list d-flex flex-column gap-3">
          {checkerComments.map((comment, idx) => (
            <div key={idx} className="p-3 border rounded-3 bg-white">
              <div className="d-flex justify-content-between mb-2">
                <strong>{comment.checker || 'Checker'}</strong>
                <small className="text-muted">{comment.timestamp || ''}</small>
              </div>
              <div>{comment.comment || comment.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
