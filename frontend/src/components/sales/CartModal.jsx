import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCart, updateCart } from "../../features/CartSlice.js";
import secureLocalStorage from "react-secure-storage";
import { Slide, toast } from "react-toastify";
import PropTypes from "prop-types";
import { confirmAlert } from "react-confirm-alert";
import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { Button, Form, Modal } from "react-bootstrap";

const CartModal = (props) => {
  const dispatch = useDispatch();
  const dataEdit = useSelector((state) => state.cart.dataEdit);
  const error = useSelector((state) => state.cart.error);
  const [data, setData] = useState({});

  const updateData = () => {
    dispatch(updateCart(data));
  };

  const actionDelete = (id) => {
    const user = secureLocalStorage.getItem("user");
    const data = { id: id, userId: user.id };
    if (dispatch(deleteCart(data))) {
      props.onHide();
      toast.success("Menu ini berhasil dihapus!", {
                position: "top-right",
                theme: "colored",
                autoClose: 5000,
                transition: Slide
      });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
                position: "top-right",
                theme: "colored",
                autoClose: 5000,
                transition: Slide
      });
    }
  }, [error, props]);

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

  useEffect(() => {
    setData(dataEdit);
  }, [dataEdit]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      fullscreen={"md-down"}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Ubah {data ? data.productName : ""}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Jumlah</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              value={data ? data.qty : 0}
              onChange={(e) => setData({ ...data, qty: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Keterangan</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={data ? data.note : ""}
              onChange={(e) => setData({ ...data, note: e.target.value })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            props.onHide(), updateData();
          }}
          variant="warning"
        >
          Ubah
        </Button>
        <Button
          onClick={() => {
            props.onHide(), confirmDel(data.id);
          }}
          variant="danger"
        >
          Hapus
        </Button>
        <Button onClick={props.onHide}>Tutup</Button>
      </Modal.Footer>
    </Modal>
  );
};

CartModal.propTypes = {
  onHide: PropTypes.func,
};

export default CartModal;