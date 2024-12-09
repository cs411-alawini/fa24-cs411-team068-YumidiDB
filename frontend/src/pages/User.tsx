import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    Autocomplete,
} from "@mui/material";

const User: React.FC = () => {
    // Mock user data
    const [user, setUser] = useState({
        name: "John Doe",
        id: "12345",
        dietaryRestrictions: ["Peanuts", "Dairy"],
    });

    const [newPassword, setNewPassword] = useState("");
    const [ingredient, setIngredient] = useState<string | null>(null);
    const [ingredientSuggestions] = useState([
        "Gluten",
        "Soy",
        "Shellfish",
        "Peanuts",
        "Eggs",
        "Milk",
        "Tree Nuts",
        "Fish",
    ]);

    const handlePasswordChange = () => {
        alert(`Password changed successfully!`);
        setNewPassword("");
    };

    const addDietaryRestriction = () => {
        if (ingredient && !user.dietaryRestrictions.includes(ingredient)) {
            setUser((prevUser) => ({
                ...prevUser,
                dietaryRestrictions: [
                    ...prevUser.dietaryRestrictions,
                    ingredient,
                ],
            }));
            setIngredient(null);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: "100%",
                margin: "20px auto",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: 3,
                backgroundColor: "#f9f9f9",
            }}
        >
            {/* User Info */}
            <Box mb={4}>
                <Typography variant="h6">User Profile</Typography>
                <Typography variant="body1">Name: {user.name}</Typography>
                <Typography variant="body1">ID: {user.id}</Typography>
            </Box>

            {/* Password Change */}
            <Box mb={4}>
                <Typography variant="h6" gutterBottom>
                    Change Password
                </Typography>
                <TextField
                    type="password"
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePasswordChange}
                    disabled={!newPassword}
                >
                    Update Password
                </Button>
            </Box>

            <Divider />

            {/* Dietary Restrictions */}
            <Box mt={4} mb={4}>
                <Typography variant="h6" gutterBottom>
                    Dietary Restrictions
                </Typography>
                <List>
                    {user.dietaryRestrictions.map((restriction, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={restriction} />
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Add Dietary Restriction */}
            <Box>
                <Typography variant="h6" gutterBottom>
                    Add Dietary Restriction
                </Typography>
                <Autocomplete
                    options={ingredientSuggestions}
                    value={ingredient}
                    onChange={(event, newValue) => setIngredient(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Ingredient"
                            variant="outlined"
                        />
                    )}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={addDietaryRestriction}
                    disabled={!ingredient}
                >
                    Add Restriction
                </Button>
            </Box>
        </Box>
    );
};

export default User;
