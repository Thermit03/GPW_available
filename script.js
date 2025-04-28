let mice = JSON.parse(localStorage.getItem('mice')) || [];
let timers = [];

function renderTable() {
    const tableBody = document.querySelector('#mouse-table tbody');
    tableBody.innerHTML = '';

    mice.forEach((mouse, index) => {
        const usageTimeClass = mouse.borrowedDuration >= 50 ? 'red' : '';
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${mouse.model}</td>
            <td>
                <select onchange="updateMouseStatus(${index}, this.value)">
                    <option value="归还" ${mouse.status === '归还' ? 'selected' : ''}>归还</option>
                    <option value="正常出借" ${mouse.status === '正常出借' ? 'selected' : ''}>正常出借</option>
                    <option value="充电" ${mouse.status === '充电' ? 'selected' : ''}>充电</option>
                    <option value="遗失" ${mouse.status === '遗失' ? 'selected' : ''}>遗失</option>
                    <option value="归还吧台" ${mouse.status === '归还吧台' ? 'selected' : ''}>归还吧台</option>
                </select>
                <input type="text" value="${mouse.details || ''}" placeholder="详情备注" onchange="updateMouseDetails(${index}, this.value)">
            </td>
            <td>${mouse.borrowTime || '---'}</td>
            <td class="${usageTimeClass}">${mouse.borrowedDuration.toFixed(2)} 小时</td>
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

    localStorage.setItem('mice', JSON.stringify(mice));
}

function addMouse() {
    const start = parseInt(prompt("请输入起始鼠标序号:"));
    const end = parseInt(prompt("请输入结束鼠标序号:"));
    
    if (isNaN(start) || isNaN(end) || start > end) {
        alert("请输入有效的序号范围！");
        return;
    }

    for (let i = start; i <= end; i++) {
        mice.push({
            model: `鼠标${i}`,
            status: '归还',
            borrowTime: '',
            borrowedDuration: 0,
            remarks: '',
            details: '',
            deposit: false
        });
    }

    renderTable();
}

// 其他函数...

document.addEventListener('DOMContentLoaded', () => {
    const exportButton = document.createElement('button');
    exportButton.textContent = '导出数据';
    exportButton.onclick = exportData;
    document.body.appendChild(exportButton);

    const importButton = document.createElement('button');
    importButton.textContent = '导入数据';
    importButton.onclick = importData;
    document.body.appendChild(importButton);

    const clearButton = document.createElement('button');
    clearButton.textContent = '清空鼠标数据';
    clearButton.onclick = clearMice;
    document.body.appendChild(clearButton);

    const modifyButton = document.createElement('button');
    modifyButton.textContent = '修改鼠标数据';
    modifyButton.onclick = modifyMouseData;
    document.body.appendChild(modifyButton);

    const addButton = document.createElement('button');
    addButton.textContent = '添加鼠标';
    addButton.onclick = addMouse;
    document.body.appendChild(addButton);

    renderTable();
});
