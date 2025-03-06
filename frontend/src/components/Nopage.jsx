import { Link } from "react-router-dom";

function NoPage() {
  return (
    <>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <div>
          <h1>404 Page Not Found</h1>
          <div className="d-flex align-items-center justify-content-center">
            <Link to={"/"} className="btn btn-primary mb-3">
              Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default NoPage;