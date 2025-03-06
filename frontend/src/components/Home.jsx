import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import NavbarComponent from "./NavbarComponent.jsx";
import ChartComponent from "./dashboard/ChartComponent.jsx";
import { useState } from "react";

const Home = () => {
  const [totPurchase, setTotPurchase] = useState(0);
  const [totOrder, setTotOrder] = useState(0);
  return (
    <>
      <NavbarComponent />
      <Container>
        <Row className="mt-3 bg-body-tertiary rounded p-3 pb-0">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row className="mt-3 bg-body-tertiary rounded p-3">
          <Col xl={6} md={6} sm={12}>
            <div className="shadow-sm card bg-body border-0">
              <div className="card-body">
                <div className="row no-gutters align-items-center ">
                  <div className="col mr-2 ">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Penjualan {new Date().getFullYear()}
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      Rp {totOrder.toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-credit-card fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col xl={6} md={6} sm={12}>
            <div className="shadow-sm card bg-body border-0">
              <div className="card-body">
                <div className="row no-gutters align-items-center ">
                  <div className="col mr-2 ">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Pembelian {new Date().getFullYear()}
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      Rp {totPurchase.toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-credit-card fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-3 bg-body-tertiary rounded p-3">
          <Col>
            <div className="shadow-sm card bg-body border-0">
              <div className="card-body">
                <ChartComponent
                  setTotPurchase={setTotPurchase}
                  setTotOrder={setTotOrder}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;