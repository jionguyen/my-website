const SPREADSHEET_ID = '1ToX4JUdV8Bt9N-eNcbyQMW6AJnxM9mRqTs6X3ilB5rA'; // ID của Google Sheets
const CLIENT_ID = '1076064063621-ebh970ll77hqv47591cjilvdhds8olqh.apps.googleusercontent.com'; // Client ID OAuth2
const API_KEY = 'AIzaSyBQxenT2Q8XNpDv1gNqb1IOJvrl6z1ruNk'; // API Key của bạn
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets'; // Quyền truy cập vào Google Sheets
const RANGE = 'DanhSachCauHoi!A:C'; // Phạm vi cột trong Google Sheets (Số thứ tự, Câu hỏi, Câu trả lời)
const PASSWORD = '123'; // Mật khẩu dùng để thay đổi dữ liệu

// Hàm khởi tạo OAuth2
function authenticate() {
  gapi.auth2.getAuthInstance().signIn().then(() => {
    loadDataFromGoogleSheets(); // Tải dữ liệu sau khi đăng nhập thành công
  });
}

// Hàm tải thư viện Google API và khởi tạo OAuth2
function loadClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    scope: SCOPE
  }).then(() => {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

// Kiểm tra trạng thái đăng nhập
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    loadDataFromGoogleSheets(); // Nếu đã đăng nhập, tải dữ liệu
  } else {
    authenticate(); // Nếu chưa đăng nhập, yêu cầu đăng nhập
  }
}

// Hàm thêm câu hỏi vào Google Sheets
function addQuestion() {
  const question = document.getElementById("new-question").value;
  const answer = document.getElementById("new-answer").value;
  const password = document.getElementById("password").value;

  if (password !== PASSWORD) {
    alert("Mật khẩu sai!");
    return;
  }

  if (!question || !answer) {
    alert("Vui lòng nhập cả câu hỏi và câu trả lời.");
    return;
  }

  const values = [
    [question, answer],
  ];

  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
    valueInputOption: "RAW",
    resource: {
      values: values
    }
  }).then(response => {
    alert("Câu hỏi đã được thêm thành công!");
    loadDataFromGoogleSheets(); // Tải lại dữ liệu từ Google Sheets
  }).catch(error => {
    console.error("Error adding question:", error);
  });
}

// Hàm tải dữ liệu từ Google Sheets
function loadDataFromGoogleSheets() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
  }).then(response => {
    const data = response.result.values;
    displayData(data);
  }).catch(error => {
    console.error("Error loading data from Google Sheets:", error);
  });
}

// Hàm hiển thị dữ liệu vào bảng
function displayData(data) {
  const tableBody = document.querySelector("#data-table tbody");
  tableBody.innerHTML = ""; // Xóa dữ liệu cũ

  if (!data || data.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="3">Không có dữ liệu.</td>`;
    tableBody.appendChild(tr);
    return;
  }

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

// Tải thư viện và khởi tạo
function start() {
  gapi.load('client:auth2', loadClient);
}

window.onload = start;
