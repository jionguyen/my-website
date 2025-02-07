const sheetId = "1ToX4JUdV8Bt9N-eNcbyQMW6AJnxM9mRqTs6X3ilB5rA"; // ID Google Sheets của bạn
const apiKey = "AIzaSyBQxenT2Q8XNpDv1gNqb1IOJvrl6z1ruNk"; // API Key của bạn
const sheetName = "DanhSachCauHoi"; // Tên sheet trong Google Sheets

// Hàm lấy danh sách câu hỏi từ Google Sheets
async function fetchQuestions() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A:C?key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.values) {
            displayQuestions(data.values);
        } else {
            console.error("Không lấy được dữ liệu từ Google Sheets.");
        }
    } catch (error) {
        console.error("Lỗi kết nối đến Google Sheets:", error);
    }
}

// Hàm hiển thị danh sách câu hỏi lên trang web
function displayQuestions(questionList) {
    let list = document.getElementById("questionList");
    list.innerHTML = ""; // Xóa danh sách cũ

    questionList.slice(1).forEach((item, index) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${index + 1}</td><td><b>Q:</b> ${item[0]} <br> <b>A:</b> ${item[1]}</td>`;
        list.appendChild(tr);
    });
}

// Hàm lưu câu hỏi vào Google Sheets
async function saveQuestionToGoogleSheets(question, answer) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A:C:append?valueInputOption=USER_ENTERED&key=${apiKey}`;

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
            fetchQuestions(); // Cập nhật danh sách sau khi thêm mới
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
        saveQuestionToGoogleSheets(question, answer);
        document.getElementById("question").value = "";
        document.getElementById("answer").value = "";
    } else {
        alert("⚠️ Vui lòng nhập đầy đủ câu hỏi và câu trả lời.");
    }
});

// Hiển thị danh sách khi tải trang
window.onload = fetchQuestions;
