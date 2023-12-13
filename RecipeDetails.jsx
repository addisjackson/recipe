import React from "react";

const RecipeDetails = ({ recipeSummary, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{recipeSummary.title}</h2>
          <span className="close-btn" onClick={onClose}>
            &times;
          </span>
        </div>
        <p dangerouslySetInnerHTML={{ __html: recipeSummary.summary }}></p>
      </div>
    </div>
  );
};

export default RecipeDetails;
