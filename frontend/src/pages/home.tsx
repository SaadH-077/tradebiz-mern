import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import NavBar from '../components/NavBar';

const Home = () => {
    const theme = useTheme();

    return (
        <>
            <NavBar />
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: 'calc(110vh - 64px)', // Adjust height if NavBar height is different
                    backgroundImage: 'url(https://wallpapercave.com/wp/wp11456379.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', // Overlay color
                    },
                    '& > *': {
                        position: 'relative', // Ensures that the text appears above the overlay
                        zIndex: 2,
                    }
                }}
            >
                <Typography variant="h2" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                    Welcome to TradeBiz!
                </Typography>
                <Typography variant="h6" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
                    Your Trading Partner for Life.
                </Typography>
                {/* Additional content here */}
            </Box>
        </>
    );
};

export default Home;
