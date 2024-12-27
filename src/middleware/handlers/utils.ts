import { NextRequest, NextResponse } from "next/server";

export const redirectTo = (request: NextRequest, redirectToPath: string) => {
    const url = request.nextUrl.clone();
    url.pathname = redirectToPath;
    return NextResponse.redirect(url);
};
