import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import { axiosInstance } from "../../auth/AxiosConfig.jsx";
import NavbarComponent from "../NavbarComponent.jsx";
import {
  Breadcrumb,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import { IoMdAdd } from "react-icons/io";
import { FaSave, FaSearch } from "react-icons/fa";
import ProductModal from "./ProductModal.jsx";

const AddPurchase = () => {
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [currIndex, setCurrIndex] = useState(0);
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().setHours(7, 0, 0, 0) //untuk timezone asia jakarta
  );
  const [note, setNote] = useState("");
  const [data, setData] = useState([
    {
      product: null,
      qty: 1,
      price: 0,
      totalPrice: 0,
    },
  ]);
  useEffect(() => {
    setData([
      {
        product: null,
        qty: 1,
        price: 0,
        totalPrice: 0,
      },
    ]);
  }, []);

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

  const handleChange = (e, i) => {
    const { name, value } = e;
    const onchangeVal = [...data];
    if (name == "product") {
      const product = JSON.parse(value);
      onchangeVal[i].product = {
        productId: product.id,
        productName: product.productName,
        price: product.price,
        qty: product.qty,
      };
      onchangeVal[i].price = product.price;
      onchangeVal[i].totalPrice = Number(onchangeVal[i].qty) * product.price;
    } else {
      onchangeVal[i][name] = value;
    }
    if (name == "qty") {
      onchangeVal[i].totalPrice = onchangeVal[i].qty * onchangeVal[i].price;
    }
    setData(onchangeVal);
  };

  const handleDelete = (i) => {
    const deleteVal = [...data];
    deleteVal.splice(i, 1);
    setData(deleteVal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data[0].product == null) {
      toast.error("Product cannot be empty", {
        position: "top-center",
      });
      return;
    }
    // check duplicate
    const isDuplicate = data.some((obj, index) => {
      return (
        data.findIndex(
          (item) => item.product.productId === obj.product.productId
        ) !== index
      );
    });
    if (isDuplicate) {
      toast.error("Duplicate Product", {
        position: "top-center",
      });
    } else {
      let sum = 0;
      if (data) {
        sum = data.reduce(function (result, item) {
          return result + parseInt(item.totalPrice);
        }, 0);
      }
      // simpan data ke database

      let bodyContent = {
        date: new Date(
          new Date(purchaseDate).getTime() -
            new Date().getTimezoneOffset() * 60 * 1000
        )
          .toJSON()
          .slice(0, 19)
          .replace("T", " "),
        note: note,
        userId: secureLocalStorage.getItem("user").id,
        total: sum,
        ppn: Number(sum) * 0.11,
        grandTotal: Number(sum) * 0.11 + Number(sum),
        detail: data,
      };
      let reqOptions = {
        url: "/api/purchases",
        method: "POST",
        data: bodyContent,
      };
      try {
        const response = await axiosInstance.request(reqOptions);
        if (response.data) {
          toast.success(response.data.message, {
            position: "top-center",
          });
          navigate("/purchase");
        }
      } catch (error) {
        const errMessage = JSON.parse(error.request.response);
        toast.error(errMessage.message, {
          position: "top-center",
        });
      }
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
              <Breadcrumb.Item href="#">Transaction</Breadcrumb.Item>
              <Breadcrumb.Item href="/purchase">Purchase</Breadcrumb.Item>
              <Breadcrumb.Item active>Create Purchase</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row>
          <Col>
            <form onSubmit={handleSubmit}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Purchase Date
                </Form.Label>
                <Col sm="10">
                  <DatePicker
                    className="form-control"
                    selected={purchaseDate}
                    onChange={(date) => setPurchaseDate(date)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Note
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
                    <IoMdAdd /> Add Product
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Table bordered hover striped className="mt-3">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit price</th>
                        <th>Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <InputGroup>
                              <Form.Control
                                placeholder="Search ..."
                                value={
                                  item.product ? item.product.productName : ""
                                }
                                onChange={(e) =>
                                  handleChange(
                                    {
                                      name: e.target.name,
                                      value: e.target.value,
                                    },
                                    index
                                  )
                                }
                              />
                              <Button
                                type="button"
                                variant="primary"
                                onClick={() => {
                                  setModalShow(true), setCurrIndex(index);
                                }}
                              >
                                <FaSearch /> Search
                              </Button>
                            </InputGroup>
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              name="qty"
                              value={item.qty}
                              onChange={(e) =>
                                handleChange(
                                  {
                                    name: e.target.name,
                                    value: e.target.value,
                                  },
                                  index
                                )
                              }
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
                              x
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
                    <FaSave /> Save
                  </Button>
                </Col>
              </Row>
            </form>
          </Col>
        </Row>
      </Container>
      <ProductModal
        show={modalShow}
        size="xl"
        modalTitle="Search Supplier"
        currIndex={currIndex}
        handleChange={handleChange}
        onHide={() => setModalShow(false)}
      />
    </>
  );
};

export default AddPurchase;