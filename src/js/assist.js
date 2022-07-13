const female_names = require("@stdlib/datasets-female-first-names-en")();
const male_names = require("@stdlib/datasets-male-first-names-en")();
const both_names = male_names.concat(female_names);
const custom_names = [
  "Swole Torchic",
  "Ceefs",
  "Meefs",
  "David but not Copperfield",
  "Prussia",
  "hdert",
];
const names = both_names.concat(custom_names);
// console.log(female_names());
// console.log(male_names());
console.log(names);

var fs = require("fs");

var message =
  '{\n  "locals": {\n    unisex: ' + JSON.stringify(names) + "\n  }\n}";

fs.writeFile(".pugrc", message, function (err, file) {
  if (err) throw err;
  console.log("Success!");
});
