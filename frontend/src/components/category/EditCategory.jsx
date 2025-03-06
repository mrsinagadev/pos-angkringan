import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../auth/AxiosConfig.jsx";
import { Slide, toast } from "react-toastify";
import NavbarComponent from "../NavbarComponent.jsx";
import { Breadcrumb, Button, Col, Container, Form, Row } from "react-bootstrap";
import { FaSave } from "react-icons/fa";

const EditCategory = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const loadData = useCallback(async () => {
    let reqOptions = {
      url: `/api/categorys/${id}`,
      method: "GET",
    };
    try {
      const response = await axiosInstance.request(reqOptions);
      if (response.data) {
        setName(response.data.result.kategoryName);
      }
    } catch (error) {
      const errMessage = JSON.parse(error.request.response);
      toast.error(errMessage.message, {
        position: "top-center",
      });
    }
  }, [id]);
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let bodyContent = JSON.stringify({
      kategoryName: name,
    });

    let reqOptions = {
      url: `/api/categorys/${id}`,
      method: "PUT",
      data: bodyContent,
    };

    try {
      const response = await axiosInstance.request(reqOptions);
      if (response.data) {
        toast.success(response.data.message, {
          position: "top-right",
          theme: "colored",
          autoClose: 5000,
          hideProgressBar: false,
          transition: Slide
        });
        navigate("/category");
      }
    } catch (error) {
      const errMessage = JSON.parse(error.request.response);
      toast.error(errMessage.message, {
          position: "top-right",
          theme: "colored",
          autoClose: 5000,
          hideProgressBar: false,
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
              <Breadcrumb.Item href="/category">Kategori</Breadcrumb.Item>
              <Breadcrumb.Item active>Ubah Kategori</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row className="mt-3 bg-body-tertiary rounded p-3">
          <Col>
            <form onSubmit={handleSubmit}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Nama Kategori
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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

export default EditCategory;