const createElements = (arr) => {
    const htmlElements = arr.map((el) => `<span class="btn bg-[#EDF7FF]">${el}</span>`);
    return htmlElements.join(" ");
};

const manageSpinner = (status) => {
    if(status) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    } else {
        document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }
};

const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all") // promise of response
    .then((res) => res.json()) // promise of json
    .then((json) => displayLessons(json.data));
};

const removeActive = () => {
    const lessonBtns = document.querySelectorAll(".lesson-btn");
    lessonBtns.forEach((btn) => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then((res) => res.json())
    .then((json) => {
        removeActive(); // remove all active class
        const clickBtn = document.getElementById(`lesson-btn-${id}`);
        clickBtn.classList.add("active"); // add active class
        displayLevelWord(json.data);
    });
};

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
};

const displayWordDetails = (word) => {
    console.log(word)
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `<div class="space-y-2">
                                <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation})</h2>
                            </div>
                            <div class="space-y-2">
                                <h2 class="font-bold">Meaning</h2>
                                <p>${word.meaning}</p>
                            </div>
                            <div class="space-y-2">
                                <h2 class="font-bold">Example</h2>
                                <p>${word.sentence}</p>
                            </div>
                            <div class="space-y-2">
                                <h2 class="font-bold">সমার্থক শব্দ গুলো</h2>
                                <div class="space-y-2">${createElements(word.synonyms)}</div>
                            </div>
    `;
    document.getElementById("word_modal").showModal();
};

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if(words.length === 0) {
        wordContainer.innerHTML = `
            <div class="font-bangla text-center col-span-full space-y-4">
                <img src="./assets/alert-error.png" alt="" class="mx-auto">
                <p class="font-normal text-[#79716B] text-[14px]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="font-medium text-4xl">নেক্সট Lesson এ যান</h2>
            </div>
        `;
        manageSpinner(false);
        return;
    }

    words.forEach((word) => {
        const card = document.createElement("div");
        card.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm text-center py-15 px-10 space-y-6">
                    <h2 class="text-2xl font-bold">${word.word?word.word:"word পাওয়া যায়নি"}</h2>
                    <p class="font-semibold">Meaning / Pronounciation</p>
                    <div class="font-bangla text-2xl font-bold">"${word.meaning?word.meaning:"meaning পাওয়া যায়নি"} / ${word.pronunciation?word.pronunciation:"pronunciation পাওয়া যায়নি"}"</div>
                    <div class="flex justify-between items-center">
                        <button onclick="loadWordDetail(${word.id})" class="bg-[#1A91FF20] hover:bg-[#1A91FF80] p-2 rounded-lg"><i class="fa-solid fa-circle-info"></i></button>
                        <button class="bg-[#1A91FF20] hover:bg-[#1A91FF80] p-2 rounded-lg"><i class="fa-solid fa-volume-high"></i></button>
                    </div>
            </div>        
        `;
        wordContainer.append(card);
    })
    manageSpinner(false);
};

const displayLessons = (lessons) => {
    // 1. get the container and empty
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";
    // 2. get into every lesson
    for(let lesson of lessons) {
        // 3. create element
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>`;
        // 4. append element into the container
        levelContainer.append(btnDiv);

    }

};

loadLessons();

document.getElementById("btn-search").addEventListener("click", () => {
    removeActive();
    const input = document.getElementById("input-search");
    const searchValue = input.value.trim().toLowerCase();

    fetch("https://openapi.programming-hero.com/api/words/all")
    .then(res => res.json())
    .then(data => {
        const allWords = data.data;
        const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
        displayLevelWord(filterWords);
    });
});