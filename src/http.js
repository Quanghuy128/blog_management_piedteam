class Http {
  constructor() {
    this.api = "https://614b2c9ce4cc2900179eaf41.mockapi.io/articles";
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  //tạo method read[get] để get data từ api
  async send(method, url, body) {
    const data = await fetch(url, {
      method: method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined, //not null
    });
    if (!data.ok) {
      throw new Error("Invalid Request");
    }
    return data.json();
  }
  readPosts() {
    return this.send("GET", `${this.api}`,null);
  }
  readPost(id) {
    return this.send("GET", `${this.api}/${id}`,null);
  }
  createPost(body) {
    return this.send("POST", `${this.api}`,body);
  }
  updatePost(id,body) {
    return this.send("PUT", `${this.api}/${id}`,body);
  }
  deletePost(id) {
    return this.send("DELETE", `${this.api}/${id}`,null);
  }
}
export default new Http();
