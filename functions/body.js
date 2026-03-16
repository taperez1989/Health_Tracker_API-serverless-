import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { client, TABLE_NAME } from "../utils/db.js";
import { scanByType } from "../utils/dbhelpers.js";



export async function addBody(event) {
    
    let payload;

    if (typeof event.body === "string") {
        payload = JSON.parse(event.body);
    } else if (typeof event.body === "object" && event.body !== null) {
        payload = event.body;
    } else {
        payload = {};
    }

    const { weight, chest, waist, arms, thighs, bodyFat } = payload;

    if (
        (weight !== undefined && (typeof weight !== "number" ||
        weight < 0 )) ||
        (chest !== undefined && (typeof chest !== "number" ||
        chest < 0)) ||
        (waist !== undefined && (typeof waist !== "number" ||
        waist < 0)) ||
        (arms !== undefined && (typeof arms !== "number" ||
        arms < 0)) ||
        (thighs !== undefined && (typeof thighs !== "number" ||
        thighs < 0)) ||
        (bodyFat !== undefined && (typeof bodyFat !== "number" ||
        bodyFat < 0))

    ) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid Measurements" })
        };
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const timestamp = new Date().toISOString();

    const item = {
        id: { S: id },
        type: { S: "body" },
        timestamp: { S: timestamp },
    };
    
    if (weight !== undefined) item.weight = { N: String(weight) };
    if (chest !== undefined) item.chest = { N: String(chest) };
    if (waist !== undefined) item.waist = { N: String(waist) };
    if (arms !== undefined) item.arms = { N: String(arms) };
    if (thighs !== undefined) item.thighs = { N: String(thighs) };
    if (bodyFat !== undefined) item.bodyFat = { N: String(bodyFat) };
    
    const params = {
        TableName: TABLE_NAME,
        Item: item
    };

    await client.send(new PutItemCommand(params));

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "measurements saved",
            id,
            timestamp,
        }),
    };
    
};

export async function getBody(event) {
    try {
        const items = await scanByType("body");

        const body = items.map((item) => ({
            id: item.id?.S,
            type: item.type?.S,
            weight: item.weight?.N ? Number(item.weight.N) : null,
            chest: item.chest?.N ? Number(item.chest.N) : null,
            waist: item.waist?.N ? Number(item.waist.N) : null,
            arms: item.arms?.N ? Number(item.arms.N) : null,
            thighs: item.thighs?.N ? Number(item.thighs.N) : null,
            bodyFat: item.bodyFat?.N ? Number(item.bodyFat.N) : null,
            timestamp: item.timestamp?.S,
        }))
        .sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));

        return {
            statusCode: 200,
            body: JSON.stringify({ body }),
        };
    } catch (err) {
        console.error("getBody", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }

}