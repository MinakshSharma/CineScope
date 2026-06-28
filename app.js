// required all the packages
const express = require("express");
const path = require("path");
const app = express();
const port = 8080;

// done required configurations:
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// home page of our web app:
app.get("/", (req, res) => {
  res.render("index.ejs", { movie: {} }); // Initialize movie object with empty object
});

// post request for collecting form submission details and extract api response details.
app.post("/", async (req, res) => {
  let { apikey, t } = req.body;
  let url = `http://www.omdbapi.com/?apikey=${apikey}&t=${t}`;

  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network is slow " + response.statusText);
    }
    const result = await response.json(); // Convert response to JSON
    const movie = {
      title: result.Title,
      duration: result.Runtime,
      year: result.Year,
      Released: result.Released,
      Genre: result.Genre,
      Director: result.Director,
      Actor: result.Actors,
      desc: result.Plot,
      language: result.Language,
      Image: result.Poster,
      Ratings: result.Ratings,
    };
    res.render("index.ejs", { movie });
  } catch (err) {
    res.render("index.ejs", { movie: {} }); // Render the "Movie not found" message
  }
});

app.listen(port, () => {
  console.log(`app is listening to the port ${port}`);
});
