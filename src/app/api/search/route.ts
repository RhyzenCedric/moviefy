import { NextResponse } from "next/server";
import type { iTunesSong } from "../../../../.next/dev/types/itunes";

interface iTunesSearchResponse {
    resultCount: number;
    results: iTunesSong[];
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json(
            { error: "Query parameter is required." },
            { status: 400 }
        );
    }

    try {
        const res = await fetch(
            `https://itunes.apple.com/search?term=${encodeURIComponent(
                query
            )}&entity=song&limit=25`
        );
        console.log("query:", query);
        if (!res.ok) {
            throw new Error("iTunes API failed");
        
        }
        const data: iTunesSearchResponse = await res.json();
        return NextResponse.json(data.results);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch iTunes data." },
            { status: 500 }
        );
    }
}