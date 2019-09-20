const list = document.querySelector('.menu-list');
const details = document.querySelector('.details');

class Notes {
  constructor() {
    this.baseUrl = 'http://localhost:3000/api/v1/notes';
    this.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  getUnnamedNotes() {
    fetch(`${this.baseUrl}`)
      .then((res) => res.json())
      .then((notes) => {
        notes.forEach((note) => {
          if (note.user_id === null) {
            list.innerHTML += new Note(note).renderLi();
          }
        });
      });
  }

  showDetails() {
    list.addEventListener('click', (e) => {
      const { id } = e.target.dataset;

      if (e.target.className === 'menu-item') {
        fetch(`${this.baseUrl}/${id}`)
          .then((res) => res.json())
          .then((note) => {
            details.innerHTML = new Note(note).renderDetails();
          });
      }
    });
  }

  addNote(id) {
    const createNoteBttn = document.querySelector('#create-note');

    createNoteBttn.addEventListener('click', (note) => {
      details.innerHTML = new Note(note).renderNoteForm();

      const addNoteBttn = document.querySelector('#add-note');
      const title = document.querySelector('#title');
      const body = document.querySelector('#body');

      addNoteBttn.addEventListener('click', () => {
        if (title.value.length && body.value.length > 0) {
          fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
              title: title.value,
              body: body.value,
              user_id: id,
            }),
          }).then((res) => res.json())
            .then((note) => {
              list.innerHTML += new Note(note).renderLi();
              title.value = '';
              body.value = '';
            });
        }
      });
    });
  }

  editNote() {
    details.addEventListener('click', (e) => {
      const { id } = e.target.dataset;
      const title = document.querySelector(`h1[data-id="${id}"]`);
      const body = document.querySelector(`p[data-id="${id}"]`);
      const note = document.querySelector(`a[data-id="${id}"]`);
      if (e.target.id === 'save') {
        fetch(`${this.baseUrl}/${id}`, {
          method: 'PATCH',
          headers: this.headers,
          body: JSON.stringify({
            title: title.innerText,
            body: body.innerText,
          }),
        }).then((res) => res.json())
          .then(() => {
            note.innerText = title.innerText;
          });
      }
    });
  }

  deleteNote() {
    list.addEventListener('click', (e) => {
      const { id } = e.target.dataset;
      const note = document.querySelector(`li[data-id="${id}"]`);
      if (e.target.id === 'delete') {
        fetch(`${this.baseUrl}/${id}`, {
          method: 'DELETE',
        });
        note.parentNode.removeChild(note);
        details.innerHTML = '';
      }
    });
  }
}
