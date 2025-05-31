import React, { useState, useContext } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Card,
    CardContent,
    CardActions,
    IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; // Import an icon for the form
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"; // Icon for removing conditions
import TradingIcon from '@mui/icons-material/ShowChart';
import axios from "axios";
import { UserContext } from "../context/UserContext"; // Ensure this path is correct
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
// import UserContext from './context/UserContext'; // Ensure correct path

const CreateTradeRoute = () => {
    const { user } = useContext(UserContext); // Ensure correct context
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [conditions, setConditions] = useState([""]);

    // Retrieve user data from local storage
    const storedUser = localStorage.getItem('user');

    console.log('User from context in CreateTradeRoute:', storedUser);

    const navigate = useNavigate();

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (!storedUser)
        {
            alert('You must be logged in to create a trade.');
            return;
        }

        // Parse the stored user data
        const user = JSON.parse(storedUser);

        console.log("User from local storage in CreateTradeRoute:", user)

        console.log("Creating trade with data:", {
            title,
            description,
            conditions,
        });

        try {
            const tradeData = {
                title,
                description,
                conditions,
                creator : user.id,
                creatorName : user.name,
            };

            console.log("Creating trade with data:", tradeData);

            const response = await axios.post(
                "http://localhost:8000/create-trade/trades",
                tradeData
            );
            alert("Trade created successfully!");

            if (response.data.success) {
                console.log("Trade created successfully");

                // Clear the form or navigate away
                setTitle("");
                setDescription("");
                setConditions([""]);
                navigate("/home");
            }
        } catch (error) {
            console.error("Error creating trade:", error);
            alert("Error creating trade. Please try again.");
        }
    };

    const handleConditionChange = (index: any, event: any) => {
        const newConditions = [...conditions];
        newConditions[index] = event.target.value;
        setConditions(newConditions);
    };

    const addCondition = () => {
        setConditions([...conditions, ""]);
    };

    const removeCondition = (index: any) => {
        const newConditions = [...conditions];
        newConditions.splice(index, 1);
        setConditions(newConditions);
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
            <Box sx={{ my: 4, mt: 12 }}>
                <Card raised sx={{ p: 2 }}>
                    <CardContent>
                        <TradingIcon
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
                            Create New Trade
                        </Typography>
                        <TextField
                            required
                            label="Title"
                            fullWidth
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            required
                            label="Description"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        {conditions.map((condition, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 2,
                                }}
                            >
                                <TextField
                                    label={`Condition ${index + 1}`}
                                    fullWidth
                                    variant="outlined"
                                    value={condition}
                                    onChange={(e) =>
                                        handleConditionChange(index, e)
                                    }
                                />
                                <IconButton
                                    onClick={() => removeCondition(index)}
                                    color="error"
                                >
                                    <RemoveCircleOutlineIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Button
                            onClick={addCondition}
                            startIcon={<AddCircleOutlineIcon />}
                            sx={{ mb: 2 }}
                        >
                            Add Condition
                        </Button>
                    </CardContent>
                    <CardActions>
                        <Button
                            type="submit"
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Create Trade
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Container>
        </Box>
    );
};

export default CreateTradeRoute;
