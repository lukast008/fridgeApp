import UuidUtils from './../UuidUtils';

jest.mock('react-native-get-random-values', () => '');

describe("Test generateId", () => {
  it("should return different values in two calls", () => {
    const id1 = UuidUtils.generateId();
    const id2 = UuidUtils.generateId();
    expect(id1).not.toBe(id2);
  });
});
