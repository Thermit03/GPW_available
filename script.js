let mice = []; // 存储鼠标数据

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

// 初始渲染
renderTable();
