import React, { useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Card,
    CardContent,
    CardActions,
    CardHeader,
    IconButton,
    Box,
} from "@mui/material";
import NavBar from "../components/NavBar";
import OfferIcon from "@mui/icons-material/LocalOffer"; // This is an offer icon from Material UI
import axios from "axios";
import { useEffect } from "react";
import { useParams } from 'react-router-dom';

const CreateOffer = ({clientsocket}:{clientsocket:any}) => {
    const [quantity, setQuantity] = useState("");
    const [cashOffer, setCashOffer] = useState("");

    const { tradeId } = useParams();
    console.log("Trade ID at the start of Create Offer:", tradeId)

    const storedUser:any = localStorage.getItem("user");
    const parsedUser:any = JSON.parse(storedUser);

    console.log("User data (Frontend):", parsedUser);

    

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        // Ensure that parsedUser contains the required 'id' field
        if (!parsedUser || !parsedUser.id) 
        {
            console.error("Invalid user data.", parsedUser);
            return;
        }

        const userId = parsedUser.id;
        console.log("User ID:", userId);

        const creatorName = parsedUser.name;
        console.log("Creator Name:", creatorName);

        const username = parsedUser.username;   
        console.log("Username:", username);

        // Print what the Form submitted
        console.log("Quantity: ", quantity);
        console.log("Cash Offer: ", cashOffer);

        const offerData = {
            tradeId: tradeId,
            creator: userId, 
            creatorName: creatorName,
            username: username,
            quantity: parseInt(quantity), // Convert quantity to a number
            cashOffered: parseFloat(cashOffer), // Convert cashOffer to a number    
        };

        try 
        {
            console.log("Creating offer with data (Frontend):", offerData);
            const response = await axios.post(
                "http://localhost:8000/offers/create",
                offerData
            );

            console.log("Response from backend:", response.data);
            console.log("Response.data.success:", response.data.success);

            if (response.data.success) 
            {
                console.log("Offer created Succesfully:", response.data.offer);

                // Emit the offer to the server
                console.log("EMITTING OFFER", response.data.offer)
                clientsocket.emit("newOffer", response.data.offer);

                // Clear the form fields
                setQuantity("");
                setCashOffer("");
            } 
            else 
            {
                console.log("Failed to create offer:", response.data.message);
                alert(response.data.message)
            }
        } 
        catch (error) 
        {
            console.error("Error submitting offer:", error);
        }
    };

    return (
        <Box
            sx={{
                background: `url('https://wallpapercave.com/wp/wp11456379.jpg') no-repeat center center`,
                backgroundSize: "cover",
                width: "100vw",
                height: "100vh",
                position: "absolute",
                top: 0,
                left: 0,
                padding: "0px 0", // Adjust padding to push the content down from the NavBar
            }}
        >
            <NavBar />
            <Container
                maxWidth="sm"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "100%", // This will center the card vertically
                    padding: 2,
                }}
            >
                <Card sx={{ mt: 10 }}>
                    <CardHeader
                        title={
                            <OfferIcon
                                color="primary"
                                sx={{
                                    fontSize: 60,
                                    display: "block",
                                    mx: "auto",
                                }}
                            />
                        }
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
                        Create Offer
                    </Typography>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                    
                            <TextField
                                label="Quantity"
                                variant="outlined"
                                fullWidth
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                label="Cash Offer ($)"
                                variant="outlined"
                                fullWidth
                                value={cashOffer}
                                onChange={(e) => setCashOffer(e.target.value)}
                                sx={{ mb: 1 }}
                            />
                            <CardActions>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Submit Offer
                                </Button>
                            </CardActions>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default CreateOffer;
