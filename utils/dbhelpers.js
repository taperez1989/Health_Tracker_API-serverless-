import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { client, TABLE_NAME } from "../utils/db.js";

export async function scanByType(typeValue) {
    const result = await client.send(
        new ScanCommand({
            TableName: TABLE_NAME,
            FilterExpression: "#t = :v",
            ExpressionAttributeNames: { "#t": "type" },
            ExpressionAttributeValues: { ":v": { S: typeValue } },
        })
    );

    return result.Items || [];
}