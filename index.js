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
let tuneID = tunes.length;
let genreID = genres.length;

// Búinn / þarf að fara yfir
// TODO Yfirfara og prófa
//1. Lestu öll lögin 
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
//2. Lesið einstakt lag.
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
//3. Búðu til nýtt lag.
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
app.patch(API + V1 + "tunes/:tuneId/", (req, res) => {
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

//TODO eftir að gera, spurning hvort hægt sé að búa til function sem hægt er að nota í þessu falli og fallinu fyrir ofan

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

//TODO Yfirfara og prófa
app.post(API + V1 + "genres", (req, res) => {
  //TODO create new genre
  const { genreName } = req.body;

  if (!genreName) {
    return res.status(400).send("Message: genreName is required in the body.");
  }

  genres.forEach((genre) => {
    if (genre.genreName === genreName) {
      return res.status(400).send("Message: Genre already exists.");
    }
  });

  genres.push({
    id: genreID.toString(),
    genreName: genreName,
  });
  genreID++;

  res.status(201).json(genres.at(-1));
});

//TODO Yfirfara og prófa
app.delete(API + V1 + "genres/:genreId", (req, res) => {
  const { genreId } = req.params;

  const pos = genres.map((e) => e.id).indexOf(genreId.toString());

  if (pos === -1) {
    return res
      .status(404)
      .send("Message: Genre with id " + genreId + " not found.");
  }

  tunes.forEach((tune) => {
    if (tune.genreId == genreId) {
      return res
        .status(400)
        .send(
          "message: Genre " + genres[pos].genreName + " has tunes. Not deleted!"
        );
    }
  });

  const ret = genres.splice(pos, pos + 1);

  res.status(200).json(ret);
});

// Endapunktar miðað við framenda

//TODO eftir að klára
app.get(API + V1 + "genres/:genreId/tunes/:tuneId", (req, res) => {
  const { genreId, tuneId } = req.params;

  let found = false

  tunes.forEach((tune) => {
    if (tune.id == tuneId && tune.genreId == genreId) {
      found = true
      return res.status(200).json(tune);
    }
  });
  if (!found) {
    res.status(404).send("Message: Tune not found");
  }
});

app.post(API + V1 + "genres/:genreId/tunes", (req, res) => {
  const genId = req.params.genreId;
  const { name, content } = req.body;

  if (!name || !content || !content.length) {
    return res
      .status(400)
      .send("Message: Name and none empty content are required in the body");
  }

  if (!(genres.map((e) => e.id).includes(genId.toString()))){
    return res.status(404).send("Message: Genre not found")
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

// Allt annað
app.use("*", (req, res) => {
  res.status(405).send("Operation not supported.");
});

//Start the server
app.listen(port, () => {
  console.log("Tune app listening on port: " + port);
});
