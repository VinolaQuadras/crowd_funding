
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {STARTUP_API_URL} from "../../config/apiConfig";
import { 
  Container, 
  Form, 
  Button, 
  Alert, 
  Row, 
  Col, 
  Spinner,
  
} from "react-bootstrap";
import { 
   
  FaBuilding, 
  FaImage, 
  FaFileContract, 
  FaChartLine,
  FaInfoCircle,
  FaArrowLeft,
  FaCheck
} from "react-icons/fa";
import { RootState } from "../../Store";

interface StartupRegistrationFormProps {
  onClose: () => void;
}

const StartupRegistrationForm: React.FC<StartupRegistrationFormProps> = ({ onClose }) => {
  const userId = useSelector((state: RootState) => state.auth.userId);
  const token = useSelector((state: RootState) => state.auth.token);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industryType: "",
    totalFundingGoal: "",
    equityOffered: "",
    pricePerShare: "",
    minInvestment: "",
    maxInvestment: "",
    fundingDeadline: "",
  });

  const [files, setFiles] = useState({
    pitchDeckPath: null as File | null,
    logoPath: null as File | null,
    bannerPath: null as File | null,
    businessDocPath: null as File | null,
    termsDocPath: null as File | null,
  });

  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState<"success" | "danger">("success");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [validation, setValidation] = useState({
    basicInfo: false,
    financialInfo: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Update validation status
    if (step === 1) {
      setValidation(prev => ({
        ...prev,
        basicInfo: formData.name !== "" && formData.description !== "" && formData.industryType !== ""
      }));
    } else if (step === 2) {
      setValidation(prev => ({
        ...prev,
        financialInfo: formData.totalFundingGoal !== "" && formData.equityOffered !== "" && 
                      formData.pricePerShare !== "" && formData.minInvestment !== "" && 
                      formData.maxInvestment !== "" && formData.fundingDeadline !== ""
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [e.target.name]: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("userId", userId ?? "");

    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formDataToSend.append(key, file);
      }
    });

    try {
      const response = await fetch(`${STARTUP_API_URL}/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to register startup");

      setMessage("Startup registered successfully!");
      setVariant("success");
      
      // Reset form after successful submission
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      setMessage("Error: " + (error as Error).message);
      setVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="mb-4">
              <h2 className="mb-2">Basic Information</h2>
              <p className="text-muted">Tell us about your startup</p>
            </div>
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Startup Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Enter your startup name"
                className="py-2"
                required 
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4}
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Describe your startup and its mission"
                className="py-2"
                required 
              />
              <Form.Text className="text-muted">
                A compelling description helps investors understand your vision
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Industry</Form.Label>
              <Form.Select 
                name="industryType" 
                value={formData.industryType} 
                onChange={handleChange as any} 
                className="py-2"
                required
              >
                <option value="">Select industry</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Energy">Energy</option>
                <option value="Transportation">Transportation</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            
            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="outline-secondary" 
                className="me-2" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={nextStep} 
                disabled={!formData.name || !formData.description || !formData.industryType}
              >
                Next
              </Button>
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <div className="mb-4">
              <h2 className="mb-2">Financial Details</h2>
              <p className="text-muted">Set your funding terms</p>
            </div>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Total Funding Goal ($)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="totalFundingGoal" 
                    value={formData.totalFundingGoal} 
                    onChange={handleChange} 
                    className="py-2"
                    required 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Equity Offered (%)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="equityOffered" 
                    value={formData.equityOffered} 
                    onChange={handleChange} 
                    className="py-2"
                    min="0.01" 
                    max="100" 
                    step="0.01"
                    required 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Price Per Share ($)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="pricePerShare" 
                    value={formData.pricePerShare} 
                    onChange={handleChange} 
                    className="py-2"
                    step="0.01"
                    required 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Min Investment ($)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="minInvestment" 
                    value={formData.minInvestment} 
                    onChange={handleChange} 
                    className="py-2"
                    required 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Max Investment ($)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="maxInvestment" 
                    value={formData.maxInvestment} 
                    onChange={handleChange} 
                    className="py-2"
                    required 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Funding Deadline</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="fundingDeadline" 
                    value={formData.fundingDeadline} 
                    onChange={handleChange} 
                    className="py-2"
                    required 
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="bg-light p-3 rounded mb-4">
              <div className="d-flex align-items-center mb-2">
                <FaInfoCircle className="text-primary me-2" />
                <span className="fw-bold">Valuation Estimate</span>
              </div>
              <p className="mb-1 small">
                With {formData.equityOffered}% equity at ${formData.totalFundingGoal}, 
                your implied post-money valuation would be approximately 
                ${formData.totalFundingGoal && formData.equityOffered ? 
                  (Number(formData.totalFundingGoal) / (Number(formData.equityOffered) / 100)).toLocaleString() : '0'}
              </p>
            </div>
            
            <div className="d-flex justify-content-between mt-4">
              <Button 
                variant="outline-secondary" 
                onClick={prevStep}
              >
                <FaArrowLeft className="me-1" /> Back
              </Button>
              <Button 
                variant="primary" 
                onClick={nextStep} 
                disabled={!formData.totalFundingGoal || !formData.equityOffered || 
                          !formData.pricePerShare || !formData.minInvestment || 
                          !formData.maxInvestment || !formData.fundingDeadline}
              >
                Next
              </Button>
            </div>
          </>
        );
        
      case 3:
        return (
          <>
            <div className="mb-4">
              <h2 className="mb-2">Upload Documents</h2>
              <p className="text-muted">Add your business documents and media</p>
            </div>
            
            <div className="mb-4">
              <Form.Group controlId="pitchDeck" className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <FaChartLine className="text-primary me-2" />
                  <Form.Label className="fw-bold m-0">Pitch Deck (PDF)</Form.Label>
                </div>
                <div className="custom-file-upload">
                  <Form.Control 
                    type="file" 
                    name="pitchDeckPath" 
                    accept="application/pdf" 
                    onChange={handleFileChange} 
                    className="form-control py-2"
                  />
                  <small className="text-muted d-block mt-1">
                    {files.pitchDeckPath ? files.pitchDeckPath.name : 'No file selected'}
                  </small>
                </div>
              </Form.Group>

              <Form.Group controlId="logo" className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <FaImage className="text-primary me-2" />
                  <Form.Label className="fw-bold m-0">Logo (Image)</Form.Label>
                </div>
                <div className="custom-file-upload">
                  <Form.Control 
                    type="file" 
                    name="logoPath" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="form-control py-2" 
                  />
                  <small className="text-muted d-block mt-1">
                    {files.logoPath ? files.logoPath.name : 'No file selected'}
                  </small>
                </div>
              </Form.Group>

              <Form.Group controlId="banner" className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <FaImage className="text-primary me-2" />
                  <Form.Label className="fw-bold m-0">Banner Image</Form.Label>
                </div>
                <div className="custom-file-upload">
                  <Form.Control 
                    type="file" 
                    name="bannerPath" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="form-control py-2" 
                  />
                  <small className="text-muted d-block mt-1">
                    {files.bannerPath ? files.bannerPath.name : 'No file selected'}
                    <br/>Recommended size: 1200 x 400 pixels
                  </small>
                </div>
              </Form.Group>

              <Form.Group controlId="businessDoc" className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <FaBuilding className="text-primary me-2" />
                  <Form.Label className="fw-bold m-0">Business Plan (PDF)</Form.Label>
                </div>
                <div className="custom-file-upload">
                  <Form.Control 
                    type="file" 
                    name="businessDocPath" 
                    accept="application/pdf" 
                    onChange={handleFileChange}
                    className="form-control py-2" 
                  />
                  <small className="text-muted d-block mt-1">
                    {files.businessDocPath ? files.businessDocPath.name : 'No file selected'}
                  </small>
                </div>
              </Form.Group>

              <Form.Group controlId="termsDoc" className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  <FaFileContract className="text-primary me-2" />
                  <Form.Label className="fw-bold m-0">Terms Document (PDF)</Form.Label>
                </div>
                <div className="custom-file-upload">
                  <Form.Control 
                    type="file" 
                    name="termsDocPath" 
                    accept="application/pdf" 
                    onChange={handleFileChange}
                    className="form-control py-2" 
                  />
                  <small className="text-muted d-block mt-1">
                    {files.termsDocPath ? files.termsDocPath.name : 'No file selected'}
                  </small>
                </div>
              </Form.Group>
            </div>
            
            <div className="d-flex justify-content-between mt-4">
              <Button 
                variant="outline-secondary" 
                onClick={prevStep}
              >
                <FaArrowLeft className="me-1" /> Back
              </Button>
              <Button 
                variant="success" 
                type="submit" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" /> 
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaCheck className="me-2" /> Register Startup
                  </>
                )}
              </Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container className="py-4" >
      {message && (
        <Alert 
          variant={variant} 
          dismissible 
          onClose={() => setMessage("")}
          className="mb-4 shadow-sm"
        >
          {variant === "success" ? <FaCheck className="me-2" /> : null}
          {message}
        </Alert>
      )}
      
      <div className="bg-white border-0 shadow-sm rounded p-4 mb-4">
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="progress w-100" style={{ height: "8px" }}>
              <div 
                className="progress-bar bg-primary" 
                role="progressbar" 
                style={{ width: `${(step / 3) * 100}%` }}
                aria-valuenow={(step / 3) * 100} 
                aria-valuemin={0} 
                aria-valuemax={100}>
              </div>
            </div>
          </div>
          
          <div className="d-flex justify-content-between">
            <div className={`text-center ${step >= 1 ? 'text-primary fw-bold' : 'text-muted'}`}>
              Basic Info
            </div>
            <div className={`text-center ${step >= 2 ? 'text-primary fw-bold' : 'text-muted'}`}>
              Financials
            </div>
            <div className={`text-center ${step >= 3 ? 'text-primary fw-bold' : 'text-muted'}`}>
              Documents
            </div>
          </div>
        </div>
        
        <Form>
          {renderStep()}
        </Form>
      </div>
    </Container>
  );
};

export default StartupRegistrationForm;