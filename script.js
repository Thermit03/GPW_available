let mice = JSON.parse(localStorage.getItem('mice')) || []; // 从 Local Storage 获取数据
let timers = []; // 用于存储计时器

function renderTable() {
    const tableBody = document.querySelector('#mouse-table tbody');
    tableBody.innerHTML = ''; // 清空表格

    mice.forEach((mouse, index) => {
        const row = document.createElement('tr');
        const usageTimeClass = mouse.borrowedDuration >= 50 ? 'red' : ''; // 超过 50 小时标红

        row.innerHTML = `
            <td>${mouse.model}</td>
            <td>
                <select onchange="updateMouseStatus(${index}, this.value)">
                    <option value="归还" ${mouse.status === '归还' ? 'selected' : ''}>归还</option>
                    <option value="借出" ${mouse.status === '借出' ? 'selected' : ''}>借出</option>
                    <option value="充电" ${mouse.status === '充电' ? 'selected' : ''}>充电</option>
                    <option value="遗失" ${mouse.status === '遗失' ? 'selected' : ''}>遗失</option>
                    <option value="详见备注" ${mouse.status === '详见备注' ? 'selected' : ''}>详见备注</option>
                </select>
            </td>
            <td>${mouse.borrowTime}</td>
            <td class="${usageTimeClass}">${mouse.borrowedDuration.toFixed(2)} 小时</td>
            <td><input type="text" value="${mouse.remarks}" onchange="updateMouseRemarks(${index}, this.value)" placeholder="备注"></td>
            <td>
                <select onchange="updateDeposit(${index}, this.value)">
                    <option value="是" ${mouse.deposit ? 'selected' : ''}>是</option>
                    <option value="否" ${!mouse.deposit ? 'selected' : ''}>否</option>
                </select>
            </td>
            <td><button onclick="removeMouse(${index})">删除</button></td>
        `;
        tableBody.appendChild(row);
    });

    localStorage.setItem('mice', JSON.stringify(mice)); // 将数据保存到 Local Storage
}

function addMouse() {
    const start = parseInt(prompt("请输入起始鼠标序号:"));
    const end = parseInt(prompt("请输入结束鼠标序号:"));

    for (let i = start; i <= end; i++) {
        mice.push({
            model: i,
            status: '归还', // 默认状态为归还
            borrowTime: '',
            borrowedDuration: 0, // 初始化借出时长
            remarks: '',
            deposit: false
        });
    }

    renderTable();
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
        mice[index].borrowTime = ''; // 清空出借时间
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

function updateMouseRemarks(index, remarks) {
    mice[index].remarks = remarks;
    renderTable();
}

function updateDeposit(index, deposit) {
    mice[index].deposit = deposit === '是';
    renderTable();
}

function removeMouse(index) {
    mice.splice(index, 1);
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

// 页面加载完成后渲染表格
document.addEventListener('DOMContentLoaded', () => {
    renderTable(); // 初始渲染
});
