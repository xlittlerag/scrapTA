import os from "https://deno.land/x/dos@v0.11.0/mod.ts";

export interface INotifier {
  notify(message: string): boolean | Promise<boolean>;
}

export class PostNotifier implements INotifier {
  constructor(private post_endpoint: string | undefined) {}

  async notify(message: string): Promise<boolean> {
    if (this.post_endpoint === undefined) return false;
    await fetch(
      this.post_endpoint,
      {
        method: "POST",
        body: message,
      },
    );
    return true;
  }
}

export class NativeNotifier implements INotifier {
  private cmds = {
    linux: [
      "notify-send",
      "-t",
      "60000",
      "Train Alert",
    ],
    windows: [],
    darwin: [],
  };
  notify(message: string): boolean {
    if (os.platform() !== "linux") return false;
    Deno.run({
      cmd: [
        ...this.cmds[os.platform()],
        message,
      ],
    });
    return true;
  }
}

export class ConsoleNotifier implements INotifier {
  notify(message: string): boolean {
    console.log(message);
    return true;
  }
}
