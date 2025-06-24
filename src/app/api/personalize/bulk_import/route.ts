import { type NextRequest, NextResponse } from "next/server";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { putItemsBulk } from "~/server/personalize";

const createContext = async (req: NextRequest) => {
    return createTRPCContext({
        headers: req.headers,
    });
};

export async function POST(request: NextRequest) {
    try {
        const ctx = await createContext(request);
        const caller = createCaller(ctx);
        const destinations = await caller.destination.getAll();

        const items = destinations.map((destination) => ({
            itemId: destination.id,
            properties: {
                name: destination.name,
                categoryL1: destination.voyageType,
                categoryL2: destination.voyageRegion,
                categoryL3: destination.voyageEmbarkPort,
                categoryL4: destination.voyageDisembarkPort,
                categoryL5: destination.embarkationCountry,
                categoryL6: destination.disEmbarkationCountry,
                categoryL7: destination.yatchId,
                voyageNights: destination.nights,
                price: destination.startingPrice,
                voyageStartDate: new Date(destination.voyageStartDate).getTime(),// timestamp
                voyageEndDate: new Date(destination.voyageEndDate).getTime(),
            },
        }));

        const res = await putItemsBulk(items);
        
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