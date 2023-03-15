import {remote} from 'webdriverio';
import ClientUtils from "./clientUtils";
const path = require('path');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

const opts = {
  path: '/wd/hub/',
  port: 4723,
  capabilities: {
    platformName: 'Android',
    deviceName: 'emulator-5554',
    app: path.resolve('android\\app\\build\\outputs\\apk\\debug\\app-debug.apk'),
    automationName: 'UiAutomator2',
  },
};

export const initClient = async () => {
  const client = await remote(opts);
  await client.pause(3000);
  const pack = await client.getCurrentPackage();
  const activity = await client.getCurrentActivity();
  await client.closeApp();
  await client.startActivity(pack, activity); //Reload to force update
  await client.pause(3000);
  return new ClientUtils(client);
}
