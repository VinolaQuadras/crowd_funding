
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Image, Spinner, Modal } from "react-bootstrap";
import { AppDispatch, RootState } from "../../Store";
import { fetchUserProfile } from "../../Apis/Authapi";
import StartupRegistrationForm from "../Startups/StartupRegistration";

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const token = useSelector((state: RootState) => state.auth.token);
  const firstName = useSelector((state: RootState) => state.auth.firstName);
  const lastName = useSelector((state: RootState) => state.auth.lastName);
  const profileImage = useSelector((state: RootState) => state.auth.profileImage);
  const email = useSelector((state: RootState) => state.auth.email);
  const phoneNumber = useSelector((state: RootState) => state.auth.phoneNumber);
  const role = useSelector((state: RootState) => state.auth.role);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!token) {
      console.error("⚠️ No token, redirecting to login...");
      navigate("/");
      return;
    }

    fetchUserProfile(token, dispatch).then(() => {
      setLoading(false);
    });
  }, [token, dispatch, navigate]);

  if (loading)
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="shadow-lg p-4 text-center bg-light" style={{ maxWidth: "500px", width: "100%" }}>
        <Image
          src={profileImage ?? "https://via.placeholder.com/150"}
          alt="Profile"
          roundedCircle
          width={120}
          height={120}
          className="mx-auto mb-3 border border-2"
        />
        <h2 className="fw-bold">{firstName || "Unknown"} {lastName || ""}</h2>
        <p className="text-muted">{email || "Not provided"}</p>
        <p className="text-muted">📞 {phoneNumber || "Not provided"}</p>

        {role === "Admin" ? (
          <Button variant="danger" className="w-100 mt-4" onClick={() => navigate("/admin-dashboard")}>
            Go to Admin Dashboard
          </Button>
        ) : (
          <>
            <Button variant="primary" className="w-100 mt-4" onClick={() => setShowForm(true)}>
              Create Campaign
            </Button>
            <Button variant="secondary" className="w-100 mt-2" onClick={() => navigate("/your-campaigns")}>
              View My Campaigns
            </Button>
          </>
        )}
      </Card>

      
      <Modal show={showForm} onHide={() => setShowForm(false)} centered dialogClassName="modal-dialog-scrollable"  >
  <Modal.Header closeButton>
    
  </Modal.Header>
  <Modal.Body style={{ maxHeight: "80vh", overflowY: "auto"}}>
    <StartupRegistrationForm onClose={() => setShowForm(false)} />
  </Modal.Body>
</Modal>

    </Container>
  );
};

export default Profile;
