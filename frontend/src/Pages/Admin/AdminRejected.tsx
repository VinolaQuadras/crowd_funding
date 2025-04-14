import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Container, Card, Spinner, Alert } from "react-bootstrap";
import { AppDispatch, RootState } from "../../Store";
import { getStartups } from "../../Store/Actions/StartupAction";

const AdminRejected: React.FC = () => {
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

  if (loading)
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="danger" />
      </Container>
    );

  return (
    <Container className="mt-5">
      <Card className="shadow-lg border-0 p-4">
        <Card.Body>
          <h2 className="text-center text-danger fw-bold">Rejected Startups</h2>
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
                    <th>Funding Deadline</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {startups
                    .filter((startup) => startup.status === "Rejected")
                    .map((startup) => (
                      <tr key={startup.startupId} className="align-middle text-center">
                        <td className="fw-semibold">{startup.name}</td>
                        <td>${startup.totalFundingGoal.toLocaleString()}</td>
                        <td>{startup.equityOffered}%</td>
                        <td>{new Date(startup.fundingDeadline).toLocaleDateString()}</td>
                        <td>
                          <span className="badge bg-danger">Rejected</span>
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

export default AdminRejected;
