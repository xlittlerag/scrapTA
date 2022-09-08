#!/bin/env -S deno run --allow-net --allow-env
import { checkAvailableTickets } from "../lib/scraping.ts";
import { Bot } from "../lib/telegram.ts";
import { Query, TicketStatus } from "../lib/types.ts";
import { citiesMap, emptyFilterDebug } from "../lib/utils.ts";
import json_queries from "../queries.json" assert { type: "json" };

const TOKEN = Deno.env.get("TOKEN");
const CHAT = Deno.env.get("CHAT");
if (!(TOKEN && CHAT)) throw new Error("Bot token or chat id is not provided");
const bot = new Bot(TOKEN, CHAT);

const queries: Query[] = json_queries;

(await Promise.all(
  queries.map(async (q: Query): Promise<TicketStatus> =>
    await checkAvailableTickets(
      citiesMap.getCityCode(q.from),
      citiesMap.getCityCode(q.to),
      q.searchDate,
      q.wantedDays,
    )
  ),
)).filter(emptyFilterDebug)
  .forEach((ticketStatus) =>
    bot.sendMessage(
      `${citiesMap.getCityName(ticketStatus.fromCity)} a ${
        citiesMap.getCityName(ticketStatus.toCity)
      }: ${ticketStatus.availableTickets}`,
    )
  );
