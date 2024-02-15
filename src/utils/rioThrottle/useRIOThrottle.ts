import requestQueue from "./rioRequestQueue";
import { Request, RequestReturn } from "../types";

export const useRIOThrottle = (request: Request, args: object) => {
  return requestQueue.addRequest(async () => {
    return request(args);
  });
};
