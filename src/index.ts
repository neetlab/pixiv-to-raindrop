import "reflect-metadata";
import { HttpFunction } from "@google-cloud/functions-framework";
import { getContainer } from "./inversify.config";
import { Driver } from "./driver";

export const receive: HttpFunction = async (_req, res) => {
  try {
    const container = await getContainer();
    await container.get(Driver).synchronize();
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(200);
  }
};
