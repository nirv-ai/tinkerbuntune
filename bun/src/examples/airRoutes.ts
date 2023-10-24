/**
 * recreating a few examples from practical gremlin using the air-routes dataset
 *
 * groovy api translator: https://www.gremlator.com/
 */

import { g, client } from "remote";
import { common } from "groovy/common";
import { log } from "logger";

const { scope, column, order, __, t, p } = common;

///////////////////////// CREATE/UPSERT
log(
  "CONDITIONAL CREATE: airport with a code of 'XYZ'",
  await g
    .V()
    .has("airport", "code", "XYZ")
    .fold()
    .coalesce(
      __.unfold(),
      __.addV("airport")
        .property("code", "XYZ")
        .property("icao", "KXYZ")
        .property("desc", "This is not a real airport")
    )
    .toList()
);
///////////////////////// READS
log("edge labels", await g.E().label().dedup().toList());
log("vertex labels", await g.V().label().dedup().toList());
log(
  "vertex labels: total by type",
  await g.V().groupCount().by(t.label).toList()
);
log(
  "edge labels: total by type",
  await g.E().group().by(t.label).by(__.count()).toList()
);
log(
  "vertex properties",
  await g.V().hasLabel("airport").limit(1).keys().dedup().toList()
);
log("edge properties", await g.E().hasLabel("route").limit(1).keys().toList());
log(
  "top 10 countries by total airports",
  await g
    .V()
    .hasLabel("airport")
    .groupCount()
    .by("country")
    .unfold()
    .order()
    .by(column.values, order.desc)
    .fold()
    .limit(scope.local, 10)
    .toList()
);
log(
  "airports from AUS to AGR with exactly 2 stops",
  (
    await g
      .V()
      .has("code", "AUS")
      .repeat(__.out())
      .times(3)
      .has("code", "AGR")
      .path()
      .by("code")
      .toList()
  )
    // @ts-ignore
    .map((x) => x.objects)
);
log(
  "how many routes leaving airports",
  await g.V().hasLabel("airport").outE("route").count().toList()
);

log(
  "for 1 route: both verticies and the edge that connects it",
  await g
    .V()
    .has("airport", "code", "LCY")
    .outE()
    .inV()
    .path()
    .limit(1)
    .toList()
);
log(
  "check if an edge exists between two vertices",
  await g.V().has("code", "AUS").out("route").has("code", "DFW").hasNext()
);
log(
  "code, region and total routes of the first 10 airports",
  await g
    .V()
    .has("type", "airport")
    .limit(10)
    .project("a", "b", "c")
    .by("code")
    .by("region")
    .by(__.out().count())
    .toList()
);

log(
  "If an airport has a runway > 12,000 feet return its code else return its description",
  await g
    .V()
    .has("region", "US-TX")
    .choose(
      __.values("longest").is(p.gt(12000)),
      __.values("code"),
      __.values("desc")
    )
    .limit(5)
    .toList()
);

log(
  "using inject with a useless value in order to execute some other query",
  await g
    .inject(1)
    .choose(__.V().hasLabel("XYZ").count().is(0), __.constant("None found"))
    .toList()
);

log(
  "nested repeat + loops require naming each",
  await g
    .V()
    .has("code", "SAF")
    .repeat("r1", __.out().simplePath())
    .until(__.loops("r1").is(3).or().has("code", "MAN"))
    .path()
    .by("city")
    .limit(3)
    .toList()
);

log(
  "get the element associated with a property",
  await g.V().properties().hasId(583).element().toList()
);
log(
  "calculate the ratio between two traversals in one query",
  await g
    .V()
    .has("region", "US-NM")
    .group()
    .by("code")
    .by(__.values("runways"))
    .select(column.values)
    .unfold()
    .sum()
    .store("a")
    .V()
    .has("region", "US-AZ")
    .group()
    .by("code")
    .by(__.values("runways"))
    .select(column.values)
    .unfold()
    .sum()
    .store("b")
    .project("first", "second")
    .by(__.select("a").unfold())
    .by(__.select("b").unfold())
    .math("first / second")
    .toList()
);

log(
  "client.submit: vertex properties",
  await client.submit(`g.V().hasLabel('airport').limit(1).next().keys()`)
);
log(
  "client.submit: total hops between two verticies",
  await client.submit(
    `g
      .withSack(sackInit)
      .V()
      .has("code", "AUS")
      .repeat(out().simplePath().sack(sum).by(constant(perHop)))
      .until(has("code", "WLG"))
      .limit(total)
      .local(union(path().by("code"), sack()).fold())
  `,
    {
      sackInit: 0,
      perHop: 1,
      total: 10,
    }
  )
);
