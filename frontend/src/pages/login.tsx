import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useEffect, useContext, useState } from "react";
import axios from "axios";

const defaultTheme = createTheme();

function Login() {
    const navigate = useNavigate();
    const {user, setUser} = useContext(UserContext);
    const [error, setError] = useState<string>("");

    const redirectToSignUp = () => {
        navigate("/signup");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const username = formData.get('username') as string; // Assuming input name is 'username'
        const password = formData.get('password') as string; // Assuming input name is 'password'

        try 
        {
            const response = await axios.post("http://localhost:8000/auth/login"
                , {
                    username,
                    password,
                }
            );

            console.log("Response from API:", response.data);

            if (response.data.success) 
            {
                console.log("Login successful");
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user)); // This will update local storage
                navigate("/home");
            }
        }
        catch (error: any) 
        {
            console.error("Login error:", error.response?.data.message || "An error occurred during login");
            setError(error.response?.data.message); // Set error message from server response
        }

    };


    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography component="h1" variant="h3">
                        Trading App
                    </Typography>
                    <Box sx={{ mb: 3 }} />

                    <Avatar
                        sx={{
                            m: 1,
                            bgcolor: "#0e6890",
                            width: { xs: 36, sm: 50, md: 64 },
                            height: { xs: 36, sm: 50, md: 64 },
                        }}
                    >
                        <LockOutlinedIcon fontSize="large" />

                    </Avatar>

                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{ fontFamily: "Arial" }}
                    >
                        Login
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            InputProps={{
                                style: { color: "#000000" },
                            }}
                            InputLabelProps={{
                                style: { color: "#000000" },
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            InputProps={{
                                style: { color: "#000000" },
                            }}
                            InputLabelProps={{
                                style: { color: "#000000" },
                            }}
                        />
                        <Box sx={{ mb: 1 }} />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: "#0e6890",
                                "&:hover": { backgroundColor: "#000000" },
                            }}
                        >
                            Sign In
                        </Button>
                        {error && (
                            <Typography
                                variant="body2"
                                sx={{ color: "red", mt: 2 }}
                            >
                                {error}
                            </Typography>
                        )}
                            <Grid item>
                                <Link
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        redirectToSignUp();
                                    }}
                                    variant="body2"
                                    sx={{
                                        color: "#0e6890",
                                        textDecorationColor: "#000000",
                                        "&:hover": {
                                            textDecoration: "underline",
                                        },
                                    }}
                                >
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Login;