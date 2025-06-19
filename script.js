let wordData = [];
let streak = 0;
let maxStreak = 0;
let currentAnswer = "";
let isAwaitingNext = false;
let translationAfter = false;
let showStreak = true;
let showEmoji = false;
let toggledFormIndex = []

// document.getElementById("streak-checkbox").checked = true
// document.getElementById("verbpresent-checkbox").checked = true
// document.getElementById("verbpast-checkbox").checked = true
// document.getElementById("verbfuture-checkbox").checked = true
// document.getElementById("verbplain-checkbox").checked = true
// document.getElementById("verbpolite-checkbox").checked = true
// document.getElementById("verbverypolite-checkbox").checked = true

const conjugationForms = [
  "present (반말)", "present polite (해요체)", "present formal (습니다)",
  "past (반말)", "past polite (해요체)", "past formal (습니다)",
   "future (반말)", "future polite (해요체)", "future formal (습니다)",
   "imperative (반말)", "imperative polite (세요)", "imperative formal (십시오)"
];

const key = ["pr", "prf", "prff", "pa", "paf", "paff", "f", "ff", "fff", "pr", "i", "if"];

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("options-button").onclick = toggleOptions
    fetch('worddata.json')
        .then(res => res.json())
        .then(data => {
            wordData = data;
            init();
        });
})

function init() {
    // loadSettingsFromLocalStorage(); // ← Load first
    applySettings();                // ← Apply based on saved data
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
            // localStorage.setItem("maxStreak", maxStreak); // Save max streak to local storage
            updateStatus(`Correct.\n${currentAnswer} ○`, "green");
        } else {
            streak = 0;
            if (translationAfter) {
                document.getElementById("translation").classList.remove("display-none")
            }
            updateStatus(`${userInput} ×\n${currentAnswer} ○`, "red");
        }

        if (showStreak) {
            updateStreakDisplay();
        }
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

    const tenseEmoji = getTenseEmoji(formIndex);
    const politenessEmoji = getPolitenessEmoji(formIndex);
    document.getElementById("conjugation-inquery-text").innerText = conjugationForms[formIndex];
    document.querySelector(".tense-emoji").innerText = tenseEmoji;
    document.querySelector(".politeness-emoji").innerText = politenessEmoji;
    document.getElementById("emoji-indicators").classList.toggle("display-none", !showEmoji);
    document.getElementById("translation").innerText = wordData[wordIndex].tr;
    if (translationAfter) {
        document.getElementById("translation").classList.add("display-none")
    }
}

function getTenseEmoji(formIndex) {
    if (formIndex >= 0 && formIndex <= 2) return '⚡'; // Present
    if (formIndex >= 3 && formIndex <= 5) return '⏪'; // Past
    if (formIndex >= 6 && formIndex <= 8) return '🔮'; // Future
    if (formIndex >= 9 && formIndex <= 11) return '❗'; // Imperative
    return '⚡';
}

function getPolitenessEmoji(formIndex) {
    const politenessIndex = formIndex % 3;
    if (politenessIndex === 0) return '😎'; // Plain (반말)
    if (politenessIndex === 1) return '😊'; // Polite (해요체)
    if (politenessIndex === 2) return '🎩'; // Very formal (습니다체)
    return '😎';
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
    if (!document.getElementById("verbpresent-checkbox").checked && !document.getElementById("verbpast-checkbox").checked && !document.getElementById("verbfuture-checkbox").checked && !document.getElementById("verbimperative-checkbox").checked) {
        document.getElementById("conjugation-must-choose").classList.remove("display-none");
        return;
    }
    if (!document.getElementById("verbplain-checkbox").checked && !document.getElementById("verbpolite-checkbox").checked && !document.getElementById("verbverypolite-checkbox").checked) {
        document.getElementById("politeness-must-choose").classList.remove("display-none");
        return;
    }
    document.getElementById("main-view").classList.remove("display-none")
    document.getElementById("options-view").classList.add("display-none")
    document.getElementById("top-must-choose").classList.add("display-none");
    document.getElementById("conjugation-must-choose").classList.add("display-none")
    document.getElementById("donation-section").classList.add("display-none")
    document.getElementById("politeness-must-choose").classList.add("display-none")
    applySettings();
    // saveSettingsToLocalStorage();
    generateQuestion()
})

function applySettings() {
    const present = document.getElementById("verbpresent-checkbox").checked;
    const past = document.getElementById("verbpast-checkbox").checked;
    const future = document.getElementById("verbfuture-checkbox").checked;
    const imperative = document.getElementById("verbimperative-checkbox").checked;

    const plain = document.getElementById("verbplain-checkbox").checked;
    const polite = document.getElementById("verbpolite-checkbox").checked;
    const veryPolite = document.getElementById("verbverypolite-checkbox").checked;

    toggledFormIndex = [];

    const tenseFlags = [present, past, future, imperative];
    const politenessFlags = [plain, polite, veryPolite];

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            const formIndex = i * 3 + j;
            if (!tenseFlags[i] || !politenessFlags[j]) {
                toggledFormIndex.push(formIndex);
            }
        }
    }
    toggleTranslation(document.getElementById("translation-checkbox").checked)
    toggleStreak(document.getElementById("streak-checkbox").checked)
    toggleEmoji(document.getElementById("emojis-checkbox").checked)
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
        showStreak = true
    } else {
        document.getElementById("current-streak").classList.add("display-none")
        document.getElementById("current-streak-text").classList.add("display-none")
        document.getElementById("max-streak").classList.add("display-none")
        document.getElementById("max-streak-text").classList.add("display-none")
        showStreak = false
    }
}

function toggleEmoji(enabled) {
    console.log("test")
    if (enabled) {
        document.getElementById("emoji-indicators").classList.remove("display-none")
        showEmoji = true
    } else {
        document.getElementById("emoji-indicators").classList.add("display-none")
        showEmoji = false
    }
}

// function saveSettingsToLocalStorage() {
//     const settingIds = [
//         "translation-checkbox", "translation-always-radio", "translation-after-radio",
//         "streak-checkbox", "emojis-checkbox",
//         "verbpresent-checkbox", "verbpast-checkbox", "verbfuture-checkbox", "verbimperative-checkbox",
//         "verbplain-checkbox", "verbpolite-checkbox", "verbverypolite-checkbox"
//     ];

//     settingIds.forEach(id => {
//         const el = document.getElementById(id);
//         if (el) {
//             localStorage.setItem(id, el.checked);
//         }
//     });

//     localStorage.setItem("maxStreak", maxStreak); // store max streak too
// }

// function loadSettingsFromLocalStorage() {
//     const settingIds = [
//         "translation-checkbox", "translation-always-radio", "translation-after-radio",
//         "streak-checkbox", "emojis-checkbox",
//         "verbpresent-checkbox", "verbpast-checkbox", "verbfuture-checkbox", "verbimperative-checkbox",
//         "verbplain-checkbox", "verbpolite-checkbox", "verbverypolite-checkbox"
//     ];

//     settingIds.forEach(id => {
//         const el = document.getElementById(id);
//         if (el) {
//             const stored = localStorage.getItem(id);
//             if (stored === "true" || stored === "false") {
//                 el.checked = stored === "true";
//             } else {
//                 // remove invalid or corrupted value
//                 localStorage.removeItem(id);
//             }
//         }
//     });

//     const storedMaxStreak = localStorage.getItem("maxStreak");
//     const parsed = parseInt(storedMaxStreak);
//     if (!isNaN(parsed)) {
//         maxStreak = parsed;
//     } else {
//         maxStreak = 0;
//         localStorage.removeItem("maxStreak");
//     }

//     updateStreakDisplay();
// }