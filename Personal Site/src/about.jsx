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
                I’m Eric, a student wrapping up my degree in Computer Science. I’m into coding and technology, with experience in various programming languages and tools. I’ve worked on projects and helped others learn tech skills along the way. Outside of that, I enjoy keeping up with new developments in the field and sharpening my abilities.
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
                When I’m not coding, you’ll probably find me at the gym—lifting some weights or just blowing off steam on the treadmill. I’m also big into shows like Breaking Bad and Game of Thrones. I love getting sucked into those intense stories; the crazy plot twists and badass characters always keep me coming back for more.
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