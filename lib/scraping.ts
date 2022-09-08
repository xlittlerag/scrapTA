import { DOMParser } from "https://esm.sh/linkedom@0.14.12";
import { Day, TicketStatus } from "./types.ts";

export async function checkAvailableTickets(
  fromCity: number,
  toCity: number,
  searchDate: string,
  wantedDays: Day[],
): Promise<TicketStatus> {
  const response = await fetch(
    "https://webventas.sofse.gob.ar/calendario.php",
    {
      "headers": {
        "accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        "content-type": "application/x-www-form-urlencoded",
        "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="104"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
      },
      "referrer": "https://webventas.sofse.gob.ar/calendario.php",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body":
        `busqueda%5Btipo_viaje%5D=1&busqueda%5Borigen%5D=${fromCity}&busqueda%5Bdestino%5D=${toCity}&busqueda%5Bfecha_ida%5D=${searchDate}&busqueda%5Bfecha_vuelta%5D=&busqueda%5Bcantidad_pasajeros%5D%5Badulto%5D=1&busqueda%5Bcantidad_pasajeros%5D%5Bjubilado%5D=0&busqueda%5Bcantidad_pasajeros%5D%5Bmenor%5D=0&busqueda%5Bcantidad_pasajeros%5D%5Bbebe%5D=0`,
      "method": "POST",
      "mode": "cors",
      "credentials": "include",
    },
  );

  const dateToAttribute: Record<string, Date> = {};
  wantedDays.forEach((wd) =>
    dateToAttribute[`fecha_ida_${wd.day}_${wd.month}_${wd.year}`] = new Date(
      Date.UTC(+wd.year, +wd.month - 1, +wd.day + 1),
    )
  );

  const document = new DOMParser().parseFromString(
    await response.text(),
    "text/html",
  );
  const filteredDates = document.querySelectorAll(
    "div.web label.selector.active",
  )
    .map((ad) => ad.getAttribute("for"))
    .filter((add) => dateToAttribute[add] != undefined);

  return {
    fromCity,
    toCity,
    availableTickets: filteredDates.map((fd) => dateToAttribute[fd].toLocaleDateString()),
  }
}
