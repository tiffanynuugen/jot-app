class UsersAdapter {
  constructor() {
    this.baseUrl = 'http://localhost:3000/api/v1/users';
    this.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
  }

  getUsers() {
    return fetch(this.baseUrl).then((res) => res.json());
  }

  getUser(id) {
    return fetch(`${this.baseUrl}/${id}`).then((res) => res.json());
  }

  postUser(name) {
    return fetch(this.baseUrl, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        name: name
      })
    }).then((res) => res.json());
  }

  deleteUser(id) {
    return fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: this.headers
    }).then((res) => res.json());
  }
}
