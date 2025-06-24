import { type NextRequest, NextResponse } from "next/server";
import { putItems } from "~/server/personalize";

export async function POST(request: NextRequest) {
    try {

        // get sessionId from request body
        const {
            id, // userId
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
            voyageStartDate, // timestamp in milliseconds
            voyageEndDate, // timestamp in milliseconds
        } = await request.json() as {
            id: string;
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
        };
        console.log('body', id, // userId
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
            voyageStartDate, // timestamp in milliseconds
            voyageEndDate
        );

        const res = await putItems(id, {
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
            voyageEndDate,
        });

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