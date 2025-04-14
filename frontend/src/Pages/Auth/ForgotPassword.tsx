import React, { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { forgotPassword } from "../../Apis/Authapi";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await forgotPassword(email);
      setMessage("Password reset link sent to your email.");
    } catch (err) {
      setError("Error sending reset link. Try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow-lg p-4 bg-light" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body>
          <h2 className="text-center text-primary">Forgot Password</h2>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleForgotPassword}>
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100 mt-3">
              Send Reset Link
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
