import React, { useContext } from 'react';
import { styled, AppBar as MuiAppBar, Toolbar, IconButton, Button, Box } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';     // Icon for Home
import ExploreIcon from '@mui/icons-material/Explore'; // Icon for Browse Trades
import PersonIcon from '@mui/icons-material/Person';   // Icon for My Profile
import AddBoxIcon from '@mui/icons-material/AddBox'; // Icon for Create Trade
import NotificationsIcon from '@mui/icons-material/Notifications'; // Icon for Notifications
import LogoutIcon from "@mui/icons-material/Logout"; // Icon for Logout
import PasswordIcon from '@mui/icons-material/Password'; // Icon for Change Password
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'; // Icon for Create Offer
import VisibilityIcon from '@mui/icons-material/Visibility'; // Icon for Specific Trade
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext";

interface AppBarProps {
    open?: boolean; // Optional prop for drawer state
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop: PropertyKey) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#0e6890',
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const NavBar: React.FC = () => {
    const navigate = useNavigate();
    const {user, setUser} = useContext(UserContext);

    const handleSignOut = () => {
        // Implement sign-out logic here
        setUser(null);
        console.log("User signed out");
        // Redirect to login page or clear user session
        navigate("/");
    
        localStorage.removeItem('user');
      };

      return (
        <AppBar position="fixed" open={false}>
            <Toolbar>
                <Button startIcon={<HomeIcon />} color="inherit" onClick={() => navigate('/home')} sx={{ mx: 1 }}>
                    Home
                </Button>
                <Button startIcon={<ExploreIcon />} color="inherit" onClick={() => navigate('/browse')} sx={{ mx: 1 }}>
                    Browse Trades
                </Button>
                <Button startIcon={<AddBoxIcon />} color="inherit" onClick={() => navigate('/create-trade')} sx={{ mx: 1 }}>
                    Create Trade
                </Button>
                {/* <Button startIcon={<SwapHorizIcon />} color="inherit" onClick={() => navigate('/create-offer')} sx={{ mx: 1 }}>
                    Create Offer
                </Button> */}
                {/* <Button startIcon={<VisibilityIcon />} color="inherit" onClick={() => navigate('/specific-trade')} sx={{ mx: 1 }}>
                    Specific Trade
                </Button> */}
                <Button startIcon={<PersonIcon />} color="inherit" onClick={() => navigate('/profile')} sx={{ mx: 1 }}>
                    My Profile
                </Button>
                <Button startIcon={<PasswordIcon />} color="inherit" onClick={() => navigate('/change-password')} sx={{ mx: 1 }}>
                    Change Password
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button startIcon={<LogoutIcon />} color="inherit" onClick={handleSignOut}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;