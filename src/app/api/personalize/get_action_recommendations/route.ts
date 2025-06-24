import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { getRecommendations } from "~/server/personalize";

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
        const { sessionId, itemId, eventType } = await request.json() as { sessionId: string; itemId: string; eventType: string };
        console.log('body', sessionId, itemId, eventType);
        
        const res = await getRecommendations(userId, itemId);

        return NextResponse.json(res);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
        console.error(error);
        return NextResponse.error();
    }
}