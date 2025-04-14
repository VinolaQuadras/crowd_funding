import React from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentCancelPage: React.FC = () => {
  const navigate = useNavigate();

  
  const handleRetry = () => {
    
  
      navigate('/startups');
    
  };
  
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Container className="py-5">
      <Card className="shadow-lg border-0 mx-auto" style={{ maxWidth: '600px' }}>
        <Card.Body className="p-5 text-center">
          <div className="mb-4">
            <FaTimesCircle size={80} className="text-danger mb-3" />
            <h1 className="mb-3">Payment Cancelled</h1>
            <p className="lead text-muted">
              Your investment payment was cancelled or not completed.
            </p>
            
            <Alert variant="warning" className="mt-4">
              <p className="mb-0">
                No charges have been made to your account. You can try again whenever you're ready.
              </p>
            </Alert>
          </div>
          
          <hr />
          
          <div className="d-grid gap-3 mt-4">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleRetry}
            >
              Try Again
            </Button>
            <Button 
              variant="outline-secondary" 
              size="lg" 
              onClick={handleBackToDashboard}
            >
              Back to Home
            </Button>
          </div>
          
          <div className="mt-4 text-muted">
            <small>
              If you encountered any issues during the payment process or have questions,
              please don't hesitate to contact our support team for assistance.
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentCancelPage;