import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import {
    Box,
    TextField,
    Card,
    CardContent,
    Typography,
    Grid,
} from "@mui/material";
import { Container, Nav } from "react-bootstrap";
import NavBar from "../components/NavBar";
import SearchIcon from "@mui/icons-material/Search"; // Import the search icon
import IconButton from "@mui/material/IconButton"; // Import IconButton for the search button
import { Button, List, ListItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link for navigation

interface Trade {
    _id: string;
    title: string;
    description: string;
    conditions: string[];
    creator: string;
}

const Browse = () => {
    // Specify the type of the state to be an array of trades
    const [trades, setTrades] = useState<Trade[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const navigate = useNavigate();

    // Get the user ID from local storage once when the component mounts
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) 
        {
            const user = JSON.parse(storedUser);
            setUserId(user._id); // Assuming the ID field is named '_id'
        }
    }, []);

    useEffect(() => {
        const fetchTrades = async () => {
            try 
            {
                console.log("Fetching trades");
                const response = await axios.get(
                    "http://localhost:8000/browse/trades"
                );
                setTrades(response.data); // Assumes the API returns an array of trades
            } 
            catch (error) 
            {
                console.error("Error fetching trades:", error);
            }
        };

        fetchTrades();
    }, []);

    // Utility function to determine button text
    const getButtonText = (creatorId: string) => {
        return userId === creatorId ? "See Trade Status" : "Explore";
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/trades?search=${searchTerm}`
            );
            setTrades(response.data); // Assumes the API returns an array of trades based on search
        } 
        catch (error) 
        {
            console.error("Error searching trades:", error);
        }
    };

    // Trigger search when the search button is clicked
    const handleSearchSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        handleSearch();
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Define a function to handle navigation to the specific trade page
    const handleNavigateToTrade = (tradeId: any) => {
        // Use the `navigate` function to change the route
        console.log("passing trade id to next page", tradeId)
        navigate(`/trade/${tradeId}`);
    };
  

    // Filter trades based on the search term
    const filteredTrades = trades.filter((trade) =>
        trade.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // If searchTerm is empty, show all trades, otherwise show filtered trades
    const displayedTrades = searchTerm ? filteredTrades : trades;

    return (
        <Container>
            <NavBar />
            <Box sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                <Box sx={{ display: "flex", marginBottom: 2 }}>
                    <TextField
                        fullWidth
                        label="Search Trades"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ mr: 1 }}
                    />
                    <IconButton
                        onClick={handleSearchSubmit}
                        color="primary"
                        aria-label="search"
                    >
                        <SearchIcon />
                    </IconButton>
                </Box>
                <Typography
                    variant="h6"
                    align="center"
                    style={{ fontFamily: "Arial", fontWeight: "bold" }}
                >
                    Ongoing Trades
                </Typography>
                {/* Adjust Grid layout to make each trade full width */}
                <Grid container spacing={0}>
                    {displayedTrades.map((trade: Trade) => (
                        <Grid item xs={12} key={trade._id}>
                            <Card
                                variant="outlined"
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 1,
                                    padding: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <img
                                        src="https://www.entrepreneurshipinabox.com/wp-content/uploads/A-Basic-Guide-To-Stock-Trading.jpg"
                                        alt={trade.title}
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            marginRight: 16,
                                        }}
                                    />
                                    <Box>
                                        <Typography
                                            variant="h5"
                                            component="div"
                                            sx={{ fontWeight: "bold" }}
                                        >
                                            {trade.title}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                        >
                                            {trade.description}
                                        </Typography>
                                        {/* Conditions */}
                                        {trade.conditions.map(
                                            (condition, index) => (
                                                <Typography
                                                    key={index}
                                                    variant="body2"
                                                    color="text.secondary"
                                                    component="p"
                                                >
                                                    - {condition}
                                                </Typography>
                                            )
                                        )}
                                    </Box>
                                </Box>
                                {/* Send Offer Button */}
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor:
                                            userId === trade.creator
                                                ? "darkblue"
                                                : "darkblue",
                                        "&:hover": {
                                            backgroundColor:
                                                userId === trade.creator
                                                    ? "secondary.dark"
                                                    : "primary.dark",
                                        },
                                    }}
                                    onClick={() => handleNavigateToTrade(trade._id)} // Use the navigate function on clic
                                >
                                    {getButtonText(trade.creator)}
                                </Button>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default Browse;
