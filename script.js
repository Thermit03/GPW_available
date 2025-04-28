let mice = JSON.parse(localStorage.getItem('mice')) || []; // 从 Local Storage 获取数据

function renderTable() {
    const tableBody = document.querySelector('#mouse-table tbody');
    tableBody.innerHTML = ''; // 清空表格

    mice.forEach((mouse, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${mouse.model}</td>
            <td>${mouse.status}</td>
            <td>${mouse.borrowTime}</td>
            <td>${mouse.borrowedDuration}</td>
            <td>${mouse.remarks}</td>
            <td>${mouse.deposit ? '是' : '否'}</td>
        `;
        tableBody.appendChild(row);
    });

    // 将数据保存到 Local Storage
    localStorage.setItem('mice', JSON.stringify(mice));
}

function addMouse() {
    const model = prompt("请输入鼠标型号:");
    const status = prompt("请输入鼠标状态:");
    const borrowTime = prompt("请输入出借时间:");
    const borrowedDuration = prompt("请输入已出借时间:");
    const remarks = prompt("请输入备注:");
    const deposit = confirm("是否押物?");

    mice.push({ model, status, borrowTime, borrowedDuration, remarks, deposit });
    renderTable();
}

// 导出数据为 JSON 文件
function exportData() {
    const dataStr = JSON.stringify(mice);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mice_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// 导入数据
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            try {
                mice = JSON.parse(event.target.result);
                renderTable();
            } catch (err) {
                alert('导入数据格式错误');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// 添加导入和导出按钮
document.addEventListener('DOMContentLoaded', () => {
    const exportButton = document.createElement('button');
    exportButton.textContent = '导出数据';
    exportButton.onclick = exportData;
    document.body.appendChild(exportButton);

    const importButton = document.createElement('button');
    importButton.textContent = '导入数据';
    importButton.onclick = importData;
    document.body.appendChild(importButton);

    renderTable(); // 初始渲染
});
