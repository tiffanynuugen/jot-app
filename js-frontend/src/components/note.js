class Note {
  constructor(note) {
    this.id = note.id;
    this.title = note.title;
    this.body = note.body;
  }

  renderNoteTitle(doc) {
    return `
      <a
        id="note-title"
        data-id=${this.id}
        class="is-flex is-justify-content-space-between is-align-items-center"
      >
          ${
            doc.body.innerText.length >= 30
              ? doc.body.innerText.slice(0, 25) + '...'
              : doc.body.innerText
          }
        <button id="delete-note" data-id=${this.id} class="delete is-small"></button>
      </a>
    `;
  }

  static renderNote(note) {
    return `
      <div id="note">
        <span id="save-status" class="subtitle has-text-grey-light"></span>
        <div id="title" class="mb-4">${note.title}</div>
        <div id="body" class="mb-5">${note.body}</div>
      </div>
    `;
  }

  static renderNoteForm() {
    return `
      <form id="note-form" class="is-flex is-flex-direction-column">
        <div id="new-title"></div>
        <p id="title-validation" class="help mb-4"></p>
        <div id="new-body" class="mb-5"></div>
        <button id="add-note" class="button is-medium ml-auto" type="button">Add Note</button>
      </form>
    `;
  }
}
