import React from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaLinkedin } from 'react-icons/fa';

function Connect() {
  return (
    <div id="connect" className="connect-section">
      <div className="section-container">
        <h1 className="section-title">Connect With Me</h1>
        <p className="section-subtitle">Let's get in touch</p>
        
        <div className="connect-content">
          <div className="connect-info">
            <div className="connect-item">
              <a href="mailto:ericzwierzynski1@gmail.com">
                <div className="connect-icon">
                  <FaEnvelope />
                </div>
                <div className="connect-details">
                  <h3>Email</h3>
                  <p>ericzwierzynski1@gmail.com</p>
                  <p className="connect-description">Feel free to email me for any work inquiries or just to say hello!</p>
                </div>
              </a>
            </div>
            
            <div className="connect-item">
              <a href="https://maps.google.com/?q=New+York,+NY" target="_blank" >
                <div className="connect-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="connect-details">
                  <h3>Location</h3>
                  <p>New York, NY</p>
                  <p className="connect-description">Currently based in the heart of New York City, open to remote opportunities worldwide.</p>
                </div>
              </a>
            </div>
            
            <div className="connect-item">
                <a href="https://www.linkedin.com/in/eric-zwierzynski/" target="_blank">  
                  <div className="connect-icon">
                    <FaLinkedin />
                  </div>
                  <div className="connect-details">
                    <h3>LinkedIn</h3>

                    <p className="connect-description">Connect with me professionally and stay updated with my career journey.</p>
                  </div>
                </a>
            </div>
          </div>
          
     
        </div>
      </div>
    </div>
  );
}

export default Connect;