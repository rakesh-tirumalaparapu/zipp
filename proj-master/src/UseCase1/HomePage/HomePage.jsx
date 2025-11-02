import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Image1 from "../Images/Image1.jpg";
import Personal from "../Images/Personal.png";
import Home from "../Images/Home.png";
import Bike from "../Images/bike.png";
import Car from "../Images/Car.png";
import Business from "../Images/Bussiness.png";
import Instant from "../Images/Instant.png";
import "../HomePage/HomePage.css";
import "bootstrap/dist/css/bootstrap.min.css";

function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const carouselImages = [
    { src: Image1, alt: "Loan Banner 1" },
    { src: Personal, alt: "Personal Loan" },
    { src: Home, alt: "Home Loan" },
    { src: Bike, alt: "Bike Loan" },
    { src: Car, alt: "Car Loan" },
    { src: Business, alt: "Business Loan" },
    { src: Instant, alt: "Instant Loan" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <div className="home-page">
      {/* ================= CAROUSEL ================= */}
      <div id="mainCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#mainCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0 ? "true" : undefined}
            ></button>
          ))}
        </div>

        <div className="carousel-inner">
          {carouselImages.map((img, i) => (
            <div
              key={i}
              className={`carousel-item ${i === 0 ? "active" : ""}`}
            >
              <img
                src={img.src}
                className="d-block w-100 carousel-image"
                alt={img.alt}
              />
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#mainCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#mainCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* ================= WHY CHOOSE SECTION ================= */}
      <section className="container text-center py-5">
        <h2 className="fw-bold mb-3">Why Choose Standard Chartered Loan?</h2>
        <p className="text-muted mb-5">
          Experience banking excellence with our premium loan solutions.
        </p>
        <div className="row g-4">
          {[
            { icon: "💰", title: "High Loan Amount", desc: "Up to ₹50 Lakhs based on profile" },
            { icon: "⚡", title: "Quick Disbursal", desc: "Funds within 48 hours" },
            { icon: "📄", title: "Minimal Documentation", desc: "Hassle-free process" },
            { icon: "🛡️", title: "No Collateral", desc: "Unsecured and stress-free" },
          ].map((f, i) => (
            <div className="col-12 col-md-6 col-lg-3" key={i}>
              <div className="card border-0 shadow-sm h-100 p-3 feature-card">
                <div className="display-5">{f.icon}</div>
                <h5 className="fw-bold mt-3">{f.title}</h5>
                <p className="text-muted">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= LOAN DETAILS SECTION ================= */}
      <section className="loan-details-section py-5 bg-light text-center">
        <div className="container">
          <h1>Loan Details</h1>
          <p className="section-subtitle">Transparent and competitive loan terms</p>
          <div className="row g-4">
            {[
              { icon: "💵", title: "Loan Amount", details: "₹50,000 - ₹50,00,000", desc: "Flexible amount based on eligibility" },
              { icon: "📈", title: "Interest Rate", details: "10.25% - 16% p.a.", desc: "Competitive rates for all customers" },
              { icon: "📅", title: "Loan Tenure", details: "12 - 60 Months", desc: "Flexible repayment options" },
              { icon: "💰", title: "Processing Fee", details: "1% - 2%", desc: "Of loan amount + taxes" },
            ].map((item, index) => (
              <div className="col-12 col-md-6 col-lg-3" key={index}>
                <div className="loan-detail-card p-4 shadow-sm rounded h-100">
                  <div className="detail-icon mb-2">{item.icon}</div>
                  <h4>{item.title}</h4>
                  <h5 className="fw-bold">{item.details}</h5>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INTEREST RATE TABLE ================= */}
      <section className="interest-rates-section py-5 container text-center">
        <h1>Interest Rates Comparison</h1>
        <p className="section-subtitle">
          Compare our competitive rates across different loan amounts
        </p>
        <div className="table-responsive">
          <table className="table table-bordered table-hover rates-table">
            <thead className="table-primary">
              <tr>
                <th>Loan Amount</th>
                <th>Interest Rate (p.a.)</th>
                <th>Processing Fee</th>
                <th>Tenure</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>₹1 Lakh - ₹5 Lakhs</td>
                <td>10.25% - 12.5%</td>
                <td>1% - 1.5%</td>
                <td>12 - 36 months</td>
              </tr>
              <tr>
                <td>₹5 Lakhs - ₹15 Lakhs</td>
                <td>11.5% - 14%</td>
                <td>1.2% - 1.8%</td>
                <td>12 - 48 months</td>
              </tr>
              <tr>
                <td>₹15 Lakhs - ₹50 Lakhs</td>
                <td>12% - 16%</td>
                <td>1.5% - 2%</td>
                <td>12 - 60 months</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= HOW TO APPLY SECTION ================= */}
      <section className="how-to-apply-section py-5 bg-light text-center">
        <div className="container">
          <h1>How to Apply for Loan</h1>
          <p className="section-subtitle">Simple steps to get your loan approved</p>
          <div className="row g-4">
            {[
              { step: 1, title: "Check Eligibility", desc: "Use our online tool to check your eligibility in 2 minutes", eligibility: true },
              { step: 2, title: "Apply Now", desc: "Personal Loan • Home Loan • Vehicle Loan", action: true },
              { step: 3, title: "Upload Documents", desc: "Submit required documents through our secure portal" },
              { step: 4, title: "Submit Application", desc: "Fill the online application form with basic details" },
              { step: 5, title: "Get Approval", desc: "Receive instant approval decision" },
              { step: 6, title: "Receive Funds", desc: "Get amount disbursed to your bank account" },
            ].map((step, index) => (
              <div className="col-12 col-md-6 col-lg-4" key={index}>
                <div
                  className="apply-step-card p-4 shadow-sm rounded h-100"
                  onClick={() => {
                    if (step.action) {
                      navigate("/login");
                    } else if (step.eligibility) {
                      navigate("/eligibility-checker");
                    }
                  }}
                  style={(step.action || step.eligibility) ? { cursor: "pointer" } : {}}
                >
                  <div className="step-number mb-2">{step.step}</div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                  {step.action && (
                    <button className="btn btn-primary-custom mt-3 px-4 py-2">
                      Apply Now
                    </button>
                  )}
                  {step.eligibility && (
                    <button className="btn btn-primary-custom mt-3 px-4 py-2">
                      Check Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
