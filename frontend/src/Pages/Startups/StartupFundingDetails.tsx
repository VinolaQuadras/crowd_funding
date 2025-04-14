import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Table, Card, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { AppDispatch, RootState } from '../../Store';
import { fetchStartupPayments } from '../../Store/Actions/PaymentAction';

const StartupFundingDetails: React.FC = () => {
  const { startupId } = useParams<{ startupId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  
  const { payments, error } = useSelector((state: RootState) => state.payment);
  const startup = useSelector((state: RootState) => 
    state.startups.startups.find(s => s.startupId === startupId)
  );

  const [summary, setSummary] = useState({
    successfulPayments: 0,
    pendingPayments: 0,
    totalInvestors: 0,
    averageInvestment: 0
  });

  useEffect(() => {
    const loadData = async () => {
      if (startupId) {
        setLoading(true);
        await dispatch(fetchStartupPayments(startupId));
        setLoading(false);
      }
    };
    
    loadData();
  }, [dispatch, startupId]);

  useEffect(() => {
    if (payments.length > 0) {
      
      const successStatuses = ['Succeeded', 'succeeded', 'Success', 'success', 'SUCCEEDED', 'COMPLETED', 'Completed'];
      
      
      const successfulPayments = payments.filter(p => 
        successStatuses.includes(p.paymentStatus)
      );
      
      const pendingPayments = payments.filter(p => 
        p.paymentStatus === 'Pending' || p.paymentStatus === 'pending'
      );
      
      
      const uniqueInvestors = new Set(payments.map(p => p.userId)).size;
      
      const avgInvestment = successfulPayments.length > 0 && startup 
        ? startup.totalInvestment / successfulPayments.length 
        : 0;
      
      setSummary({
        successfulPayments: successfulPayments.length,
        pendingPayments: pendingPayments.length,
        totalInvestors: uniqueInvestors,
        averageInvestment: avgInvestment
      });
    } else {
     
      setSummary({
        successfulPayments: 0,
        pendingPayments: 0,
        totalInvestors: 0,
        averageInvestment: 0
      });
    }
  }, [payments, startup]);

  // Helper function to get full investor name
  const getInvestorName = (payment: any) => {
    // Check if firstName and lastName are available
    if (payment.firstName && payment.lastName) {
      return `${payment.firstName} ${payment.lastName}`;
    } else {
      // Fallback to userId if name is not available
      return payment.userId;
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading funding details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Card className="shadow p-4">
          <h3 className="text-danger">Error</h3>
          <p>{error}</p>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="shadow-lg mb-4">
        <Card.Header className="bg-primary text-white">
          <h2>{startup?.name || 'Startup'} - Funding Details</h2>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={3} className="mb-3">
              <Card className="text-center h-100">
                <Card.Body>
                  <h3 className="text-primary">${startup?.totalInvestment.toLocaleString() || '0'}</h3>
                  <p className="text-muted">Total Funds Raised</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="text-center h-100">
                <Card.Body>
                  <h3 className="text-primary">{summary.totalInvestors}</h3>
                  <p className="text-muted">Total Investors</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="text-center h-100">
                <Card.Body>
                  <h3 className="text-success">{summary.successfulPayments}</h3>
                  <p className="text-muted">Successful Payments</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="text-center h-100">
                <Card.Body>
                  <h3 className="text-warning">{summary.pendingPayments}</h3>
                  <p className="text-muted">Pending Payments</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <h4 className="mb-3">Payment History</h4>
          {payments.length > 0 ? (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="bg-light">
                  <tr>
                    <th>Investor Name</th>
                    <th>Amount ($)</th>
                    <th>Shares Allocated</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{getInvestorName(payment)}</td>
                      <td>${payment.amount.toLocaleString()}</td>
                      <td>{payment.sharesAllocated?.toLocaleString() || '-'}</td>
                      <td>
                        <Badge bg={
                          payment.paymentStatus === 'Succeeded' || 
                          payment.paymentStatus === 'Success' || 
                          payment.paymentStatus === 'success' ? 'success' : 
                          payment.paymentStatus === 'Pending' ? 'warning' : 'danger'
                        }>
                          {payment.paymentStatus}
                        </Badge>
                      </td>
                      <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted">No payments found for this startup.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StartupFundingDetails;