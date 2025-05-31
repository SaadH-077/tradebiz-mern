import React, { useState, useContext } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Paper,
} from "@mui/material";
import { UserContext } from "../context/UserContext"; // Ensure this path is correct
import NavBar from "../components/NavBar";
import axios from "axios";
import SecurityIcon from "@mui/icons-material/Security";

const ChangePassword = () => {
    const { user } = useContext(UserContext);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    // Retrieve user data from local storage
    const storedUser = localStorage.getItem('user');

    console.log('User from context in ChangePassword:', storedUser);

    const handleChangePassword = async () => {

        // Print what the User entered
        console.log("Current Password: ", currentPassword);
        console.log("New Password: ", newPassword);
        console.log("Confirm Password: ", confirmPassword);

        // Simple client-side validation
        if (newPassword !== confirmPassword) 
        {
            setError("The new passwords do not match.");
            return;
        }

        if (!storedUser) 
        {
            setError('No user information found. Please log in again.');
            return;
        }

        const { username } = JSON.parse(storedUser);

        try 
        {
            console.log("Changing password for user:", username);
            const response = await axios.get(
                "http://localhost:8000/auth/change-password",
                {
                    params: {
                        username,
                        currentPassword,
                        newPassword,
                    }
                }
            );

            // Handle response
            if (response.data.success) 
            {
                alert("Password changed successfully!");

                // Clear input fields
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } 
            else 
            {
                setError(response.data.message);
            }
        } 
        catch (err) 
        {
            setError("An error occurred while changing the password.");
            console.error(err);
        }
    };

    return (
        <Box sx={{
            background: `url('https://wallpapercave.com/wp/wp11456379.jpg') no-repeat center center`,
            backgroundSize: 'cover',
            width: '100vw',
            height: '100vh',
            position: 'absolute',
            top: 0,
            left: 0,
            padding: '0px 0', // Adjust padding to push the content down from the NavBar
        }}>
        <Container maxWidth="sm">
            <NavBar />
            <Paper elevation={3} sx={{ mt: 12, p: 4 }}>
                <SecurityIcon
                    color="primary"
                    sx={{ fontSize: 60, display: "block", mx: "auto" }}
                />
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1,
                        fontFamily: "Arial",
                        fontWeight: "bold",
                    }}
                >
                    Change Password
                </Typography>
                <Box
                    component="form"
                    onSubmit={(e) => e.preventDefault()}
                    noValidate
                    sx={{ mt: 2 }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="currentPassword"
                        label="Current Password"
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="newPassword"
                        label="New Password"
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {error && (
                        <Typography variant="body2" color="error">
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleChangePassword}
                    >
                        Change Password
                    </Button>
                </Box>
            </Paper>
        </Container>
        </Box>
    );
};

export default ChangePassword;
