// import React, { useState } from "react";
// import {
//     Box,
//     Typography,
//     TextField,
//     Button,
//     List,
//     ListItem,
//     ListItemText,
//     Divider,
//     Autocomplete,
// } from "@mui/material";

// const User: React.FC = () => {
//     const [user, setUser] = useState({
//         name: "John Doe",
//         id: "12345",
//         dietaryRestrictions: ["loading"],
//     });

//     const [newPassword, setNewPassword] = useState("");
//     const [ingredient, setIngredient] = useState<string | null>(null);
//     const [ingredientSuggestions, setIngredientSuggestions] = useState([]);

//     const updateIngredientList = (text: string | null) => {
//         fetch("http://localhost:3007/api/user/getIngredientNames", {
//             credentials: "include",
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 ingredientString: text,
//             }),
//         }).then((response) => {
//             console.log(response);
//             // setIngredientSuggestions(response)
//         });
//     };

//     const handlePasswordChange = () => {
//         alert(`Password changed successfully!`);
//         setNewPassword("");
//     };

//     const addDietaryRestriction = () => {
//         if (ingredient && !user.dietaryRestrictions.includes(ingredient)) {
//             setUser((prevUser) => ({
//                 ...prevUser,
//                 dietaryRestrictions: [
//                     ...prevUser.dietaryRestrictions,
//                     ingredient,
//                 ],
//             }));
//             setIngredient(null);
//         }
//     };

//     return (
//         <Box
//             sx={{
//                 maxWidth: "100%",
//                 margin: "20px auto",
//                 padding: "20px",
//                 borderRadius: "8px",
//                 boxShadow: 3,
//                 backgroundColor: "#f9f9f9",
//             }}
//         >
//             {/* User Info */}
//             <Box mb={4}>
//                 <Typography variant="h6">User Profile</Typography>
//                 <Typography variant="body1">Name: {user.name}</Typography>
//                 <Typography variant="body1">ID: {user.id}</Typography>
//             </Box>

//             {/* Password Change */}
//             <Box mb={4}>
//                 <Typography variant="h6" gutterBottom>
//                     Change Password
//                 </Typography>
//                 <TextField
//                     type="password"
//                     label="New Password"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     fullWidth
//                     margin="normal"
//                 />
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={handlePasswordChange}
//                     disabled={!newPassword}
//                 >
//                     Update Password
//                 </Button>
//             </Box>

//             <Divider />

//             {/* Dietary Restrictions */}
//             <Box mt={4} mb={4}>
//                 <Typography variant="h6" gutterBottom>
//                     Dietary Restrictions
//                 </Typography>
//                 <List>
//                     {user.dietaryRestrictions.map((restriction, index) => (
//                         <ListItem key={index}>
//                             <ListItemText primary={restriction} />
//                         </ListItem>
//                     ))}
//                 </List>
//             </Box>

//             {/* Add Dietary Restriction */}
//             <Box>
//                 <Typography variant="h6" gutterBottom>
//                     Add Dietary Restriction
//                 </Typography>
//                 <Autocomplete
//                     options={ingredientSuggestions}
//                     value={ingredient}
//                     onInputChange={(event, newValue)=> {updateIngredientList(newValue)};}
//                     onChange={(event, newValue) => {
//                         setIngredient(newValue);
//                     }}
//                     renderInput={(params) => (
//                         <TextField
//                             {...params}
//                             label="Ingredient"
//                             variant="outlined"
//                         />
//                     )}
//                     fullWidth
//                     sx={{ marginBottom: 2 }}
//                 />
//                 <Button
//                     variant="contained"
//                     color="secondary"
//                     onClick={addDietaryRestriction}
//                     disabled={!ingredient}
//                 >
//                     Add Restriction
//                 </Button>
//             </Box>
//         </Box>
//     );
// };

// export default User;

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
        dietaryRestrictions: ["loading"],
    });

    const [newPassword, setNewPassword] = useState("");
    const [ingredient, setIngredient] = useState<string | null>(null);
    const [ingredientSuggestions, setIngredientSuggestions] = useState<
        string[]
    >([]);

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

    const fetchIngredientSuggestions = (text: string) => {
        if (!text.trim()) return; // Avoid unnecessary API calls for empty input

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
                    data.map((x) => x.ingredient_name) || []
                ); // Update suggestions with API response
            })
            .catch((error) => {
                console.error("Error fetching ingredient suggestions:", error);
            });
    };

    return (
        <Box
            sx={{
                maxWidth: "600px",
                margin: "20px auto",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: 3,
                backgroundColor: "#f9f9f9",
            }}
        >
            <Typography variant="h4" gutterBottom>
                User Portal
            </Typography>

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
                    onInputChange={(event, newValue) =>
                        fetchIngredientSuggestions(newValue)
                    }
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
