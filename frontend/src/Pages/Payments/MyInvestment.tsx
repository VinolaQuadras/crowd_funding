
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Table, Alert, Spinner, Card } from "react-bootstrap";
import { AppDispatch, RootState } from "../../Store";
import { fetchUserPayments } from "../../Store/Actions/PaymentAction";


const MyInvestments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { payments, loading, error } = useSelector((state: RootState) => state.payment);
  const userId = useSelector((state: RootState) => state.auth.userId);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserPayments());
    }
  }, [dispatch, userId]);

 
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

 
  const formatShares = (shares: number | null): string => {
    if (shares === null) return 'Pending';
    return shares.toFixed(6);
  };

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">My Investments</h2>

      {loading && (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && payments.length === 0 && (
        <Alert variant="info">You haven't made any investments yet.</Alert>
      )}

      {!loading && payments.length > 0 && (
        <Card className="shadow-lg">
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Startup Name</th>
                  <th>Investment Amount</th>
                  <th>Shares Allocated</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={payment.id}>
                    <td>{index + 1}</td>
                    <td>{payment.startupName}</td>
                    <td>{formatCurrency(payment.amount)}</td>
                    <td>{formatShares(payment.sharesAllocated)}</td>
                    <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span 
                        className={`badge bg-${
                          payment.paymentStatus === 'Success' ? 'success' : 
                          payment.paymentStatus === 'Pending' ? 'warning' : 
                          'danger'
                        }`}
                      >
                        {payment.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default MyInvestments;
