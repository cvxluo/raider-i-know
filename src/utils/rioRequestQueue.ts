// https://stackoverflow.com/questions/65850544/rate-limit-the-number-of-request-made-from-react-client-to-api
// need to look more into error handling when using - sometimes we run into rate limits even with this.

import { Request, RequestReturn } from "./types";

const LOG_RIO_REQUESTS = true;

type QueueItem = {
  request: () => Promise<RequestReturn>;
  resolve: (value: Promise<RequestReturn>) => void;
  reject: (reason: any) => void;
};

class RequestQueue {
  queue: QueueItem[];
  isRequesting: boolean;
  MAX_REQUESTS: number;
  TIMEOUT: number;
  requestsProcessing: number;

  constructor() {
    this.queue = [];
    this.isRequesting = false;
    this.MAX_REQUESTS = 4; // 300; - lower to prevent 429s
    this.TIMEOUT = 1 * 1 * 1000; // 1 * 60 * 1000;
    this.requestsProcessing = 0;
  }

  addRequest(request: () => Promise<RequestReturn>) {
    console.log(
      "Adding request to queue,",
      this.requestsProcessing,
      "requests processing.",
    );
    return new Promise((resolve, reject) => {
      this.queue.push({
        request,
        resolve,
        reject,
      });

      this.processRequests();
    });
  }

  removeRequest(request: QueueItem) {
    this.queue = this.queue.filter((item) => item !== request);
  }

  cancelAll() {
    this.queue.forEach((request) => {
      request.reject({ canceled: true });
    });
    this.queue = [];
  }

  processRequests() {
    if (this.requestsProcessing >= this.MAX_REQUESTS) {
      return;
    }

    if (this.queue.length == 0) {
      return;
    }

    if (LOG_RIO_REQUESTS)
      console.log("Processing request,", this.queue.length, "left in queue.");
    const item = this.queue.shift();

    if (!item) return;
    this.requestsProcessing++;

    try {
      item.resolve(item.request());

      setTimeout(() => {
        this.requestsProcessing--;
        this.processRequests();
      }, this.TIMEOUT);
    } catch (err) {
      this.requestsProcessing--;
      item.reject(err);
      this.processRequests();
    }
  }
}

const requestQueue = new RequestQueue();
// Object.freeze(requestQueue);

export default requestQueue;
