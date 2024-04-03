import { Request } from "../types";
import requestQueue from "./rioRequestQueue";

export const useRIOThrottle = (request: Request, args: object) => {
  return requestQueue.addRequest(async () => {
    return request(args);
  });
};
