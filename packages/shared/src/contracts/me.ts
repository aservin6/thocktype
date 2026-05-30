import type { Result, UserStats } from "../types/result.ts";
import type { PublicUser } from "../types/user.ts";
import type { ApiSuccessResponse } from "./api.ts";

export type GetMeResponse = ApiSuccessResponse<PublicUser>;

export type GetMeResultsResponse = ApiSuccessResponse<Result[]>;

export type GetMeStatsResponse = ApiSuccessResponse<UserStats>;
