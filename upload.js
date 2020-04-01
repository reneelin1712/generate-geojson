const path = require("path");
const { Storage } = require("@google-cloud/storage");

const GOOGLE_CLOUD_PROJECT_ID = "becomegce"; // Replace with your project ID

const gc = new Storage({
  projectId: GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: path.join(__dirname, "./becomegce-196d7179563e.json")
});

const bucket = gc.bucket("geojson_translink");

const file = bucket.file("tempgeojson201912.json");
file
  .save(
    "./temp201912.json"
    //   {
    //     resumable: false,
    //      metadata: { contentType: "application/json" }
    //   }
  )
  .then(() => console.log("done"))
  .catch(err => console.log(err));
