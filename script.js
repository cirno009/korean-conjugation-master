let wordData = [];
let streak = 0;
let maxStreak = 0;
let currentAnswer = "";
let isAwaitingNext = false;
let translationAfter = false;
let toggledFormIndex = []
document.getElementById("options-button").onclick = toggleOptions
document.getElementById("streak-checkbox").checked = true
document.getElementById("verbpresent-checkbox").checked = true
document.getElementById("verbpast-checkbox").checked = true
document.getElementById("verbfuture-checkbox").checked = true
document.getElementById("verbplain-checkbox").checked = true
document.getElementById("verbpolite-checkbox").checked = true
document.getElementById("verbverypolite-checkbox").checked = true

const conjugationForms = [
  "present (반말)", "present formal (해요체)", "present very formal (습니다)",
  "past (반말)", "past formal (해요체)", "past very formal (습니다)",
   "future (반말)", "future formal (해요체)", "future very formal (습니다)",
   "imperative (반말)", "imperative formal (세요)", "imperative very formal (십시오)"
];

const key = ["pr", "prf", "prff", "pa", "paf", "paff", "f", "ff", "fff", "pr", "i", "if"];

fetch('worddata.json')
    .then(res => res.json())
    .then(data => {
        wordData = data;
        init();
    });

function init() {
    const inputField = document.getElementById("main-text-input");
    inputField.addEventListener("keydown", onInput);
    generateQuestion();
}

function onInput(event) {
    if (event.key !== "Enter") return;
    const inputField = document.getElementById("main-text-input");
    const userInput = inputField.value.trim();

    if (!isAwaitingNext) {
        if (!controlInput(userInput)) {
            const tooltip = document.getElementById("input-tooltip");
            tooltip.classList.remove("tooltip-fade-animation");
            void tooltip.offsetWidth;
            tooltip.classList.add("tooltip-fade-animation");
            return;
        }

        if (userInput === currentAnswer) {
            streak++;
            if (translationAfter) {
                document.getElementById("translation").classList.remove("display-none")
            }
            maxStreak = Math.max(maxStreak, streak);
            updateStatus("Correct", "green");
        } else {
            streak = 0;
            if (translationAfter) {
                document.getElementById("translation").classList.remove("display-none")
            }
            updateStatus(`Incorrect. Correct answer is ${currentAnswer}`, "red");
        }

        updateStreakDisplay();
        inputField.value = "";
        isAwaitingNext = true;
    } else {
        hideStatus();
        generateQuestion();
        isAwaitingNext = false;
    }
}

function generateQuestion() {
    const wordIndex = Math.floor(Math.random() * wordData.length);
    let formIndex;
    do {
        formIndex = Math.floor(Math.random() * conjugationForms.length);
    } while (toggledFormIndex.includes(formIndex))
    currentAnswer = wordData[wordIndex][key[formIndex]];

    document.getElementById("verb-text").innerText = wordData[wordIndex].word;
    document.getElementById("conjugation-inquery-text").innerText = conjugationForms[formIndex];
    document.getElementById("translation").innerText = wordData[wordIndex].tr;
    if (translationAfter) {
        document.getElementById("translation").classList.add("display-none")
    }
}

function updateStatus(message, color) {
    const statusBox = document.getElementById("status-box");
    const statusText = document.getElementById("status-text");
    statusBox.style.backgroundColor = color;
    statusText.innerText = message;
    statusBox.classList.remove("display-none");
}

function hideStatus() {
    document.getElementById("status-box").classList.add("display-none");
}

function updateStreakDisplay() {
    document.getElementById("current-streak-text").innerText = streak;
    document.getElementById("max-streak-text").innerText = maxStreak;
}

function controlInput(input) {
    const match = input.match(/[\uac00-\ud7af]|[\u1100-\u11ff]|[\u3130-\u318f]|[\ua960-\ua97f]|[\ud7b0-\ud7ff]|\s/g);
    return match ? match.length === input.length : false;
}

function toggleOptions() {
    document.getElementById("main-view").classList.add("display-none")
    document.getElementById("options-view").classList.remove("display-none")
    document.getElementById("donation-section").classList.remove("display-none")
}

document.getElementById("options-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!document.getElementById("translation-always-radio").checked && !document.getElementById("translation-after-radio").checked && document.getElementById("translation-checkbox").checked) {
        document.getElementById("top-must-choose").classList.remove("display-none");
        return;
    } else if (document.getElementById("translation-after-radio").checked) {
        translationAfter = true
        document.getElementById("translation").classList.add("display-none")
    } else {
        translationAfter = false
    }
    document.getElementById("main-view").classList.remove("display-none")
    document.getElementById("options-view").classList.add("display-none")
    document.getElementById("top-must-choose").classList.add("display-none");
    document.getElementById("conjugation-must-choose").classList.add("display-none")
    document.getElementById("donation-section").classList.add("display-none")
    document.getElementById("politeness-must-choose").classList.add("display-none")
    applySettings();
    generateQuestion()
})

function applySettings(){
    // const translation = document.getElementById("translation-checkbox").checked;
    // const streak = document
    toggleTranslation(document.getElementById("translation-checkbox").checked)
    toggleStreak(document.getElementById("streak-checkbox").checked)
    togglePresent(document.getElementById("verbpresent-checkbox").checked)
    togglePast(document.getElementById("verbpast-checkbox").checked)
    toggleFuture(document.getElementById("verbfuture-checkbox").checked)
}

function toggleTranslation(enabled) {
    if (enabled) {
        document.getElementById("translation").classList.remove("display-none")
    } else {
        document.getElementById("translation").classList.add("display-none")
    }
}

function toggleStreak(enabled) {
    if (enabled) {
        document.getElementById("current-streak").classList.remove("display-none")
        document.getElementById("current-streak-text").classList.remove("display-none")
        document.getElementById("max-streak").classList.remove("display-none")
        document.getElementById("max-streak-text").classList.remove("display-none")
    } else {
        document.getElementById("current-streak").classList.add("display-none")
        document.getElementById("current-streak-text").classList.add("display-none")
        document.getElementById("max-streak").classList.add("display-none")
        document.getElementById("max-streak-text").classList.add("display-none")
    }
}
