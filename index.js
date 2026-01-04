import { addMeal, getMeals } from "./functions/meals";

export const handler = async (event) => {
    try {
        const route = `${event.requestContext?.http?.method} ${event.rawPath}`;

        if (route === "POST /Meal") {
            return await addMeal(event);
        } 

        if (route === "GET /Meal") {
            return await getMeals(event);
        }

        return {
            statusCode: 404,
            body: JSON.stringify({ error: "not found" }),
        };
    } catch (err) {
        console.error("erouter error", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "internal server error" }),
        };
    }



};