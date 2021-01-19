class Notes {
  constructor() {
    this.notes = [];
    this.adapter = new NotesAdapter();
    this.initBindingsAndEventListeners();
    this.fetchNotes();
  }

  initBindingsAndEventListeners() {
    this.name = document.querySelector('#name');
    this.noteList = document.querySelector('#note-list');
    this.newNoteBttn = document.querySelector('#new-note');
    this.noteContainer = document.querySelector('#note-container');

    this.noteList.addEventListener('click', (e) => {
      this.showNote(e);
      this.deleteNote(e);
    });
    this.newNoteBttn.addEventListener('click', (e) => {
      this.noteContainer.innerHTML = Note.renderNoteForm();

      this.noteForm = document.querySelector('#note-form');
      this.newTitle = document.querySelector('#new-title');
      this.newBody = document.querySelector('#new-body');
      this.titleValidation = document.querySelector('#title-validation');
      this.addNoteBttn = document.querySelector('#add-note');

      this.addNoteBttn.addEventListener('click', () =>
        this.addNote(e.target.dataset.id)
      );
      this.noteForm.addEventListener('input', () => {
        this.autoResizeEl(this.newTitle);
        this.autoResizeEl(this.newBody);
      });
    });
  }

  renderNoteList() {
    this.noteList.innerHTML =
      this.notes.map((note) => note.renderNoteItem()).join('') ||
      `<article class="message is-dark is-medium">
        <div class="message-body">
          <em>No notes found.</em>
        </div>
      </article>
      `;
  }

  sortNotes(notes) {
    return notes.sort((a, b) => {
      const titleA = a.title.toUpperCase();
      const titleB = b.title.toUpperCase();
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
      return 0;
    });
  }

  fetchNotes(user) {
    if (!user) {
      this.adapter.getNotes().then((notes) => {
        this.sortNotes(notes).forEach((note) => {
          if (!note.user) {
            this.notes.push(new Note(note));
          }
        });
        this.renderNoteList();
      });
    } else {
      this.notes = [];
      if (user.notes.length > 0) {
        this.sortNotes(user.notes).forEach((note) => {
          this.notes.push(new Note(note));
        });
      }
      this.name.innerText = user.name;
      this.newNoteBttn.dataset.id = user.id;
      this.renderNoteList();
    }
  }

  autoResizeEl(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  showNote(e) {
    if (e.target.id === 'note-item') {
      this.adapter.getNote(e.target.dataset.id).then((note) => {
        this.noteContainer.innerHTML = Note.renderNote(note);
        this.noteContainer.dataset.id = note.id;

        this.title = document.querySelector('#title');
        this.body = document.querySelector('#body');
        this.saveNoteBttn = document.querySelector('#save-note');
        this.savedMessage = document.querySelector('#saved-message');

        this.body.addEventListener('input', () => this.autoResizeEl(this.body));
        this.saveNoteBttn.addEventListener('click', () =>
          this.editNote(note.id)
        );
      });
    }
  }

  handleTitleValidation() {
    if (!this.newTitle.value) {
      this.newTitle.classList.add('is-danger');
      this.titleValidation.classList.add('is-danger');
      this.titleValidation.innerText = "Title can't be blank.";
    } else {
      this.newTitle.classList.remove('is-danger');
      this.titleValidation.classList.remove('is-danger');
      this.titleValidation.innerText = '';
      this.newTitle.value = '';
      this.newBody.value = '';
    }
  }

  addNote(userId) {
    if (!this.newTitle.value) {
      this.handleTitleValidation();
    } else {
      this.adapter
        .postNote(this.newTitle.value, this.newBody.value, userId)
        .then((note) => {
          this.notes.push(new Note(note));
          this.handleTitleValidation();
          this.sortNotes(this.notes);
          this.renderNoteList();
        });
    }
  }

  editNote(id) {
    this.adapter
      .patchNote(this.title.innerText, this.body.value, id)
      .then((editedNote) => {
        this.notes = this.notes.map((note) =>
          note.id === id ? new Note(editedNote) : note
        );
        this.savedMessage.classList.add('is-success');
        this.savedMessage.innerText = 'Saved!';
        setTimeout(() => (this.savedMessage.innerText = ''), 1000);
        this.sortNotes(this.notes);
        this.renderNoteList();
      });
  }

  deleteNote(e) {
    if (e.target.id === 'delete-note') {
      this.adapter.deleteNote(e.target.dataset.id).then((deletedNote) => {
        this.notes = this.notes.filter((note) => deletedNote.id !== note.id);
        e.target.dataset.id === this.noteContainer.dataset.id &&
          (this.noteContainer.innerHTML = '');
        this.renderNoteList();
      });
    }
  }
}
