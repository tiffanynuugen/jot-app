class Users {
  constructor() {
    this.users = [];
    this.notes = new Notes();
    this.adapter = new UsersAdapter();
    this.initBindingsAndEventListeners();
    this.fetchUsers();
  }

  initBindingsAndEventListeners() {
    this.dropdown = document.querySelector('.dropdown');
    this.selectedUser = document.querySelector('#selected-user');
    this.userList = document.querySelector('#user-list');
    this.newUserBttn = document.querySelector('#new-user');
    this.modal = document.querySelector('.modal');
    this.background = document.querySelector('.modal-background');
    this.newName = document.querySelector('#new-name');
    this.nameValidation = document.querySelector('#name-validation');
    this.userForm = document.querySelector('#user-form');

    if (localStorage.getItem('deletedUser')) {
      this.dropdown.classList.add('is-active');
      localStorage.clear();
    }

    this.dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dropdown.classList.toggle('is-active');
      this.selectUser(e);
      this.deleteUser(e);
    });
    document.addEventListener('click', () => {
      this.dropdown.classList.remove('is-active');
    });
    this.newUserBttn.addEventListener('click', () =>
      this.modal.classList.add('is-active')
    );
    this.background.addEventListener('click', () => {
      this.modal.classList.remove('is-active');
      this.newName.value = '';
      this.newName.classList.remove('is-danger');
      this.nameValidation.innerText = '';
      this.nameValidation.classList.remove('is-danger');
    });
    this.userForm.addEventListener('submit', (e) => this.addUser(e));
  }

  renderUserList() {
    this.userList.innerHTML =
      this.users.map((user) => user.renderUser()).join('') ||
      `<li class="dropdown-item"><em>No users found.</em></li>`;
  }

  fetchUsers() {
    this.adapter.getUsers().then((users) => {
      users.forEach((user) => {
        this.users.push(new User(user));
      });
      this.renderUserList();
    });
  }

  selectUser(e) {
    if (e.target.id === 'user') {
      this.selectedUser.innerText = e.target.innerText;
      document.querySelector('#note-container').innerHTML = '';
      this.adapter.getUser(e.target.dataset.id).then((user) => {
        this.notes.fetchNotes(user);
      });
    }
  }

  showErrorColor() {
    this.newName.classList.add('is-danger');
    this.nameValidation.classList.add('is-danger');
  }

  handleNameValidations() {
    if (!this.newName.value) {
      this.showErrorColor();
      this.nameValidation.innerText = "Name can't be blank.";
    } else if (this.newName.value.length < 3) {
      this.showErrorColor();
      this.nameValidation.innerText =
        'Name is too short (minimum is 3 characters).';
    } else if (new Set(this.names).size !== this.names.length) {
      this.showErrorColor();
      this.nameValidation.innerText = 'Name is already taken.';
    } else {
      this.newName.classList.remove('is-danger');
      this.newName.value = '';
      this.nameValidation.classList.contains('is-danger')
        ? this.nameValidation.classList.replace('is-danger', 'is-success')
        : this.nameValidation.classList.add('is-success');
      this.nameValidation.innerText = 'User was successfully added!';
      setTimeout(() => (this.nameValidation.innerText = ''), 1000);
    }
  }

  addUser(e) {
    e.preventDefault();
    this.names = this.users.map((user) => user.name);
    this.names.push(this.newName.value);
    if (
      !this.newName.value ||
      this.newName.value.length < 3 ||
      new Set(this.names).size !== this.names.length
    ) {
      this.handleNameValidations();
    } else {
      this.adapter.postUser(this.newName.value).then((user) => {
        this.users.push(new User(user));
        this.handleNameValidations();
        this.renderUserList();
      });
    }
  }

  deleteUser(e) {
    if (e.target.id === 'delete-user') {
      this.adapter.deleteUser(e.target.dataset.id).then((deletedUser) => {
        this.users = this.users.filter((user) => deletedUser.id !== user.id);
        localStorage.setItem('deletedUser', deletedUser.name);
        window.location.reload();
      });
    }
  }
}
