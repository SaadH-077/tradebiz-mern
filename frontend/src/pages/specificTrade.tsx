import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import {
    Card,
    CardContent,
    CardActions,
    Button,
    Typography,
    Box,
    List,
    ListItem,
    Grid,
    Paper,
    ListItemText,
} from "@mui/material";

interface TradeDetails {
    _id: string;
    title: string;
    description: string;
    conditions: string[];
    offers: OfferDetails[]; // Array of OfferDetails
    acceptedOffer: string | null;
    creator: string;
    status: string;
}

interface OfferDetails {
    _id: string;
    creator: string;
    offerForItem: string;
    description: string;
    conditions: string[];
    quantity: number;
    cashOffered: number;
    status: string;
}

interface UserDetails {
    _id: string;
    name: string;
    username: string;
    password: string;
    tradesCreated: string[];
    itemsOwned: number;
    cash: number;
    email: string;
}

const SpecificTrade = ({ clientsocket }: { clientsocket: any }) => {
    const { tradeId } = useParams();
    console.log("Trade ID at the start:", tradeId);

    const [trade, setTrade] = useState<TradeDetails | null>(null);
    const [user, setUser] = useState<UserDetails | null>(null);
    const [offers, setOffers] = useState<any>([]);

    const navigate = useNavigate();

    const storedUser: any = localStorage.getItem("user");
    const parsedUser: any = JSON.parse(storedUser);

    useEffect(() => {
        if (storedUser) {
            const fetchUserDetails = async () => {
                try {
                    console.log("Fetching user details");
                    const response = await axios.get(
                        "http://localhost:8000/browse/user-info",
                        {
                            params: { userId: parsedUser.id },
                        }
                    );
                    console.log("User details fetched:", response.data);
                    setUser(response.data);
                } catch (error) {
                    console.error("Error fetching user details:", error);
                }
            };

            fetchUserDetails();
        }
    }, []);

    useEffect(() => {
        const fetchTradeDetails = async () => {
            try {
                console.log("Fetching trade details");
                console.log("Trade ID:", tradeId);
                const response = await axios.get(
                    `http://localhost:8000/browse/trades/`
                );
                console.log("Trade details fetched:", response.data);
                const this_trade = response.data.find(
                    (trade: any) => trade._id == tradeId
                );

                console.log("Trade details:", this_trade);

                console.log("trade creator:", this_trade.creator);
                console.log("user id:", parsedUser.id);

                setTrade(this_trade);
            } catch (error) {
                console.error("Error fetching trade details:", error);
            }
        };

        fetchTradeDetails();
    }, []);

    useEffect(() => {
        const fetchOffers = async () => {
            // console.log("Trade creator in UseEffect:", trade?.creator);
            console.log("User ID in UseEffect:", parsedUser.id);
            try {
                console.log("Fetching offers for User's Trades");
                const response = await axios.get(
                    `http://localhost:8000/browse/offer-info`,
                    {
                        params: {
                            tradeId: tradeId,
                            userId: parsedUser.id,
                            creatorName: parsedUser.name,
                        },
                    }
                );
                console.log("Offers fetched:", response.data);
                setOffers(response.data);
            } catch (error) {
                console.error("Error fetching offers:", error);
            }
        };

        fetchOffers();
    }, []);

    useEffect(() => {
        //lets connect to the room
        clientsocket.emit("join_room", tradeId);

        return () => {
            clientsocket.emit("leave_room", tradeId);
        };
    }, []);

    useEffect(() => {
        clientsocket.on("offer_made", (data: any) => {
            console.log("Offer Made from socket: ", data);
            setOffers((prevOffers: any) => [...prevOffers, data]);
        });

        return () => {
            clientsocket.off("offer_made");
        };
    }, [clientsocket]);

    const handleMakeOffer = async (trade_id: any) => {
        // Implement logic to navigate to the create offer page
        console.log("Navigating to create offer page");

        navigate(`/create-offer/${trade_id}`);
    };

    const handleAcceptOffer = async (offerId: string) => {
        try {
            console.log("Handle Accept Offer called");

            // Make an API call to accept the offer
            const response = await axios.put(
                `http://localhost:8000/browse/accept/${offerId}`
            );

            console.log("Response from accepting offer:", response.data);

            if (response.data.success) {
                console.log("Offer accepted successfully");

                //reject all the other offers
                for (let i = 0; i < offers.length; i++) {
                    if (offers[i]._id !== offerId) {
                        handleRejectOffer(offers[i]._id);
                    }
                }

                setOffers([]);
            }
        } catch (error) {
            console.error("Error accepting offer:", error);
        }
    };

    const handleRejectOffer = async (offerId: string) => {
        try {
            // Make an API call to reject the offer
            const response = await axios.put(
                `http://localhost:8000/browse/reject/${offerId}`
            );

            if (response.data.success) {
                console.log("Offer rejected successfully");
                //remove this offer from offers array:
                setOffers(offers.filter((offer: any) => offer._id !== offerId));
            }
        } catch (error) {
            console.error("Error rejecting offer:", error);
        }
    };

    if (!trade) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ marginTop: 9, padding: 3 }}>
            <NavBar />
            <Grid container spacing={2} justifyContent="center">
                <Typography variant="h4" gutterBottom>
                    Specific Trade
                </Typography>
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={3}
                        sx={{ padding: 1, bgcolor: "lightgrey", color: "black" }}
                    >
                        <Typography variant="h5" sx={{ color: "black" }}>
                            <strong>Item: </strong> {trade.title}
                        </Typography>
                        <Typography variant="h5" sx={{ color: "black" }}>
                            <strong>Description: </strong> {trade.description}
                        </Typography>
                        {trade.conditions && (
                            <List sx={{ listStyle: "inside" }}>
                                {trade.conditions.map((condition, index) => (
                                    <ListItem key={index} sx={{ padding: 0 }}>
                                        <ListItemText
                                            primary={`${condition}`}
                                            sx={{
                                                color: "black",
                                                marginLeft: "20px",
                                                "& .MuiTypography-root": {
                                                    display: "list-item",
                                                },
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>

                {/* Render the offers section */}
                {parsedUser.id === trade.creator && (
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Offers Received
                        </Typography>
                        {offers.map((offer: any) => (
                            <Card key={offer._id} sx={{ marginBottom: 2 }}>
                                <CardContent>
                                    <Typography>
                                        <strong>Offer from user: </strong>{" "}
                                        {offer.creator}
                                    </Typography>
                                    <Typography>
                                        <strong>Cash Offered: </strong>$
                                        {offer.cashOffered}
                                    </Typography>
                                    <Typography>
                                        <strong>Quantity: </strong>
                                        {offer.itemsOffered}
                                    </Typography>
                                    <Typography>
                                        <strong>Status: </strong> {offer.status}
                                    </Typography>
                                </CardContent>
                                {offer.status === "Pending" && (
                                    <CardActions>
                                        <Button
                                            onClick={() =>
                                                handleAcceptOffer(offer._id)
                                            }
                                            variant="contained"
                                            color="success"
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleRejectOffer(offer._id)
                                            }
                                            variant="contained"
                                            color="error"
                                        >
                                            Reject
                                        </Button>
                                    </CardActions>
                                )}
                            </Card>
                        ))}
                    </Grid>
                )}

                {/* Show the Make Offer button if the user viewing the trade is not the creator */}
                {parsedUser.id !== trade.creator && (
                    <Box textAlign="center" sx={{ marginTop: 2 }}>
                        <Button
                            onClick={() => handleMakeOffer(trade._id)}
                            variant="contained"
                            color="primary"
                        >
                            Make Offer
                        </Button>
                    </Box>
                )}
            </Grid>
        </Box>
    );
};

export default SpecificTrade;
