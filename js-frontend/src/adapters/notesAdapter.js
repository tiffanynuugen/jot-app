class NotesAdapter {
  constructor() {
    // this.baseUrl = 'http://localhost:3000/notes';
    this.baseUrl = 'https://jot-rails-api.herokuapp.com/notes';
    this.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
  }

  getNotes() {
    return fetch(this.baseUrl).then((res) => res.json());
  }

  getNote(id) {
    return fetch(`${this.baseUrl}/${id}`).then((res) => res.json());
  }

  postNote(title, body, userId) {
    return fetch(this.baseUrl, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        title: title,
        body: body,
        user_id: userId
      })
    }).then((res) => res.json());
  }

  patchNote(title, body, id) {
    return fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({
        title: title,
        body: body
      })
    }).then((res) => res.json());
  }

  deleteNote(id) {
    return fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: this.headers
    }).then((res) => res.json());
  }
}
