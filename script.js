const SPREADSHEET_ID = '1suU9YQBdiI95xz8tkVcNXS0lrkMrDnPQrVPXWtNdbJg'; // ID của Google Sheets
const API_KEY = 'AIzaSyBQxenT2Q8XNpDv1gNqb1IOJvrl6z1ruNk'; // API Key của bạn
const RANGE = 'Sheet1!A:C'; // Phạm vi cột trong Google Sheets (Số thứ tự, Câu hỏi, Câu trả lời)

// Hàm tải dữ liệu từ Google Sheets
function loadDataFromGoogleSheets() {
  gapi.load('client', () => {
    gapi.client.init({
      apiKey: API_KEY,
    }).then(() => {
      return gapi.client.request({
        path: `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}`,
      });
    }).then(response => {
      const data = response.result.values;
      displayData(data);
    });
  });
}

// Hàm hiển thị dữ liệu vào bảng
function displayData(data) {
  const tableBody = document.querySelector("#data-table tbody");
  tableBody.innerHTML = ""; // Xóa dữ liệu cũ
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
