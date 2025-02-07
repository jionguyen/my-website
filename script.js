const SPREADSHEET_ID = '1ToX4JUdV8Bt9N-eNcbyQMW6AJnxM9mRqTs6X3ilB5rA'; // ID của Google Sheets
const API_KEY = 'AIzaSyBQxenT2Q8XNpDv1gNqb1IOJvrl6z1ruNk'; // API Key của bạn
const RANGE = 'DanhSachCauHoi!A:C'; // Phạm vi cột trong Google Sheets (Số thứ tự, Câu hỏi, Câu trả lời)

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
