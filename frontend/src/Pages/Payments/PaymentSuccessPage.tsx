import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../Store';



const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  
 
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id') || '';
  
  useEffect(() => {
   
    const verifyPayment = async () => {
      if (sessionId) {
        setIsLoading(true);
        try {
          
        } catch (error) {
          console.error('Error verifying payment:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    verifyPayment();
  }, [sessionId, dispatch]);

  const handleViewInvestments = () => {
    navigate('/your-investments');
  };
  
  const handleContinueBrowsing = () => {
    navigate('/startups');
  };

  return (
    <Container className="py-5">
      <Card className="shadow-lg border-0 mx-auto" style={{ maxWidth: '600px' }}>
        <Card.Body className="p-5 text-center">
          <div className="mb-4">
            <FaCheckCircle size={80} className="text-success mb-3" />
            <h1 className="mb-3">Payment Successful!</h1>
            <p className="lead text-muted">
              Your investment has been processed successfully. Thank you for your support!
            </p>
            {sessionId && (
              <Alert variant="info" className="mt-3">
                Transaction ID: {sessionId}
              </Alert>
            )}
          </div>
          
          <hr />
          
          <div className="d-grid gap-3 mt-4">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleViewInvestments}
              disabled={isLoading}
            >
              View My Investments
            </Button>
            <Button 
              variant="outline-primary" 
              size="lg" 
              onClick={handleContinueBrowsing}
            >
              Continue Browsing Startups
            </Button>
          </div>
          
          <div className="mt-4 text-muted">
            <small>
              A confirmation email has been sent to your registered email address.
              If you have any questions, please contact our support team.
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentSuccessPage;