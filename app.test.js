const assert = require("assert");
const { convertDose } = require("./app");

assert.strictEqual(
  convertDose("stimulants", "Methylphenidate IR", "Amphetamine Mixed Salts", 20),
  10
);
assert.strictEqual(
  convertDose("stimulants", "Lisdexamfetamine", "Methylphenidate IR", 30),
  20
);
assert.strictEqual(
  convertDose("stimulants", "Amphetamine Mixed Salts", "Amphetamine Mixed Salts", 25),
  25
);
assert.strictEqual(
  convertDose("moodStabilizers", "Lamotrigine", "Lithium Carbonate", 200),
  33.3
);
assert.strictEqual(
  convertDose("moodStabilizers", "Lithium Carbonate", "Divalproex", 900),
  810
);
assert.strictEqual(
  convertDose("moodStabilizers", "Lithium Carbonate", "Divalproex", 0),
  null
);
assert.strictEqual(
  convertDose("invalidCategory", "Lithium Carbonate", "Divalproex", 900),
  null
);
assert.strictEqual(
  convertDose("stimulants", "Not A Medication", "Dextroamphetamine", 10),
  null
);
assert.strictEqual(
  convertDose("stimulants", "Dextroamphetamine", "Not A Medication", 10),
  null
);

console.log("All app conversion tests passed.");
