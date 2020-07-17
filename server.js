const fs = require("fs");
const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let notes = [];

app.use(express.static(__dirname + '/public'));

//html routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/assets/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/assets/notes.html"));
});

//api calls
app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "db/db.json"), (err, notes) => {
        if (err) throw err;
    })
    return res.json(notes)
});

app.post("/api/notes", (req, res) => {
    newNote = req.body
    notes.push(newNote);
    notes.forEach((note) => {
        note.id = uuidv4();
    });
    fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
        if (err) throw err;
    });
    res.end();
});

app.delete("/api/notes/:id", (req, res) => {
    console.log(req.params.id);
    let newNotes = notes.filter(note => note.id != req.params.id); 
    // console.log(notes[0].id);
    // console.log(newNotes);
    fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(newNotes), (err) => {
        if (err) throw err;
        notes = newNotes
    });
    res.end();
});


app.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT)
})


