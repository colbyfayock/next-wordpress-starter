class Request {
  async fetch() {
    const response = await fetch(this.url);
    return await response.json();
  }
}

export default Request;