import { useDispatch, useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { TbBrandCakephp } from "react-icons/tb";
import { GiClothes } from "react-icons/gi";
import { LiaIconsSolid } from "react-icons/lia";
import { useEffect } from "react";
import { getAllCategory } from "../../features/CategoriSlice.js";
import { Slide, toast } from "react-toastify";
import {
    getAllByCategory,
    getAllProduct,
} from "../../features/ProductSlice.js";
import { Col, ListGroup } from "react-bootstrap";
import { MdEmojiFoodBeverage, MdOutlineProductionQuantityLimits } from "react-icons/md";

const ListCategory = () => {
    const categorys = useSelector((state) => state.category.data);
    const loading = useSelector((state) => state.category.loading);
    const error = useSelector((state) => state.category.error);
    const dispatch = useDispatch();

    const setIcon = (id) => {
        switch (id) {
            case 1:
                return <FaUtensils />;
            case 2:
                return <TbBrandCakephp />;
            case 3:
                return <LiaIconsSolid />;
            case 4:
                return <GiClothes />;
            default:
                return <MdEmojiFoodBeverage />;
        }
    };

    useEffect(() => {
        dispatch(getAllCategory());
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

    function setActive(elem) {
        var a = document.getElementsByClassName("active");
        for (let i = 0; i < a.length; i++) {
            a[i].classList.remove("active");
        }
        elem.classList.add("active");
    }

    const showAll = () => {
        dispatch(getAllProduct(""));
    };

    const categoryClicked = (id) => {
        dispatch(getAllByCategory(id));
    };

    return (
        <>
            <Col md={4} lg={2}>
                <div className="position-sticky z-3" style={{ top: "12px" }}>
                    <div className="bg-body-tertiary rounded p-3">
                        <h4>Kategori Produk</h4>
                        <hr />
                        {loading ? "Loading..." : ""}
                        <ListGroup key="all001">
                            <ListGroup.Item
                                id={`all001`}
                                className="mb-1 shadow-sm border-0"
                                active
                                action
                                onClick={() => {
                                    setActive(document.getElementById(`all001`)), showAll();
                                }}
                            >
                                <MdOutlineProductionQuantityLimits /> Semua Menu
                            </ListGroup.Item>
                        </ListGroup>
                        {categorys &&
                            categorys.map((item) => (
                                <ListGroup key={item.id}>
                                    <ListGroup.Item
                                        id={`key${item.id}`}
                                        className="mb-1 shadow-sm border-0"
                                        action
                                        onClick={() => {
                                            setActive(document.getElementById(`key${item.id}`)),
                                                categoryClicked(item.id);
                                        }}
                                    >
                                        {setIcon(item.id)} {item.kategoryName}
                                    </ListGroup.Item>
                                </ListGroup>
                            ))}
                    </div>
                </div>
            </Col>
        </>
    );
};

export default ListCategory;