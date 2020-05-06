const path = require("path");
// const { Storage } = require("@google-cloud/storage");
const fs = require("fs");

// const GOOGLE_CLOUD_PROJECT_ID = "becomegce"; // Replace with your project ID

// const gc = new Storage({
//   projectId: GOOGLE_CLOUD_PROJECT_ID,
//   keyFilename: path.join(__dirname, "./becomegce-196d7179563e.json")
// });

// const bucket = gc.bucket("geojson_translink");

const { Pool, Client } = require("pg");
const connectString =
  "postgressql://postgres:postgrespassword@localhost:5432/postgres";

const client = new Client({
  // connectionString: connectString
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgrespassword",
  port: 5432
});

client.connect();

client.query(
  "SELECT * from forgeojson WHERE issue_year='2019' ORDER BY sum DESC limit 30000",
  //ORDER BY sum DESC limit 50000
  // "SELECT * from forgeojson WHERE issue_year='2019' AND issue_month='12'",
  (err, res) => {
    // console.log(res);
    // console.log(err);
    const features = res.rows.map(stop => {
      return {
        type: "Feature",
        properties: {
          stopID: stop.origin_stop,
          stopName: stop.stop_name,
          //routeNum: stop.route,
          // year: stop.issue_year,
          month: stop.issue_month,
          qty: stop.sum / 10000
        },
        geometry: {
          type: "Point",
          coordinates: [stop.stop_lon, stop.stop_lat]
        }
      };
    });

    const geoJson2017to2019 = {
      type: "FeatureCollection",
      features: features
    };

    // console.log(geoJson2017to2019);
    fs.writeFileSync(
      "geojson/geoJson2019.json",
      JSON.stringify(geoJson2017to2019)
    );

    //   const file = bucket.file("geojson201912.json");
    //   file
    //     .save("./temp.json", {
    //       resumable: false,
    //       metadata: { contentType: "application/json" }
    //     })
    //     .then(() => console.log("done"))
    //     .catch(err => console.log(err));

    client.end();
  }
);
