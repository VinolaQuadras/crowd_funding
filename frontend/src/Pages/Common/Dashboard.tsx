import { Button, Container, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();

 
 
    const images = [
      "/images/image5.webp",
      "/images/image6.jpg",
      "/images/image7.jpg",
    ];
    

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); 
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <Container
      fluid
      className="position-relative vh-100 d-flex align-items-center justify-content-center"
    >
      
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: `url(${images[currentIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "opacity 1s ease-in-out",
          zIndex: -1,
        }}
      ></div>

      
      <Card
        className="shadow-lg text-center p-5 bg-light"
        style={{ maxWidth: "600px", width: "100%", zIndex: 2 }}
      >
        <h1 className="fw-bold text-primary">Welcome to Raised</h1>
        <p className="text-muted fs-5">
          Invest in dreams, own the future! Start funding the next big thing today!
        </p>
        <Button
          variant="primary"
          className="mt-3 px-4 py-2 fw-bold"
          onClick={() => navigate("/startups")}
        >
          Start Investing
        </Button>
      </Card>
    </Container>
  );
};

export default Dashboard;
