import { FaGithub, FaLinkedin } from 'react-icons/fa';

function ProfileCard(){

    return(
        <div className="card">
            <div>
            <h2>Eric Zwierzynski</h2>
            <h3>Software Engineer</h3>
            <p>Location: New York, NY</p>
            <p>Hello I'm an aspiring Software Engineer enjoy my page!</p>
            <div className='first-link'><a className="first">Contact</a><a className="second">Resume</a>
            </div>
            <div className='second-link'><a> <FaLinkedin size={30} /></a><a><FaGithub size={30} /></a></div>
            </div>
            <div>
                <img src="ProfilePic.jpg" alt="Profile Picture" className="profile-pic"/>
            </div>
        </div>
        
    )

}

export default ProfileCard 