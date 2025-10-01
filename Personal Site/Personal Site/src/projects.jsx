import React from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

function Projects() {
  const projects = [
    {
      title: "GuidanceHub",
      description: "GuidanceHub is an AI-powered platform that provides personalized advice on a variety of life topics. Users can receive tailored guidance based on their specific situations, preferences, and emotional states.",
      technologies: ["JavaScript", "Node.js", "Express.js", "MongoDB", "OpenAI API"],
      image: "/ghub.png",
      github: "https://github.com/ericshark/GuidanceHub",
      liveDemo: "https://pathfinder-krpb.onrender.com/"
    },
    {
      title: "Password Generator",
      description: "Generate secure, random passwords with ease. This lightweight application helps you create strong passwords to enhance your online security, ensuring you never use an insecure password again.",
      technologies: ["JavaScript", "HTML5", "CSS3"],
      image: "pgen.png",
      github: "https://github.com/ericshark/Password-Generator",
     
    },
    {
      title: "Game Hub",
      description: "A fun and interactive gaming platform built with Java. Game Hub offers a sleek main menu to launch classic games like Snake and Ultimate Tic Tac Toe, providing hours of entertainment for players of all ages.",
      technologies: ["Java", "JavaFX"],
      image: "gamehub.png",
      github: "https://github.com/ericshark/GameHub",
     
    },
    {
      title: "Portfolio Website",
      description: "A personal portfolio website showcasing my projects and skills. Built with React and styled with CSS.",
      technologies: ["React", "CSS3", "Responsive Design"],
      image: "ppage.png",
      github: "https://github.com/ericshark/Personal-Site",
      liveDemo: "#"
    }
  ];

  return (
    <div id="projects" className="projects-section">
      <div className="section-container">
        <h1 className="section-title">Projects</h1>
        <p className="section-subtitle">Check out some of my recent work</p>
        
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="project-links">
                  <a href={project.github} target="_blank" className="project-link" title="View Code">
                    <FaGithub />
                  </a>
                  <a href={project.liveDemo} target="_blank" className="project-link" title="Live Demo">
                    <FaExternalLinkAlt />
                  </a>
                </div>
              </div>
              <div className="project-info">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;
