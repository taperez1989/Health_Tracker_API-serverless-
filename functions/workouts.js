import { PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { client, TABLE_NAME } from "../utils/db.js";
import { scanByType } from "../utils/dbhelpers.js";


export async function addWorkout(event) {

    let payload;

    if (typeof event.body === "string") {
        payload = JSON.parse(event.body);
    } else if (typeof event.body === "object" && event.body !== null) { payload = event.body; }
    else {
        payload = {};
    }

    const { exercise, sets, reps, weight } = payload;

    if (typeof weight !== "number" ||
        weight < 0 ||
        typeof sets !== "number" ||
        sets <= 0 ||
        typeof reps !== "number" ||
        reps <= 0 ||
        typeof exercise !== "string" ||
        exercise.trim().length === 0
    ) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "invalid workout input" })
        };
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const timestamp = new Date().toISOString();

    const item = {
        TableName: TABLE_NAME,
        Item: {
            id: { S: id },
            type: { S: "workout" },
            exercise: { S: "workout"},
            weight: { N: weight.toString() },
            sets: { N: sets.toString() },
            reps: { N: reps.toString() },
            timestamp: { S: timestamp },
        },
    };
    await client.send(new PutItemCommand(item));

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "workout saved",
            id,
            timestamp,
        }),
    };
}


export async function getWorkout(event) {
    try {
        const items = await scanByType("workout");

        const workout = items.map((item) => ({
            id: item.id?.S,
            type: item.type?.S,
            exercise: item.exercise?.S,
            weight: item.weight?.N ? Number(item.weight.N) : null,
            sets: item.sets?.N ? Number(item.sets.N) : null,
            reps: item.reps?.N ? Number(item.reps.N) : null,
            timestamp: item.timestamp?.S,
        }));

        return {
            statusCode: 200, body: JSON.stringify({ workout }),
        };
    } catch (err) {
        console.error("getWorkout", err)
        return {
            statusCode: 500,
            body: JSON.stringify({error: "Internal server error"}),
        }
    };
}