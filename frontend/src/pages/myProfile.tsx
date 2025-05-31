import React, { useState, useEffect, useContext } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Avatar,
    Grid,
    Paper,
    Chip,
    CardActions,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import SecurityIcon from "@mui/icons-material/Security";
import OfferIcon from "@mui/icons-material/LocalOffer";
import { parse } from "path";

// Define the structure of the user details object
interface UserDetails {
    id: string;
    name: string;
    username: string;
    cash: number; 
}

// Define the structure of the trade object
interface Trade {
    id: string;
    title: string;
    description: string;
    conditions: string[];
}

interface Offer {
    _id: string; // Use _id as it is the standard MongoDB document identifier
    creator: string; // creator holds the user's ID
    description: string;
    conditions: string[];
    quantity: number;
    cashOffered: number;
    offerForItem: string; // This seems to be the field name for the trade item title
    status: string;
}

const MyProfile = () => {
    const [userDetails, setUserDetails] = useState<any>(null);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [sentOffers, setSentOffers] = useState<Offer[]>([]);
    const navigate = useNavigate();

    // Retrieve user data from local storage
    const storedUser = localStorage.getItem("user");
    // console.log("User from context in MyProfile:", storedUser);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);

            // Fetch sent offers when the component mounts
            const fetchSentOffers = async (userId: string) => {
                try {
                    console.log("User ID:", parsedUser.id);
                    const response = await axios.get(
                        `http://localhost:8000/offers/user-offers`,
                        {
                            params: { userId: parsedUser.id },
                        }
                    );

                    console.log(
                        "Response from API Sent Offers:",
                        response.data
                    );
                    setSentOffers(response.data);
                } catch (error) {
                    console.error("Error fetching sent offers:", error);
                }
            };

            if (userDetails && userDetails.id) {
                fetchSentOffers(userDetails.id);
            }
        }
    }, [userDetails]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);

            // Fetch detailed user information
            const fetchUserInfo = async () => {
                try {
                    // console.log("Parsed User ID:", parsedUser.id);
                    const response = await axios.get(
                        "http://localhost:8000/browse/user-info",
                        {
                            params: { userId: parsedUser.id },
                        }
                    );
                    console.log("Response from API:", response.data);
                    setUserDetails(response.data);
                } catch (error) {
                    console.error("Error fetching user info:", error);
                }
            };

            // Fetch trades made by the user
            const fetchUserTrades = async () => {
                try {
                    console.log("Parsed User ID:", parsedUser.id);
                    const response = await axios.get(
                        `http://localhost:8000/browse/user-trades`,
                        {
                            params: { userId: parsedUser.id },
                        }
                    );
                    console.log("Response from API Trades:", response.data);
                    setTrades(response.data.trades); // Assuming the API returns the user's trades
                } catch (error) {
                    console.error("Error fetching user's trades:", error);
                }
            };

            fetchUserInfo();
            fetchUserTrades();
        }
    }, []);

    return (
        <Container>
            <NavBar />
            <Box sx={{ my: 4, mt: 12 }}>
                <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid
                            item
                            xs={12}
                            sm={3}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Avatar
                                sx={{
                                    width: 128,
                                    height: 128,
                                    border: "2px solid #000",
                                }}
                                src="https://as2.ftcdn.net/v2/jpg/01/76/21/53/1000_F_176215306_uqxl1pqNJYqOQ33A5rX3WQoHQ7gSjXAU.jpg"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h4" gutterBottom>
                                <AccountCircleIcon /> {userDetails?.name}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                @{userDetails?.username}
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<LockOpenIcon />}
                                sx={{ mt: 1, mb: 1, borderRadius: 50 }}
                                onClick={() => navigate("/change-password")}
                            >
                                Update Password
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<AddCircleOutlineIcon />}
                                sx={{ mt: 1, mb: 1, ml: 2, borderRadius: 50 }}
                                onClick={() => navigate("/create-trade")}
                            >
                                Create Trade
                            </Button>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={3}
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Chip
                                label={`Cash: $${userDetails?.cash || "0"}`}
                                color="primary"
                                variant="outlined"
                                sx={{ width: "100%", fontSize: "1rem" }}
                            />
                            <Chip
                                label={`Items: ${
                                    userDetails?.itemsOwned || "0"
                                }`}
                                color="primary"
                                variant="outlined"
                                sx={{ width: "100%", fontSize: "1rem" }}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
            <Typography variant="h5" gutterBottom>
                My Trades
            </Typography>
            {trades.map((trade, index) => (
                <Card
                    key={trade.id}
                    sx={{
                        display: "flex",
                        mb: 2,
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img
                            src="https://www.entrepreneurshipinabox.com/wp-content/uploads/A-Basic-Guide-To-Stock-Trading.jpg"
                            alt={trade.title}
                            style={{
                                width: "100px",
                                height: "100px",
                                marginRight: 16,
                            }}
                        />
                        <CardContent>
                            <Typography variant="h6">{trade.title}</Typography>
                            <Typography variant="body1" color="text.secondary">
                                {trade.description}
                            </Typography>
                            {trade.conditions.map((condition, idx) => (
                                <Typography
                                    key={idx}
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    - {condition}
                                </Typography>
                            ))}
                        </CardContent>
                    </Box>
                    <CardActions>
                        <Box
                            sx={{
                                backgroundColor: "green",
                                borderRadius: "70%",
                                width: 80, // Adjust as needed
                                height: 80, // Adjust as needed
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white", // Adjust as needed
                                fontWeight: "bold", // Adjust as needed
                            }}
                        >
                            Trade
                        </Box>
                    </CardActions>
                </Card>
            ))}

            {/* New section for Sent Offers */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Sent Offers
            </Typography>
            {sentOffers.map((offer: any) => (
                <Card
                    key={offer._id}
                    sx={{
                        display: "flex",
                        mb: 2,
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img
                            src="https://tradebrains.in/wp-content/uploads/2020/01/Option-Trading-101-Call-Put-Options-cover.jpg"
                            alt={offer.offerForItem}
                            style={{
                                width: "100px",
                                height: "100px",
                                marginRight: 16,
                            }}
                        />
                        <CardContent>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: "bold" }}
                            >
                                Offer for Item : {offer.offerForItem}
                            </Typography>
                            {/* <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "bold" }}
                            >
                                Description:
                            </Typography> */}
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "bold" }}
                            >
                                Cash Offered: ${offer.cashOffered}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "bold" }}
                            >
                                Items Offered: {offer.itemsOffered}
                            </Typography>
                            <Box
                                sx={{
                                    backgroundColor: "lightgrey", // Adjust as needed
                                    padding: 2, // Adjust as needed
                                    borderRadius: 1, // Adjust as needed
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: "bold" }}
                                >
                                    Status: {offer.status}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Box>
                    <CardActions>
                        <Box
                            sx={{
                                backgroundColor: "maroon",
                                borderRadius: "70%",
                                width: 80, // Adjust as needed
                                height: 80, // Adjust as needed
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white", // Adjust as needed
                                fontWeight: "bold", // Adjust as needed
                            }}
                        >
                            Offer
                        </Box>
                    </CardActions>
                </Card>
            ))}
        </Container>
    );
};

export default MyProfile;
