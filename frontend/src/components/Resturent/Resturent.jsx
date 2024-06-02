import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useQuery } from "react-query";
import EditLineIcon from "remixicon-react/EditLineIcon";
import DeleteBinLineIcon from "remixicon-react/DeleteBinLineIcon";
import Swal from "sweetalert2";
import "primereact/resources/themes/saga-blue/theme.css";
import "react-phone-number-input/style.css";
import { Col, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AdminNavbar from "../AdminNavbar/SideNavbar";

function Resturents() {
  const [show, setShow] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteID, setDeleteID] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setShowDetail(true);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
  } = useForm({
    validateInputChanges: true,
    initialValues: {
      name: "",
      address: "",
      telephone: "",
      image: "",
    },
  });

  const editProductForm = useForm({
    validateInputChanges: true,
    initialValues: {
      _id: "",
      name: "",
      address: "",
      telephone: "",
      image: "",
    },
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  //use react query and fetch member data
  const { data, isLoading, isError, refetch } = useQuery(
    "acceptedMemberData",
    async () => {
      const response = await axios.get("http://localhost:3001/resturent/");
      return response.data;
    }
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading data</p>;
  }

  const editResturent = async () => {
    try {
      const editProductDetails = editProductForm.getValues();
      await axios.put(
        `http://localhost:3001/resturent/updateResturent/${editProductDetails._id}`,
        editProductDetails
      );
      editProductForm.reset();
      setShowEdit(false);
      Swal.fire({
        icon: "success",
        title: "Resturent Update Successfully",
        text: "You have successfully update a Resturent",
      });
      refetch();
    } catch (err) {
      console.log("edit form error", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  const addResturent = async (formData) => {
    try {
      console.log(formData);
      await axios.post(
        "http://localhost:3001/resturent/addResturent",
        formData
      );

      reset();
      Swal.fire({
        icon: "success",
        title: "Resturent Added Successfully",
        text: "You have successfully added a Resturent",
      });
      refetch();
    } catch (err) {
      console.log("Add form error:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  const deleteResturent = async (_id) => {
    try {
      await axios.delete(`http://localhost:3001/resturent/delete/${_id}`, {
        withCredentials: true,
      });
      Swal.fire({
        title: "Deleted!",
        text: "Resturent has been deleted.",
        icon: "success",
      });
      refetch();

      setShowDelete(false);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };
  const handleDelete = (_id) => {
    setShowDelete(true);
    setDeleteID(_id);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);

  const handleCloseEdit = () => {
    setShowEdit(false);
    editProductForm.reset(); // Reset the form
  };

  const handleShowEdit = () => setShowEdit(true);

  const filteredData = data.filter((member) =>
    Object.values(member).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      // `reader.result` contains the base64 encoded image data
      setValue("image", reader.result); // Store base64 data in form state
      editProductForm.setValue("image", reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreviewUrl(imageUrl); // Convert image to base64 string
    }
  };

  // Generate report
  const downloadPdfReport = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      theme: "striped",
      head: [
        [
          "Resturent ID",
          "Resturen Name",
          "Resturent Address",
          "Resturent Telephone",
        ],
      ],
      body: data.map((item) => [
        item.cusReturentID,
        item.name,
        item.address,
        item.telephone,
      ]),
      columnStyles: { 0: { cellWidth: "auto" } },
    });
    doc.save("Resturent Report.pdf");
  };

  return (
    <>
      <center>
        <div>
          <AdminNavbar />
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add Resturent</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Resturent Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => handleImageUpload(e)}
                    accept="image/*"
                  />
                  {imagePreviewUrl && (
                    <img
                      src={imagePreviewUrl}
                      alt="Preview"
                      style={{
                        width: "150px",
                        height: "100px",
                        marginTop: "10px",
                      }}
                    />
                  )}
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>
                    Resturent Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="name"
                    {...register("name", {
                      required: true,
                    })}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>
                    Resturent Address
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    {...register("address", {
                      required: true,
                    })}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>
                    Resturent Telephone
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    {...register("telephone", {
                      required: true,
                    })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit((data) => {
                  console.log(data);
                  addResturent(data);
                  handleClose(); // Move handleClose to onSubmit handler
                })}
              >
                Add Resturent
              </Button>
            </Modal.Footer>
          </Modal>
          <div style={{ padding: "30px" }}>
            <h2>Resturentes</h2>
            <center>
              <Row style={{ padding: "20px" }}>
                <Col>
                  <Form className="d-flex">
                    <Form.Control
                      type="search"
                      placeholder="Search by Resturent ID"
                      className="me-2"
                      aria-label="Search"
                      style={{ width: "400px", marginLeft: "400px" }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </Form>
                </Col>
                <Col>
                  <Button
                    style={{
                      backgroundColor: "black",
                      borderBlockColor: "black",
                    }}
                    onClick={handleShow}
                  >
                    Add Resturent
                  </Button>
                </Col>
                <Col>
                  <Button
                    onClick={downloadPdfReport}
                    style={{
                      backgroundColor: "black",
                      borderBlockColor: "black",
                    }}
                  >
                    Download Report
                  </Button>
                </Col>
              </Row>
            </center>

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Resturent ID</th>
                  <th>Resturent Name</th>
                  <th>Resturent Image</th>
                  <th>Resturent Address</th>
                  <th>Resturent Telephone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((member) =>
                    Object.values(member).some((value) =>
                      value
                        .toString()
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                  )
                  .map((member) => (
                    <tr key={member.cusReturentID}>
                      <td onClick={() => handleRowClick(member)}>
                        {member.cusReturentID}
                      </td>
                      <td onClick={() => handleRowClick(member)}>
                        {member.name}
                      </td>
                      <center>
                        <div
                          onClick={() => handleRowClick(member)}
                          style={{
                            width: "120px",
                            height: "50px",
                            alignItems: "center",
                            backgroundSize: "cover",
                            backgroundImage: `url(${member.image})`,
                          }}
                        ></div>
                      </center>
                      <td>{member.address}</td>
                      <td>{member.telephone}</td>
                      <td>
                        <EditLineIcon
                          onClick={() => {
                            editProductForm.reset({
                              _id: member._id,
                              name: member.name,
                              address: member.address,
                              telephone: member.telephone,
                              image: member.image,
                            });
                            setShowEdit(true);
                          }}
                        />
                        <DeleteBinLineIcon
                          onClick={() => {
                            handleDelete(member._id);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            {selectedProduct && (
              <Modal
                size="lg"
                show={showDetail}
                onHide={() => setShowDetail(false)}
                centered
              >
                <center>
                  <Modal.Header closeButton>
                    <Modal.Title>Resturent Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Card.Img
                      variant="top"
                      src={selectedProduct.image}
                      style={{
                        width: "80%",
                        height: "280px",
                        borderRadius: "10px",
                      }}
                    />
                    <br />
                    <br />
                    <p>
                      <strong>Resturent ID: </strong>{" "}
                      {selectedProduct.cusReturentID}
                    </p>
                    <p>
                      <strong>Resturent name: </strong> {selectedProduct.name}
                    </p>
                    <p>
                      <strong>Resturent Address: </strong>{" "}
                      {selectedProduct.address}
                    </p>
                    <p>
                      <strong>Resturent Telephone: </strong>{" "}
                      {selectedProduct.telephone}
                    </p>
                  </Modal.Body>
                </center>
              </Modal>
            )}
          </div>
          <Modal show={showDelete} onHide={handleCloseDelete}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Resturent</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure!</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDelete}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  deleteResturent(deleteID);
                }}
              >
                Yes
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={showEdit} onHide={handleCloseEdit}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Resturent</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => handleImageUpload(e)}
                    accept="image/*"
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Resturent Name</Form.Label>
                  <Form.Control
                    type="text"
                    {...editProductForm.register("name")}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Resturent Address</Form.Label>
                  <Form.Control
                    type="text"
                    {...editProductForm.register("address")}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Resturent Telephone</Form.Label>
                  <Form.Control
                    type="text"
                    {...editProductForm.register("telephone")}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEdit}>
                Close
              </Button>
              <Button variant="primary" onClick={() => editResturent()}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </center>
    </>
  );
}

export default Resturents;
