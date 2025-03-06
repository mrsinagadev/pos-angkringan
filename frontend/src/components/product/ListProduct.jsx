import { useCallback, useEffect, useState } from "react";
import { Slide, toast } from "react-toastify";
import { axiosInstance } from "../../auth/AxiosConfig.jsx";
import { confirmAlert } from "react-confirm-alert";
import { FaCheck, FaSearch } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import NavbarComponent from "../NavbarComponent.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Breadcrumb,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import ProductCard from "./ProductCard.jsx";

const ListProduct = () => {
  const [data, setData] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [tempId, setTempId] = useState(0);
  const limit = 20;
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [change, setChange] = useState(0);

  const loadData = useCallback(async () => {
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
        position: "top-right",
        theme: "colored",
        autoClose: 5000,
        transition: Slide
      });
    }
  }, [data, keyword, lastId, limit]);

  useEffect(() => {
    setChange(2);
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastId, keyword, change]);

  const fetchMore = () => {
    setLastId(tempId);
  };

  const serchData = (e) => {
    e.preventDefault();
    setChange(3);
    setLastId(0);
    setData([]);
    setKeyword(query);
  };

  const actionDelete = async (id) => {
    let reqOptions = {
      url: `/api/products/${id}`,
      method: "DELETE",
    };
    try {
      const out = await axiosInstance.request(reqOptions);
      if (out.data) {
        setLastId(0);
        setData([]);
        setChange(1);
        toast.success(out.data.message, {
          position: "top-right",
          theme: "colored",
          autoClose: 5000,
          transition: Slide
        });
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

  const confirmDel = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-body-tertiary p-5 rounded shadow">
            <h1>Apakah kamu yakin?</h1>
            <p>Data ini akan dihapus permanen!</p>
            <div className="text-center">
              <button className="btn btn-danger me-2" onClick={onClose}>
                <MdCancel /> Tidak
              </button>
              <button
                className="btn btn-success"
                onClick={() => {
                  actionDelete(id);
                  onClose();
                }}
              >
                <FaCheck /> Ya, hapus
              </button>
            </div>
          </div>
        );
      },
    });
  };
  return (
    <>
      <NavbarComponent />
      <InfiniteScroll
        dataLength={data.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <Container>
          <Row className="mt-3 bg-body-tertiary rounded p-3 pb-0">
            <Col>
              <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item href="#">Master</Breadcrumb.Item>
                <Breadcrumb.Item active>Produk</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
          <Row className="mt-3 bg-body-tertiary rounded p-3">
            <Col>
              <Row>
                <Col md={5}>
                  <Link to={"/product/add"} className="btn btn-primary mb-3">
                    <IoMdAdd /> Tambah Product
                  </Link>
                </Col>
                <Col md={7}>
                  <form onSubmit={serchData}>
                    <InputGroup className="mb-3">
                      <Form.Control
                        placeholder="Cari produk ..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      <Button type="submit" variant="primary">
                        <FaSearch /> Cari
                      </Button>
                    </InputGroup>
                  </form>
                </Col>
              </Row>
              <Row>
                {data.map((item, index) => (
                  <ProductCard
                    key={index}
                    product={item}
                    confirmDel={confirmDel}
                  />
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </InfiniteScroll>
    </>
  );
};

export default ListProduct;