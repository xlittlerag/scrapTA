export type Day = {
  day: string,
  month: string,
  year: string
}

export type Query = {
  from: string,
  to: string,
  searchDate: string,
  wantedDays: Day[]
}

export type TicketStatus = {
  fromCity: number,
  toCity: number,
  availableTickets: string[]
}
