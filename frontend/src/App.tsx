import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import User from "./pages/User";
import Planner from "./pages/Planner";
import RecipePage from "./pages/RecipePage";
import Collection from "./pages/Collection";
import CollectionRecipePage from "./pages/CollectionRecipePage";
import LoginPage from "./pages/Login";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Layout />}>
                <Route path="user" element={<User />} />
                <Route path="planner" element={<Planner />} />
                <Route path="/planner/:calorieRange" element={<Planner />} />
                <Route path = "/recipe/:id" element={<RecipePage />} />
                <Route path="collection" element={<Collection />} />
                <Route path="/collection/recipe/:id" element={<CollectionRecipePage />} />
            </Route>
        </Routes>
    );
}

export default App;
