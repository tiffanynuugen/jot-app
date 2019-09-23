class Note {
  constructor(note) {
    this.id = note.id;
    this.title = note.title;
    this.body = note.body;
  }

  renderLi() {
    return `
    <li id="list-item" data-id=${this.id}>
      <a id="note" data-id=${this.id} class="menu-item">
        ${this.title}
      </a>
      <i id="delete-note" data-id=${this.id} class="fas fa-minus-circle"></i>
    </li>
    `;
  }

  renderDetails() {
    return `
    <h1 contenteditable="true" id="title" data-id=${this.id} class="subtitle is-2">
      ${this.title}
    </h1>
    <p contenteditable="true" id="body" data-id=${this.id} class="subtitle is-6">
      ${this.body}
    </p>
    <a id="save-note" data-id=${this.id} class="button is-small">Save</a>
    `;
  }

  renderNewNoteForm() {
    return `
    <form>
      <input id="title" class="input subtitle is-5" type="text" placeholder="Title"/>
      <textarea id="body" class="textarea subtitle is-5" placeholder="Body" rows="10"></textarea>
      <span id="add-note"><a class="button is-medium" type="submit">Add Note</a></span>
    </form>
    `;
  }
}
