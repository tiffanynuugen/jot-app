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

      this.newTitle = new Quill(document.querySelector('#new-title'), {
        theme: 'snow',
        placeholder: "Don't forget the title...",
        modules: {
          toolbar: [['bold', 'italic', 'underline'], [{ header: 1 }, { header: 2 }], ['clean']]
        }
      });
      this.newBody = new Quill(document.querySelector('#new-body'), {
        theme: 'snow',
        placeholder: 'Start jotting here...'
      });
      this.titleValidation = document.querySelector('#title-validation');
      this.addNoteBttn = document.querySelector('#add-note');

      this.addNoteBttn.addEventListener('click', () => this.addNote(e.target.dataset.id));
    });
  }

  renderNoteList() {
    this.noteList.innerHTML =
      this.notes
        .map((note) =>
          note.renderNoteTitle(new DOMParser().parseFromString(note.title, 'text/html'))
        )
        .join('') ||
      `<article class="message is-dark is-medium">
        <div class="message-body">
          <em>No notes found.</em>
        </div>
      </article> `;
  }

  sortNotes(notes) {
    return notes.sort((a, b) => {
      const docA = new DOMParser().parseFromString(a.title, 'text/html');
      const docB = new DOMParser().parseFromString(b.title, 'text/html');
      return docA.body.innerText.localeCompare(docB.body.innerText);
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

  showNote(e) {
    if (e.target.id === 'note-title') {
      this.adapter.getNote(e.target.dataset.id).then((note) => {
        console.log('note shown', note);
        this.noteContainer.innerHTML = Note.renderNote(note);

        this.saveNoteBttn = document.querySelector('#save-note');
        this.savedMessage = document.querySelector('#saved-message');

        this.noteContainer.dataset.id = note.id;

        this.title = new Quill(document.querySelector('#title'), {
          theme: 'bubble',
          placeholder: 'There should be a title here...',
          modules: {
            toolbar: [['bold', 'italic', 'underline'], [{ header: 1 }, { header: 2 }], ['clean']]
          }
        });
        this.body = new Quill(document.querySelector('#body'), {
          theme: 'bubble',
          placeholder: "Jot here if you haven't already...",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'link'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['clean']
            ]
          }
        });

        this.saveNoteBttn.addEventListener('click', () => this.editNote(note.id));
      });
    }
  }

  handleTitleValidation() {
    if (!this.newTitle.getText().trim().length) {
      this.newTitle.root.classList.add('input', 'is-danger');
      this.titleValidation.classList.add('is-danger');
      this.titleValidation.innerText = "Title can't be blank.";
    } else {
      this.newTitle.root.classList.remove('input', 'is-danger');
      this.titleValidation.classList.remove('is-danger');
      this.titleValidation.innerText = '';
      this.newTitle.setText('');
      this.newBody.setText('');
    }
  }

  addNote(userId) {
    if (!this.newTitle.getText().trim().length) {
      this.handleTitleValidation();
    } else {
      this.adapter
        .postNote(this.newTitle.root.innerHTML, this.newBody.root.innerHTML, userId)
        .then((note) => {
          console.log('note added', note);
          this.notes.push(new Note(note));
          this.handleTitleValidation();
          this.sortNotes(this.notes);
          this.renderNoteList();
        });
    }
  }

  editNote(id) {
    this.adapter.patchNote(this.title.innerText, this.body.value, id).then((editedNote) => {
      this.notes = this.notes.map((note) => (note.id === id ? new Note(editedNote) : note));
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
