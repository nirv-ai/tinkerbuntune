import { common } from "groovy/common";
import { GroovyTraversalSource } from "groovy/dsl";
const { traversal, DriverRemoteConnection, gremlin } = common;
export const g = traversal(GroovyTraversalSource).withRemote(new DriverRemoteConnection("ws://0.0.0.0:8182/gremlin"));
// FYI: neptune doesnt support parameterizition in scripts
// may be best to skip this and focus on something more neptune relevant
// @see https://tinkerpop.apache.org/docs/3.7.0/reference/#gremlin-javascript-scripts
export const client = new gremlin.driver.Client("ws://0.0.0.0:8182/gremlin", {
    traversalSource: "g",
    session: `${Date.now()}`, // FYI: must be a string ;)~
});
