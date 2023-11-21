# tinkerbuntune

- ETL for tinkerpop & neptune with bun & docker
  - CSV to tinkergraph: complete
  - tinkergraph to neptune: TBD
- utils for building APIs and querying property graphs

## TLDR!

- TODO (noah): repo under active development: this will eventually become a proper readme file ;)~

## links

- [practical gremlin](https://kelvinlawrence.net/book/Gremlin-Graph-Guide.html)

## ETL

```sh
### add peer deps
bun add type-fest gremlin

### add tinkerbuntune
# add latest
bun add github:nirv-ai/tinkerbuntune
# or specific version
bun add github:nirv-ai/tinkerbuntune#1.2.3

```

```ts
// everything is available @ tinkerbuntune/utils
// ETL a directory of CSVs into tinkergraph

// somefile.ts
import { csvToTinkergraph } from "tinkerbuntune/utils";
import { config } from "./config";
await csvToTinkergraph(config);

// config.ts
// TODO (noah): create example
```

### ETL Pipeline

1. config.transform{Header,Records}: this CAN potentially modify the record.col indexes supplied to later fns
2. config.colMap.inject: this does NOT modify record.col indexes but injects data directly into TinkerData
3. config.colMap.transform: receives each CSV record after steps and processes each column

## docker scripts

- example based on the practical gremlin air routes dataset

### runtinkerpop.sh: gremlin console > gremlin server > tinkergraph

```sh
###  starts a gremlin server and gremlin console
./runtinkerpop.sh

### test the server is running & the tinker graph is loaded
curl "localhost:8182/gremlin?gremlin=g.V().has('code','SFO').valueMap()"
wget -qO- "localhost:8182/gremlin?gremlin=g.V().has('code','SFO').valueMap()"

### attach to the running console container
docker attach gconsole
Gremlin.version()
```

- execute cmds against tinkergraph
- ensure you're attached to the console container

```groovy
//// gremlin console -> gremlin server -> tinkergraph
// connect to gremlin server
:remote connect tinkerpop.server conf/remote.yaml
// toggle remote mode
:remote console
g.V().count()

//// gremlin console -> tinkergraph
// toggle local mode
:remote console
// load air-routes data from practical gremlin
:load scripts/air-routes.groovy
g.V().count()

// detach from the gconsole container
ctrlp ctrlq
```

### runutils.sh: bun > gremlin server

```sh
###  starts a bun server with gremlin javascript
./runutils.sh

### install deps and execute examples file
bun install
bun examples

```
