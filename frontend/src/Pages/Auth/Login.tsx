
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { login } from "../../Apis/Authapi";
import { loginSuccess } from "../../Store/Actions/AuthActions";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      const { token, userId, role } = response.data;
      dispatch(loginSuccess({ token, userId, role }));
      
      navigate("/dashboard")
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center vh-100"
    >
      <Card className="p-4 shadow-lg" style={{ width: "350px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
          <div className="text-center mt-3">
            <a href="/forgot-password" className="text-decoration-none">
              Forgot Password?
            </a>
            <p className="mt-2">
              Don't have an account?{" "}
              <a href="/register" className="text-primary">
                Signup
              </a>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
