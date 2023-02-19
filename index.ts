import { webhookCallback } from "https://deno.land/x/grammy@v1.9.2/mod.ts";
import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { bot } from "./bot.ts";
import { appConfig } from "./configs/appConfig.ts";

const handleUpdate = webhookCallback(bot, "std/http");

serve({
    ["/" + appConfig.botApiKey]: async (req) => {
        if (req.method == "POST") {
            try {
                return await handleUpdate(req);
            } catch (err) {
                console.error(err);
            }
        }
        return new Response();
    }
});
