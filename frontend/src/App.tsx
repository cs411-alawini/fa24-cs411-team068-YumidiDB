import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import User from "./pages/User";
import Planner from "./pages/Planner";
import Collection from "./pages/Collection";
import LoginPage from "./pages/Login";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Layout />}>
                <Route path="user" element={<User />} />
                <Route path="planner" element={<Planner />} />
                <Route path="collection" element={<Collection />} />
            </Route>
        </Routes>
    );
}

export default App;
