
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Form, Container, Card, Spinner, Alert } from "react-bootstrap";
import { AppDispatch, RootState } from "../../Store";
import { getStartups, updateStartupStatus } from "../../Store/Actions/StartupAction";

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const startups = useSelector((state: RootState) => state.startups.startups);
  const userRole = useSelector((state: RootState) => state.auth.role);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      console.error("⚠️ No token, redirecting to login...");
      navigate("/");
      return;
    }

    dispatch(getStartups()).then(() => setLoading(false));
  }, [token, dispatch, navigate]);

  const handleStatusChange = (startupId: string, newStatus: string) => {
    dispatch(updateStartupStatus({ startupId, status: newStatus }));
  };

  if (loading)
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  return (
    <Container className="mt-5">
      <Card className="shadow-lg border-0 p-4">
        <Card.Body>
          <h2 className="text-center text-primary fw-bold">Admin Dashboard</h2>
          <hr />

          {userRole !== "Admin" ? (
            <Alert variant="danger" className="text-center">
              Unauthorized Access
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="mt-3">
                <thead className="table-dark text-center">
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
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {startups.map((startup) => (
                    <tr key={startup.startupId} className="align-middle text-center">
                      <td className="fw-semibold">{startup.name}</td>
                      <td>${startup.totalFundingGoal.toLocaleString()}</td>
                      <td>{startup.equityOffered}%</td>
                      <td>${startup.preMoneyValuation.toLocaleString()}</td>
                      <td>${startup.pricePerShare.toLocaleString()}</td>
                      <td>${startup.minInvestment.toLocaleString()}</td>
                      <td>${startup.maxInvestment.toLocaleString()}</td>
                      <td>{new Date(startup.fundingDeadline).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`badge ${
                            startup.status === "Approved"
                              ? "bg-success"
                              : startup.status === "Rejected"
                              ? "bg-danger"
                              : "bg-warning"
                          }`}
                        >
                          {startup.status}
                        </span>
                      </td>
                      <td>
                        <Form.Select
                          value={startup.status}
                          onChange={(e) => handleStatusChange(startup.startupId, e.target.value)}
                          className="fw-semibold"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </Form.Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
