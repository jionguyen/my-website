const SPREADSHEET_ID = '1ToX4JUdV8Bt9N-eNcbyQMW6AJnxM9mRqTs6X3ilB5rA'; // ID của Google Sheets
const API_KEY = 'AIzaSyBQxenT2Q8XNpDv1gNqb1IOJvrl6z1ruNk'; // API Key của bạn
const RANGE = 'DanhSachCauHoi!A:C'; // Phạm vi cột trong Google Sheets (Số thứ tự, Câu hỏi, Câu trả lời)
const PASSWORD = '123'; // Mật khẩu yêu cầu

// Hàm tải dữ liệu từ Google Sheets
function loadDataFromGoogleSheets() {
  gapi.load('client', () => {
    gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
    }).then(() => {
      return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
      });
    }).then(response => {
      const data = response.result.values;
      displayData(data);
    }).catch(error => {
      console.error("Error loading data from Google Sheets:", error);
    });
  });
}

// Hàm hiển thị dữ liệu vào bảng
function displayData(data) {
  const tableBody = document.querySelector("#data-table tbody");
  tableBody.innerHTML = ""; // Xóa dữ liệu cũ

  // Kiểm tra nếu dữ liệu trống
  if (!data || data.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="3">Không có dữ liệu.</td>`;
    tableBody.appendChild(tr);
    return;
  }

  // Hiển thị dữ liệu vào bảng
  data.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td>${row[2]}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// Tải dữ liệu khi trang web được mở
window.onload = loadDataFromGoogleSheets;

// Hàm tìm kiếm câu hỏi
function filterData() {
  const input = document.getElementById("search-input");
  const filter = input.value.toLowerCase();
  const rows = document.querySelectorAll("#data-table tbody tr");

  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    const question = cells[1].textContent.toLowerCase();
    if (question.indexOf(filter) > -1) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// Hàm thêm câu hỏi mới
function addQuestion() {
  const newQuestion = document.getElementById("new-question").value;
  const newAnswer = document.getElementById("new-answer").value;
  const password = document.getElementById("password").value;

  // Kiểm tra mật khẩu
  if (password !== PASSWORD) {
    alert("Mật khẩu không đúng!");
    return;
  }

  if (newQuestion && newAnswer) {
    // Tạo yêu cầu gửi lên Google Sheets
    const newRow = [[newQuestion, newAnswer]];
    const params = {
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: 'RAW',
    };
    const valueRange = {
      values: newRow
    };

    gapi.client.sheets.spreadsheets.values.append(params, valueRange).then(response => {
      alert("Câu hỏi đã được thêm!");
      loadDataFromGoogleSheets(); // Tải lại dữ liệu từ Google Sheets
    }).catch(error => {
      console.error("Error adding question:", error);
    });
  } else {
    alert("Vui lòng nhập đầy đủ câu hỏi và câu trả lời.");
  }
}
