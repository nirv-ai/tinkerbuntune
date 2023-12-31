// import * as etl from '#utils/loader/etl';

const goodConfigTests = (configMap: typeof configs.good) => {
  describe('good configs', () => {
    describe('readCsvDir', () => {
      test.skip('adds csv file names to store', () => {
        expect(false).toBeTrue()
      })
    })

    for (const [configName, config] of configMap.entries()) {
      describe(`${configName}`, () => {
        describe('csvToTinkergraph', () => {
          test.skip('ETL success', () => {
            expect(false).toBeTrue()
          })
        })

        describe('transformConfigFiles', () => {
          test.if((config.files?.size ?? 0) > 0)('config with files', () => {
            // should always save output to store
            // but if not recursive
            // ^ aso delete config.files from store
            // ^ also parse file
            expect(false).toBeTrue()
          })
        })

        describe('transformUnmappedFiles', () => {
          test.skip('deletes unmapped file from store', () => {
            expect(false).toBeTrue()
          })
          test.skip('parses file', () => {
            expect(false).toBeTrue()
          })

          test.skip('saves file to store', () => {
            expect(false).toBeTrue()
          })
        })

        describe('loadTinkerData', () => {
          test.skip('pushes transformed files into tinkergraph', () => {
            // calls loaders.tinkerdata
            // persists results log disk
            expect(false).toBeTrue()
          })
        })

        describe('parseFile', () => {
          test('parses and saves file to store', () => {
            expect(false).toBeTrue()
          })
        })

        describe('transformAndSaveTinkerData', () => {
          test('parses and saves file to store', () => {
            // calls transformsers.csvToTInkerData
            // saves to store
            expect(false).toBeTrue()
          })
        })
      })
    }
  })
}

const badConfigTests = (configMap: typeof configs.bad) => {
  describe('bad configs', () => {
    describe('readCsvDir', () => {
      test.skip('invalid path to csv dir', () => {
        expect(false).toBeTrue()
      })
    })

    describe('transformConfigFiles', () => {
      test.skip('throws if config file not in store', () => {
        expect(false).toBeTrue()
      })
    })

    describe('transformUnmappedFiles', () => {
      test.skip('throws if getSpec not defined', () => {
        expect(false).toBeTrue()
      })
    })

    describe('loadTinkerData', () => {
      test.skip('throws if no files transformed', () => {
        expect(false).toBeTrue()
      })
    })

    describe('parseFile', () => {
      test('throws if unable to parse file', () => {
        expect(false).toBeTrue()
      })
    })

    describe('transformAndSaveTinkerData', () => {
      test('throws if thing not in store', () => {
        expect(false).toBeTrue()
      })
    })

    for (const [configName, config] of configMap.entries()) {
      describe(`${configName}`, () => {
        describe('csvToTinkergraph', () => {
          test.skip('ETL failure', () => {
            try {
              // g.V().count() should not change
              // g.E().count() should not change
              // and preferablly an error should be thrown
              expect(false).toBeTrue()
            }
            catch (error: unknown) {
              expect(error).toBeInstanceOf(Error)
              expect(error.message.length).toBeGreaterThan(5)
            }
          })
        })
      })
    }
  })
}

describe('etl', () => {
  describe('getStore', () => {
    test.skip('default store', () => {
      expect(false).toBeTrue()
    })

    test.skip('overrides', () => {
      expect(false).toBeTrue()
    })
  })

  for (const [testType, configMap] of Object.entries(configs)) {
    switch (testType) {
      case 'good': {
        goodConfigTests(configMap)
        break
      }
      case 'bad': {
        badConfigTests(configMap)
        break
      }
      default: {
        throw new Error(`${testType} not setup for etl.test.ts`)
      }
    }
  }
})
