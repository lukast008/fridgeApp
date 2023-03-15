import {initClient} from "./config";
import ClientUtils from "./clientUtils";

let clientUtils: ClientUtils;

describe('Add product', () => {

  beforeAll(async () => clientUtils = await initClient());
  afterAll(async () => {
    //await client.deleteSession();
  });

  it('should add default product', async function() {
    await clientUtils.click("~products-screen-add-button");
    await clientUtils.setValue("~add-product-screen-name-input", "Pomidor");
    await clientUtils.click("~add-product-screen-save-button");
  });
});
