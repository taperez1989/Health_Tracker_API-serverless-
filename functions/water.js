import { PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { client, TABLE_NAME } from "../utils/db.js";


export async function addWater(event) {

    let payload;

    if (typeof event.body === "string") {
        payload = JSON.parse(event.body);
    } else if (typeof event.body === "object" && event.body !== null) { payload = event.body; }
    else {
        payload = {};
    }

    const { amount, unit } = payload;

    if (typeof amount !== "number" ||
        amount < 0 || typeof unit !== "string" ||
        unit.trim().length === 0
    ) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "invalid water input" })
        };
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const timestamp = new Date().toISOString();

    const item = {
        TableName: TABLE_NAME,
        Item: {
            id: { S: id },
            type: { S: "water" },
            amount: { N: amount.toString() },
            unit: { S: unit },
            timestamp: { S: timestamp },
        },
    };
    await client.send(new PutItemCommand(item));

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "water saved",
            id,
            timestamp,
        }),
    };
}


export async function getWater(event) {
    try {
        const result = await client.send(
            new ScanCommand({
                TableName: TABLE_NAME,
            })
        );

        const water = (result.Items || []).map((item) => ({
            id: item.id?.S,
            type: item.type?.S,
            amount: item.amount?.N ? Number(item.amount.N) : null,
            unit: item.unit?.S,
            timestamp: item.timestamp?.S,
        }));

        return {
            statusCode: 200, body: JSON.stringify({ water }),
        };
    } catch (err) {
        console.error("getWater", err)
        return {
            statusCode: 500,
            body: JSON.stringify({error: "Internal server error"}),
        }
    };
}