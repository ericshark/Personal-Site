import React from 'react';
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

function Experience() {
    const experiences = [
        {
            title: "Software Developer Intern",
            company: "GeoComm",
            location: "Remot",
            period: "May 2025 - Present",
            description: [
                "Contributed to backend development using Python, supporting public safety GIS applications designed for emergency response systems.",
                "Developed custom Airflow DAGs automating recurring workflows, reducing manual tasks by 30%.",
                "Wrote 40+ Pytest unit cases, increasing code coverage from 32% to 90%",
                "Implemented structured logging, reducing incident triage time by 40%.",
                "Refactored existing codebase, enhancing readability, performance, and maintainability."
             
            ],
            technologies: ["Python, Fast API, SQLAlchemy, SQL, Apache Airflow"]
        },
        {
            title: "Google Software Engineering Program (G-SWEP)",
            company: "Google",
            location: "New York, NY",
            period: "Jan 2024 - May 2025",
            description: [
                "Received guidance from a Google engineering mentor on advanced problem-solving, system design, and real-world software engineering best practices.",
                "Enhanced proficiency in algorithms, data structures, and coding efficiency through technical workshops and mock interviews for large-scale applications.",
             
            ],
            technologies: ["Python"]
        },
        {
            title: "Computer Science Teaching Assistant",
            company: "City University of New York, College of Staten Island",
            location: "Staten Island, NY",
            period: "January 2025 – May 2025",
            description: [
                "Collaborated with the professor to support over 25 students per lab session in mastering debugging techniques and technical concepts.",
                "Resolved coding errors with precise troubleshooting, increasing lab assignment completion rates by 20% across sessions.",
                "Provided clear, targeted instruction to enhance student understanding of programming fundamentals, including loops and data structures.",
                "Ensured a productive lab environment by addressing technical issues efficiently and aligning efforts with course goals."
                ],
            technologies: ["Python", "C++"]
        },
        {
            title: "Mathematics and Computer Science Tutor",
            company: "City University of New York, College of Staten Island",
            location: "Staten Island, NY",
            period: "September 2024 – May 2025",
            description: [
                "Conducted one-on-one and group tutoring sessions in Mathematics and Computer Science, focusing on calculus, algebra, data structures, and languages like Python and JavaScript.",
                "Designed individualized learning strategies to tackle specific student challenges, boosting comprehension and grades for over 30 students weekly.",
                "Explained complex technical concepts clearly, helping students master programming skills and mathematical reasoning effectively.",
                "Adapted teaching methods to diverse learning styles, ensuring consistent academic improvement across a range of topics."
                ],
            technologies: ["Python", "Java", "JavaScript", "C++"]
        },
        {
            title: "Project Manager Intern",
            company: "JRM Construction Management",
            location: "New York, NY",
            period: "May 2024 - Aug 2024",
            description: [
                "Coordinated project workflows using Procore, ensuring timely delivery and adherence to budget constraints.",
                "Streamlined team communication through efficient documentation practices, reducing project delays by 25%.",
                "Monitored task progress and resource allocation to maintain alignment with project milestones and goals.",
                "Facilitated collaboration across teams, improving operational efficiency and issue resolution timelines."
                ],
            technologies: ["Procore", "Excel", "Budget Management"]
        },
        {
            title: "Software Developer Intern",
            company: "Research Foundation of The City University of New York",
            location: "New York, NY",
            period: "Feb 2024 - May 2024",
            description: [
                "Designed and built an internship-finder web app using React, Next.js, Node.js, and the OpenAI API.",
                "Integrated intelligent search and recommendation features to assist students in discovering relevant internships.",
                "Collaborated with researchers on computer science outreach projects and led development efforts to improve internship matchmaking.",
                "Produced engaging content and a website to simplify AI and cryptography concepts for non-technical audiences."
                ],
            technologies: ["JavaScript", "React","Next.js","Node.js", "CSS", "OpenAI API", "Bootstrap", "Git"]
        }
    ];

    return (
        <div className="experience-section" id="experience">
            <div className="section-container">
                <h1 className="section-title">Experience</h1>
                <p className="section-subtitle">My professional journey</p>
                
                <div className="experience-grid">
                    {experiences.map((exp, index) => (
                        <div key={index} className="experience-card">
                            <div className="experience-card-header">
                                <div className="experience-title-section">
                                    <h2 className="experience-title">{exp.title}</h2>
                                    <h3 className="experience-company">{exp.company}</h3>
                                </div>
                                <div className="experience-meta">
                                    <div className="experience-location">
                                        <FaMapMarkerAlt className="experience-icon" /> {exp.location}
                                    </div>
                                    <div className="experience-period">
                                        <FaCalendarAlt className="experience-icon" /> {exp.period}
                                    </div>
                                </div>
                            </div>
                            <div className="experience-card-body">
                                <ul className="experience-description">
                                    {exp.description.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                                <div className="experience-technologies">
                                    {exp.technologies.map((tech, i) => (
                                        <span key={i} className="experience-tech-tag">{tech}</span>
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

export default Experience;