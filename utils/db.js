import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const client = new DynamoDBClient({ region: "us-east-1" });
export const TABLE_NAME = "HealthTracker";
