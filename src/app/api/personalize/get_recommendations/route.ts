import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { getRecommendationsMostViewed, getRecommendationsRecommendedYou } from "~/server/personalize";

export async function POST(request: NextRequest) {
    const session = await auth();
    try {
        if (!session) {
            console.error('not authenticated');
            return NextResponse.error();
        }
        // Get userId from session
        console.log('session', session);
        const userId = session.user?.id;
        // get sessionId from request body
        const { yatchId } = await request.json() as { yatchId: string; };
        // console.log('body', sessionId, itemId, eventType);
        
        const mostViewed = await getRecommendationsMostViewed(userId,  yatchId);
        const forYou = await getRecommendationsRecommendedYou(userId, yatchId);

        const respomnse = {
            mostViewed,//Most viewed
            forYou,//For you
            // recommender// Customers who viewed X also viewed
        }

        return NextResponse.json(respomnse);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
        console.error(error);
        return NextResponse.error();
    }
}