// Stimulant equivalents are expressed as: how many mg of methylphenidate IR
// (MPH-IR) equal 1 mg of the listed agent. Values reflect commonly cited
// clinical equivalence ranges; individual response varies.
const STIMULANTS = [
  { id: "mph-ir",      name: "Methylphenidate IR (Ritalin)",            factor: 1.0 },
  { id: "mph-er",      name: "Methylphenidate ER (Ritalin LA, Metadate CD)", factor: 1.0 },
  { id: "mph-oros",    name: "Methylphenidate OROS (Concerta)",         factor: 0.83 },
  { id: "dexmph-ir",   name: "Dexmethylphenidate IR (Focalin)",         factor: 2.0 },
  { id: "dexmph-er",   name: "Dexmethylphenidate ER (Focalin XR)",      factor: 2.0 },
  { id: "mas-ir",      name: "Mixed amphetamine salts IR (Adderall)",   factor: 2.0 },
  { id: "mas-xr",      name: "Mixed amphetamine salts XR (Adderall XR)", factor: 2.0 },
  { id: "damp-ir",     name: "Dextroamphetamine IR (Dexedrine)",        factor: 2.0 },
  { id: "damp-sp",     name: "Dextroamphetamine spansule (Dexedrine SR)", factor: 2.0 },
  { id: "lisdex",      name: "Lisdexamfetamine (Vyvanse)",              factor: 0.66 },
];

// Mood stabilizer "equivalents" use typical adult target daily doses for
// educational comparison only. These are not pharmacologic equivalents.
const MOOD_STABILIZERS = [
  { id: "lithium",     name: "Lithium carbonate",      targetDose: 900,  unit: "mg/day" },
  { id: "valproate",   name: "Valproate (Depakote)",   targetDose: 1000, unit: "mg/day" },
  { id: "carbamazepine", name: "Carbamazepine (Tegretol)", targetDose: 600,  unit: "mg/day" },
  { id: "oxcarbazepine", name: "Oxcarbazepine (Trileptal)", targetDose: 1200, unit: "mg/day" },
  { id: "lamotrigine", name: "Lamotrigine (Lamictal)", targetDose: 200,  unit: "mg/day" },
  { id: "topiramate",  name: "Topiramate (Topamax)",   targetDose: 200,  unit: "mg/day" },
];

function populateSelect(select, options, defaultId) {
  select.innerHTML = "";
  for (const opt of options) {
    const o = document.createElement("option");
    o.value = opt.id;
    o.textContent = opt.name;
    if (opt.id === defaultId) o.selected = true;
    select.appendChild(o);
  }
}

function renderTable(table, headers, rows) {
  const thead = `<thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody>`;
  table.innerHTML = thead + tbody;
}

function roundDose(n) {
  if (!isFinite(n) || n <= 0) return 0;
  if (n < 5) return Math.round(n * 4) / 4;
  if (n < 25) return Math.round(n * 2) / 2;
  if (n < 100) return Math.round(n);
  return Math.round(n / 5) * 5;
}

function setupStimulants() {
  const fromSel = document.getElementById("stim-from");
  const toSel = document.getElementById("stim-to");
  const dose = document.getElementById("stim-from-dose");
  const result = document.getElementById("stim-result");

  populateSelect(fromSel, STIMULANTS, "mph-ir");
  populateSelect(toSel, STIMULANTS, "mas-ir");

  function recalc() {
    const from = STIMULANTS.find((s) => s.id === fromSel.value);
    const to = STIMULANTS.find((s) => s.id === toSel.value);
    const mg = parseFloat(dose.value);
    if (!from || !to || !isFinite(mg) || mg <= 0) {
      result.textContent = "—";
      return;
    }
    const mphEquiv = mg * from.factor;
    const target = mphEquiv / to.factor;
    result.textContent = `${roundDose(target)} mg`;
  }

  for (const el of [fromSel, toSel, dose]) {
    el.addEventListener("input", recalc);
    el.addEventListener("change", recalc);
  }

  renderTable(
    document.getElementById("stim-table"),
    ["Medication", "MPH-IR equivalent (per mg)"],
    STIMULANTS.map((s) => [s.name, s.factor.toFixed(2)])
  );
}

function setupMoodStabilizers() {
  const fromSel = document.getElementById("mood-from");
  const toSel = document.getElementById("mood-to");
  const dose = document.getElementById("mood-from-dose");
  const result = document.getElementById("mood-result");

  populateSelect(fromSel, MOOD_STABILIZERS, "lithium");
  populateSelect(toSel, MOOD_STABILIZERS, "valproate");

  function recalc() {
    const from = MOOD_STABILIZERS.find((m) => m.id === fromSel.value);
    const to = MOOD_STABILIZERS.find((m) => m.id === toSel.value);
    const mg = parseFloat(dose.value);
    if (!from || !to || !isFinite(mg) || mg <= 0) {
      result.textContent = "—";
      return;
    }
    const fraction = mg / from.targetDose;
    const target = fraction * to.targetDose;
    result.textContent = `${roundDose(target)} mg/day`;
  }

  for (const el of [fromSel, toSel, dose]) {
    el.addEventListener("input", recalc);
    el.addEventListener("change", recalc);
  }

  renderTable(
    document.getElementById("mood-table"),
    ["Medication", "Typical adult target"],
    MOOD_STABILIZERS.map((m) => [m.name, `${m.targetDose} ${m.unit}`])
  );
}

function setupTabs() {
  const tabs = {
    stim: { btn: document.getElementById("tab-stim"), panel: document.getElementById("panel-stim") },
    mood: { btn: document.getElementById("tab-mood"), panel: document.getElementById("panel-mood") },
  };

  function activate(key) {
    for (const [k, t] of Object.entries(tabs)) {
      const active = k === key;
      t.btn.classList.toggle("active", active);
      t.btn.setAttribute("aria-selected", active ? "true" : "false");
      t.panel.classList.toggle("hidden", !active);
    }
  }

  tabs.stim.btn.addEventListener("click", () => activate("stim"));
  tabs.mood.btn.addEventListener("click", () => activate("mood"));
}

setupStimulants();
setupMoodStabilizers();
setupTabs();
