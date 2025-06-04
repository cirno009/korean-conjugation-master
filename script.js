let wordData = [];

fetch('worddata.json')
    .then(res => res.json())
    .then(data => {
        wordData = data;
        console.log("First word:", (wordData[0].word));
        main()
    });


function main() {
    const conjugationForms = [
        "present (반말)", "present formal (해요체)", "present very formal(습니다)",
        "past", "past (formal)", "past (very formal)",
        "future", "future (formal)", "future (very formal)"
    ];
    const key = ["pr", "prf", "prff", "pa", "paf", "paff", "f", "ff", "fff"];

    const inputField = document.getElementById("main-text-input");
    const verbText = document.getElementById("verb-text");
    const directions = document.getElementById("conjugation-inquery-text");
    const statusBox = document.getElementById("status-box");
    const statusText = document.getElementById("status-text");
    const streakText = document.getElementById("current-streak-text");
    const maxStreakText = document.getElementById("max-streak-text");
    let streak = 0
    let maxStreak = 0

    let currentAnswer = "";
    let isAwaitingNext = false;

    generateQuestion();

    inputField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const userInput = inputField.value.trim();
            if (!isAwaitingNext) {

                console.log("User typed", userInput);
                console.log("Answer is", currentAnswer);

                if (!controlInput(userInput)) {
                    console.log("The user did not type in korean.")
                    const tooltip = document.getElementById("input-tooltip");
                    tooltip.classList.remove("tooltip-fade-animation");
                    void tooltip.offsetWidth;
                    tooltip.classList.add("tooltip-fade-animation")
                    return
                }

                if (userInput === currentAnswer) {
                    streak += 1
                    if (maxStreak < streak) {
                        maxStreak = streak
                    }
                    statusBox.style.backgroundColor = "green"
                    statusText.innerText = "Correct";
                    streakText.innerText = streak;
                    maxStreakText.innerText = streak
                } else {

                    streak = 0
                    statusBox.style.backgroundColor = "red"
                    statusText.innerText = ("Incorrect. Correct answer is " + currentAnswer);
                    streakText.innerText = streak
                }

                statusBox.classList.remove("display-none");
                inputField.value = "";
                isAwaitingNext = true;

            } else {
                statusBox.classList.add("display-none");
                generateQuestion();
                isAwaitingNext = false;
            }
        }
    });

    function generateQuestion() {
        const initWord = Math.floor(Math.random() * wordData.length);
        const initForm = Math.floor(Math.random() * conjugationForms.length);

        verbText.innerText = wordData[initWord].word;
        directions.innerText = conjugationForms[initForm];
        currentAnswer = wordData[initWord][key[initForm]];

        console.log("New answer is", currentAnswer);
    }

    function controlInput(input) {
        const match = input.match(/[\uac00-\ud7af]|[\u1100-\u11ff]|[\u3130-\u318f]|[\ua960-\ua97f]|[\ud7b0-\ud7ff]|\s/g);
        return match ? match.length === input.length : false;
    }
}