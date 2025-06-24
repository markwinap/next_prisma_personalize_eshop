import {
    PersonalizeRuntimeClient,
    GetActionRecommendationsCommand,
    GetRecommendationsCommand
} from "@aws-sdk/client-personalize-runtime";
import {
    PersonalizeEventsClient,
    PutEventsCommand,
    PutUsersCommand,
    PutItemsCommand,
} from "@aws-sdk/client-personalize-events";
import { env } from "~/env";


interface ItemProps {
    name: string;
    categoryL1: string;
    categoryL2: string;
    categoryL3: string;
    categoryL4: string;
    categoryL5: string;
    categoryL6: string;
    categoryL7: string;
    voyageNights: number;
    price: number;
    voyageStartDate: number; // timestamp in milliseconds
    voyageEndDate: number; // timestamp in milliseconds
}


const client = new PersonalizeRuntimeClient({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});

const eventsClient = new PersonalizeEventsClient({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});

const getActionRecommendation = async (userId: string) => {
    const command = new GetActionRecommendationsCommand({
        campaignArn: process.env.PERSONALIZE_CAMPAIGN_ARN,
        userId,
    });

    try {
        const response = await client.send(command);
        return response;
    } catch (error) {
        console.error("Error getting action recommendations:", error);
        throw error;
    }
}

const getRecommendationsMostViewed = async (userId: string, yatchId: string) => {
    // const getRecommendationsParam = {
    //   campaignArn: "CAMPAIGN_ARN" /* required */,
    //   userId: "USER_ID" /* required */,
    //   numResults: 15 /* optional */,
    //   filterArn: "FILTER_ARN" /* required to filter recommendations */,
    //   filterValues: {
    //     PROPERTY:
    //       '"VALUE"' /* Only required if your filter has a placeholder parameter */,
    //   },
    // };

    const command = new GetRecommendationsCommand({
        recommenderArn: env.AWS_PERSONALIZE_RECOMENDER_MOST_VIEWED_ARN,
        filterArn: env.AWS_PERSONALIZE_FILTER_ARN,
        filterValues: {
            PARAMETER: `\"${yatchId}\"`, // Replace with the actual parameter name and value
        },
        userId,
        // itemId,
        numResults: 4, // Adjust the number of results as needed
    });
    try {
        const response = await client.send(command);
        return response;
    } catch (error) {
        console.error("Error getting recommendations:", error);
        throw error;
    }
}
const getRecommendationsRecommendedYou = async (userId: string, yatchId: string) => {
    const command = new GetRecommendationsCommand({
        recommenderArn: env.AWS_PERSONALIZE_RECOMENDER_FOR_YOU_ARN,
        filterArn: env.AWS_PERSONALIZE_FILTER_ARN,
        filterValues: {
            PARAMETER: `\"${yatchId}\"`, // Replace with the actual parameter name and value
        },
        userId,
        // itemId,
        numResults: 4, // Adjust the number of results as needed
    });
    try {
        const response = await client.send(command);
        return response;
    } catch (error) {
        console.error("Error getting recommendations:", error);
        throw error;
    }
}

const putEvents = async (userId: string, sessionId: string, eventType: string, itemId: string) => {
    // const input = {
    //   trackingId: trackingId, // e.g., "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    //   userId: userId,
    //   sessionId: sessionId,
    //   eventList: [
    //     {
    //       eventType: 'click',
    //       sentAt: new Date(),
    //       itemId: itemId,
    //       properties: JSON.stringify({
    //         page: 'product_page',
    //         action: 'view',
    //       }),
    //     },
    //   ],
    // };

    const command = new PutEventsCommand({
        trackingId: env.AWS_PERSONALIZE_TRACKING_ID,
        userId,
        sessionId, // You can generate a unique session ID for each user session
        eventList: [
            {
                eventType, // or 'view', 'purchase', etc.
                itemId, // The ID of the item being interacted with
                sentAt: new Date(),
            },
        ],
    });

    try {
        const response = await eventsClient.send(command);
        return response;
    } catch (error) {
        console.error("Error putting events:", error);
        throw error;
    }
}
const putEventsBulk = async ( userId: string, sessionId: string, events: {eventType: string, itemId: string }[]) => {
    const chunkSize = 10; // Personalize allows a maximum of 10 events per request
    const responses = [];
    for (let i = 0; i < events.length; i += chunkSize) {
        const chunk = events.slice(i, i + chunkSize);

        const command = new PutEventsCommand({
            trackingId: env.AWS_PERSONALIZE_TRACKING_ID,
            userId,
            sessionId, // Use the sessionId from the first event in the chunk
            eventList: chunk.map(event => ({
                eventType: event.eventType,
                itemId: event.itemId,
                sentAt: new Date(),
            })),
        });
        try {
            const response = await eventsClient.send(command);
            responses.push(response);
        } catch (error) {
            console.error("Error putting events in bulk:", error);
            throw error;
        }
    }
    return responses;
}
const putItems = async (itemId: string, data: ItemProps) => {
    const {
        name,
        categoryL1,
        categoryL2,
        categoryL3,
        categoryL4,
        categoryL5,
        categoryL6,
        categoryL7,
        voyageNights,
        price,
        voyageStartDate,
        voyageEndDate
    } = data;
    const command = new PutItemsCommand({
        datasetArn: env.AWS_PERSONALIZE_DATASET_ITEM_ARN,
        items: [
            {
                itemId,
                properties: JSON.stringify({
                    name,
                    categoryL1,
                    categoryL2,
                    categoryL3,
                    categoryL4,
                    categoryL5,
                    categoryL6,
                    categoryL7,
                    voyageNights,
                    price,
                    voyageStartDate,
                    voyageEndDate
                }),
            },
        ],
    });
    try {
        const response = await eventsClient.send(command);
        return response;
    } catch (error) {
        console.error("Error putting items:", error);
        throw error;
    }
}
const putItemsBulk = async (items: { itemId: string, properties: ItemProps }[]) => {
    const chunkSize = 10;
    const responses = [];
    for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        const command = new PutItemsCommand({
            datasetArn: env.AWS_PERSONALIZE_DATASET_ITEM_ARN,
            items: chunk.map(item => ({
                itemId: item.itemId,
                properties: JSON.stringify(item.properties),
            })),
        });
        try {
            const response = await eventsClient.send(command);
            responses.push(response);
        } catch (error) {
            console.error("Error putting items in bulk:", error);
            throw error;
        }
    }
    return responses;
}
const putUser = async (userId: string, country: string) => {
    const command = new PutUsersCommand({
        datasetArn: env.AWS_PERSONALIZE_DATASET_USER_ARN,
        users: [
            {
                userId: userId,
                properties: JSON.stringify({
                    //USER_ID: userId,
                    country: country,
                }),
            },
        ],
    });

    console.log('putUserItem', JSON.stringify(command));

    try {
        const response = await eventsClient.send(command);
        return response;
    } catch (error) {
        console.error("Error putting items:", error);
        throw error;
    }
}

export {
    getActionRecommendation,
    getRecommendationsMostViewed,
    getRecommendationsRecommendedYou,
    putEvents,
    putEventsBulk,
    putItems,
    putItemsBulk,
    putUser
};