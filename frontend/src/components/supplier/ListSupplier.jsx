import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "../../auth/AxiosConfig.jsx";
import { Slide, toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { FaCheck, FaSearch, FaTrash } from "react-icons/fa";
import { MdCancel, MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
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
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

const ListSupplier = () => {
  const [data, setData] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [tempId, setTempId] = useState(0);
  const limit = 25;
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const loadData = useCallback(
    async (search) => {
      let reqOptions = {
        url: `/api/suppliers?search_query=${keyword}&lastId=${lastId}&limit=${limit}`,
        method: "GET",
      };
      try {
        const response = await axiosInstance.request(reqOptions);
        const newData = response.data.result;
        if (search) {
          setData(newData);
        } else {
          setData([...data, ...newData]);
        }
        setTempId(response.data.lastId);
        setHasMore(response.data.hasMore);
      } catch (error) {
        const errMessage = error.request.response
          ? JSON.parse(error.request.response)
          : error.message;
        toast.error(errMessage.message, {
            position: "top-right",
            theme: "colored",
            autoClose: 5000,
            transition: Slide
        });
      }
    },
    [data, lastId, keyword]
  );

  useEffect(() => {
    loadData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastId, keyword]);

  const serchData = (e) => {
    e.preventDefault();
    setLastId(0);
    setData([]);
    setKeyword(query);
    loadData(true);
  };

  const fetchMore = () => {
    setLastId(tempId);
  };

  const handleDelete = async (id) => {
    let reqOptions = {
      url: `/api/suppliers/${id}`,
      method: "DELETE",
    };
    try {
      const response = await axiosInstance.request(reqOptions);
      if (response.data) {
        toast.success(response.data.message, {
          position: "top-right",
          theme: "colored",
          autoClose: 5000,
          transition: Slide
        });
        setLastId(0);
        setData([]);
        setKeyword("");
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
                  handleDelete(id);
                  onClose();
                }}
              >
                <FaCheck /> Ya,hapus
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
      <Container>
        <Row className="mt-3 bg-body-tertiary rounded p-3 pb-0">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item href="#">Master</Breadcrumb.Item>
              <Breadcrumb.Item active>Supplier</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row className="mt-3 bg-body-tertiary rounded p-3">
          <Col>
            <Row>
              <Col md={5}>
                <Link to={"/supplier/add"} className="btn btn-primary mb-3">
                  <IoMdAdd /> Tambah Supplier
                </Link>
              </Col>
              <Col md={7}>
                <form onSubmit={serchData}>
                  <InputGroup className="mb-3">
                    <Form.Control
                      placeholder="Cari supplier ..."
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
            <InfiniteScroll
              dataLength={data.length}
              next={fetchMore}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
            >
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Nomor Telpon</th>
                    <th>Email</th>
                    <th>Alamat</th>
                    <th className="d-flex justify-content-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {item.firstName} {item.lastName}
                      </td>
                      <td>{item.phone}</td>
                      <td>{item.email ? item.email : "n/a"}</td>
                      <td>{item.address}</td>
                      <td>
                        <div className="d-flex justify-content-center">
                        <Link
                          to={`/supplier/${item.id}`}
                          className="btn btn-warning me-1"
                        >
                          <MdEdit /> Ubah
                        </Link>
                        <Button
                          variant="danger"
                          onClick={() => confirmDel(item.id)}
                        >
                          <FaTrash /> Hapus
                        </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </InfiniteScroll>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ListSupplier;