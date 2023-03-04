//Sample for Assignment 3
const express = require("express");
//Import a body parser module to be able to access the request body as json
const bodyParser = require("body-parser");

//Use cors to avoid issues with testing on localhost
const cors = require("cors");

const app = express();

const port = 3000;

//Tell express to use the body parser module
app.use(bodyParser.json());

//Tell express to use cors -- enables CORS for this backend
app.use(cors());

//Set Cors-related headers to prevent blocking of local requests
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//The following is an example of an array of two tunes.The content has been shortened to make it readable
const tunes = [
  {
    id: "0",
    name: "Für Elise",
    genreId: "1",
    content: [
      { note: "E5", duration: "8n", timing: 0 },
      { note: "D#5", duration: "8n", timing: 0.25 },
      { note: "E5", duration: "8n", timing: 0.5 },
      { note: "D#5", duration: "8n", timing: 0.75 },
      { note: "E5", duration: "8n", timing: 1 },
      { note: "B4", duration: "8n", timing: 1.25 },
      { note: "D5", duration: "8n", timing: 1.5 },
      { note: "C5", duration: "8n", timing: 1.75 },
      { note: "A4", duration: "4n", timing: 2 },
    ],
  },
  {
    id: "1",
    name: "Seven Nation Army",
    genreId: "0",
    content: [
      { note: "E5", duration: "4n", timing: 0 },
      { note: "E5", duration: "8n", timing: 0.5 },
      { note: "G5", duration: "4n", timing: 0.75 },
      { note: "E5", duration: "8n", timing: 1.25 },
      { note: "E5", duration: "8n", timing: 1.75 },
      { note: "G5", duration: "4n", timing: 1.75 },
      { note: "F#5", duration: "4n", timing: 2.25 },
    ],
  },
];

const genres = [
  { id: "0", genreName: "Rock" },
  { id: "1", genreName: "Classic" },
];

//Your endpoints go here

const API = "/api";
const V1 = "/v1/";
let tuneID = 2;
let genreID = 2;

// Búinn / þarf að fara yfir
//TODO Yfirfara og prófa
app.get(API + V1 + "tunes", (req, res) => {
  const { name } = req.query;
  const display = tunes.map(({ id, name, genreId }) => ({ id, name, genreId }));
  let genId;

  if (name) {
    genres.forEach((genre) => {
      if (genre.genreName.toLowerCase() == name.toLowerCase()) {
        genId = genre.id;
      }
    });
    const ret = [];

    if (!genId) {
      return res.status(200).json(ret);
    }

    display.forEach((tune) => {
      if (tune.genreId == genId) {
        ret.push(tune);
      }
    });
    return res.status(200).json(ret);
  }

  res.status(200).json(display);
});

// Finished
//TODO Yfirfara og prófa
app.get(API + V1 + "tunes/:tuneId", (req, res) => {
  const { tuneId } = req.params;
  let ret;

  tunes.forEach((tune) => {
    if (tune.id == tuneId) {
      ret = tune;
    }
  });

  if (ret) {
    return res.status(200).json(ret);
  } else {
    res.status(404).send("Tune not found");
  }
});

// Held að þessi sé klár
//TODO Yfirfara og prófa
app.post(API + V1 + "tunes/:genreId", (req, res) => {
  //TODO samkvæmt lýsingu á time breytan fyrir nótuna að vera INT

  const genId = req.params.genreId;
  const { name, content } = req.body;

  if (!name || !content || !content.length) {
    return res
      .status(400)
      .send("Message: Name and none empty content are required in the body");
  }

  if (!genres.some((genre) => genre.id == genId)) {
    return res.status(404).send("Genre does not exist");
  }

  tunes.push({
    id: tuneID.toString(),
    name: name,
    genreId: genId,
    content: content,
  });

  tuneID++;

  res.status(200).json(tunes.at(-1));
});



//TODO Yfirfara og prófa
// breyta öllu nema genre
app.patch(API + V1 + "tunes/:tId/", (req, res) => {
  const { name, content } = req.body;
  const { tuneId } = req.params;

  let tuneIndex;

  tunes.forEach((tune) => {
    if (tune.id == tuneId) {
      tuneIndex = tunes.indexOf(tune);
    }
  });

  if (tuneIndex === undefined) {
    return res.status(404).send("Message: Tune not found");
  }

  const current = tunes[tuneIndex];

  if (!name && !content) {
    return res.status(200).json(tunes[tuneIndex]);
  }

  if (name) {
    current.name = name;
  }
  if (content && content.length > 0) {
    current.content = content;
  }

  tunes[tuneIndex] = current;

  res.status(200).json(tunes[tuneIndex]);
});

app.patch(API + V1 + "tunes/:tuneId/:genreId", (req, res) => {
  const { name, genreId, content } = req.body;
  const { tuneId, genId } = req.params;

  res.status(200).send("update part of tune " + req.params.tuneId);
});

//TODO Yfirfara og prófa
app.get(API + V1 + "genres", (req, res) => {
  //TODO create
  res.status(200).json(genres);
});

app.post(API + V1 + "genres", (req, res) => {
  //TODO create new genre
  res.status(200).send("create new genre");
});

app.delete(API + V1 + "genres/:genreId", (req, res) => {
  //TODO delet genre if empty
  res.status(200).send("Delete genre");
});

app.get(API + V1 + "genres/:genreId/tunes/:tuneId", (req, res) => {
  //TODO get something
  res
    .status(200)
    .send(
      "Get tune with id " +
        req.params.tuneId +
        " from genre with id " +
        req.params.genreId
    );

  tunes.forEach((tune) => {
    if (req.params.genreId == tune.id) {
    }
  });
});

// Allt annað
app.use("*", (req, res) => {
  res.status(405).send("Operation not supported.");
});

//Start the server
app.listen(port, () => {
  console.log("Tune app listening on port: " + port);
});
