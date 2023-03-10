import Express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./api/users/index.js";
import cors from "cors";

const server = Express();
const port = 3001;
server.use(Express.json());
server.use(cors());
server.use("/authors", authorsRouter);
server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Listening on port ${port}`);
});
