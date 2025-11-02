import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EligibilityChecker.css";

function EligibilityChecker() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: "",
    monthlyIncome: "",
    employmentType: "",
    workExperience: "",
    loanAmount: "",
    loanType: "",
    existingLoans: "",
    creditScore: "",
  });

  const [errors, setErrors] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.age || formData.age < 18 || formData.age > 65) {
      newErrors.age = "Age must be between 18 and 65 years";
    }

    if (!formData.monthlyIncome || formData.monthlyIncome < 15000) {
      newErrors.monthlyIncome = "Monthly income must be at least ₹15,000";
    }

    if (!formData.employmentType) {
      newErrors.employmentType = "Please select employment type";
    }

    if (!formData.workExperience || formData.workExperience < 0) {
      newErrors.workExperience = "Work experience cannot be negative";
    }

    if (!formData.loanAmount || formData.loanAmount < 50000) {
      newErrors.loanAmount = "Loan amount must be at least ₹50,000";
    }

    if (!formData.loanType) {
      newErrors.loanType = "Please select a loan type";
    }

    if (!formData.existingLoans) {
      newErrors.existingLoans = "Please select if you have existing loans";
    }

    if (!formData.creditScore || formData.creditScore < 300 || formData.creditScore > 900) {
      newErrors.creditScore = "Credit score must be between 300 and 900";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateEligibility = () => {
    let eligible = true;
    const reasons = [];
    let eligibleAmount = 0;
    let interestRate = 0;

    // Age check
    if (formData.age < 21 || formData.age > 60) {
      eligible = false;
      reasons.push("Age must be between 21 and 60 years for loan eligibility");
    }

    // Income check
    const monthlyIncome = parseFloat(formData.monthlyIncome);
    if (monthlyIncome < 25000) {
      eligible = false;
      reasons.push("Monthly income should be at least ₹25,000");
    }

    // Employment check
    if (formData.employmentType === "unemployed") {
      eligible = false;
      reasons.push("Must be employed or self-employed to be eligible");
    }

    // Work experience check
    const experience = parseFloat(formData.workExperience);
    if (experience < 1) {
      eligible = false;
      reasons.push("Minimum 1 year of work experience required");
    }

    // Credit score check
    const creditScore = parseFloat(formData.creditScore);
    if (creditScore < 650) {
      eligible = false;
      reasons.push("Credit score should be 650 or above");
    }

    // Existing loans check
    if (formData.existingLoans === "yes") {
      reasons.push("Note: Existing loans may affect your loan amount");
    }

    // Calculate eligible amount and interest rate
    if (eligible) {
      // Eligible amount calculation: 10-20 times monthly income
      const baseAmount = monthlyIncome * 15;
      const requestedAmount = parseFloat(formData.loanAmount);
      
      eligibleAmount = Math.min(baseAmount, requestedAmount, 5000000); // Max ₹50 Lakhs
      
      // Interest rate based on credit score and loan amount
      if (creditScore >= 750) {
        interestRate = requestedAmount > 500000 ? 10.25 : 10.5;
      } else if (creditScore >= 700) {
        interestRate = requestedAmount > 500000 ? 11.5 : 12.0;
      } else if (creditScore >= 650) {
        interestRate = requestedAmount > 500000 ? 12.5 : 13.5;
      }

      if (reasons.length === 0) {
        reasons.push("You meet all the eligibility criteria!");
      }
    } else {
      eligibleAmount = 0;
      interestRate = 0;
    }

    return {
      eligible,
      eligibleAmount,
      interestRate,
      reasons,
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const result = calculateEligibility();
      setEligibilityResult(result);
      setShowResult(true);
    }
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setEligibilityResult(null);
  };

  const handleReset = () => {
    setFormData({
      age: "",
      monthlyIncome: "",
      employmentType: "",
      workExperience: "",
      loanAmount: "",
      loanType: "",
      existingLoans: "",
      creditScore: "",
    });
    setErrors({});
    setShowResult(false);
    setEligibilityResult(null);
  };

  return (
    <div className="eligibility-checker-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="eligibility-card shadow-lg rounded p-4">
              {/* Header */}
              <div className="text-center mb-4">
                <button
                  className="btn btn-link text-decoration-none mb-3"
                  onClick={() => navigate("/")}
                  style={{ padding: 0 }}
                >
                  <i className="bi bi-arrow-left me-2"></i>Back to Home
                </button>
                <h1 className="fw-bold text-primary mb-2">Check Your Loan Eligibility</h1>
                <p className="text-muted">Fill in the details below to check your eligibility in just 2 minutes</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Age */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Age <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className={`form-control ${errors.age ? "is-invalid" : ""}`}
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter your age"
                      min="18"
                      max="65"
                      required
                    />
                    {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                  </div>

                  {/* Monthly Income */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Monthly Income (₹) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className={`form-control ${errors.monthlyIncome ? "is-invalid" : ""}`}
                      name="monthlyIncome"
                      value={formData.monthlyIncome}
                      onChange={handleChange}
                      placeholder="Enter monthly income"
                      min="15000"
                      required
                    />
                    {errors.monthlyIncome && <div className="invalid-feedback">{errors.monthlyIncome}</div>}
                  </div>

                  {/* Employment Type */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Employment Type <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${errors.employmentType ? "is-invalid" : ""}`}
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select employment type</option>
                      <option value="salaried">Salaried</option>
                      <option value="self-employed">Self-Employed</option>
                      <option value="business">Business Owner</option>
                      <option value="unemployed">Unemployed</option>
                    </select>
                    {errors.employmentType && <div className="invalid-feedback">{errors.employmentType}</div>}
                  </div>

                  {/* Work Experience */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Work Experience (Years) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className={`form-control ${errors.workExperience ? "is-invalid" : ""}`}
                      name="workExperience"
                      value={formData.workExperience}
                      onChange={handleChange}
                      placeholder="Years of experience"
                      min="0"
                      step="0.5"
                      required
                    />
                    {errors.workExperience && <div className="invalid-feedback">{errors.workExperience}</div>}
                  </div>

                  {/* Loan Type */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Loan Type <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${errors.loanType ? "is-invalid" : ""}`}
                      name="loanType"
                      value={formData.loanType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select loan type</option>
                      <option value="Personal Loan">Personal Loan</option>
                      <option value="Home Loan">Home Loan</option>
                      <option value="Vehicle Loan">Vehicle Loan</option>
                    </select>
                    {errors.loanType && <div className="invalid-feedback">{errors.loanType}</div>}
                  </div>

                  {/* Loan Amount */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Desired Loan Amount (₹) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className={`form-control ${errors.loanAmount ? "is-invalid" : ""}`}
                      name="loanAmount"
                      value={formData.loanAmount}
                      onChange={handleChange}
                      placeholder="Enter loan amount"
                      min="50000"
                      max="5000000"
                      required
                    />
                    {errors.loanAmount && <div className="invalid-feedback">{errors.loanAmount}</div>}
                  </div>

                  {/* Existing Loans */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Do you have existing loans? <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${errors.existingLoans ? "is-invalid" : ""}`}
                      name="existingLoans"
                      value={formData.existingLoans}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select an option</option>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                    {errors.existingLoans && <div className="invalid-feedback">{errors.existingLoans}</div>}
                  </div>

                  {/* Credit Score */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Credit Score (CIBIL) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className={`form-control ${errors.creditScore ? "is-invalid" : ""}`}
                      name="creditScore"
                      value={formData.creditScore}
                      onChange={handleChange}
                      placeholder="Enter CIBIL score (300-900)"
                      min="300"
                      max="900"
                      required
                    />
                    {errors.creditScore && <div className="invalid-feedback">{errors.creditScore}</div>}
                    <small className="text-muted">If unknown, enter approximate score</small>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center mt-4">
                  <button type="submit" className="btn btn-primary btn-lg px-5">
                    <i className="bi bi-check-circle me-2"></i>Check Eligibility
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg px-5 ms-3"
                    onClick={handleReset}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResult && eligibilityResult && (
        <div className="modal-overlay" onClick={handleCloseResult}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {eligibilityResult.eligible ? (
                  <span className="text-success">
                    <i className="bi bi-check-circle-fill me-2"></i>Congratulations!
                  </span>
                ) : (
                  <span className="text-danger">
                    <i className="bi bi-x-circle-fill me-2"></i>Not Eligible
                  </span>
                )}
              </h3>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseResult}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {eligibilityResult.eligible ? (
                <div>
                  <div className="alert alert-success">
                    <h5 className="mb-3">You are eligible for a loan!</h5>
                    <div className="eligibility-details">
                      <div className="detail-row">
                        <span className="detail-label">Eligible Loan Amount:</span>
                        <span className="detail-value">₹{eligibilityResult.eligibleAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Expected Interest Rate:</span>
                        <span className="detail-value">{eligibilityResult.interestRate}% p.a.</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h6 className="fw-semibold mb-2">Next Steps:</h6>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        Apply for loan with your details
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        Submit required documents
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        Get quick approval and disbursal
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="alert alert-danger">
                    <h5 className="mb-3">You are currently not eligible for a loan</h5>
                    <div className="mb-3">
                      <h6 className="fw-semibold mb-2">Reasons:</h6>
                      <ul className="list-unstyled">
                        {eligibilityResult.reasons.map((reason, index) => (
                          <li key={index} className="mb-2">
                            <i className="bi bi-x-circle text-danger me-2"></i>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h6 className="fw-semibold mb-2">How to improve eligibility:</h6>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="bi bi-info-circle text-primary me-2"></i>
                        Maintain a good credit score (above 650)
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-info-circle text-primary me-2"></i>
                        Ensure stable employment and income
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-info-circle text-primary me-2"></i>
                        Clear existing loan obligations
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-info-circle text-primary me-2"></i>
                        Maintain regular income flow
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseResult}
              >
                Close
              </button>
              {eligibilityResult.eligible && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    handleCloseResult();
                    navigate("/login");
                  }}
                >
                  Proceed to Apply
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EligibilityChecker;

