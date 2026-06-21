import React from 'react'
import './About.css'

function About() {
  return (
    <>
      <div className="about-heading" id='about'>
        <h1>About Us</h1>
        <p>
          This section includes information about the authors of this website.
        </p>
      </div>
      <div className="about-container">
        <section className="about">
          <div className="about-image">
            <img src={"/about.png"} />
          </div>
          <div className="about-content">
            <h2>Hi there!</h2>
            <p>
              We are MCA students from AIMSR,
              Mumbai University.

              This project was developed as an AI-powered healthcare assistant
              to provide symptom analysis, health risk assessment,
              and medical guidance using Google Gemini AI.<br></br>

              <b>Team Members:</b><br></br>
              Aditya Dubey<br></br>
              Preitika Nayak<br></br>
              Neha Tripathi<br></br>
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

export default About
