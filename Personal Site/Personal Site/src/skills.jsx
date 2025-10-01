import React from 'react';
import { 
  FaJs, 
  FaReact, 
  FaNode, 
  FaPython, 
  FaJava, 
  FaDatabase, 
  FaPhp, 
  FaDocker 
} from 'react-icons/fa';
import { 
  SiCplusplus, 
  SiExpress, 
  SiPostgresql, 
  SiMongodb, 
  SiMysql,
  SiFastapi,
  SiPytest,
  SiPandas,
  SiNumpy,
  SiSqlalchemy
} from 'react-icons/si';

function Skills() {
  const skills = [
    { name: "JavaScript", icon: <FaJs /> },
    { name: "Python", icon: <FaPython /> },
    { name: "Java", icon: <FaJava /> },
    { name: "SQL", icon: <FaDatabase /> },
    { name: "FastAPI", icon: <SiFastapi /> },
    { name: "Pytest", icon: <SiPytest /> },
    { name: "Pandas", icon: <SiPandas /> },
    { name: "NumPy", icon: <SiNumpy /> },
    { name: "SQLAlchemy", icon: <SiSqlalchemy /> },
    { name: "React", icon: <FaReact /> },
    { name: "Node.js", icon: <FaNode /> },
    { name: "Express.js", icon: <SiExpress /> },
    { name: "PostgreSQL", icon: <SiPostgresql /> },
    { name: "MongoDB", icon: <SiMongodb /> },
    { name: "MySQL", icon: <SiMysql /> },
    { name: "Docker", icon: <FaDocker /> }
  ];

  return (
    <div id="skills" className="skills-section">
      <div className="section-container">
        <h1 className="section-title">Skills</h1>
        <p className="section-subtitle">Technologies I work with</p>
        
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div key={index} className="skill-card">
              <div className="skill-icon">{skill.icon}</div>
              <h3 className="skill-name">{skill.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Skills;
