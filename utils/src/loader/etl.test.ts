import * as etl from "./etl";

const goodConfigTests = (configMap: typeof configs.good) => {
  describe(`good configs`, () => {
    describe("readCsvDir", () => {
      test.skip("adds csv file names to store", async () => {
        expect(false).toBeTrue();
      });
    });

    for (const [testName, config] of configMap.entries()) {
      describe(`${testName}`, () => {
        describe("csvToTinkergraph", () => {
          test.skip("ETL: csv > tinkergraph", async () => {
            expect(false).toBeTrue();
          });
        });
      });
    }
  });
};

const badConfigTests = (configMap: typeof configs.bad) => {
  describe(`bad configs`, () => {
    describe("readCsvDir", () => {
      test.skip("invalid path to csv dir", async () => {
        expect(false).toBeTrue();
      });
    });

    for (const [testName, config] of configMap.entries()) {
      describe(`${testName}`, () => {});
    }
  });
};

describe("etl", () => {
  describe("getStore", () => {
    test.skip("default store", () => {
      expect(false).toBeTrue();
    });

    test.skip("overrides", () => {
      expect(false).toBeTrue();
    });
  });

  for (const [testType, configMap] of Object.entries(configs)) {
    switch (testType) {
      case "good": {
        goodConfigTests(configMap);
        break;
      }
      case "bad": {
        badConfigTests(configMap);
        break;
      }
      default:
        throw new Error(`${testType} not setup for etl.test.ts`);
    }
  }
});
