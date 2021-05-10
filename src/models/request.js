class Request {
  async fetch() {
    const response = await fetch(this.url);
    const data = await response.json();
    const headers = {};

    for (let [key, value] of response.headers) {
      headers[key] = value;
    }

    return {
      headers,
      data,
    };
  }
}

export default Request;
