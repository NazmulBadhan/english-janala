const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all") // promise of response
    .then((res) => res.json()) // promise of json
    .then((json) => displayLessons(json.data));
}

const loadLevelWord = (id) => {
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then((res) => res.json())
    .then((json) => displayLevelWord(json.data));
}

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
        return;
    }

    words.forEach((word) => {
        console.log(word);
        const card = document.createElement("div");
        card.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm text-center py-15 px-10 space-y-6">
                    <h2 class="text-2xl font-bold">${word.word?word.word:"word পাওয়া যায়নি"}</h2>
                    <p class="font-semibold">Meaning / Pronounciation</p>
                    <div class="font-bangla text-2xl font-bold">"${word.meaning?word.meaning:"meaning পাওয়া যায়নি"} / ${word.pronunciation?word.pronunciation:"pronunciation পাওয়া যায়নি"}"</div>
                    <div class="flex justify-between items-center">
                        <button class="bg-[#1A91FF20] hover:bg-[#1A91FF80] p-2 rounded-lg"><i class="fa-solid fa-circle-info"></i></button>
                        <button class="bg-[#1A91FF20] hover:bg-[#1A91FF80] p-2 rounded-lg"><i class="fa-solid fa-volume-high"></i></button>
                    </div>
            </div>        
        `;
        wordContainer.append(card);
    })
}

const displayLessons = (lessons) => {
    // 1. get the container and empty
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";
    // 2. get into every lesson
    for(let lesson of lessons) {
        // 3. create element
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
        <button onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>`;
        // 4. append element into the container
        levelContainer.append(btnDiv);

    }

}

loadLessons();