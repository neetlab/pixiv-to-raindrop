import "reflect-metadata";

import type { HttpFunction } from "@google-cloud/functions-framework";

import { getContainer } from "./inversify.config";
import { Runner } from "./services/runner/runner";

export const synchronize: HttpFunction = async (_request, response) => {
  try {
    const container = await getContainer();
    await container.get(Runner).synchronize();
    response.sendStatus(200);
  } catch {
    response.sendStatus(200);
  }
};
