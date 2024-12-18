## DDL for Table Creation

```
CREATE TABLE Recipes (
    recipe_id INT,
    name VARCHAR(255),
    minutes INT,
    description TEXT,
    steps TEXT,
    fat FLOAT,
    calories FLOAT,
    protein FLOAT,
    PRIMARY KEY(recipe_id)
);

CREATE TABLE Users (
    user_id INT,
    user_name VARCHAR(255),
    hashed_password VARCHAR(255),
    PRIMARY KEY(user_id)
);

CREATE TABLE Ingredients (
    ingredient_id INT,
    ingredient_name VARCHAR(255),
    PRIMARY KEY(ingredient_id)
);

CREATE TABLE CustomizedRecipes (
    customized_id INT,
    user_id INT NOT NULL,
    name VARCHAR(255),
    minutes INT,
    steps TEXT,
    description TEXT,
    fat FLOAT,
    calories FLOAT,
    PRIMARY KEY(customized_id),
    FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Reviews (
    review_id INT,
    recipe_id INT NOT NULL,
    review_content TEXT,
    rating INT,
    date DATE,
    PRIMARY KEY(review_id),
    FOREIGN KEY(recipe_id) REFERENCES Recipes(recipe_id) ON DELETE CASCADE
);

CREATE TABLE ingredient_portion (
    id INT,
    customized_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    ingredient_amount FLOAT,
    ingredient_unit VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY(customized_id) REFERENCES CustomizedRecipes(customized_id) ON DELETE CASCADE,
    FOREIGN KEY(ingredient_id) REFERENCES Ingredients(ingredient_id) ON DELETE CASCADE
);

CREATE TABLE user_restriction (
    id INT,
    user_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(ingredient_id) REFERENCES Ingredients(ingredient_id) ON DELETE CASCADE
);

CREATE TABLE recipe_ingredient (
    id INT,
    recipe_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(recipe_id) REFERENCES Recipes(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY(ingredient_id) REFERENCES Ingredients(ingredient_id) ON DELETE CASCADE
);
```
