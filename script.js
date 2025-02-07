const sheetId = "1ToX4JUdV8Bt9N-eNcbyQMW6AJnxM9mRqTs6X3ilB5rA"; // ID Google Sheets của bạn
const apiKey = "AIzaSyBQxenT2Q8XNpDv1gNqb1IOJvrl6z1ruNk"; // API Key của bạn
const sheetName = "DanhSachCauHoi"; // Đổi tên thành sheet bạn đặt trong Google Sheets

// Mảng lưu câu hỏi vào localStorage
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

// Hàm lưu câu hỏi vào Google Sheets
async function saveQuestionToGoogleSheets(question, answer) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/DanhSachCauHoi!A:C:append?valueInputOption=RAW&key=${apiKey}`;

    const data = {
        "values": [[new Date().toLocaleString(), question, answer]]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("✅ Câu hỏi đã được lưu vào Google Sheets!");
        } else {
            alert("❌ Lỗi khi lưu! Kiểm tra lại API Key và quyền truy cập.");
        }
    } catch (error) {
        console.error("❌ Lỗi kết nối:", error);
    }
}

// Khi nhấn nút "Thêm Câu Hỏi"
document.getElementById("submitBtn").addEventListener("click", function () {
    const question = document.getElementById("question").value.trim();
    const answer = document.getElementById("answer").value.trim();

    if (question && answer) {
        saveQuestionToGoogleSheets(question, answer); // Lưu vào Google Sheets
        questions.push({ question, answer }); // Lưu vào localStorage
        localStorage.setItem("questions", JSON.stringify(questions));
        displayQuestions(); // Cập nhật danh sách
    } else {
        alert("⚠️ Vui lòng nhập đầy đủ câu hỏi và câu trả lời.");
    }
});

// Hàm xóa câu hỏi
function deleteQuestion(index) {
    questions.splice(index, 1);
    localStorage.setItem("questions", JSON.stringify(questions));
    displayQuestions();
}

// Hiển thị câu hỏi khi tải trang
window.onload = displayQuestions;
