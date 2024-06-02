// eslint-disable-next-line no-unused-vars
import React from "react";
import Container from "react-bootstrap/Container";
import { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import img01 from "../assets/img01.png";
import { useHotkeys } from "react-hotkeys-hook";

function LandingPage() {
  const [customers, setCustomers] = useState(0);
  const [products, setProducts] = useState(0);
  const [sellers, setSellers] = useState(0);

  useEffect(() => {
    const incrementValues = () => {
      if (customers < 1000) {
        setCustomers((prevCustomers) => prevCustomers + 100);
      }
      if (products < 100) {
        setProducts((prevProducts) => prevProducts + 10);
      }
      if (sellers < 3) {
        setSellers((prevSellers) => prevSellers + 1);
      }
    };

    const interval = setInterval(incrementValues, 30);

    return () => clearInterval(interval);
  }, [customers, products, sellers]);

  useHotkeys("ctrl+enter", () => {
    window.location.href = "/admin/login";
  });

  return (
    <>
      <br />
      <Header />
      <br />
      <br />
      <br />
      <div className="d-flex justify-content-center align-items-center">
        <Container>
          <Row>
            <Col>
              <br />
              <br />
              <br />
              <br />
              <h3>Welcome to DineMaster</h3>
              <br />
              <br />
              <br />
              <Row>
                <Col>
                  <h3>{customers.toLocaleString()} +</h3>
                  <h5>Customers</h5>
                </Col>
                <Col>
                  <h3>{products.toLocaleString()} +</h3>
                  <h5>Items</h5>
                </Col>
                <Col>
                  <h3>{sellers.toLocaleString()} +</h3>
                  <h5>Branches</h5>
                </Col>
              </Row>
            </Col>
            <Col style={{ marginTop: "-60px" }}>
              <img src={img01} />
            </Col>
          </Row>
        </Container>
      </div>
      <br />
      <br />
      <br />
      <Footer />
    </>
  );
}

export default LandingPage;
