import { invariantBrand } from "type-fest/source/invariant-of";
import * as common from "./common";

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
