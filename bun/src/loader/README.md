# tinkerpop Loader

- TODO (noah): this will eventually become a proper readme file ;)~

## ETL Pipeline

1. config.transformHeader/Records: this CAN potentially modify the record.col indexes supplied to later fns
2. config.colMap.inject: this does NOT modify record.col indexes but injects data direclty into TinkerData
3. config.colMap.transform: receives each CSV record and processes each column
