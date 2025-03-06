import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import { axiosInstance } from "../../auth/AxiosConfig.jsx";
import secureLocalStorage from "react-secure-storage";
import NavbarComponent from "../NavbarComponent.jsx";
import {
  Breadcrumb,
  Button,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import { IoMdAdd } from "react-icons/io";
import { FaSave } from "react-icons/fa";

const SalesReturn = () => {
  const [note, setNote] = useState("");
  const [returnDate, setReturnDate] = useState(
    new Date().setHours(7, 0, 0, 0) //untuk timezone asia jakarta);
  );
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [data, setData] = useState([
    {
      product: null,
      qty: 0,
      price: 0,
      totalPrice: 0,
    },
  ]);
  const navigate = useNavigate();

  // load data
  const loadData = async () => {
    try {
      const out = await axiosInstance.get(`/api/orders/${id}`, {});
      setProduct(out.data.result.Orderdetail);
    } catch (error) {
      const errMessage = JSON.parse(error.request.response);
      toast.error(errMessage.message, {
          position: "top-right",
          theme: "colored",
          autoClose: 10000,
          hideProgressBar: true,
          transition: Slide
      });
    }
  };
  useEffect(() => {
    loadData();
    setData([
      {
        product: null,
        qty: 0,
        price: 0,
        totalPrice: 0,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleClick = () => {
    setData([
      ...data,
      {
        product: null,
        qty: 1,
        price: 0,
        totalPrice: 0,
      },
    ]);
  };

  const handleDelete = (i) => {
    const deleteVal = [...data];
    deleteVal.splice(i, 1);
    setData(deleteVal);
  };

  const handleChange = (e, i) => {
    const { name, value } = e.target;
    const onchangeVal = [...data];
    onchangeVal[i][name] = value;
    if (name == "qty") {
      onchangeVal[i].totalPrice = onchangeVal[i].qty * onchangeVal[i].price;
    }
    if (name == "product") {
      const product = JSON.parse(onchangeVal[i].product);
      onchangeVal[i].product = product;
      onchangeVal[i].price = product.price;
      onchangeVal[i].totalPrice = Number(onchangeVal[i].qty) * product.price;
    }
    setData(onchangeVal);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data2 = {
      date: returnDate,
      note: note,
      userId: secureLocalStorage.getItem("user").id,
      orderId: id,
      detail: data,
    };
    let bodyContent = data2;
    let reqOptions = {
      url: "/api/order-returns",
      method: "POST",
      data: bodyContent,
    };
    try {
      const response = await axiosInstance.request(reqOptions);
      if (response.data) {
        toast.success(response.data.message, {
          position: "top-right",
          theme: "colored",
          autoClose: 10000,
          hideProgressBar: true,
          transition: Slide
        });
        navigate("/sales-history");
      }
    } catch (error) {
      const errMessage = JSON.parse(error.request.response);
      toast.error(errMessage.message, {
          position: "top-right",
          theme: "colored",
          autoClose: 10000,
          hideProgressBar: true,
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
              <Breadcrumb.Item href="#">Transaksi</Breadcrumb.Item>
              <Breadcrumb.Item href="/sales-history">
                Riwayat Penjualan
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Pengembalian Penjualan</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row className="mt-3 bg-body-tertiary rounded p-3">
          <Col>
            <form onSubmit={handleSubmit}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Tanggal Pengembalian
                </Form.Label>
                <Col sm="10">
                  <DatePicker
                    className="form-control"
                    selected={returnDate}
                    onChange={(date) => setReturnDate(date)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Catatan
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Row>
                <Col className="d-flex justify-content-end">
                  <Button variant="primary" type="button" onClick={handleClick}>
                    <IoMdAdd /> Tambah Produk
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Table bordered hover striped className="mt-3">
                    <thead>
                      <tr>
                        <th>Nama Produk</th>
                        <th>Jumlah</th>
                        <th>Harga</th>
                        <th>Total Harga</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <Form.Select
                              className="form-select"
                              aria-label="Default select example"
                              selected={item.product}
                              name="product"
                              onChange={(e) => handleChange(e, index)}
                            >
                              <option value={""}>-Select Product-</option>
                              {product.map((item, index) => (
                                <option
                                  key={index}
                                  value={JSON.stringify({
                                    productId: item.productId,
                                    productName: item.productName,
                                    price: item.price,
                                  })}
                                >
                                  {item.productName}
                                </option>
                              ))}
                            </Form.Select>
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              name="qty"
                              value={item.qty}
                              onChange={(e) => handleChange(e, index)}
                            />
                          </td>
                          <td>{Number(item.price).toLocaleString("id-ID")}</td>
                          <td>
                            {Number(item.totalPrice).toLocaleString("id-ID")}
                          </td>
                          <td className="text-center">
                            <Button
                              onClick={() => handleDelete(index)}
                              className="btn-sm"
                              variant="danger"
                            >
                              Hapus
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button variant="primary" type="submit">
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

export default SalesReturn;