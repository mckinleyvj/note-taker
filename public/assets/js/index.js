const $noteTitle = $('.note-title');
const $noteText = $('.note-textarea');
const $saveNoteBtn = $('.save-note');
const $newNoteBtn = $('.new-note');
const $noteList = $('.list-container .list-group');

let activeNote = {};

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
  
const deleteNote = (id) => { 
  return fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
};

const renderActiveNote = () => {
  $saveNoteBtn.hide();
  if ( typeof activeNote.note_id === "string") {
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

var handleNoteDelete = (e) => {
  e.stopPropagation();

  var note = e.target.parentElement.getAttribute('id');
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  if (activeNote.note_id === note) {
    activeNote = {};
  }

  deleteNote(note);
  getAndRenderNotes();
  renderActiveNote();
  location.reload();
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

const handleNoteView = (e) => {
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
  $noteTitle.focus();
};

const handleRenderSaveBtn = () => {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

const renderNoteList = (notes) => {
  $noteList.empty();

  const noteListItems = [];
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];

      const str_note = JSON.stringify(note);

      const $liEl = $("<li>")
      .addClass('list-group-item')
      .attr('data-note', str_note)
      .attr('id',note.note_id);
        
      const $spanEl = $('<span>')
      .addClass('list-item-title')
      .text(note.title);
  
      $liEl.append($spanEl);
      
      const $delBtnEl = $('<i>')
        .addClass('fas fa-trash-alt float-right text-danger delete-note');

      $liEl.append($spanEl,$delBtnEl )
      noteListItems.push($liEl);
   };
   $noteList.append(noteListItems);
};

const getAndRenderNotes = () => {
  return getNotes().then((data) => { renderNoteList(data) });
};

$(window).ready(() => {
  $saveNoteBtn.on('click', handleNoteSave);
  $newNoteBtn.on('click', handleNewNoteView);
  $noteTitle.on('keyup', handleRenderSaveBtn);
  $noteText.on('keyup', handleRenderSaveBtn);
  $noteList.on('click', ".list-group-item", handleNoteView);
  $noteList.on('click', ".delete-note", handleNoteDelete);
});

getAndRenderNotes();
