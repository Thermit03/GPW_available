let mice = JSON.parse(localStorage.getItem('mice')) || [];
let timer; // 用于计时器的变量

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

    saveMice();
    renderTable();
}

function renderTable() {
    const tableBody = document.getElementById('mouse-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // 清空表格

    mice.forEach((mouse, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).innerText = mouse.model;
        row.insertCell(1).innerText = mouse.status;
        row.insertCell(2).innerText = mouse.borrowTime || '未借出';
        row.insertCell(3).innerText = mouse.borrowedDuration + ' 小时';
        row.insertCell(4).innerText = mouse.remarks;
        row.insertCell(5).innerText = mouse.deposit ? '是' : '否';

        // 如果累计使用时间达到50小时，标红
        if (mouse.borrowedDuration >= 50) {
            row.style.color = 'red';
        }
    });
}

function saveMice() {
    localStorage.setItem('mice', JSON.stringify(mice));
}

function clearMice() {
    mice = [];
    saveMice();
    renderTable();
}

function startTimer() {
    if (timer) return; // 防止重复启动计时器
    timer = setInterval(() => {
        mice.forEach(mouse => {
            if (mouse.status === '借出') {
                mouse.borrowedDuration += 1 / 60; // 每分钟增加1分钟
            }
        });
        saveMice();
        renderTable();
    }, 60000); // 每分钟更新一次
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

// 在页面加载时恢复数据
window.onload = function() {
    renderTable();
    startTimer(); // 启动计时器
};

// 示例 HTML 结构
document.body.innerHTML = `
    <button onclick="addMouse()">添加鼠标</button>
    <button onclick="clearMice()">清空鼠标</button>
    <table id="mouse-table">
        <thead>
            <tr>
                <th>型号</th>
                <th>状态</th>
                <th>出借时间</th>
                <th>累计使用时间</th>
                <th>备注</th>
                <th>押物</th>
            </tr>
        </thead>
        <tbody>
            <!-- 鼠标数据将通过 JavaScript 渲染到这里 -->
        </tbody>
    </table>
`;
