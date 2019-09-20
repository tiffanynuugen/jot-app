class User {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
  }

  renderLink() {
    return `
    <a data-id=${this.id} href="#" class="dropdown-item">
      ${this.name}
    </a>
    `;
  }
}
