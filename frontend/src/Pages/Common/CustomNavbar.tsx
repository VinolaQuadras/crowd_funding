
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Dropdown, Image, Button, Offcanvas } from "react-bootstrap";
import { RootState } from "../../Store";
import { fetchUserProfile } from "../../Apis/Authapi";
import { logout } from "../../Store/Actions/AuthActions";

const CustomNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  
  const token = useSelector((state: RootState) => state.auth.token);
  const firstName = useSelector((state: RootState) => state.auth.firstName);
  const profileImage = useSelector((state: RootState) => state.auth.profileImage);
  const role = useSelector((state: RootState) => state.auth.role); 

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUserProfile(token, dispatch);
    }
  }, [token, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    navigate("/");
  };

  return (
    <>
      
      <Navbar bg="dark-subtle" data-bs-theme="dark" expand="lg" className="shadow-sm">
        <Container>
          <Button variant="dark" className="border-0 me-3" onClick={() => setSidebarOpen(true)}>
            ☰
          </Button>

          <Navbar.Brand className="fw-bold fs-4 text-white" onClick={() => navigate("/")}>
            Raised
          </Navbar.Brand>

       

         
          <Nav>
            <Dropdown align="end">
              <Dropdown.Toggle variant="dark" className="d-flex align-items-center border-0 bg-transparent">
                <Image src={profileImage ?? "https://via.placeholder.com/40"} alt="Profile" roundedCircle width={40} height={40} />
                <span className="ms-2 text-white">{firstName || "User"}</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="bg-dark">
                <Dropdown.Item className="text-white" onClick={() => navigate("/profile")}>
                  Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="text-white" onClick={handleLogout}>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>

      
      <Offcanvas show={sidebarOpen} onHide={() => setSidebarOpen(false)} placement="start" className="bg-dark text-white">
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title className="fs-4 fw-bold">Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
          <Nav.Link className="text-white fs-5 py-2" onClick={() => { navigate("/dashboard"); setSidebarOpen(false); }}>
              Home
            </Nav.Link>
            <Nav.Link className="text-white fs-5 py-2" onClick={() => { navigate("/startups"); setSidebarOpen(false); }}>
              Campaigns
            </Nav.Link>

            {/* Check user role */}
            {role === "Admin" ? (
              <>
            
                <Nav.Link className="text-white fs-5 py-2" onClick={() => { navigate("/admin/approved"); setSidebarOpen(false); }}>
                  Approved
                </Nav.Link>
                <Nav.Link className="text-white fs-5 py-2" onClick={() => { navigate("/admin/rejected"); setSidebarOpen(false); }}>
                  Rejected
                </Nav.Link>
                <Nav.Link className="text-white fs-5 py-2" onClick={() => { navigate("/admin/pending"); setSidebarOpen(false); }}>
                  Pending Approval
                </Nav.Link>
              </>
            ) : (
              <>
              
                <Nav.Link className="text-white fs-5 py-2" onClick={() => { navigate("/your-campaigns"); setSidebarOpen(false); }}>
                  Your Campaigns
                </Nav.Link>
                <Nav.Link className="text-white fs-5 py-2" onClick={() => { navigate("/your-investments"); setSidebarOpen(false); }}>
                  Your Investments
                </Nav.Link>
              </>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default CustomNavbar;
