#!/bin/env -S deno run -A --unstable
import {
  ConsoleNotifier,
  INotifier,
  NativeNotifier,
  PostNotifier,
} from "../lib/notify.ts";
import { checkAvailableTickets } from "../lib/scraping.ts";
import { Query, TicketStatus } from "../lib/types.ts";
import { citiesMap } from "../lib/utils.ts";
import input from "../input.json" assert { type: "json" };
import buildQueries from "../lib/queryBuilder.ts";

const POST_URL = Deno.env.get("POST_URL");
if (!(POST_URL)) {
  console.info(
    "[Info] No POST endpoint provided. Falling back to console logging and system notifier",
  );
}
const notifiers: INotifier[] = [
  new ConsoleNotifier(),
  new NativeNotifier(),
  new PostNotifier(POST_URL),
];

const queries: Query[] = buildQueries(input);

(await Promise.all(queries.map(processQuery))).every((response: boolean) =>
  response == true
) ||
  console.log("[Info] No tickets found");

async function processQuery(q: Query): Promise<boolean> {
  const ticketStatus: TicketStatus = await checkAvailableTickets(
    citiesMap.getCityCode(q.from),
    citiesMap.getCityCode(q.to),
    q.searchDate,
    q.wantedDays,
  );
  if (ticketStatus.availableTickets.length != 0) {
    notifiers.forEach(async (notifier) =>
      await notifier.notify(
        `${citiesMap.getCityName(ticketStatus.fromCity)} a ${
          citiesMap.getCityName(ticketStatus.toCity)
        }: ${ticketStatus.availableTickets}`,
      )
    );
    return true;
  } else return false;
}
