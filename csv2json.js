const csvToJson = require("convert-csv-to-json");

const input = "./data/trips20191201.csv";
const output = "./geojson/trips20191201.json";

csvToJson
  .fieldDelimiter(",")
  // .formatValueByType()
  .generateJsonFileFromCsv(input, output);
