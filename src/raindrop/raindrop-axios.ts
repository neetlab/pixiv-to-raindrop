import FormData from "form-data";
import { IHttp } from "../http/http";
import { HttpAxios } from "../http/http-axios";
import { IRaindropClient } from "./raindrop";
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

export class RaindropClientAxios implements IRaindropClient {
  private readonly _http: IHttp;

  public constructor(token: string) {
    this._http = new HttpAxios({
      baseURL: "https://api.raindrop.io",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  public createRaindrop(
    parameters: CreateRaindropParameters
  ): Promise<CreateRaindropResponse> {
    return this._http.post("/rest/v1/raindrop", parameters);
  }

  public checkUrlExistence(
    parameters: CheckUrlExistenceParameters
  ): Promise<CheckUrlExistenceResponse> {
    return this._http.post("/rest/v1/import/url/exists", parameters);
  }

  public uploadRaindropCover(
    id: number,
    parameters: UploadRaindropCoverParameters
  ): Promise<UploadRaindropCoverResponse> {
    const formData = new FormData();
    formData.append("cover", parameters.cover);

    return this._http.put(`/rest/v1/raindrop/${id}/cover`, formData, {
      headers: formData.getHeaders(),
    });
  }
}
