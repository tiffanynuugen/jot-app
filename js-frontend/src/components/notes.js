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
    this.titleToolbar = [
      [{ header: 1 }, { header: 2 }],
      ['bold', 'italic', 'underline'],
      ['clean']
    ];
    this.bodyToolbar = [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      ['link', 'blockquote', 'code-block', 'image'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean']
    ];

    this.noteList.addEventListener('click', (e) => {
      this.showNote(e);
      this.deleteNote(e);
    });

    this.newNoteBttn.addEventListener('click', () => {
      this.noteContainer.innerHTML = Note.renderNoteForm();
      this.titleValidation = document.querySelector('#title-validation');
      this.addNoteBttn = document.querySelector('#add-note');
      this.newTitle = new Quill(document.querySelector('#new-title'), {
        theme: 'snow',
        placeholder: "Don't forget the title...",
        modules: {
          toolbar: this.titleToolbar
        }
      });
      this.newBody = new Quill(document.querySelector('#new-body'), {
        theme: 'snow',
        placeholder: 'Start jotting here...',
        modules: {
          syntax: true,
          toolbar: this.bodyToolbar
        }
      });
      this.addNoteBttn.addEventListener('click', () => this.addNote(this.newNoteBttn.dataset.id));
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
      </article>`;
  }

  sortNotes(notes) {
    return notes.sort((a, b) => {
      const docA = new DOMParser().parseFromString(a.title, 'text/html');
      const docB = new DOMParser().parseFromString(b.title, 'text/html');
      return docA.body.innerText.trim().localeCompare(docB.body.innerText.trim());
    });
  }

  fetchNotes(user) {
    if (!user) {
      this.adapter.getNotes().then((notes) => {
        notes.forEach((note) => {
          if (!note.user) {
            this.notes.push(new Note(note));
            this.sortNotes(this.notes);
          }
        });
        this.renderNoteList();
      });
    } else {
      this.notes = [];
      if (user.notes.length > 0) {
        user.notes.forEach((note) => {
          this.notes.push(new Note(note));
          this.sortNotes(this.notes);
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
        this.noteContainer.innerHTML = Note.renderNote(note);
        this.noteContainer.dataset.id = note.id;
        this.saveStatus = document.querySelector('#save-status');
        this.title = new Quill(document.querySelector('#title'), {
          theme: 'bubble',
          placeholder: 'There should be a title here...',
          modules: {
            toolbar: this.titleToolbar
          }
        });
        this.body = new Quill(document.querySelector('#body'), {
          theme: 'bubble',
          placeholder: "Jot here if you haven't already...",
          modules: {
            syntax: true,
            toolbar: this.bodyToolbar
          }
        });
        this.title.on('text-change', () => this.editNote(note.id));
        this.body.on('text-change', () => this.editNote(note.id));
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
      const newTitleEl = document.createElement('textarea');
      const newBodyEl = document.createElement('textarea');
      newTitleEl.innerHTML = this.newTitle.root.innerHTML;
      newBodyEl.innerHTML = this.newBody.root.innerHTML;
      const cleanNewTitle = DOMPurify.sanitize(newTitleEl.value);
      const cleanNewBody = DOMPurify.sanitize(newBodyEl.value);
      this.adapter.postNote(cleanNewTitle, cleanNewBody, userId).then((note) => {
        this.notes.push(new Note(note));
        this.handleTitleValidation();
        this.sortNotes(this.notes);
        this.renderNoteList();
      });
    }
  }

  editNote(id) {
    clearTimeout(this.timerId);
    this.saveStatus.innerHTML = '<em>(Saving...)</em>';
    const titleEl = document.createElement('textarea');
    const bodyEl = document.createElement('textarea');
    titleEl.innerHTML = this.title.root.innerHTML;
    bodyEl.innerHTML = this.body.root.innerHTML;
    const cleanTitle = DOMPurify.sanitize(titleEl.value);
    const cleanBody = DOMPurify.sanitize(bodyEl.value);
    this.adapter.patchNote(cleanTitle, cleanBody, id).then((editedNote) => {
      this.notes = this.notes.map((note) => (note.id === id ? new Note(editedNote) : note));
      this.sortNotes(this.notes);
      this.renderNoteList();
    });
    this.timerId = setTimeout(() => (this.saveStatus.innerHTML = '<em>(Saved)</em>'), 2600);
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
