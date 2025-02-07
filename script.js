const questions = [
    { id: 1, question: "Ai là người sáng lập Microsoft?" },
    { id: 2, question: "Nguyên tố hóa học nào có ký hiệu H?" },
    { id: 3, question: "Thủ đô của Việt Nam là gì?" },
];

function loadQuestions() {
    let table = document.getElementById("questionList");
    table.innerHTML = "";

    questions.forEach(q => {
        let row = `<tr>
            <td>${q.id}</td>
            <td>${q.question}</td>
        </tr>`;
        table.innerHTML += row;
    });
}

function searchQuestion() {
    let keyword = document.getElementById("search").value.toLowerCase();
    let table = document.getElementById("questionList");
    table.innerHTML = "";

    questions.forEach(q => {
        if (q.question.toLowerCase().includes(keyword)) {
            let row = `<tr>
                <td>${q.id}</td>
                <td>${q.question}</td>
            </tr>`;
            table.innerHTML += row;
        }
    });
}

window.onload = loadQuestions;
