import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import NavbarComponent from "../NavbarComponent.jsx";
import { Breadcrumb, Button, Col, Container, Form, Row } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { axiosInstance } from "../../auth/AxiosConfig.jsx";

const AddSupplier = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let bodyContent = JSON.stringify({
      firstName,
      lastName,
      phone,
      email,
      address,
    });

    let reqOptions = {
      url: "/api/suppliers",
      method: "POST",
      data: bodyContent,
    };

    try {
      const response = await axiosInstance.request(reqOptions);
      if (response.data) {
        toast.success(response.data.message, {
            position: "top-right",
            theme: "colored",
            autoClose: 5000,
            transition: Slide
        });
        navigate("/supplier");
      }
    } catch (error) {
      const errMessage = JSON.parse(error.request.response);
      toast.error(errMessage.message, {
            position: "top-right",
            theme: "colored",
            autoClose: 5000,
            transition: Slide
      });
    }
  };
  return (
    <>
      <NavbarComponent />
      <Container>
        <Row className="mt-3 bg-body-tertiary rounded p-3 pb-0">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item href="#">Master</Breadcrumb.Item>
              <Breadcrumb.Item href="/supplier">Supplier</Breadcrumb.Item>
              <Breadcrumb.Item active>Tambah Supplier</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row className="mt-3 bg-body-tertiary rounded p-3">
          <Col>
            <form onSubmit={handleSubmit}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Nama Depan
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Nama Belakang
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Nomor Telpon
                </Form.Label>
                <Col sm="5">
                  <Form.Control
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Email
                </Form.Label>
                <Col sm="5">
                  <Form.Control
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Address
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Row>
                <Col md={{ span: 10, offset: 2 }}>
                  <Button type="submit" variant="primary">
                    <FaSave /> Simpan
                  </Button>
                </Col>
              </Row>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AddSupplier;