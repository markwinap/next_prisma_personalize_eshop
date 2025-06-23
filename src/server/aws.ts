import {
    PersonalizeRuntimeClient,
    GetActionRecommendationsCommand,
    GetRecommendationsCommand
} from "@aws-sdk/client-personalize-runtime";
import {
    PersonalizeEventsClient,
    PutEventsCommand
} from "@aws-sdk/client-personalize-events";
import { env } from "~/env";

const client = new PersonalizeRuntimeClient({
    region: env.AWS_REGION as string,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY as string,
    },
});

const eventsClient = new PersonalizeEventsClient({
    region: env.AWS_REGION as string,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY as string,
    },
});

const getActionRecommendation = async (userId: string, itemId: string) => {
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

const getRecommendations = async (userId: string, itemId: string) => {
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
        campaignArn: process.env.PERSONALIZE_CAMPAIGN_ARN,
        userId,
        itemId,
        numResults: 10, // Adjust the number of results as needed
    });
    try {
        const response = await client.send(command);
        return response;
    } catch (error) {
        console.error("Error getting recommendations:", error);
        throw error;
    }
}

const putEvents = async (userId: string, itemId: string, eventType: string) => {


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
        trackingId: process.env.PERSONALIZE_TRACKING_ID,
        userId,
        sessionId: "session-id", // You can generate a unique session ID for each user session
        eventList: [
            {
                eventType,
                properties: JSON.stringify({ itemId }),
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

export {
    getActionRecommendation,
    getRecommendations,
    putEvents
};