import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Spinner, Alert, Form, InputGroup } from "react-bootstrap";
import { FaSearch, FaFilter } from "react-icons/fa";
import { AppDispatch, RootState } from "../../Store";
import { getStartups } from "../../Store/Actions/StartupAction";
import StartupCard from "./StartupCard";

const Startups: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { startups, loading, error } = useSelector((state: RootState) => state.startups);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");

  useEffect(() => {
    dispatch(getStartups());
  }, [dispatch]);

  // Get unique industries for filter dropdown
  const industries = ["All", ...new Set(startups.map(s => s.industryType))];

  // Filter startups based on search term and industry filter
  const filteredStartups = startups
    .filter((startup) => startup.status.toLowerCase() === "approved")
    .filter((startup) => 
      startup.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      startup.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((startup) => 
      industryFilter === "All" || startup.industryType === industryFilter
    );

  return (
    <Container fluid className="py-4 px-md-5">
      <h2 className="text-primary fw-bold mb-4">Discover Startups</h2>

      <Row className="mb-4">
        <Col md={6} lg={4}>
          <InputGroup>
            <InputGroup.Text className="bg-white">
              <FaSearch className="text-primary" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search startups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4} lg={3} className="mt-3 mt-md-0">
          <InputGroup>
            <InputGroup.Text className="bg-white">
              <FaFilter className="text-primary" />
            </InputGroup.Text>
            <Form.Select 
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading startups...</p>
        </div>
      )}
      
      {error && <Alert variant="danger" className="text-center">{error}</Alert>}

      {!loading && !error && filteredStartups.length === 0 && (
        <Alert variant="info" className="text-center my-5">
          <h5>No startups found</h5>
          <p className="mb-0">Try adjusting your search criteria or check back later for new opportunities.</p>
        </Alert>
      )}

      <Row className="g-4">
        {filteredStartups.map((startup) => (
          <Col key={startup.startupId} xs={12} sm={6} md={4} lg={3}> 
            <StartupCard startup={startup} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Startups;