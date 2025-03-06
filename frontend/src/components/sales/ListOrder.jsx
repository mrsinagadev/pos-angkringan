import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCart, setDetail } from "../../features/CartSlice.js";
import { Slide, toast } from "react-toastify";
import { Col, ListGroup } from "react-bootstrap";
import CartModal from "./CartModal.jsx";
import TotalCart from "./TotalCart.jsx";

const ListOrder = () => {
  const carts = useSelector((state) => state.cart.data);
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = React.useState(false);

  useEffect(() => {
    dispatch(getAllCart());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
                position: "top-right",
                theme: "colored",
                autoClose: 5000,
                transition: Slide
      });
    }
  }, [error]);

  return (
    <>
      <Col md={12} lg={3} className="mb-5 pb-5">
        <div className="position-sticky z-3" style={{ top: "12px" }}>
          <div className="bg-body-tertiary rounded p-3">
            <h4>Daftar Pesanan</h4>
            <hr />
            {loading ? "Loading..." : ""}
            <ListGroup variant="flush">
              {carts ? (
                carts.map((item) => (
                  <ListGroup.Item
                    key={item.id}
                    variant="flush"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      dispatch(setDetail(item)), setModalShow(true);
                    }}
                  >
                    <div className="fw-bold">{item.productName}</div>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="me-auto">
                        <small>
                          Rp {parseInt(item.price).toLocaleString("id-ID")} x{" "}
                          {item.qty}
                        </small>
                        <p>
                          <small>{item.note}</small>
                        </p>
                      </div>
                      <div>
                        <strong>
                          <small>
                            Rp{" "}
                            {parseInt(item.price * item.qty).toLocaleString(
                              "id-ID"
                            )}
                          </small>
                        </strong>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <p>Tidak ada data ...</p>
              )}
            </ListGroup>
            <TotalCart carts={carts} />
          </div>
        </div>
      </Col>
      <CartModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
};

export default ListOrder;