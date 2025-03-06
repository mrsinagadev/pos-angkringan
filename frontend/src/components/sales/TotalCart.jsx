import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { axiosInstance } from "../../auth/AxiosConfig.jsx";
import { toast } from "react-toastify";
import { Button, Col, Row } from "react-bootstrap";
import { FaCartArrowDown } from "react-icons/fa";

const TotalCart = ({ carts }) => {
  const navigate = useNavigate();
  let sum = 0;
  if (carts) {
    sum = carts.reduce(function (result, item) {
      return result + parseInt(item.totalPrice);
    }, 0);
  }
  const saveCartData = async () => {
    const user = secureLocalStorage.getItem("user");
    try {
      const order = {
        date: new Date(
          new Date().toLocaleString("en", { timeZone: "Asia/Jakarta" })
        ),
        total: sum,
        ppn: sum * 0.11,
        grandTotal: sum * 0.11 + sum,
        detail: carts,
      };
      const result = await axiosInstance.post(`/api/orders/${user.id}`, order);
      if (result.data.result) {
        toast.success(result.data.message);
        navigate(`/orders/${result.data.result.id}`);
      }
    } catch (error) {
      const errMessage = JSON.parse(error.request.response);
      toast.error(errMessage.message, {
        position: "top-center",
      });
    }
  };
  return (
    <div className="fixed-bottom">
      <Row>
        <Col
          lg={{ span: 3, offset: 9 }}
          md={{ span: 12, offset: 0 }}
          className="bg-body pt-2"
        >
          <div className="px-3">
            <h4>
              Total Bayar :{" "}
              <strong className="float-end me-3">
                Rp {sum.toLocaleString("id-ID")}
              </strong>
            </h4>
            <Button
              variant="primary"
              className="w-100 me-3 mb-3"
              size="lg"
              onClick={() => saveCartData(carts)}
            >
              <FaCartArrowDown /> Bayar
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

TotalCart.propTypes = {
  carts: PropTypes.array,
};

export default TotalCart;