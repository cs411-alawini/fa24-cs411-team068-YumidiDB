// LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Link,
} from "@mui/material";

const LoginPage: React.FC = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginFail, setLoginFail] = useState(false);
    const navigate = useNavigate();

    const handleLogin = () => {
        if (username && password) {
            setLoginFail(false);
            fetch("http://localhost:3007/api/user/login", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            }).then((response) => {
                if (!response.ok) {
                    setLoginFail(true);
                } else {
                    console.log("Logged in:", { username, password });
                    navigate("/user");
                }
            });
        }
    };

    const handleRegister = () => {
        if (username && password) {
            fetch("http://localhost:3007/api/user/register", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            }).then((response) => {
                if (!response.ok) {
                    setLoginFail(true);
                } else {
                    console.log("Registered:", { username, password });
                    navigate("/user");
                }
            });
        }
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                }}
            >
                <Typography variant="h4" gutterBottom>
                    {isRegistering ? "Register" : "Login"}
                </Typography>
                <TextField
                    label="Username"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={isRegistering ? handleRegister : handleLogin}
                >
                    {isRegistering ? "Register" : "Login"}
                </Button>
                {loginFail && (
                    <Typography>
                        {isRegistering ? "Register Failed" : "Login Failed"}
                    </Typography>
                )}
                <Link
                    href="#"
                    sx={{ mt: 2 }}
                    onClick={() => setIsRegistering(!isRegistering)}
                >
                    {isRegistering
                        ? "Already have an account? Login"
                        : "Don't have an account? Register"}
                </Link>
            </Box>
        </Container>
    );
};

export default LoginPage;
