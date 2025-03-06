import { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../../auth/AxiosConfig.jsx";
import NavbarComponent from "../../NavbarComponent.jsx";
import { Breadcrumb, Button, Col, Container, Form, Row } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import PDFViewer from "../PDFViewer.jsx";

const SalesReport = () => {
  const [startDate, setStartDate] = useState(
    new Date().setHours(7, 0, 0, 0) //untuk timezone asia jakarta);
  );
  const [endDate, setEndDate] = useState(
    new Date().setHours(7, 0, 0, 0) //untuk timezone asia jakarta);
  );
  const [url, setUrl] = useState("");

  const downloadPDF = async () => {
    setUrl(""); // Reset URL sebelum generate
    const id = toast.loading("Mohon bersabar...", { position: "top-center" });

    try {
        const response = await axiosInstance.post("/api/orders-pdf", {
            startDate,
            endDate,
        });
        toast.update(id, {
            render: "File PDF berhasil diperbarui!",
            type: "success",
            position: "top-center",
            isLoading: false,
            autoClose: 4000,
        });
        // Hindari cache dengan menambahkan timestamp di URL
        setUrl(`${import.meta.env.VITE_API_URL + response.data.result}?t=${Date.now()}`);
    } catch (error) {
        const errMessage = JSON.parse(error.request.response);
        toast.error(errMessage.message, { position: "top-center" });
    }
};
  const downloadExcel = async () => {
    const id = toast.loading("Mohon bersabar...", {
      position: "top-center",
    });
    let bodyContent = JSON.stringify({
      startDate,
      endDate,
    });
    let reqOptions = {
      url: "/api/orders-excel",
      method: "POST",
      data: bodyContent,
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
              <Breadcrumb.Item active>Penjualan</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row className="mt-3 bg-body-tertiary rounded p-3">
          <Col>
            <form>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Dari tanggal
                </Form.Label>
                <Col sm="10">
                  <ReactDatePicker
                    className="form-control"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                Sampai tanggal
                </Form.Label>
                <Col sm="10">
                  <ReactDatePicker
                    className="form-control"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                  />
                </Col>
              </Form.Group>
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

export default SalesReport;