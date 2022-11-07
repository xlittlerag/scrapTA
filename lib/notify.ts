interface INotifier {
  notify(message: string): boolean|Promise<boolean>;
}

export class PostNotifier implements INotifier {
  constructor(private post_endpoint: string) {}

  async notify(message: string): Promise<boolean> {
    const response = await fetch(
      this.post_endpoint,
      {
        method: "POST",
        body: message
      }
    )
    console.log(response)

    return true;
  }
}

export class ConsoleNotifier implements INotifier {
  notify(message: string): boolean {
    console.log(message)
    return true;
  }
}
