
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { resetPassword } from "../../Apis/Authapi";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState<"success" | "danger">("success");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setVariant("danger");
      return;
    }
    try {
      await resetPassword(token, password, confirmPassword);
      setMessage("Password reset successful. Redirecting...");
      setVariant("success");
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setMessage("Error resetting password");
      setVariant("danger");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow-lg p-4" style={{ width: "400px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Reset Password</h2>

          {message && <Alert variant={variant}>{message}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Reset Password
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ResetPassword;
