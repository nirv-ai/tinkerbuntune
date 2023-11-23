/**
 * this file only tests modifications made to common
 */

import * as common from "#utils/groovy/common";

describe("common", () => {
  describe("go", () => {
    test.skip("EDir.in", () => {
      expect(false).toBeTrue();
    });
    test.skip("EDir.out", () => {
      expect(false).toBeTrue();
    });
    test("invalid direction", () => {
      const invalidDirection = "to the moon";
      // @ts-expect-error not an edir
      expect(() => common.go(invalidDirection)).toThrow(invalidDirection);
    });
  });
});
