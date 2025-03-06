import { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../../auth/AxiosConfig.jsx";
import NavbarComponent from "../../NavbarComponent.jsx";
import { Breadcrumb, Button, Col, Container, Form, Row } from "react-bootstrap";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import PDFViewer from "../PDFViewer.jsx";

const SupplierReport = () => {
  const [url, setUrl] = useState("");
  const downloadPDF = async () => {
    setUrl("");
    const id = toast.loading("Mohon bersabar...", {
      position: "top-center",
    });
    let reqOptions = {
      url: "/api/suppliers-pdf",
      method: "GET",
    };
    try {
      const out = await axiosInstance.request(reqOptions);
      toast.update(id, {
        render: "File pdf berhasil didownload!",
        type: "success",
        position: "top-center",
        isLoading: false,
        autoClose: 4000,
      });
      setUrl(import.meta.env.VITE_API_URL + out.data.result);
    } catch (error) {
      const errMessage = JSON.parse(error.request.response);
      toast.error(errMessage.message, {
        position: "top-center",
      });
    }
  };

  const downloadExcel = async () => {
    const id = toast.loading("Mohon bersabar...", {
      position: "top-center",
    });
    let reqOptions = {
      url: "/api/suppliers-excel",
      method: "GET",
    };
    try {
      const out = await axiosInstance.request(reqOptions);
      toast.update(id, {
        render: "File excel berhasil didownload!",
        type: "success",
        position: "top-center",
        isLoading: false,
        autoClose: 4000,
      });
      window.open(import.meta.env.VITE_API_URL + out.data.result, "_blank");
    } catch (error) {
      const errMessage = JSON.parse(error.request.response);
      toast.error(errMessage.message, {
        position: "top-center",
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
              <Breadcrumb.Item href="#">Laporan</Breadcrumb.Item>
              <Breadcrumb.Item active>Supplier</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row className="mt-3 bg-body-tertiary rounded p-3">
          <Col>
            <form>
              <Form.Group as={Row} className="mb-3">
                <Col sm="12">
                  <Button
                    type="button"
                    onClick={downloadPDF}
                    variant="primary me-1"
                  >
                    <FaFilePdf /> Download PDF
                  </Button>
                  <Button
                    type="button"
                    onClick={downloadExcel}
                    variant="primary"
                  >
                    <FaFileExcel /> Download Excel
                  </Button>
                </Col>
              </Form.Group>
            </form>
            <PDFViewer url={url} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SupplierReport;