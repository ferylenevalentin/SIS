import { Link } from 'react-router-dom';
import './Sidebar.css';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';
import GroupIcon from '@mui/icons-material/Group';
function Sidebar() {
  return (
    <div className="sidebar-main">
      <div className="sidebar-links">
        <Link to = "/">
         <HomeIcon> </HomeIcon> HOME
        </Link>
        <Link to  ="/addstudent">
           <InfoIcon></InfoIcon> MANAGE STUDENTS
        </Link>
        <Link to  ="/adduser">
           <GroupIcon></GroupIcon> MANAGE USERS
        </Link>
      </div>
    </div>
  );
}


export default Sidebar;