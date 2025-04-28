let mice = JSON.parse(localStorage.getItem('mice')) || []; // 从 Local Storage 获取数据

function renderTable() {
    const tableBody = document.querySelector('#mouse-table tbody');
    tableBody.innerHTML = ''; // 清空表格

    mice.forEach((mouse, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td> <!-- 鼠标序号 -->
            <td>
                <select onchange="updateMouseStatus(${index}, this.value)">
                    <option value="正常出借" ${mouse.status === '正常出借' ? 'selected' : ''}>正常出借</option>
                    <option value="充电" ${mouse.status === '充电' ? 'selected' : ''}>充电</option>
                    <option value="遗失" ${mouse.status === '遗失' ? 'selected' : ''}>遗失</option>
                    <option value="归还吧台" ${mouse.status === '归还吧台' ? 'selected' : ''}>归还吧台</option>
                    <option value="上次充电后累计出借时间" ${mouse.status === '上次充电后累计出借时间' ? 'selected' : ''}>上次充电后累计出借时间</option>
                </select>
            </td>
            <td>${mouse.borrowTime}</td>
            <td>${mouse.borrowedDuration}</td>
            <td><input type="text" value="${mouse.remarks}" onchange="updateMouseRemarks(${index}, this.value)" placeholder="备注"></td>
            <td>
                <select onchange="updateDeposit(${index}, this.value)">
                    <option value="是" ${mouse.deposit ? 'selected' : ''}>是</option>
                    <option value="否" ${!mouse.deposit ? 'selected' : ''}>否</option>
                </select>
            </td>
        `;
        tableBody.appendChild(row);
    });

    localStorage.setItem('mice', JSON.stringify(mice)); // 将数据保存到 Local Storage
}

function addMouse() {
    const start = parseInt(prompt("请输入起始鼠标序号:"));
    const end = parseInt(prompt("请输入结束鼠标序号:"));
    const borrowTime = new Date().toLocaleString(); // 获取当前时间

    for (let i = start; i <= end; i++) {
        mice.push({
            model: `鼠标${i}`,
            status: '正常出借',
            borrowTime: borrowTime,
            borrowedDuration: '0', // 初始化借出时长
            remarks: '',
            deposit: false
        });
    }

    renderTable();
}

function updateMouseStatus(index, status) {
    mice[index].status = status;
    renderTable();
}

function updateMouseRemarks(index, remarks) {
    mice[index].remarks = remarks;
    renderTable();
}

function updateDeposit(index, deposit) {
    mice[index].deposit = deposit === '是';
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
