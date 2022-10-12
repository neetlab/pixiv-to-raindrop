import {
  CheckUrlExistenceParameters,
  CreateRaindropParameters,
  UploadRaindropCoverParameters,
} from "./request-bodies";
import {
  CheckUrlExistenceResponse,
  CreateRaindropResponse,
  UploadRaindropCoverResponse,
} from "./responses";

export interface IRaindropClient {
  createRaindrop(
    parameters: CreateRaindropParameters
  ): Promise<CreateRaindropResponse>;

  checkUrlExistence(
    parameters: CheckUrlExistenceParameters
  ): Promise<CheckUrlExistenceResponse>;

  uploadRaindropCover(
    id: number,
    parameters: UploadRaindropCoverParameters
  ): Promise<UploadRaindropCoverResponse>;
}
