import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../keystatic.config";
import { adminEnabled } from "@/lib/admin";

const handlers = makeRouteHandler({ config });

const disabled = async () => new Response("Not found", { status: 404 });

export const GET: typeof handlers.GET = (req) => (adminEnabled() ? handlers.GET(req) : disabled());
export const POST: typeof handlers.POST = (req) => (adminEnabled() ? handlers.POST(req) : disabled());
