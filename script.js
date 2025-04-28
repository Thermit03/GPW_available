let mice = JSON.parse(localStorage.getItem('mice')) || []; // 从 Local Storage 获取数据
let timers = []; // 用于存储计时器

function renderTable() {
    const tableBody = document.querySelector('#mouse-table tbody');
    tableBody.innerHTML = ''; // 清空表格

    mice.forEach((mouse, index) => {
        const usageTimeClass = mouse.borrowedDuration >= 50 ? 'red' : ''; // 超过 50 小时标红
        const row = document.createElement('tr'); // 定义行

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

    localStorage.setItem('mice', JSON.stringify(mice)); // 将数据保存到 Local Storage
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
            status: '归还', // 默认状态为归还
            borrowTime: '',
            borrowedDuration: 0, // 初始化借出时长
            remarks: '',
            details: '',
            deposit: false
        });
    }

    renderTable(); // 更新表格
}

function updateMouseStatus(index, status) {
    mice[index].status = status;

    if (status === '充电') {
        clearInterval(timers[index]); // 停止计时
        mice[index].borrowedDuration = 0; // 清零累计使用时间
    } else if (status === '正常出借') {
        mice[index].borrowTime = new Date().toLocaleString(); // 更新出借时间
        startTimer(index); // 开始计时
    } else if (status === '归还') {
        clearInterval(timers[index]); // 停止计时
        mice[index].borrowTime = '---'; // 设置为“---”
    }

    renderTable();
}

function startTimer(index) {
    if (timers[index]) {
        clearInterval(timers[index]); // 清除已有计时器
    }

    timers[index] = setInterval(() => {
        mice[index].borrowedDuration += 0.01667; // 每分钟增加 1/60 小时
        if (mice[index].borrowedDuration >= 50) {
            renderTable(); // 更新表格以显示标红
        }
    }, 1000 * 60); // 每分钟更新一次
}

function updateMouseDetails(index, details) {
    mice[index].details = details;
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

// 开发菜单功能
function clearMice() {
    if (confirm("确定要清空所有鼠标数据吗？")) {
        mice = [];
        localStorage.removeItem('mice');
        renderTable();
    }
}

function modifyMouseData() {
    const index = parseInt(prompt("请输入要修改的鼠标序号:")) - 1;
    if (index < 0 || index >= mice.length) {
        alert("无效的鼠标序号！");
        return;
    }

    const property = prompt("请输入要修改的属性（status/details/remarks/deposit）：");
    const newValue = prompt("请输入新的值：");

    if (property === 'status') {
        updateMouseStatus(index, newValue);
    } else if (property === 'details') {
        updateMouseDetails(index, newValue);
    } else if (property === 'remarks') {
        updateMouseRemarks(index, newValue);
    } else if (property === 'deposit') {
        mice[index].deposit = newValue === '是';
        renderTable();
    } else {
        alert("无效的属性！");
    }
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

    const clearButton = document.createElement('button');
    clearButton.textContent = '清空鼠标数据';
    clearButton.onclick = clearMice;
    document.body.appendChild(clearButton);

    const modifyButton = document.createElement('button');
    modifyButton.textContent = '修改鼠标数据';
    modifyButton.onclick = modifyMouseData;
    document.body.appendChild(modifyButton);

    // 添加“添加鼠标”按钮
    const addButton = document.createElement('button');
    addButton.textContent = '添加鼠标';
    addButton.onclick = addMouse; // 绑定添加鼠标函数
    document.body.appendChild(addButton);

    renderTable(); // 初始渲染
});
