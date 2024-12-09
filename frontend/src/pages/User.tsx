import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
    Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

const User: React.FC = () => {
    const [user, setUser] = useState({
        name: "John Doe",
        id: "12345",
        dietaryRestrictions: ["loading"],
    });

    const [newPassword, setNewPassword] = useState("");
    const [ingredient, setIngredient] = useState<string | null>(null);
    const [ingredientSuggestions, setIngredientSuggestions] = useState<
        string[]
    >([]);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        fetch("http://localhost:3007/api/user/getRestrictionsByUserName", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setUser({
                    name: "John Doe",
                    id: "12345",
                    dietaryRestrictions:
                        data === undefined
                            ? []
                            : data.map(
                                  (x: { ingredient_name: string }) =>
                                      x.ingredient_name
                              ),
                });
            });
    }, []);

    const handlePasswordChange = () => {
        alert(`Password changed successfully!`);
        setNewPassword("");
    };

    const addDietaryRestriction = () => {
        if (
            ingredient &&
            (user.dietaryRestrictions.length == 0 ||
                !user.dietaryRestrictions.includes(ingredient))
        ) {
            fetch("http://localhost:3007/api/user/addUserRestriction", {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ingredient_name: ingredient,
                }),
            }).then((response) => {
                if (response.ok) {
                    setUser((prevUser) => ({
                        ...prevUser,
                        dietaryRestrictions: [
                            ...prevUser.dietaryRestrictions,
                            ingredient,
                        ],
                    }));
                    setIngredient(null);
                }
            });
        }
    };

    const removeDietaryRestriction = (restriction: string) => {
        fetch("http://localhost:3007/api/user/deleteUserRestriction", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ingredient_name: restriction,
            }),
        }).then((response) => {
            if (response.ok) {
                setUser({
                    ...user,
                    dietaryRestrictions: user.dietaryRestrictions.filter(
                        (item) => item !== restriction
                    ),
                });
            }
        });
    };

    const fetchIngredientSuggestions = useCallback((text: string) => {
        if (!text.trim()) return;

        fetch("http://localhost:3007/api/user/getIngredientNames", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ingredientString: text,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setIngredientSuggestions(
                    data.map(
                        (x: { ingredient_name: string }) => x.ingredient_name
                    ) || []
                );
            })
            .catch((error) => {
                console.error("Error fetching ingredient suggestions:", error);
            });
    }, []);

    const handleInputChange = (
        event: React.ChangeEvent<unknown>,
        newValue: string
    ) => {
        setInputValue(newValue);

        if (debounceTimeout) clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(() => {
            fetchIngredientSuggestions(newValue);
        }, 300); // Adjust delay as needed
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
                <Typography variant="h6">User Info</Typography>
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
                    {user.dietaryRestrictions &&
                        user.dietaryRestrictions.map((restriction, index) => (
                            <ListItem
                                key={index}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() =>
                                            removeDietaryRestriction(
                                                restriction
                                            )
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
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
                    inputValue={inputValue}
                    onInputChange={handleInputChange}
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
