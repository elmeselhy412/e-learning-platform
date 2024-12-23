import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import Head from "next/head";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        students: 0,
        instructors: 0,
        failedLogins: 0,
    });
    const [adminName, setAdminName] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/admin/login");
            return;
        }
        decodeAdminName(token);
        fetchStats(token);
    }, [router]);

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

    const fetchStats = async (token) => {
        try {
            const [studentsRes, instructorsRes, failedLoginsRes] = await Promise.all([
                fetch("http://localhost:3000/users/students", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("http://localhost:3000/users/instructors", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("http://localhost:3000/users/failed-logins", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            if (!studentsRes.ok || !instructorsRes.ok || !failedLoginsRes.ok)
                throw new Error("Failed to fetch stats");

            const students = await studentsRes.json();
            const instructors = await instructorsRes.json();
            const failedLogins = await failedLoginsRes.json();

            setStats({
                students: students.length,
                instructors: instructors.length,
                failedLogins: failedLogins.length,
            });
        } catch (error) {
            console.error("Error fetching stats:", error.message);
        }
    };

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <>
            <Head>
                <title>Admin Dashboard</title>
            </Head>
            <div className="container-fluid vh-100 p-0">
                <div className="row h-100">
                    {/* Sidebar */}
                    <nav
                        className="col-md-3 col-lg-2 d-md-block bg-dark sidebar text-white"
                        style={{ height: "100vh" }}
                    >
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
                                    <a href="#" className="nav-link text-white">
                                        <i className="mdi mdi-school"></i> Instructors
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link text-white">
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
                                <h4 className="m-0">Dashboard</h4>
                            </div>
                        </nav>

                        {/* Cards */}
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <div className="card text-white bg-primary h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">Total Students</h5>
                                        <p className="card-text display-4">{stats.students}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="card text-white bg-success h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">Total Instructors</h5>
                                        <p className="card-text display-4">{stats.instructors}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="card text-white bg-danger h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">Failed Logins</h5>
                                        <p className="card-text display-4">{stats.failedLogins}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
