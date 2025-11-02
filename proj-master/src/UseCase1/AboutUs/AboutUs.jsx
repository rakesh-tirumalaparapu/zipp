import React from "react";
import "../AboutUs/AboutUs.css";
import ScImage2 from "../Images/Sc-Image2.jpg";
import OurStory from "../Images/Our_Story.jpg";
import GlobalPresence from "../Images/Global_presence.jpg";

function AboutUs() {
  return (
    <div className="about-page">
      {/* ================= HERO SECTION ================= */}
      <section
        className="about-hero-section text-white text-center d-flex align-items-center"
        style={{
          backgroundImage: `url(${ScImage2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container hero-overlay py-5">
          <h1 className="fw-bold display-4 animate__animated animate__fadeInDown"></h1>
          <p className="lead mt-3 animate__animated animate__fadeInUp">
            Leading the future of banking with innovation, trust, and global
            excellence since 1853.
          </p>
          <div className="row justify-content-center mt-5">
            <div className="col-6 col-md-3 stat-box">
              <h2 className="fw-bold">170+</h2>
              <p>Years of Excellence</p>
            </div>
            <div className="col-6 col-md-3 stat-box">
              <h2 className="fw-bold">60+</h2>
              <p>Markets Worldwide</p>
            </div>
            <div className="col-6 col-md-3 stat-box">
              <h2 className="fw-bold">1M+</h2>
              <p>Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR STORY SECTION ================= */}
      <section className="our-story-section py-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-6">
              <h2 className="fw-bold mb-3 text-primary">Our Story</h2>
              <p>
                Standard Chartered has been shaping international banking for
                over 170 years. Established in 1853, we operate in more than 60
                dynamic markets across Asia, Africa, and the Middle East.
              </p>
              <p>
                Our mission is to drive commerce and prosperity through our
                unique diversity. Guided by our purpose “Here for good”, we are
                committed to creating lasting value for customers, employees,
                and communities.
              </p>
              <button className="btn btn-primary-custom mt-3">Learn More</button>
            </div>
            <div className="col-md-6">
              {/* ✅ Replaced placeholder with your local Our_Story image */}
              <div className="ratio ratio-16x9 shadow-lg rounded overflow-hidden">
                <img
                  src={OurStory}
                  alt="Our Story"
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
            </div>
          </div>

          <div className="timeline mt-5">
            <div className="timeline-item">
              <div className="timeline-year">1853</div>
              <p>Founded under Royal Charter</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">1969</div>
              <p>Merger of Standard Bank and Chartered Bank</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2000+</div>
              <p>Digital transformation and global expansion</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VALUES SECTION ================= */}
      <section className="values-section py-5 bg-light text-center">
        <div className="container">
          <h2 className="fw-bold mb-4 text-primary">Our Core Values</h2>
          <div className="row g-4">
            {[
              {
                icon: "🎯",
                title: "Integrity",
                desc: "We do what is right, not what is easy — with honesty and transparency.",
              },
              {
                icon: "🤝",
                title: "Collaboration",
                desc: "We work together across boundaries to achieve shared success.",
              },
              {
                icon: "💡",
                title: "Innovation",
                desc: "We embrace change and explore new ways to deliver excellence.",
              },
              {
                icon: "🌍",
                title: "Sustainability",
                desc: "We strive for a sustainable future for our people and the planet.",
              },
            ].map((v, i) => (
              <div className="col-12 col-md-6 col-lg-3" key={i}>
                <div className="card h-100 border-0 shadow value-card">
                  <div className="card-body">
                    <div className="display-4">{v.icon}</div>
                    <h5 className="fw-bold mt-3">{v.title}</h5>
                    <p className="text-muted">{v.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LEADERSHIP SECTION ================= */}
      <section className="leadership-section py-5 text-center">
        <div className="container">
          <h2 className="fw-bold mb-5 text-primary">Leadership Team</h2>
          <div className="row g-4">
            {[
              {
                initials: "JV",
                name: "José Viñals",
                role: "Group Chairman",
                desc: "Providing strategic leadership and governance with decades of financial expertise.",
              },
              {
                initials: "BW",
                name: "Bill Winters",
                role: "Group Chief Executive",
                desc: "Driving global strategy and operational excellence.",
              },
              {
                initials: "AH",
                name: "Andy Halford",
                role: "Chief Financial Officer",
                desc: "Overseeing financial performance and strategic growth.",
              },
            ].map((leader, i) => (
              <div className="col-12 col-md-4" key={i}>
                <div className="card leader-card shadow-sm h-100 border-0">
                  <div className="leader-avatar mx-auto">
                    {leader.initials}
                  </div>
                  <div className="card-body">
                    <h5 className="fw-bold">{leader.name}</h5>
                    <p className="text-success fw-semibold">{leader.role}</p>
                    <p className="text-muted">{leader.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GLOBAL PRESENCE SECTION ================= */}
      <section className="global-section py-5 bg-light text-center">
        <div className="container">
          <h2 className="fw-bold mb-4 text-primary">Global Presence</h2>
          <div className="row align-items-center g-5">
            <div className="col-md-6">
              {/* ✅ Replaced placeholder with your local Global_presence image */}
              <div className="ratio ratio-16x9 shadow-lg rounded overflow-hidden">
                <img
                  src={GlobalPresence}
                  alt="Global Presence"
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="row text-start g-3">
                <div className="col-6">
                  <h4 className="fw-bold text-success">60+</h4>
                  <p>Markets</p>
                </div>
                <div className="col-6">
                  <h4 className="fw-bold text-success">85,000+</h4>
                  <p>Employees</p>
                </div>
                <div className="col-6">
                  <h4 className="fw-bold text-success">1,000+</h4>
                  <p>Branches</p>
                </div>
                <div className="col-6">
                  <h4 className="fw-bold text-success">125+</h4>
                  <p>Nationalities</p>
                </div>
              </div>
              <div className="mt-4 text-start">
                <h5 className="fw-bold">Key Regions</h5>
                <ul className="list-unstyled">
                  {["Asia", "Africa", "Middle East", "Europe", "Americas"].map(
                    (region, i) => (
                      <li key={i} className="region-item">
                        {region}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
