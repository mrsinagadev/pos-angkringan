import { useState } from "react";
import { Container, Image, Nav, Navbar, NavDropdown } from "react-bootstrap";
import secureLocalStorage from "react-secure-storage";
import { FaBuffer, FaChartBar } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import ProfileModal from "./ProfileModal.jsx";

const NavbarComponent = () => {
  const [modalShow, setModalShow] = useState(false);
  const user = secureLocalStorage.getItem("user");
  let nama = "User";
  if (user) {
    nama = user.name;
  }

  const avatar = (
    <Image
      src={"/img/img_avatar.png"}
      alt="User"
      roundedCircle
      style={{ width: "30px" }}
    />
  );
  return (
    <Navbar expand="lg" className="bg-body-tertiary print">
      <Container fluid>
        <Navbar.Brand href="/" className="text-primary fw-bold">KULINERAN APP</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto fw-medium">
            <NavDropdown
              title={
                <>
                  <FaBuffer /> {"Master"}
                </>
              }
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item href="/category">Kategori</NavDropdown.Item>
              <NavDropdown.Item href="/supplier">Supplier</NavDropdown.Item>
              <NavDropdown.Item href="/product">Produk</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={
                <>
                  <GrTransaction /> {"Transaksi"}
                </>
              }
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item href="/sales">Penjualan</NavDropdown.Item>
              <NavDropdown.Item href="/sales-history">
                Riwayat Penjualan
              </NavDropdown.Item>
              <NavDropdown.Item href="/purchase">Pembelian</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={
                <>
                  <FaChartBar /> {"Laporan"}
                </>
              }
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item href="/supplier-report">
                Supplier
              </NavDropdown.Item>
              <NavDropdown.Item href="/product-report">
                Produk
              </NavDropdown.Item>
              <NavDropdown.Item href="/sales-report">Penjualan</NavDropdown.Item>
              <NavDropdown.Item href="/purchase-report">
                Pembelian
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <NavDropdown className="fw-medium"
              title={
                <>
                  {avatar} {nama}
                </>
              }
              id="collapsible-nav-dropdown"
            >
              <NavDropdown.Item href="#" onClick={() => setModalShow(true)}>
                Profil
              </NavDropdown.Item>
              <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <ProfileModal
        show={modalShow}
        size="xl"
        modalTitle="Search Supplier"
        onHide={() => setModalShow(false)}
      />
    </Navbar>
  );
};

export default NavbarComponent;