import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Modal, Button, Form } from "react-bootstrap";
import CustomTable from "../components/CustomTable";
import { jwtDecode } from "jwt-decode";

export default function Instructors() {
    const [instructors, setInstructors] = useState([]);
    const [token, setToken] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [currentInstructor, setCurrentInstructor] = useState(null);
    const [editedData, setEditedData] = useState({ name: "", email: "", role: "" });
    const [adminName, setAdminName] = useState("");
    const router = useRouter();

    useEffect(() => {
        const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!storedToken) {
            router.replace("/admin/login");
            return;
        }
        setToken(storedToken);
    }, [router]);

    useEffect(() => {
        if (token) {
            decodeAdminName(token);
            fetchInstructors(token);
        }
    }, [token]);

    const decodeAdminName = (token) => {
        try {
            const decoded = jwtDecode(token);
            if (decoded && decoded.sub) {
                setAdminName(decoded.sub);
            }
        } catch (error) {
            console.error("Error decoding token:", error.message);
        }
    };

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    const fetchInstructors = async (token) => {
        try {
            const response = await fetch("http://localhost:3000/users/instructors", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setInstructors(data);
            } else {
                console.error("Failed to fetch instructors");
            }
        } catch (error) {
            console.error("Error fetching instructors:", error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:3000/users/instructors/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            setInstructors((prev) => prev.filter((instructor) => instructor._id !== id));
        } catch (error) {
            console.error("Error deleting instructor:", error.message);
        }
    };

    const handleEdit = (instructor) => {
        console.log("Selected Instructor:", instructor);

        setCurrentInstructor(instructor);
        setEditedData({ name: instructor.name, email: instructor.email, role: instructor.role });
        setTimeout(() => setShowModal(true), 0);
    };

    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`http://localhost:3000/users/instructors/${currentInstructor._id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedData),
            });
            if (response.ok) {
                setInstructors((prev) =>
                    prev.map((instructor) =>
                        instructor._id === currentInstructor._id ? { ...instructor, ...editedData } : instructor
                    )
                );
                setShowModal(false);
            } else {
                console.error("Failed to update instructor");
            }
        } catch (error) {
            console.error("Error updating instructor:", error.message);
        }
    };

    const columns = [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "createdAt", label: "Registered Date" },
    ];

    return (
        <>
            <Head>
                <title>Admin Dashboard - Instructors</title>
            </Head>
            <div className="container-fluid vh-100 p-0">
                <div className="row h-100">
                    {/* Sidebar */}
                    <nav className="col-md-3 col-lg-2 d-md-block bg-dark sidebar text-white" style={{ height: "100vh" }}>
                        <div className="position-sticky p-3 d-flex flex-column h-100">
                            <h3 className="text-center mb-4">Admin Panel</h3>
                            <ul className="nav flex-column mb-auto">
                                <li className="nav-item mb-2">
                                    <a href="/admin/dashboard" className="nav-link text-white">
                                        <i className="mdi mdi-view-dashboard"></i> Dashboard
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="/admin/students" className="nav-link text-white">
                                        <i className="mdi mdi-account"></i> Students
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="/admin/instructors" className="nav-link text-white active">
                                        <i className="mdi mdi-school"></i> Instructors
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="/admin/failed-logins" className="nav-link text-white">
                                        <i className="mdi mdi-alert"></i> Failed Logins
                                    </a>
                                </li>
                            </ul>
                            <div className="mt-auto d-flex align-items-center">
                                <div
                                    className="rounded-circle bg-light text-dark d-inline-flex justify-content-center align-items-center me-2"
                                    style={{ width: "40px", height: "40px", fontSize: "1.2rem" }}
                                >
                                    {getInitials(adminName)}
                                </div>
                                <p className="mt-2 fw-bold">{adminName}</p>
                            </div>
                        </div>
                    </nav>

                    {/* Main Content */}
                    <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-light">
                        {/* Header */}
                        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
                            <div className="container-fluid">
                                <h4 className="m-0">Instructors</h4>
                            </div>
                        </nav>

                        {/* Table */}
                        <div className="card shadow-sm p-3">
                            <h5 className="mb-3">Registered Instructors</h5>
                            <CustomTable
                                data={instructors}
                                columns={columns}
                                showActions={true}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered key={currentInstructor?._id}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Instructor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedData.name}
                                onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={editedData.email}
                                onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="role">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={editedData.role}
                                onChange={(e) => setEditedData({ ...editedData, role: e.target.value })}
                            >
                                <option value="student">Student</option>
                                <option value="instructor">Instructor</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
