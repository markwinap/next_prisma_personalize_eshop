import { type NextRequest, NextResponse } from "next/server";
import { putUser } from "~/server/personalize";

export async function POST(request: NextRequest) {
    try {

        // get sessionId from request body
        const { userId, country } = await request.json() as { userId: string; country: string };
        console.log('body', userId, country);
        
        const res = await putUser(userId, country);

        return NextResponse.json(res);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
        console.error(error);
        return NextResponse.error();
    }
}
// METHOD: POST
// PATH: http://localhost:3000/api/personalize/put_user
// BODY:
// {
//     "userId": "cmc8i4mtt00000c0wr9gl2h4u",
//     "country": "MX"
// }