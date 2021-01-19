class Note {
  constructor(note) {
    this.id = note.id;
    this.title = note.title;
    this.body = note.body;
  }

  renderNoteItem() {
    return `
      <a id="note-item"
        data-id=${this.id}
        class="is-flex is-justify-content-space-between is-align-items-center"
      >
        ${this.title}
        <button id="delete-note" data-id=${this.id} class="delete is-small"></button>
      </a>
    `;
  }

  static renderNote(note) {
    return `
      <h2 id="title" class="subtitle is-2">${note.title}</h2>
      <textarea id="body" class="textarea" placeholder="No text here yet...">${note.body}</textarea>
      <a id="save-note" class="button is-small">Save</a>
      <span id="saved-message" class="help"></span>
    `;
  }

  static renderNoteForm() {
    return `
      <form id="note-form" class="is-flex is-flex-direction-column">
        <textarea id="new-title" class="textarea" placeholder="Title" rows="1"></textarea>
        <p id="title-validation" class="help"></p>
        <textarea id="new-body" class="textarea mt-4 mb-5" placeholder="Body" rows="10"></textarea>
        <button id="add-note" class="button is-medium ml-auto" type="button">
          Add Note
        </button>
      </form>
      `;
  }
}

// `<form id="note-form">
//   <textarea id="new-title" class="textarea" placeholder="Title" rows="1"></textarea>
//   <p id="title-validation" class="help"></p>
//   <textarea id="new-body" class="textarea" placeholder="Body" rows="10"></textarea>
//   <button id="add-note" class="button is-medium" type="button">
//     Add Note
//   </button>
// </form>`;
