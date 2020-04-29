const csvToJson = require("convert-csv-to-json");

const input = "./data/test.csv";
const output = "./data/test.json";

csvToJson
  .fieldDelimiter(",")
  .formatValueByType()
  .generateJsonFileFromCsv(input, output);
