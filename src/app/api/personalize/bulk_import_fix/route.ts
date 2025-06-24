import { type NextRequest, NextResponse } from "next/server";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { putItemsBulk } from "~/server/personalize";

interface DestinationProps {
    id: string
    voyageId: string
    voyageName: string
    yachtId: string
    yachtName: string
    voyageType: string
    voyageRegion: string
    voyageStartDate: string
    voyageStartDOW: string
    voyageEndDate: string
    voyageEndDOW: string
    voyageEmbarkPort: string
    voyageEmbarkPortCode: string
    voyageDisembarkPort: string
    voyageDisembarkPortCode: string
    embarkationCountry: string
    disEmbarkationCountry: string
    nights: number
    startingPrice: number
    ports: string[]
    portCodes: string[]
    voyageRegionExpansion: string
    suiteAvailability: number
    portData: PortDaum[]
    voyageUrlPath: string
    departureYearMonth: string
    portFeeMap: PortFeeMap
    startingPriceMap: StartingPriceMap
}

interface PortDaum {
    portCode: string
    portName: string
    portDate?: string
    sequenceNo: number
    countryName?: string
}

interface PortFeeMap {
    AUD: number
    GBP: number
    USM: number
    EUR: number
    USD: number
}

interface StartingPriceMap {
    AUD: number
    GBP: number
    USM: number
    EUR: number
    USD: number
}


const createContext = async (req: NextRequest) => {
    return createTRPCContext({
        headers: req.headers,
    });
};

export async function POST(request: NextRequest) {
    try {

        // get sessionId from request body
        const { data } = await request.json() as { data: DestinationProps[] };

        const ctx = await createContext(request);
        const caller = createCaller(ctx);

        const bulkImport = data.map((destination) => ({
            name: destination.voyageName,
            voyageType: destination.voyageType,
            voyageRegion: destination.voyageRegion,
            voyageStartDate: new Date(destination.voyageStartDate),
            voyageEndDate: new Date(destination.voyageEndDate),
            voyageEmbarkPort: destination.voyageEmbarkPort,
            voyageDisembarkPort: destination.voyageDisembarkPort,
            embarkationCountry: destination.embarkationCountry,
            disEmbarkationCountry: destination.disEmbarkationCountry,
            nights: destination.nights,
            startingPrice: destination.startingPrice,
            ports: destination.ports,
            yatchId: destination.yachtId,
        }));

        const destinations = await caller.destination.bulkCreate(bulkImport);

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