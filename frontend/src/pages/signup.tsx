import React, { useState, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
    Container,
    CssBaseline,
    Box,
    Typography,
    TextField,
    Button,
    Avatar,
    ThemeProvider,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

const defaultTheme = createTheme();

const SignupForm: React.FC = () => {
    const [username_, setUsername] = useState<string>("");
    const [name_, setName] = useState<string>("");
    const [password_, setPassword] = useState<string>("");
    const [email_, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(""); // Reset error message at the start of submission

        const formData = new FormData(event.currentTarget);
        const username = formData.get('username') as string;
        setUsername(username);
        const name = formData.get('name') as string;
        setName(name);
        const password = formData.get('password') as string;
        setPassword(password);
        const email = formData.get('email') as string;
        setEmail(email);

        console.log("Signing up with", { name, username, password, email });

        try {
            const response = await axios.post(
                "http://localhost:8000/auth/signup",
                {
                    name_,
                    username_,
                    password_,
                    email_,
                }
            );

            console.log(response.data);

            if (response.data.success) 
            {
                console.log("Signup successful");

                // clear usrname and password fields
                setUsername("");
                setName("");
                setEmail("");
                setError("");

                navigate("/");
            }
        } 
        catch (error: any) 
        {
            console.error(
                "Signup error:",
                error.response?.data.message ||
                    "An error occurred during signup"
            );
            setError(
                error.response?.data.message ||
                    "An error occurred during signup"
            );
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
                        Sign Up
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
                            id="name"
                            label="Name"
                            name="name"
                            autoComplete="name"
                            onChange={(e) => setName(e.target.value)}
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
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setUsername(e.target.value)}
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
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
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
                            id="email"
                            label="Email Address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                style: { color: "#000000" },
                            }}
                            InputLabelProps={{
                                style: { color: "#000000" },
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: "#0e6890",
                                "&:hover": { backgroundColor: "#0000000" },
                            }}
                        >
                            Sign Up
                        </Button>
                        {error && (
                            <Typography
                                variant="body2"
                                sx={{ color: "red", mt: 2 }}
                            >
                                {error}
                            </Typography>
                        )}
                    </Box>
                    <Grid item>
                        <Link
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/");
                            }}
                            variant="body2"
                            sx={{
                                color: "#000000",
                                textDecorationColor: "#000000",
                            }}
                        >
                            Already have an account? Sign in
                        </Link>
                    </Grid>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default SignupForm;
