const $noteTitle = $('.note-title');
const $noteText = $('.note-textarea');
const $saveNoteBtn = $('.save-note');
const $newNoteBtn = $('.new-note');
const $noteList = $('.list-container .list-group');

var activeNote = {};

const getNotes = () => {
  return fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => { return data })
    .catch((error) => {
      console.error('Error:', error);
  });
};

const saveNote = (note) => {
  return fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  })
    .then((res) => res.json())
    .then((data) => {console.log(data)})
    .catch((error) => {
      console.error('Error:', error);
  });
};
  
// const deleteNote = (id) => { 
//   return fetch(`/api/notes/${id}`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
// };

const renderActiveNote = () => {
  $saveNoteBtn.hide();
  console.log(typeof activeNote);
  if (typeof activeNote === "object") {
    $noteTitle.attr('readonly', true);
    $noteText.attr('readonly', true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.removeAttr('readonly');
    $noteText.removeAttr('readonly');
    $noteTitle.val('');
    $noteText.val('');
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: $noteTitle.val(),
    text: $noteText.val(),
  }
  saveNote(newNote).then(() => {
        getAndRenderNotes();
        renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  //.attr('data-note')
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// Render the list of note titles
const renderNoteList = (notes) => {
  $noteList.empty();

  const noteListItems = [];
  // Returns HTML element with or without a delete button
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];

      const str_note = JSON.stringify(note);

      const $liEl = $("<li>")
      .addClass('list-group-item')
      .attr('data-note', str_note)
      .attr('id',i);
        
      const $spanEl = $('<span>')
      .addClass('list-item-title')
      .text(note.title);
  
      $liEl.append($spanEl);
      
        const $delBtnEl = $('<i>')
        .addClass(
          'fas',
          'fa-trash-alt',
          'float-right',
          'text-danger',
          'delete-note');
        // .on('click', handleNoteDelete);

      $liEl.append($spanEl, $delBtnEl);
      noteListItems.push($liEl);
   };
   $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => {
  return getNotes().then((data) => { renderNoteList(data) });
};

$(window).ready(() => {
  $saveNoteBtn.on('click', handleNoteSave);
  $newNoteBtn.on('click', handleNewNoteView);
  $noteTitle.on('keyup', handleRenderSaveBtn);
  $noteText.on('keyup', handleRenderSaveBtn);
  $noteList.on('click', ".list-group-item", handleNoteView);
});

getAndRenderNotes();
