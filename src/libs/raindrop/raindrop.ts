import type {
  CheckUrlExistenceParameters,
  CreateRaindropParameters,
  UploadRaindropCoverParameters,
} from "./request-bodies";
import type {
  CheckUrlExistenceResponse,
  CreateRaindropResponse,
  UploadRaindropCoverResponse,
} from "./responses";

export interface IRaindropClient {
  createRaindrop: (
    parameters: CreateRaindropParameters
  ) => Promise<CreateRaindropResponse>;

  checkUrlExistence: (
    parameters: CheckUrlExistenceParameters
  ) => Promise<CheckUrlExistenceResponse>;

  uploadRaindropCover: (
    id: number,
    parameters: UploadRaindropCoverParameters
  ) => Promise<UploadRaindropCoverResponse>;
}
