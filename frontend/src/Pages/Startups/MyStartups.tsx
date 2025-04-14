
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Table, Spinner, Card, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../Store";
import { getStartups } from "../../Store/Actions/StartupAction";
import StartupRegistrationForm from "./StartupRegistration";

const MyStartups: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const [showForm, setShowForm] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const userStartups = useSelector((state: RootState) =>
    state.startups.startups.filter((startup) => startup.userId === userId)
  );
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      setLoading(true);
      try {
        
        await dispatch(getStartups());
        console.log("Data loading complete");
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadData();
    
    
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const viewFundingDetails = (startupId: string) => {
    navigate(`/funding-details/${startupId}`);
  };

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading My Campaigns...</p>
      </Container>
    );

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-primary">My Campaigns</h2>
          <Button variant="success" onClick={() => setShowForm(true)}>
            + Create New Campaign
          </Button>
        </div>
        
        {userStartups.length > 0 ? (
          <div className="table-responsive">
            <Table striped bordered hover responsive className="text-center">
              <thead className="bg-primary text-white">
                <tr>
                  <th>Name</th>
                  <th>Total Funding Goal ($)</th>
                  <th>Equity Offered (%)</th>
                  <th>Pre-Money Valuation ($)</th>
                  <th>Price Per Share ($)</th>
                  <th>Min Investment ($)</th>
                  <th>Max Investment ($)</th>
                  <th>Funding Deadline</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Funds Received ($)</th>
                  <th>Funding Details</th>
                </tr>
              </thead>
              <tbody>
                {userStartups.map((startup) => (
                  <tr key={startup.startupId}>
                    <td>{startup.name}</td>
                    <td>{startup.totalFundingGoal.toLocaleString()}</td>
                    <td>{startup.equityOffered}%</td>
                    <td>{startup.preMoneyValuation.toLocaleString()}</td>
                    <td>{startup.pricePerShare.toLocaleString()}</td>
                    <td>{startup.minInvestment.toLocaleString()}</td>
                    <td>{startup.maxInvestment.toLocaleString()}</td>
                    <td>{new Date(startup.fundingDeadline).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          startup.status === "Approved" ? "bg-success" : "bg-warning"
                        }`}
                      >
                        {startup.status}
                      </span>
                    </td>
                    <td>{new Date(startup.createdAt).toLocaleDateString()}</td>
                    <td>{startup.totalInvestment.toLocaleString()}</td>
                    <td>
                      <Button 
                        variant="info" 
                        size="sm"
                        onClick={() => viewFundingDetails(startup.startupId)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <p className="text-muted text-center">No campaigns found.</p>
        )}
      </Card>
      <Modal show={showForm} onHide={() => setShowForm(false)} centered dialogClassName="modal-dialog-scrollable" >
        <Modal.Header closeButton>
          
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "80vh", overflowY: "auto"}}>
          <StartupRegistrationForm onClose={() => setShowForm(false)} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MyStartups;