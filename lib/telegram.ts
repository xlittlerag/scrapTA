import { TelegramBot } from "https://deno.land/x/telegram_bot_api@0.4.0/mod.ts";

export class Bot {
  private bot: TelegramBot;

  constructor(token: string, private chat_id: string) {
    this.bot = new TelegramBot(token);
  }

  sendMessage(message: string): void {
    this.bot.sendMessage({
      chat_id: this.chat_id,
      text: message,
    });
  }
}
