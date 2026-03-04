import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { client, TABLE_NAME } from "../utils/db.js";
import { scanByType } from "../utils/dbhelpers.js";

export async function addMeal(event) {
// parse
    // if the payload is a string or an object it converts it so that it can be read otherwise it returns an empty object and error code
    let payload;

    if (typeof event.body === "string") {
        payload = JSON.parse(event.body);
    } else if (typeof event.body === "object" && event.body !== null) {
        payload = event.body;
    } else {
        payload = {};
    }

    const { name, calories } = payload;
// validate
    if (
        typeof calories !== "number" ||
        calories < 0 ||
        typeof name !== "string" ||
        name.trim().length === 0
    ) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid meal input" }),
        };
    }

    //creates timestamp and an id for each meal logged
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const timestamp = new Date().toISOString();


    //decontructs the params 
    const params = {
        TableName: TABLE_NAME,
        Item: {
            id: { S: id },
            type: { S: "meal"},
            name: { S: name },
            calories: { N: String(calories) },
            timestamp: { S: timestamp },
        },
    };

    await client.send(new PutItemCommand(params));

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "Meal saved",
            id,
            timestamp,
        }),
    };
}

export async function getMeals(event) {
    try {
        const items = await scanByType("meals");

        // convert DynamoDB attribute format -> plain JS
        const meals = items.map((item) => ({
            id: item.id?.S,
            type: item.type?.S,
            name: item.name?.S,
            calories: item.calories?.N ? Number(item.calories.N) : null,
            timestamp: item.timestamp?.S,
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ meals }),
        };
    } catch (err) {
        console.error("getMeals", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
}