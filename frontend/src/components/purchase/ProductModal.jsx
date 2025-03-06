import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../auth/AxiosConfig.jsx";
import {
  Button,
  Col,
  Figure,
  Form,
  InputGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

const ProductModal = (props) => {
  const { show, onHide, size, currIndex, handleChange } = props;
  const [keyword, setKeyword] = useState("");
  const [lastId, setLastId] = useState(0);
  const limit = 20;
  const [data, setData] = useState([]);
  const [tempId, setTempId] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");

  const loadData = async () => {
    let reqOptions = {
      url: `/api/products?search_query=${keyword}&lastId=${lastId}&limit=${limit}`,
      method: "GET",
    };
    try {
      const response = await axiosInstance.request(reqOptions);
      const newData = response.data.result;
      setData([...data, ...newData]);
      setTempId(response.data.lastId);
      setHasMore(response.data.hasMore);
    } catch (error) {
      const errMessage = JSON.parse(error.request.response);
      toast.error(errMessage.message, {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastId, keyword]);

  const serchData = (e) => {
    e.preventDefault();
    setLastId(0);
    setData([]);
    setKeyword(query);
  };

  const fetchMore = () => {
    setLastId(tempId);
  };

  return (
    <>
      <Modal
        onClose={onHide}
        size={size}
        show={show}
        onHide={onHide}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Search Product
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <form onSubmit={serchData}>
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Search ..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <Button type="submit" variant="primary">
                    Search
                  </Button>
                </InputGroup>
              </form>
            </Col>
          </Row>
          <Row id="scrollableDiv" style={{ height: "600px", overflow: "auto" }}>
            <Col>
              <InfiniteScroll
                dataLength={data.length}
                next={fetchMore}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                scrollableTarget="scrollableDiv"
              >
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product Name</th>
                      <th>QTY</th>
                      <th>Price</th>
                      <th>Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr
                        style={{ cursor: "pointer" }}
                        key={index}
                        onClick={() => {
                          handleChange(
                            { name: "product", value: JSON.stringify(item) },
                            currIndex
                          ),
                            onHide();
                        }}
                      >
                        <td>{index + 1}</td>
                        <td>{item.productName}</td>
                        <td>{Number(item.qty).toLocaleString("id-ID")}</td>
                        <td>Rp {Number(item.price).toLocaleString("id-ID")}</td>
                        <td>
                          <Figure className="m-0 p-0">
                            <Figure.Image
                              className="m-0 p-0"
                              width={50}
                              height={35}
                              alt="preview image"
                              src={item.url}
                            />
                          </Figure>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </InfiniteScroll>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};
ProductModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  size: PropTypes.string,
  currIndex: PropTypes.number,
  handleChange: PropTypes.func,
};
export default ProductModal;