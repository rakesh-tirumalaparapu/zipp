import React from 'react';
import './CommentsTab.css';

const CommentsTab = ({ application }) => {
  const makerComments = application?.makerComments || [];
  const checkerComments = application?.checkerComments || [];
  const allComments = [...makerComments, ...checkerComments].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  if (allComments.length === 0) {
    return (
      <div className="comments-tab">
        <div className="text-center py-4">
          <i className="bi bi-chat-dots display-4 text-muted"></i>
          <p className="text-muted mt-2">No comments available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="comments-tab">
      <h3>Comments & Remarks</h3>
      <div className="comments-list">
        {allComments.map((comment, index) => (
          <div key={index} className={`comment-item ${comment.type || 'info'}`}>
            <div className="comment-header">
              <div className="comment-meta">
                <span className="comment-author">{comment.maker || comment.checker || 'System'}</span>
                <span className="comment-time">{comment.timestamp || new Date().toLocaleString()}</span>
              </div>
              <span className={`comment-type-badge ${comment.type || 'info'}`}>
                {comment.type === 'info' ? 'Info' : 
                 comment.type === 'success' ? 'Verified' : 
                 comment.type === 'warning' ? 'Warning' : 'Comment'}
              </span>
            </div>
            <div className="comment-content">
              {comment.comment || comment.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsTab;

