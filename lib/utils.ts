import { TicketStatus } from "./types.ts";

const cityCodes: Record<string, number> = {
  "BA": 481,
  "MDQ": 255,
};

class TwoWayMap {
  private reverseMap: Record<number, string>;

  constructor(private map: Record<string, number>) {
    this.map = map;
    this.reverseMap = {};

    for (const key in map) {
      this.reverseMap[map[key]] = key;
    }
  }
  getCityCode(cityName: string) {
    return this.map[cityName];
  }
  getCityName(cityCode: number) {
    return this.reverseMap[cityCode];
  }
}

export const citiesMap: TwoWayMap = new TwoWayMap(cityCodes);

export function emptyFilterDebug(response: TicketStatus) {
  console.log(response);
  return response.availableTickets.length != 0;
}
