document.addEventListener('DOMContentLoaded', () => {
  notes.getUnnamedNotes();
  notes.showDetails();
  notes.addNote();
  notes.editNote();
  notes.deleteNote();
  users.getUsers();
  users.selectUser();
  users.addUser();
});
