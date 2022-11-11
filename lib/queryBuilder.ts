// MDQ-BA:
// - 2022/11/23

import { Day, Input, Query } from "./types.ts";

export default function buildQueries(inputs: Input[]): Query[] {
  return inputs.map(buildQueriesForTrain).flat(1);
}

function buildQueriesForTrain(input: Input): Query[] {
  const searchAndWanted = optimizeSearch(input.dates);

  return searchAndWanted.map((saw) => (
    {
      from: getFromTrain(input.train, Train.From),
      to: getFromTrain(input.train, Train.To),
      searchDate: saw.search,
      wantedDays: saw.wanted,
    }
  ));
}

function getFromTrain(train: string, idx: Train): string {
  return train.split("-")[idx];
}

function optimizeSearch(dates: string[]): { search: string; wanted: Day[] }[] {
  const sortedDates: Date[] = dates.sort().map((d) => new Date(d));
  const searchAndWanted = [];
  let index = 0;
  let pack: Date[] = [];
  for (let i = 0; i <= sortedDates.length; i++) {
    if (
      i === sortedDates.length ||
      pack.length > 0 &&
        sortedDates[i].getTime() - pack[0].getTime() > 518400000
    ) {
      const middle = new Date(
        pack[0].getTime() +
          (pack[pack.length - 1].getTime() - pack[pack.length - 1].getTime()) /
            2,
      );
      searchAndWanted[index++] = {
        search: middle?.toISOString().substring(0, 10).split("-").reverse()
          .join("/"),
        wanted: pack.map((date: Date) => ({
          day: ("0" + date?.getDate()).slice(-2),
          month: (date.getMonth() + 1).toString(),
          year: date.getFullYear().toString(),
        })),
      };
      pack = [];
    }
    if (i < sortedDates.length) pack.push(sortedDates[i]);
  }

  return searchAndWanted;
}

enum Train {
  From = 0,
  To = 1,
}
