import { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { useQuery } from "react-query";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import NavBar from "../Header/Header";
import Footer from "../Footer/Footer";
import "./style.css";

const AllResturents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  //   const params = useParams();
  //   const memberId = params.id;

  const handleNameClick = (member) => {
    setMemberData(member);
    setShowModal(true);
  };

  // use react query and fetch member data
  const { data, isLoading, isError } = useQuery(
    "acceptedMemberData",
    async () => {
      const response = await axios.get("http://localhost:3001/resturent/");
      return response.data;
    }
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading data</p>;
  }

  // Apply filters to the data
  const filteredData = data.filter(
    (member) =>
      Object.values(member).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      ) &&
      (categoryFilter
        ? member.category.toLowerCase() === categoryFilter.toLowerCase()
        : true)
  );

  return (
    <>
      <br />
      <NavBar />
      <br />
      <div>
        <br />
        <center>
          <h2>Resturents</h2>
          <div>
            <div style={{ margin: "20px", padding: "20px" }}>
              <Row xs={1} md={3} className="g-4" style={{ padding: "20px" }}>
                {filteredData.map((member) => (
                  <Col key={member.cusMemberID}>
                    <Card style={{ width: "22rem", textAlign: "left" }}>
                      <Card.Img variant="top" src={member.image} style={{height: "200px"}}/>
                      <Card.Body>
                        <Card.Title>{member.name}</Card.Title>
                        <Card.Text> {member.address}</Card.Text>
                        <Card.Text>{member.telephone}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </center>
      </div>
      <br />
      <br />
      <Footer />
    </>
  );
};

export default AllResturents;
