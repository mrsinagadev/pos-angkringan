import { Button, Card, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";

const ProductCard = ({ product, confirmDel }) => {
  return (
    <Col md={3} xs={6} className="mb-4">
      <Card className="shadow-sm border-0">
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
          <div className="text-center">
            <Link
              to={`/product/${product.id}`}
              className="btn btn-warning me-2"
            >
              <MdEdit /> Ubah
            </Link>
            <Button variant="danger" onClick={() => confirmDel(product.id)}>
              <IoMdTrash /> Hapus
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object,
  confirmDel: PropTypes.func,
};

export default ProductCard;