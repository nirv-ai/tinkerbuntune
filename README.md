# TinkerBunTune

- ETL for tinkerpop & neptune with bun & docker
  - CSV to tinkergraph: complete
  - tinkergraph to neptune: TBD

## TLDR!

## links

- [practical gremlin](https://kelvinlawrence.net/book/Gremlin-Graph-Guide.html)

## ETL

- TODO (noah): this will eventually become a proper readme file ;)~

```sh
### add peer deps
bun add type-fest csv gremlin
### add tinkerbuntune
### @see https://bun.sh/docs/cli/install#non-npm-dependencies
# add latest
bun add github:nirv-ai/tinkerbuntune=
# or specific version
bun add github:nirv-ai/tinkerbuntune#0.0.5
# or specific commit
bun add github:nirv-ai/tinkerbunetune#57a7b1a
```

```ts
// everything is available @ tinkerbuntune/bun
// ETL a directory of CSVs into tinkergraph

// somefile.ts
import { csvToTinkergraph } from "tinkerbuntune/bun";
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

### gconsole.sh: gremlin console + gremlin server

- test and attach to the console container

```sh
###  starts a gremlin server and gremlin console
./gconsole.sh

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

### gbun.sh: bun (typescript) + gremlin server

```sh
###  starts a bun server with gremlin javascript
./gbun.sh

### install deps and execute examples file
bun install
bun examples

```
