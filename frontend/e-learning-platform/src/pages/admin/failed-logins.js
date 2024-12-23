import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import CustomTable from "../components/CustomTable";

import { jwtDecode } from "jwt-decode";

export default function FailedLogins() {
    const [failedLogins, setFailedLogins] = useState([]);
    const [token, setToken] = useState("");

    const [adminName, setAdminName] = useState("");
    const router = useRouter();

    useEffect(() => {
        const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!storedToken) {
            router.replace("/admin/login");
            return;
        }
        setToken(storedToken);
        fetchFailedLogins(storedToken);
    }, [router]);

    useEffect(() => {
        if (token) {
            decodeAdminName(token);
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

    const fetchFailedLogins = async (token) => {
        try {
            const response = await fetch("http://localhost:3000/users/failed-logins", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setFailedLogins(data);
            } else {
                console.error("Failed to fetch failed logins");
            }
        } catch (error) {
            console.error("Error fetching failed logins:", error.message);
        }
    };

    const columns = [
        { key: "username", label: "Username" },
        { key: "reason", label: "Reason" },
        { key: "timestamp", label: "Timestamp" },
    ];

    return (
        <>
            <Head>
                <title>Admin Dashboard - Failed Logins</title>
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
                                    <a href="/admin/instructors" className="nav-link text-white">
                                        <i className="mdi mdi-school"></i> Instructors
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="/admin/failed-logins" className="nav-link text-white active">
                                        <i className="mdi mdi-alert"></i> Failed Logins
                                    </a>
                                </li>
                            </ul>
                            <div className="mt-auto d-flex align-items-cente">
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
                                <h4 className="m-0">Failed Login Attempts</h4>
                            </div>
                        </nav>

                        <div className="card shadow-sm p-3">
                            <h5 className="mb-3">Failed Logins</h5>
                            <CustomTable data={failedLogins} columns={columns} showActions={false} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
