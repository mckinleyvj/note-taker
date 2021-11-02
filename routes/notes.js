const notes = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

// GET Route to read db.json
notes.get('/', (req, res) => {
  //console.info(`${req.method} request received for notes.`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.post('/', (req, res) => {
  // console.info(`${req.method} request received to add a note.`);
  // console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };
    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding note');
  }
});

notes.delete('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  //console.log(noteId);
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((theNote) => theNote.note_id !== noteId)
      //Save that array to the filesystem
      writeToFile('./db/db.json', result);
      
      // Respond to the DELETE request
      //res.json(`Item ${tipId} has been deleted 🗑️`);
    });
});

module.exports = notes;