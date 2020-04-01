const path = require("path");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");

const GOOGLE_CLOUD_PROJECT_ID = "becomegce"; // Replace with your project ID

const gc = new Storage({
  projectId: GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: path.join(__dirname, "./becomegce-196d7179563e.json")
});

const bucket = gc.bucket("geojson_translink");

const { Pool, Client } = require("pg");
const connectString =
  "postgressql://postgres:postgrespassword@localhost:5432/postgres";

const client = new Client({
  connectionString: connectString
});

client.connect();

client.query("SELECT * from stops_inbound_qty", (err, res) => {
  const features = res.rows.map(stop => {
    return {
      type: "Feature",
      properties: { stopID: stop.origin_stop, qty: stop.sum / 10000 },
      geometry: {
        type: "Point",
        coordinates: [stop.stop_lon, stop.stop_lat]
      }
    };
  });

  const geoJson201912 = {
    type: "FeatureCollection",
    features: features
  };

  console.log(geoJson201912);
  fs.writeFileSync("temp.json", JSON.stringify(geoJson201912));

  //   const file = bucket.file("geojson201912.json");
  //   file
  //     .save("./temp.json", {
  //       resumable: false,
  //       metadata: { contentType: "application/json" }
  //     })
  //     .then(() => console.log("done"))
  //     .catch(err => console.log(err));

  client.end();
});
