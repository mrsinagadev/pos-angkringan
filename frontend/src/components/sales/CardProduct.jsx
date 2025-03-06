import { Col } from "react-bootstrap";
import { Card } from "react-bootstrap";
import PropTypes from "prop-types";

const CardProduct = ({ product, setCart }) => {
  return (
    <Col md={4} xs={6} className="mb-4">
      <Card className="shadow-sm border-0" onClick={() => setCart(product)}>
        <Card.Img width={"100%"} height={200} variant="top" src={product.url} />
        <Card.Body>
          <Card.Text>
            <small>{product.code}</small>
            <br />
            {product.productName.toUpperCase()} {" ( " + product.qty + " )"}
            <br />
            <strong>
              Rp. {parseInt(product.price).toLocaleString("id-ID")}
            </strong>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

CardProduct.propTypes = {
  product: PropTypes.object,
  setCart: PropTypes.func,
};

export default CardProduct;
