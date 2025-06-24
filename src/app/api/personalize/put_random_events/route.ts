import { type NextRequest, NextResponse } from "next/server";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { putEventsBulk } from "~/server/personalize";

const createContext = async (req: NextRequest) => {
    return createTRPCContext({
        headers: req.headers,
    });
};
// GENERATE 1000 random events
export async function POST(request: NextRequest) {
    try {
        const { userId, sessionId, eventType } = await request.json() as { userId: string, sessionId: string, eventType: string, itemId: string };
        console.log('body', userId, sessionId, eventType);

        const ctx = await createContext(request);
        const caller = createCaller(ctx);
        const destinations = await caller.destination.getAll();

        // Generate 1000 random events
        const events = Array.from({ length: 10 }, () => {
            const randomDestination = destinations[Math.floor(Math.random() * destinations.length)];
            return {
                eventType: eventType, // e.g., 'click', 'view', etc.
                itemId: randomDestination?.id ?? '', // Use the ID of a random destination
                sentAt: new Date(), // Current timestamp
            };
        });

        const res = await putEventsBulk(userId, sessionId, events);

        return NextResponse.json(res);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
        console.error(error);
        return NextResponse.error();
    }
}
