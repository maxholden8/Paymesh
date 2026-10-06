import { Hono } from "hono";
import { PAYMESH_WELL_KNOWN } from "./discovery/manifest";

const app = new Hono();

app.get("/", (c) =>
  c.json({
    name: "Paymesh",
    version: "0.1.0",
    status: "building",
  }),
);

app.get(PAYMESH_WELL_KNOWN, (c) =>
  c.json({
    version: "0.1",
    services: [],
  }),
);

export default app;
