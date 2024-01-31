import requestQueue from "./rioRequestQueue";

export const useRIOThrottle = (request) => {
  return requestQueue.addRequest(request);
};
