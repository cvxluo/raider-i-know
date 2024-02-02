import requestQueue from "./rioRequestQueue";

export const useRIOThrottle = (request, args) => {
  return requestQueue.addRequest(async () => {
    return request(args);
  });
};
