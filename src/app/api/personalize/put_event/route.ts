import { type NextRequest, NextResponse } from "next/server";
import { putEvents } from "~/server/personalize";

export async function POST(request: NextRequest) {
    try {

        // get sessionId from request body
        const { userId, sessionId, eventType, itemId } = await request.json() as { userId: string, sessionId: string, eventType: string, itemId: string };
        console.log('body', userId, sessionId, eventType, itemId);
        // userId: string, sessionId: string, eventType: string, itemId: string
        const res = await putEvents(userId, sessionId, eventType, itemId);

        return NextResponse.json(res);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
        console.error(error);
        return NextResponse.error();
    }
}
// METHOD: POST
// PATH: http://localhost:3000/api/personalize/put_event
// BODY:
// {
//     "userId": "cmc8i4mtt00000c0wr9gl2h4u",
//     "country": "MX"
// }