import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:3000/auth/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) throw new Error("Invalid username or password");

            const { accessToken } = await response.json();
            localStorage.setItem("token", accessToken);
            router.push("/admin/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <Head>
                <title>Admin Login</title>
            </Head>
            <div
                className="d-flex justify-content-center align-items-center vh-100"
                style={{
                    background: "linear-gradient(to right, #6a11cb, #2575fc)",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                <div className="card shadow-lg p-4" style={{ width: "400px" }}>
                    <h1 className="text-center mb-3 fw-bold" style={{ fontSize: "2.5rem" }}>ADMIN LOGIN</h1>
                    <p className="text-center text-muted">
                        Please enter your login and password!
                    </p>
                    <form onSubmit={handleLogin}>
                        <div className="form-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <p className="text-danger text-center" style={{ fontSize: "0.9rem" }}>
                                {error}
                            </p>
                        )}
                        <div className="d-grid gap-2">
                            <button className="btn btn-primary" type="submit">
                                Login
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </>
    );
}
