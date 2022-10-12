import "reflect-metadata";
import { HttpFunction } from "@google-cloud/functions-framework";
import { getContainer } from "./inversify.config";
import { Runner } from "./services/runner/runner";

export const synchronize: HttpFunction = async (_req, res) => {
  try {
    const container = await getContainer();
    await container.get(Runner).synchronize();
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(200);
  }
};
