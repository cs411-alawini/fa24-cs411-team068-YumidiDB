import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
// import { useNavigate } from "react-router-dom";
// import axios from 'axios';

interface CustomizedRecipe {
    customized_id: number;
    user_id: number;
    recipe_id: number;
    name: string;
    minutes: number;
    description: string;
    steps: string;
    fat: number;
    calories: number;
    protein: number;
}

const Collection: React.FC = () => {
    const [recipes, setRecipes] = useState<CustomizedRecipe[]>([]);
    const [selectedRecipe, setSelectedRecipe] =
        useState<CustomizedRecipe | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const userId = 1; // Replace with actual user ID
    // const navigate = useNavigate();

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            // const response = await axios.get(
            //     `/api/customized-recipes?userId=${userId}`
            // );
            // setRecipes(response.data);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    };

    const handleDelete = async (customized_id: number) => {
        try {
            // await axios.delete(`/api/customized-recipes/${customized_id}`);
            // setRecipes((prev) =>
            //     prev.filter((recipe) => recipe.customized_id !== customized_id)
            // );
            console.log(customized_id);
        } catch (error) {
            console.error("Error deleting recipe:", error);
        }
    };

    const handleEdit = (recipe: CustomizedRecipe) => {
        setSelectedRecipe(recipe);
        setIsDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (selectedRecipe) {
            try {
                // await axios.put(
                //     `/api/customized-recipes/${selectedRecipe.customized_id}`,
                //     selectedRecipe
                // );
                // setIsDialogOpen(false);
                // fetchRecipes();
            } catch (error) {
                console.error("Error updating recipe:", error);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedRecipe) {
            setSelectedRecipe({
                ...selectedRecipe,
                [e.target.name]: e.target.value,
            });
        }
    };

    return (
        <Container>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Minutes</TableCell>
                            <TableCell>Calories</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {recipes.map((recipe) => (
                            <TableRow key={recipe.customized_id}>
                                <TableCell>{recipe.name}</TableCell>
                                <TableCell>{recipe.minutes}</TableCell>
                                <TableCell>{recipe.calories}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEdit(recipe)}>
                                        Edit
                                    </Button>
                                    <IconButton
                                        onClick={() =>
                                            handleDelete(recipe.customized_id)
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>Edit Recipe</DialogTitle>
                <DialogContent>
                    {selectedRecipe && (
                        <>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Name"
                                name="name"
                                value={selectedRecipe.name}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Minutes"
                                name="minutes"
                                type="number"
                                value={selectedRecipe.minutes}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Calories"
                                name="calories"
                                type="number"
                                value={selectedRecipe.calories}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Description"
                                name="description"
                                multiline
                                rows={4}
                                value={selectedRecipe.description}
                                onChange={handleInputChange}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleUpdate}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Collection;
