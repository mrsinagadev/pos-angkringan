import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosInstance } from "../../auth/AxiosConfig.jsx";
import { toast } from "react-toastify";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import secureLocalStorage from "react-secure-storage";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoPrint } from "react-icons/io5";

const PrintPurchase = () => {
  const [data, setData] = useState({});
  const [detail, setDetail] = useState([]);
  const { id } = useParams();

  const loadData = useCallback(async () => {
    try {
      const out = await axiosInstance.get(`/api/purchases/${id}`, {});
      setData(out.data.result);
      setDetail(out.data.result.Purchasedetail);
    } catch (error) {
      const errMessage = JSON.parse(error.request.response);
      toast.error(errMessage.message, {
        position: "top-center",
      });
    }
  }, [id]);
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePrint = () => {
    window.print();
  };
  return (
    <>
      <Container>
        <Row className="mt-3 justify-content-between">
          <Col lg={6} className="text-start align-top">
            <h4>Nota Pembelian</h4>
            <table>
              <tr>
                <td>Tanggal dicetak</td>
                <td>&nbsp;:&nbsp;</td>
                <td>-</td>
              </tr>
              <tr>
                <td>Dicetak oleh</td>
                <td>&nbsp;:&nbsp;</td>
                <td>{secureLocalStorage.getItem("user")?.name}</td>
              </tr>
            </table>
          </Col>
          <Col>
            <table>
              <tr>
                <td>No Pembelian</td>
                <td>&nbsp;:&nbsp;</td>
                <td>{data?.code}</td>
              </tr>
              <tr>
                <td>Tanggal Pembelian</td>
                <td>&nbsp;:&nbsp;</td>
                <td>
                  {new Date(data?.date).toDateString("id-ID") || data?.date}
                </td>
              </tr>
              <tr>
                <td>Catatan</td>
                <td>&nbsp;:&nbsp;</td>
                <td>{data?.note}</td>
              </tr>
            </table>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Table>
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Jumlah</th>
                  <th>Harga</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {detail?.map((item, index) => (
                  <tr key={index}>
                    <td>{item?.productName}</td>
                    <td>{Number(item?.qty).toLocaleString("id-ID")}</td>
                    <td>Rp {Number(item?.price).toLocaleString("id-ID")}</td>
                    <td className="text-end">
                      Rp {Number(item?.total).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} className="text-end">
                    <strong>Total</strong>
                  </td>
                  <td className="text-end">
                    <strong>
                      Rp {Number(data.total).toLocaleString("id-ID")}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-end">
                    <strong>PPN</strong>
                  </td>
                  <td className="text-end">
                    <strong>
                      Rp {Number(data.ppn).toLocaleString("id-ID")}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-end">
                    <strong>Total Harga</strong>
                  </td>
                  <td className="text-end">
                    <strong>
                      Rp {Number(data.grandTotal).toLocaleString("id-ID")}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="print">
          <Col className="p-3">
            <div className="d-flex justify-content-between">
              <Link to="/purchase" className="btn btn-primary">
                <IoMdArrowRoundBack />
                Kembali
              </Link>
              <Button variant="primary" onClick={() => handlePrint()}>
                <IoPrint /> Cetak
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PrintPurchase;