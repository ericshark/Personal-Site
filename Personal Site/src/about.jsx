import React from 'react';
import { FaUser, FaGraduationCap, FaLaptopCode, FaHeart } from 'react-icons/fa';

function About() {
  return (
    <div id="about" className="about-section">
      <div className="section-container">
        <h1 className="section-title">About Me</h1>
        <p className="section-subtitle">Get to know me better</p>
        
        <div className="about-content">
          <div className="about-text">
            <div className="about-card">
              <div className="about-icon">
                <FaUser />
              </div>
              <div className="about-info">
                <h3>Who I Am</h3>
                <p>
                Hi, I'm Eric, a software developer passionate about turning complex problems into clean, user-friendly applications. I enjoy working with Python, databases, and cloud technologies to create impactful solutions.
                </p>
               
              </div>
            </div>
            
            <div className="about-card">
              <div className="about-icon">
                <FaGraduationCap />
              </div>
              <div className="about-info">
                <h3>Education</h3>
                <p>
                  <strong>Bachelor of Science in Computer Science</strong><br />
                  City University of New York - College of Staten Island<br />
                  May 2025
                </p>
                <p>
                  <strong>Relevant Coursework:</strong> Artificial Intelligence, Software Engineering, Analysis of Algorithms, Internet Data
Communications and Security, Database Systems, Object Oriented Software Design, Web Development

                </p>
              </div>
            </div>
            
      
            
            <div className="about-card">
              <div className="about-icon">
                <FaHeart />
              </div>
              <div className="about-info">
                <h3>Outside of Coding</h3>
                <p>
                When I’m not behind the keyboard, I enjoy fitness training, discovering new music, and exploring healthy recipes to fuel my day.
                </p>
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;