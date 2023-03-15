import {Browser} from "webdriverio";

class ClientUtils {
  client: Browser<"async">;
  constructor(client: Browser<"async">) {
    this.client = client;
  }

  wait = (s: number) => this.client.pause(s * 1000);

  click = async (locator: string) => {
    const element = await this.client.$(locator);
    await element.waitForDisplayed();
    await element.waitForEnabled();
    element.click();
  }

  setValue = async (locator: string, value: string) => {
    const element = await this.client.$(locator);
    await element.waitForDisplayed();
    element.setValue(value);
  }
}

export default ClientUtils;
