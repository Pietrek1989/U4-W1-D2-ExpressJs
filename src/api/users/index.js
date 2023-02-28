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

authorsRouter.get("/:authorId", (request, response) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const author = authorsArray.find(
    (author) => author.id === request.params.authorId
  );
  response.send(author);
});

authorsRouter.put("/:authorId", (request, response) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const index = authorsArray.findIndex(
    (author) => author.id === request.params.authorId
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

authorsRouter.delete("/:authorId", (request, response) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const remainingAuthors = authorsArray.filter(
    (author) => author.id !== request.params.authorId
  );
  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));
  response.status(204).send();
});

export default authorsRouter;
