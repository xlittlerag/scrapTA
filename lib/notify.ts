import { Notification } from "https://deno.land/x/deno_notify@1.3.1/ts/mod.ts";

export interface INotifier {
  notify(message: string): boolean | Promise<boolean>;
}

export class PostNotifier implements INotifier {
  constructor(private post_endpoint: string) {}

  async notify(message: string): Promise<boolean> {
    const response = await fetch(
      this.post_endpoint,
      {
        method: "POST",
        body: message,
      },
    );
    console.log(response);

    return true;
  }
}

export class NativeNotifier implements INotifier {
  notify(message: string): boolean {
    new Notification({ linux: true, windows: true })
      .title("Ticket Alert")
      .body(message)
      .timeout(60000)
      .show();
    return true;
  }
}

export class ConsoleNotifier implements INotifier {
  notify(message: string): boolean {
    console.log(message);
    return true;
  }
}
