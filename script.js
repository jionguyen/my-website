const questions = [
    { id: 1, question: "Ai là người sáng lập Microsoft?" },
    { id: 2, question: "Nguyên tố hóa học nào có ký hiệu H?" },
    { id: 3, question: "Thủ đô của Việt Nam là gì?" },
];
// Mảng lưu câu hỏi
let questions = JSON.parse(localStorage.getItem("questions")) || [];

// Hàm hiển thị câu hỏi lên trang
function displayQuestions() {
    let list = document.getElementById("questionList");
    list.innerHTML = ""; // Xóa danh sách cũ

    questions.forEach((item, index) => {
        let li = document.createElement("li");
        li.innerHTML = `<b>Q:</b> ${item.question} <br> <b>A:</b> ${item.answer} 
                        <button onclick="deleteQuestion(${index})">Xóa</button>`;
        list.appendChild(li);
    });
}

// Hàm thêm câu hỏi
function addQuestion() {
    let question = document.getElementById("newQuestion").value.trim();
    let answer = document.getElementById("newAnswer").value.trim();

    if (question && answer) {
        questions.push({ question, answer });
        localStorage.setItem("questions", JSON.stringify(questions));
        displayQuestions();
        document.getElementById("newQuestion").value = "";
        document.getElementById("newAnswer").value = "";
    } else {
        alert("Vui lòng nhập đầy đủ câu hỏi và câu trả lời!");
    }
}

// Hàm xóa câu hỏi
function deleteQuestion(index) {
    questions.splice(index, 1);
    localStorage.setItem("questions", JSON.stringify(questions));
    displayQuestions();
}

// Hiển thị câu hỏi khi tải trang
window.onload = displayQuestions;


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
