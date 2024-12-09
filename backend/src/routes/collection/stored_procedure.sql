-- diff of calory of most popular 10 and least popular 10 recipes
CREATE PROCEDURE COMPARE_INGREDIENT_USE(
    OUT diff INT

)
BEGIN

    DECLARE avg_calory_1 INT;
    DECLARE avg_calory_2 INT;

    SELECT AVG(calory) INTO avg_calory_1
    FROM Reviews NATURAL JOIN Recipes
    GROUP BY
        recipe_id
    ORDER BY
        AVG(rating) DESC
    LIMIT 10

    SELECT AVG(calory) INTO avg_calory_2
    FROM Reviews NATURAL JOIN Recipes
    GROUP BY
        recipe_id
    ORDER BY
        AVG(rating) ASC
    LIMIT 10

    SET diff = avg_calory_1 - avg_calory_2;

END;

CALL COMPARE_INGREDIENT_USE(@diff);
SELECT @diff;