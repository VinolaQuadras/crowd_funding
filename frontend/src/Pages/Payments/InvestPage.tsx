
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner, Card, Modal } from "react-bootstrap";
import {STARTUPPUBLISHABLE_API_URL} from "../../config/apiConfig";
import axios from "axios";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { AppDispatch, RootState } from "../../Store";
import { createPaymentIntent } from "../../Store/Actions/PaymentAction";

const InvestPage: React.FC = () => {
    const { startupId } = useParams<{ startupId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const userId = useSelector((state: RootState) => state.auth.userId);
    const [amount, setAmount] = useState<string>("");
    const [modalShow, setModalShow] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

    const { loading, error } = useSelector((state: RootState) => state.payment);
    const startup = useSelector((state: RootState) =>
        state.startups.startups.find((s) => s.startupId === startupId)
    );

    useEffect(() => {
        const fetchStripeKey = async () => {
            try {
                const response = await axios.get(`${STARTUPPUBLISHABLE_API_URL}`);
                console.log("Stripe Key Response:", response.data);  
            if (!response.data.publishableKey) {
                console.error("Stripe key missing in response.");
                return;
            }
            setStripePromise(loadStripe(response.data.publishableKey));
        } catch (error) {
            console.error("Error fetching Stripe publishable key:", error);
        }
    };
    fetchStripeKey();
}, []);

    if (!startupId) {
        return <Alert variant="danger">Error: Invalid startup ID</Alert>;
    }

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || /^[0-9]*$/.test(value)) {
            setAmount(value);
        }
    };

    const handleInvest = async () => {
        if (!userId) {
            setModalMessage("User is not authenticated. Please log in.");
            setModalShow(true);
            return;
        }
    
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setModalMessage("Please enter a valid investment amount.");
            setModalShow(true);
            return;
        }
    
        const investmentAmount = parseFloat(amount);
    
        if (!startup) {
            setModalMessage("Startup details not found.");
            setModalShow(true);
            return;
        }
    
        const { minInvestment, maxInvestment } = startup;
    
        if (investmentAmount < minInvestment) {
            setModalMessage(`Investment must be at least $${minInvestment}.`);
            setModalShow(true);
            return;
        }
        if (maxInvestment !== null && investmentAmount > maxInvestment) {
            setModalMessage(`Investment cannot exceed $${maxInvestment}.`);
            setModalShow(true);
            return;
        }
    
        try {
            const response = await dispatch(
                createPaymentIntent({ userId, startupId, amount: investmentAmount })
            ).unwrap();
    
            console.log("Payment Intent Response:", response); 
    
            if (response?.sessionId) {
                const stripe = await stripePromise;
                if (stripe) {
                    const { error } = await stripe.redirectToCheckout({
                        sessionId: response.sessionId, 
                    });
    
                    if (error) {
                        console.error("Stripe error:", error);
                        setModalMessage("Payment could not be processed.");
                        setModalShow(true);
                    }
                } else {
                    setModalMessage("Stripe is not loaded properly.");
                    setModalShow(true);
                }
            } else {
                setModalMessage("Investment failed. No sessionId received.");
                setModalShow(true);
            }
        } catch (error) {
            console.error("Payment error:", error);
            setModalMessage("Something went wrong! Please try again.");
            setModalShow(true);
        }
    };
    

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card className="p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
                <Card.Body>
                    <Card.Title className="text-center mb-3">Invest in Startup</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Enter Amount:</Form.Label>
                            <Form.Control
                                type="text"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="Enter amount"
                                isInvalid={!amount || isNaN(Number(amount))}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid amount.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button
                            variant="primary"
                            className="w-100"
                            onClick={handleInvest}
                            disabled={loading || stripePromise===null}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : "Invest Now"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

           
            <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>⚠ Investment Alert</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalShow(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default InvestPage;



