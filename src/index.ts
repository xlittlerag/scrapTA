#!/bin/env -S deno run --allow-net --allow-env
import { ConsoleNotifier, PostNotifier } from "../lib/notify.ts";
import { checkAvailableTickets } from "../lib/scraping.ts";
import { Query, TicketStatus } from "../lib/types.ts";
import { citiesMap } from "../lib/utils.ts";
import json_queries from "../queries.json" assert { type: "json" };

const POST_URL = Deno.env.get("POST_URL");
if (!(POST_URL)) console.error("No POST endpoint provided. Falling back to console logging");
const notifier = POST_URL ? new PostNotifier(POST_URL) : new ConsoleNotifier();

const queries: Query[] = json_queries;

(await Promise.all(queries.map(processQuery))).every((response: boolean) => response == true)
|| console.log("No tickets found")

async function processQuery(q: Query): Promise<boolean> {
  const ticketStatus: TicketStatus = await checkAvailableTickets(
    citiesMap.getCityCode(q.from),
    citiesMap.getCityCode(q.to),
    q.searchDate,
    q.wantedDays,
  )
  if(ticketStatus.availableTickets.length != 0) {
    return await notifier.notify(
      `${citiesMap.getCityName(ticketStatus.fromCity)} a ${
        citiesMap.getCityName(ticketStatus.toCity)
      }: ${ticketStatus.availableTickets}`,
    )
  } else return false
}
