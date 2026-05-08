const LISDEXAMFETAMINE_FACTOR = 1 / 3;

const MEDICATIONS = {
  stimulants: {
    "Methylphenidate IR": { factor: 0.5 },
    Dexmethylphenidate: { factor: 1.0 },
    "Amphetamine Mixed Salts": { factor: 1.0 },
    Dextroamphetamine: { factor: 1.0 },
    Lisdexamfetamine: { factor: LISDEXAMFETAMINE_FACTOR }
  },
  moodStabilizers: {
    "Lithium Carbonate": { factor: 900 },
    Divalproex: { factor: 1000 },
    Lamotrigine: { factor: 150 },
    Carbamazepine: { factor: 800 }
  }
};

function convertDose(category, fromMedication, toMedication, doseMg) {
  const classData = MEDICATIONS[category];
  if (!classData || !classData[fromMedication] || !classData[toMedication]) {
    return null;
  }
  const input = Number(doseMg);
  if (!Number.isFinite(input) || input <= 0) {
    return null;
  }

  const fromFactor = classData[fromMedication].factor;
  const toFactor = classData[toMedication].factor;
  const converted = (input * fromFactor) / toFactor;
  return Math.round(converted * 10) / 10;
}

function populateMedicationOptions() {
  const category = document.getElementById("category").value;
  const meds = Object.keys(MEDICATIONS[category]);
  const fromSelect = document.getElementById("fromMed");
  const toSelect = document.getElementById("toMed");

  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";

  meds.forEach((medication) => {
    const fromOption = document.createElement("option");
    fromOption.value = medication;
    fromOption.textContent = medication;
    fromSelect.appendChild(fromOption);

    const toOption = document.createElement("option");
    toOption.value = medication;
    toOption.textContent = medication;
    toSelect.appendChild(toOption);
  });

  if (meds.length > 1) {
    toSelect.selectedIndex = 1;
  }
}

function handleConversion() {
  const category = document.getElementById("category").value;
  const fromMedication = document.getElementById("fromMed").value;
  const toMedication = document.getElementById("toMed").value;
  const dose = document.getElementById("dose").value;
  const resultNode = document.getElementById("result");

  const converted = convertDose(category, fromMedication, toMedication, dose);
  if (converted === null) {
    resultNode.textContent = "Please enter a valid dose and choose valid medications.";
    return;
  }

  resultNode.textContent = `${dose} mg of ${fromMedication} ≈ ${converted} mg of ${toMedication}.`;
}

if (typeof document !== "undefined") {
  document.getElementById("category").addEventListener("change", populateMedicationOptions);
  document.getElementById("convertBtn").addEventListener("click", handleConversion);
  populateMedicationOptions();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { MEDICATIONS, convertDose };
}
