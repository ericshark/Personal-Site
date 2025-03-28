import { useState, useEffect } from 'react';

function Nav(){
    const [activeLink, setActiveLink] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            
            // Get all sections
            const aboutSection = document.getElementById('about');
            const experienceSection = document.getElementById('experience');
            const skillsSection = document.getElementById('skills');
            const projectsSection = document.getElementById('projects');
            const connectSection = document.getElementById('connect');
            
            // Get positions of each section (accounting for navbar height)
            const navHeight = 200; // Increased height offset for better section detection
            
            // Set active based on current scroll position
            if (scrollPosition < (aboutSection?.offsetTop - navHeight || Infinity)) {
                setActiveLink('home');
            } else if (aboutSection && scrollPosition < (experienceSection?.offsetTop - navHeight || Infinity)) {
                setActiveLink('about');
            } else if (experienceSection && scrollPosition < (skillsSection?.offsetTop - navHeight || Infinity)) {
                setActiveLink('experience');
            } else if (skillsSection && scrollPosition < (projectsSection?.offsetTop - navHeight || Infinity)) {
                setActiveLink('skills');
            } else if (projectsSection && scrollPosition < (connectSection?.offsetTop - navHeight || Infinity)) {
                setActiveLink('projects');
            } else if (connectSection) {
                setActiveLink('connect');
            }
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);
        
        // Initial check on component mount
        handleScroll();
        
        // Clean up event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Handle click on nav links
    const handleLinkClick = (link) => {
        setActiveLink(link);
        
        // Special handling for home link - scroll to top
        if (link === 'home') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    return(
        <nav className="NavBar">
            <a href="#">
                <h1>Eric Zwierzynski</h1>
            </a>
            <ul className="NavBarLinks">
                <li>
                    <a 
                        href="#" 
                        className={activeLink === 'home' ? 'active' : ''} 
                        onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick('home');
                        }}
                    >
                        Home
                    </a>
                </li>
                <li>
                    <a 
                        href='#about' 
                        className={activeLink === 'about' ? 'active' : ''} 
                        onClick={() => handleLinkClick('about')}
                    >
                        About
                    </a>
                </li>
                <li>
                    <a 
                        href='#experience' 
                        className={activeLink === 'experience' ? 'active' : ''} 
                        onClick={() => handleLinkClick('experience')}
                    >
                        Experience
                    </a>
                </li>
                <li>
                    <a 
                        href='#skills' 
                        className={activeLink === 'skills' ? 'active' : ''} 
                        onClick={() => handleLinkClick('skills')}
                    >
                        Skills
                    </a>
                </li>
                <li>
                    <a 
                        href='#projects' 
                        className={activeLink === 'projects' ? 'active' : ''} 
                        onClick={() => handleLinkClick('projects')}
                    >
                        Projects
                    </a>
                </li>
                <li>
                    <a 
                        href='#connect' 
                        className={activeLink === 'connect' ? 'active' : ''} 
                        onClick={() => handleLinkClick('connect')}
                    >
                        Connect
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default Nav;