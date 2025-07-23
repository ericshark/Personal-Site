import { FaGithub, FaLinkedin } from 'react-icons/fa';

function ProfileCard(){

    return(
        <div className="card" id="home">
            
            <div>
            <h2>Eric Zwierzynski</h2>
            <h3>Software Engineer</h3>
            <p>Location: New York, NY</p>
            <p>Building tech solutions and chasing good stories—welcome to my corner of the web!</p>
            <div className='first-link'>
                <a href="#connect" className="first">Contact</a>
                <a href="/Eric_Zwierzynski_Resume.pdf" className="second" download>Resume</a>
            </div>
            <div className='second-link'><a href="https://www.linkedin.com/in/eric-zwierzynski/" target="_blank"> 
            <FaLinkedin size={40} /></a><a href="https://github.com/ericshark" target="_blank"><FaGithub size={40} /></a></div>
            </div>
            <div>
                <div className="animated-border">
                    <img src="ProfilePic.jpg" alt="Profile Picture" className="profile-pic"/>
                </div>
            </div>
           
        </div>
        
    )

}

export default ProfileCard