import PropTypes from "prop-types";

const PDFViewer = ({ url }) => {
  return (
    <>
      <iframe src={url} width="100%" height="700px" />
    </>
  );
};
PDFViewer.propTypes = {
  url: PropTypes.string,
};
export default PDFViewer;