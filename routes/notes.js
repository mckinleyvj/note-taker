const notes = require('express').Router();
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
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

// notes.get("/api/notes/:id", function(req,res) {
//   res.json(notes[req.params.id]);
// });

// notes.delete("/api/notes/:id", function(req, res) {
//   notes.splice(req.params.id, 1);
// });

module.exports = notes;