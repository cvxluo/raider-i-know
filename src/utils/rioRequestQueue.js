// https://stackoverflow.com/questions/65850544/rate-limit-the-number-of-request-made-from-react-client-to-api
// need to look more into error handling when using - sometimes we run into rate limits even with this.

class RequestQueue {
  constructor() {
    this.queue = [];
    this.isRequesting = false;
    this.MAX_REQUESTS = 250; // 300; - slightly lower to prevent 429s
    this.TIMEOUT = 1 * 60 * 1000; // 1 minute
    this.requestsProcessing = 0;
  }

  addRequest(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        request,
        resolve,
        reject,
      });

      this.processRequests();
    });
  }

  removeRequest(request) {
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

    const item = this.queue.shift();
    this.requestsProcessing++;

    try {
      item.resolve(item.request);

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
