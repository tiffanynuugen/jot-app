const content = document.querySelector('.dropdown-content');

class Users {
  constructor() {
    this.notes = new Notes();
    this.baseUrl = 'http://localhost:3000/api/v1/users';
    this.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  getUsers() {
    fetch(`${this.baseUrl}`)
      .then((res) => res.json())
      .then((users) => {
        users.forEach((user) => {
          content.innerHTML += new User(user).renderLink();
        });
      });
  }

  selectUser() {
    const dropdown = document.querySelector('.dropdown');

    dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('is-active');
    });
    document.addEventListener('click', () => {
      dropdown.classList.remove('is-active');
    });

    content.addEventListener('click', (e) => {
      e.preventDefault();

      const { id } = e.target.dataset;
      const select = document.querySelector('#select');
      const link = document.querySelector(`a[data-id="${id}"]`);
      const label = document.querySelector('.menu-label');

      if (e.target === link) {
        select.innerHTML = link.innerHTML;
        list.innerHTML = '';
        details.innerHTML = '';

        fetch(`${this.baseUrl}/${id}`)
          .then((res) => res.json())
          .then((user) => {
            label.innerHTML = `
            ${user.name} Notes <i id="new-note" class="fas fa-plus-circle"></i>`;
            user.notes.forEach((note) => {
              list.innerHTML += new Note(note).renderLi();
            });
            this.notes.addNote(id);
          });
      }
    });
  }

  addUser() {
    const newUserBttn = document.querySelector('#new-user');
    const modal = document.querySelector('.modal');
    const background = document.querySelector('.modal-background');
    const name = document.querySelector('#name');
    const addUserBttn = document.querySelector('#add-user');
    const help = document.querySelector('.help');

    newUserBttn.addEventListener('click', () => {
      modal.classList.add('is-active');
    });

    background.addEventListener('click', () => {
      help.innerHTML = '';
      name.value = '';
      modal.classList.remove('is-active');
      help.classList.remove('is-danger');
    });

    addUserBttn.addEventListener('click', () => {

      let namesArr = [];
      Array.from(content.children).forEach(name => {
        namesArr.push(name.innerText.trim());
      });

      if (name.value.length < 3) {
        help.innerHTML = 'Name must be at least 3 characters long.';
        help.classList.add('is-danger');
      } else if (namesArr.indexOf(name.value) !== -1) {
        help.innerHTML = 'Name is already used.';
        help.classList.add('is-danger');
      } else {
        fetch(`${this.baseUrl}`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            name: name.value,
          }),
        }).then((res) => res.json())
        .then((user) => {
          content.innerHTML += new User(user).renderLink();
          modal.classList.remove('is-active');
        });
      }
    });
  }
}
