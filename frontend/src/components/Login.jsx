import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import secureLocalStorage from "react-secure-storage";
import { Slide, toast } from "react-toastify";
import { axiosInstance } from "../auth/AxiosConfig.jsx";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/users/login", {
        userName,
        password,
      });
      if (response.data) {
        secureLocalStorage.setItem("acessToken", response.data.acessToken);
        secureLocalStorage.setItem("refreshToken", response.data.refreshToken);
        secureLocalStorage.setItem("user", response.data.result);
        toast.success(response.data.message, {
          position: "top-right",
          theme: "colored",
          autoClose: 10000,
          hideProgressBar: true,
          transition: Slide
        });
        window.location.href = "/";
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
    <div
      className="border d-flex align-items-center justify-content-center bg-primary"
      style={{ height: "100vh" }}
    >
      <Card className="col-lg-3 col-md-6 col-sm-6 bg-body-tertiary border-0">
        <Card.Body>
          <Card.Title className="text-center mb-3">
            <h5 className="text-primary">Welcome to Kulineran App X Angkringan Sabira</h5>
            <hr />
            <h4>Login </h4>
          </Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column lg="3" sm="12">
                Username
              </Form.Label>
              <Col lg="9" sm="12">
                <Form.Control
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column lg="3" sm="12">
                Password
              </Form.Label>
              <Col lg="9" sm="12">
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formSubmitButton">
              <Col sm={{ span: 9, offset: 3 }}>
                <Button variant="primary" type="submit">
                  Login
                </Button>
              </Col>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
