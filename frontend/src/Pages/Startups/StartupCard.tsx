import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {API_BASEBACKEND_URL} from "../../config/apiConfig";
import { Card, Button, Row, Col, Badge } from "react-bootstrap";
import {  FaChartLine, FaBuilding, FaFileContract } from "react-icons/fa";
import { RootState } from "../../Store";

interface StartupProps {
  startup: {
    startupId: string;
    userId: string;
    name: string;
    description: string;
    bannerPath: string;
    pitchDeckPath: string;
    logoPath: string;
    businessDocPath: string;
    termsDocPath: string;
    pricePerShare: number;
    status: string;
    industryType: string;
    totalFundingGoal: number;
    equityOffered: number;
    preMoneyValuation: number;
    minInvestment: number;
    maxInvestment: number;
    totalInvestment: number;
    fundingDeadline: string;
    createdAt: string;
  };
}



const StartupCard: React.FC<StartupProps> = ({ startup }) => {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const userRole = useSelector((state: RootState) => state.auth.role);

  const isOwner = startup.userId === userId;
  const isAdmin = userRole === "Admin";

  const fundingProgress = Math.min(
    (startup.totalInvestment / startup.totalFundingGoal) * 100,
    100
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="h-100 border-0 shadow-lg overflow-hidden">
      <div 
        className="position-relative"
        style={{ 
          height: "180px", 
          backgroundImage: `url(${API_BASEBACKEND_URL}${startup.bannerPath})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div 
          className="position-absolute bottom-0 start-0 w-100 p-2"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            color: "white"
          }}
        >
          <div className="d-flex align-items-center">
            <div 
              className="me-2 rounded bg-white d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px", overflow: "hidden" }}
            >
              <img 
                src={`${API_BASEBACKEND_URL}${startup.logoPath}`}
                onError={(e) => (e.currentTarget.src = "/default-logo.png")}
                alt={`${startup.name} logo`}
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </div>
            <h5 className="m-0 fw-bold text-white">{startup.name}</h5>
          </div>
        </div>
      </div>

      <Card.Body className="px-3 pt-3 pb-0">
        <div className="mb-3">
          <Badge bg="secondary" className="me-2">{startup.industryType}</Badge>
          <Badge 
            bg={fundingProgress >= 100 ? "success" : fundingProgress >= 70 ? "warning" : "primary"}
          >
            {fundingProgress.toFixed(0)}% Funded
          </Badge>
        </div>
        
        <p className="text-muted small mb-3" style={{ 
          height: "3rem", 
          overflow: "hidden", 
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical" 
        }}>
          {startup.description}
        </p>
        
        <div className="progress mb-3" style={{ height: "8px" }}>
          <div 
            className={`progress-bar ${fundingProgress >= 100 ? "bg-success" : "bg-primary"}`} 
            role="progressbar" 
            style={{ width: `${fundingProgress}%` }}
            aria-valuenow={fundingProgress} 
            aria-valuemin={0} 
            aria-valuemax={100}
          ></div>
        </div>
        
        <div className="d-flex justify-content-between mb-3">
          <div>
            <div className="small text-muted">Raised</div>
            <div className="fw-bold text-success">{formatCurrency(startup.totalInvestment)}</div>
          </div>
          <div className="text-end">
            <div className="small text-muted">Goal</div>
            <div className="fw-bold">{formatCurrency(startup.totalFundingGoal)}</div>
          </div>
        </div>
        
        <Row className="mb-4">
          <Col xs={6}>
            <div className="small text-muted">Equity</div>
            <div className="fw-bold">{startup.equityOffered}%</div>
          </Col>
          <Col xs={6} className="text-end">
            <div className="small text-muted">Min Investment</div>
            <div className="fw-bold">{formatCurrency(startup.minInvestment)}</div>
          </Col>
        </Row>
        
        <Row className="small mb-4 gx-2">
          <Col>
            <div className="text-muted">Valuation</div>
            <div className="fw-bold">{formatCurrency(startup.preMoneyValuation)}</div>
          </Col>
          <Col>
            <div className="text-muted">Share Price</div>
            <div className="fw-bold">${startup.pricePerShare.toFixed(2)}</div>
          </Col>
          <Col>
            <div className="text-muted">Deadline</div>
            <div className="fw-bold">{new Date(startup.fundingDeadline).toLocaleDateString()}</div>
          </Col>
        </Row>
      </Card.Body>

      <Card.Footer className="bg-white border-0 pt-0">
        <div className="d-flex mb-3 gap-2">
          {startup.pitchDeckPath && (
            <Button
              variant="outline-primary"
              size="sm"
              className="flex-grow-1 d-flex align-items-center justify-content-center"
              href={`${API_BASEBACKEND_URL}${startup.pitchDeckPath}`}
              target="_blank"
            >
              <FaChartLine className="me-1" /> <span className="small">Pitch</span>
            </Button>
          )}
          {startup.businessDocPath && (
            <Button
              variant="outline-secondary"
              size="sm"
              className="flex-grow-1 d-flex align-items-center justify-content-center"
              href={`${API_BASEBACKEND_URL}${startup.businessDocPath}`}
              target="_blank"
            >
              <FaBuilding className="me-1" /> <span className="small">Business</span>
            </Button>
          )}
          {startup.termsDocPath && (
            <Button
              variant="outline-dark"
              size="sm"
              className="flex-grow-1 d-flex align-items-center justify-content-center"
              href={`${API_BASEBACKEND_URL}${startup.termsDocPath}`}
              target="_blank"
            >
              <FaFileContract className="me-1" /> <span className="small">Terms</span>
            </Button>
          )}
        </div>
        
        <Button
          variant={isOwner ? "outline-secondary" : isAdmin ? "outline-secondary" : "primary"}
          className="w-100 fw-bold"
          onClick={() => navigate(`/invest/${startup.startupId}`)}
          disabled={isOwner || isAdmin}
        >
          {isOwner ? "Your Campaign" : isAdmin ? "Admin View" : "Invest Now"}
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default StartupCard;
