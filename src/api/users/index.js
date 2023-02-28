import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const authorsRouter = Express.Router();
const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);

authorsRouter.post("/", (request, response) => {
  const newAuthor = {
    ...request.body,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uniqid(),
  };
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  authorsArray.push(newAuthor);
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));
  response.status(201).send({ id: newAuthor.id });
});

authorsRouter.get("/", (request, response) => {
  const fileContentAsBuffer = fs.readFileSync(authorsJSONPath);
  const authorsArray = JSON.parse(fileContentAsBuffer);
  response.send(authorsArray);
});

authorsRouter.get("/:userId", (request, response) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const user = authorsArray.find((user) => user.id === request.params.userId);
  response.send(user);
});

authorsRouter.put("/:userId", (request, response) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const index = authorsArray.findIndex(
    (author) => author.id === request.params.userId
  );
  const oldAuthor = authorsArray[index];
  const updatedAuthor = {
    ...oldAuthor,
    ...request.body,
    updatedAt: new Date(),
  };
  authorsArray[index] = updatedAuthor;
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));
  response.send(updatedAuthor);
});

authorsRouter.delete("/:userId", (request, response) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const remainingAuthors = authorsArray.filter(
    (author) => author.id !== request.params.userId
  ); // ! = =
  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));
  response.status(204).send();
});

export default authorsRouter;
