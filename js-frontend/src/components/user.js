class User {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
  }

  renderUser() {
    return `
      <a
        id="user"
        data-id=${this.id}
        class="dropdown-item pr-4 is-flex is-justify-content-space-between is-align-items-center"
      >
        ${this.name}
        <button id="delete-user" data-id=${this.id} class="delete is-small"></button>
      </a>
    `;
  }
}
