document.addEventListener("DOMContentLoaded", async () => {
  const dbName = await renderDatabaseName();
  await renderTableList();
  await renderGuideList();
  await executeQuery(`USE ${dbName};`);
});

let logCounter = 1;
let elapsed;
let errorMsg;

document.getElementById("submitKeywordBtn").addEventListener("click", function () {
  const keyword = document.getElementById("keywordInput").value.trim();
  if (!keyword) {
    alert("키워드를 입력해주세요.");
    return;
  }

  const encoded = encodeURIComponent(keyword);

  // 현재 URL에 query 파라미터 추가 또는 업데이트
  const url = new URL(window.location.href);
  url.searchParams.set("query", encoded);
  window.history.replaceState({}, '', url);

  // 최종 이동
  window.location.href = `/tracking-test`;
});

function getCurrentTime() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

// ✅ 사용할 데이터베이스 이름 표시
async function renderDatabaseName() {
  try {
    const res = await axios.get("/sql-workbench/database-name");
    const name = res.data.name;

    const dbName = document.getElementById("databaseName");
    dbName.innerHTML = `
      <span class='icon-Big-Data'></span>&nbsp;&nbsp;${name}
    `;

    return name;
  } catch (err) {
    console.error("데이터베이스 이름 로딩 실패:", err);
  }
}

// ✅ 테이블 목록 렌더링 및 클릭 시 SELECT 쿼리 자동 실행
async function renderTableList() {
  try {
    const res = await axios.get("/sql-workbench/table-list");
    const tables = res.data.tables;

    const tableListUl = document.getElementById("tableList");
    tableListUl.innerHTML = "";

    tables.forEach((table) => {
      const li = document.createElement("li");
      li.className = "table-list";
      li.dataset.table = table;
      li.innerHTML = `&#8227; ${table}`;

      // ✅ 클릭 시 자동 SELECT 쿼리 실행
      li.onclick = async () => {
        // 👉 가이드 폼이 열려 있으면 초기화
        const guideContainer = document.getElementById("guideContainer");
        guideContainer.innerHTML = "";
        delete guideContainer.dataset.table;
        delete guideContainer.dataset.fields;

        // 👉 textarea 다시 표시
        const sqlInput = document.getElementById("sql-input");
        sqlInput.style.display = "";

        // 👉 SELECT 쿼리 자동 입력 및 실행
        const query = `SELECT * FROM ${table};`;
        sqlInput.value = query;
        await executeQuery(query);
      };

      tableListUl.appendChild(li);
    });
  } catch (err) {
    console.error("테이블 목록 로딩 실패:", err);
  }
}

async function renderGuideList() {
  try {
    const res = await axios.get("/sql-workbench/guide-list");
    const guideListUl = document.getElementById("guideList");
    guideListUl.innerHTML = "";

    res.data.files
      .filter(file => /^[\d]+_.*\.(json|js|sql|txt|md)$/i.test(file))  // ✅ 다양한 확장자 허용
      .sort()
      .forEach(file => {
        const ext = file.split(".").pop().toLowerCase();
        const name = file.replace(/^\d+_/, "").replace(/\.(json|js|sql|txt|md)$/, "");
        
        // 확장자에 따라 아이콘 클래스 매핑
        const iconMap = {
          sql: "fas fa-database text-primary",
          json: "fas fa-cube text-success",
          js: "fab fa-js text-warning",
          md: "fas fa-file-alt text-info",
          txt: "fas fa-file-lines text-muted"
        };
        const iconClass = iconMap[ext] || "fas fa-file";
              
        const li = document.createElement("li");
        li.className = "guide-sample table-list";
        li.dataset.filename = file;
        li.title = `${name} 가이드`;
        li.innerHTML = `<span>&#8227; <i class="${iconClass}"></i> ${name}</span>`;

        li.onclick = async () => {
          const ext = file.split(".").pop().toLowerCase();
          const container = document.getElementById("guideContainer");
          const sqlInput = document.getElementById("sql-input");
          container.innerHTML = "";

          try {
            const res = await axios.get(`/sql-workbench/guide-files/${file}`);
            const content = res.data;

            if (ext === "json") {
              sqlInput.style.display = "none";
              renderGuideUI(content);  // 👉 JSON 구조 기반 UI 생성

            } else if (ext === "sql") {
              sqlInput.value = content;
              sqlInput.style.display = "block";

              // ✅ SQL 파일 선택 시 즉시 실행
              await executeQuery(content);

            } else {
              sqlInput.style.display = "none";
              let language = "plaintext";
              if (ext === "js") language = "javascript";
              else if (ext === "md") language = "markdown";

              container.innerHTML = `
                <div class="p-2 bg-light text-start">
                  <div class="fw-bold mb-2">유입 트래킹 JS 스크립트</div>
                  <pre><code class="language-${language}">${Prism.highlight(content, Prism.languages[language] || Prism.languages.plaintext, language)}</code></pre>
                </div>
              `;
            }
          } catch (err) {
            sqlInput.style.display = "none";
            container.innerHTML = `
              <div class="alert alert-danger mt-3">가이드 파일을 불러오는 중 오류가 발생했습니다.</div>
            `;
          }
        };

        guideListUl.appendChild(li);
      });

  } catch (err) {
    console.error("가이드 목록 로딩 실패:", err);
  }
}

// ✅ 실제 UI를 생성하는 함수
function renderGuideUI(guide) {
  const container = document.getElementById("guideContainer");
  container.innerHTML = "";

  const sqlInput = document.getElementById("sql-input");

  if (guide?.type === "input" && Array.isArray(guide.columns) && guide.table) {
    sqlInput.style.display = "none";

    // 👉 data 속성 추가
    container.dataset.table = guide.table;
    container.dataset.fields = JSON.stringify(guide.columns.map(col => col.name));

    // 👉 필드 라벨 매핑 저장
    const fieldLabelMap = {};
    guide.columns.forEach(col => {
      fieldLabelMap[col.name] = col.label;
    });
    container.dataset.fieldLabels = JSON.stringify(fieldLabelMap);

    const form = document.createElement("form");
    form.className = "p-3 border-top bg-white";

    const row = document.createElement("div");
    row.className = "row";

    guide.columns.forEach((col, index) => {
      const colDiv = document.createElement("div");
      colDiv.className = "col-12 col-md-6 col-lg-3 mb-2";

      const label = document.createElement("label");
      label.className = "form-label fw-semibold";
      label.setAttribute("for", `guide-input-${index}`);
      label.textContent = col.label || `항목 ${index + 1}`;

      const input = document.createElement("input");
      input.className = "form-control";
      input.type = col.type || "text";
      input.id = `guide-input-${index}`;
      input.name = col.name;
      input.placeholder = `예: ${col.placeholder}` || `예: ${col.label}`;
      input.value = col.value || ""

      colDiv.appendChild(label);
      colDiv.appendChild(input);
      row.appendChild(colDiv);
    });

    // 안내 메시지 추가
    const helperText = document.createElement("div");
    helperText.className = "form-text text-muted text-start small mt-0";
    helperText.innerHTML = `
      <i class="fas fa-lightbulb text-danger me-1 mt-2"></i>
        우측 상단의 <strong><i class="fas fa-bolt icon-execute"></i> Execute</strong> 버튼을 클릭하거나,
        <span class="badge badge-default fs-10px pt-3px">Ctrl + Enter</span> 단축키를 사용해 입력값을 실행하세요.
    `;

    form.appendChild(row);
    form.appendChild(helperText);
    container.appendChild(form);
  } else {
    sqlInput.style.display = "";
    container.innerHTML = `
      <div class="alert alert-warning m-3">
        지원되지 않는 가이드 형식입니다.
      </div>
    `;
  }
}

async function executeQuery(inputSql = null) {
  const sqlInput = document.getElementById("sql-input");
  const guideContainer = document.getElementById("guideContainer");
  const form = guideContainer.querySelector("form");
  let isJsScript = false;
  let sql;

  if (inputSql) {
    sqlInput.value = inputSql;
    sql = inputSql;
  } else {
    sql = sqlInput.value;
  }  

  // 👉 1. 가이드 입력폼에서 실행하는 경우
  if (!sql && form) {
    isJsScript = true;

    const formData = new FormData(form);
    const payload = {};
    for (let [key, value] of formData.entries()) {
      payload[key] = value.trim();
    }

    const table = guideContainer.dataset.table;
    const fieldList = JSON.parse(guideContainer.dataset.fields || "[]");
    const fieldLabelMap = JSON.parse(guideContainer.dataset.fieldLabels || "{}");

    // ✅ 필수 데이터 검증
    if (!table || !Array.isArray(fieldList) || fieldList.length === 0) {
      showModal('입력 오류', '테이블 정보 또는 필드 정보가 잘못되었습니다.');
      return;
    }

    const missing = fieldList.filter(field => !payload[field]);
    if (missing.length > 0) {
      const missingLabels = missing.map(f => {
        const label = fieldLabelMap[f] || f;
        return `<strong>${label}</strong>`;
      }).join(", ");

      showModal("입력 오류", `다음 항목이 비어 있습니다: ${missingLabels}`);
      return;
    }
    // ✅ INSERT 쿼리 생성
    sql = `
      INSERT INTO ${table} (${fieldList.join(", ")})
      VALUES (${fieldList.map(field => `'${payload[field]}'`).join(", ")});
    `.trim();
  }

  // 👉 2. 일반 SQL 입력 실행
  if (!sql) {
    sql = sqlInput.value.trim();
    if (!sql) {
      showModal('입력 오류', "실행할 SQL이 비어 있습니다.");
      return;
    }
  }

  const start = performance.now();

  // ✅ 주석 제거
  sql = sql
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');

  try {
    const res = await axios.post("/sql-workbench/execute-query", { sql });

    const rawColumns = res.data.columns || [];
    const rows = res.data.rows || [];

    const columns = rawColumns;
    const head = document.getElementById("result-head");
    const body = document.getElementById("result-body");

    head.innerHTML = "";
    columns.forEach(col => {
      const th = document.createElement("th");
      th.textContent = col;
      th.classList.add("text-start");
      head.appendChild(th);
    });

    body.innerHTML = "";
    rows.forEach(row => {
      const tr = document.createElement("tr");
      columns.forEach(col => {
        const td = document.createElement("td");
        const value = row[col];
        td.textContent = value === null || value === undefined ? "NULL" : value;
        if (value === null || value === undefined) td.classList.add("text-muted");
        td.classList.add("text-start");
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });

    const elapsed = ((performance.now() - start) / 1000).toFixed(3);
    const msg = rows[0]?.Message || `${rows.length} row(s) returned`;
    addLogRow(true, sql, msg, `${elapsed} sec`);

    if (isJsScript) {
      setTimeout(async () => {
        try {
          const res = await axios.get("/sql-workbench/js-script");
          const scriptContent = res.data;
          showModal(
            "유입 트래킹 JS 스크립트",
            `<pre><code class="language-js">${Prism.highlight(scriptContent, Prism.languages.javascript, 'javascript')}</code></pre>`
          );
        } catch (err) {
          showModal(
            "유입 트래킹 JS 스크립트",
            "<div class='text-danger'>스크립트를 불러오는 중 오류가 발생했습니다.</div>"
          );
        }
      }, 500); // ⏱ 1.5초 지연
    }

  } catch (err) {
    const elapsed = ((performance.now() - start) / 1000).toFixed(3);
    const errorMsg = err.response?.data?.error || "쿼리 실행 중 오류 발생";
    addLogRow(false, sql, errorMsg, `${elapsed} sec`);
  }
}

document.getElementById("execute-btn").addEventListener("click", () => executeQuery());

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") {
    e.preventDefault();
    executeQuery();
  }
});

function addLogRow(isSuccess, sql, message, duration) {
  const tbody = document.getElementById("action-output-body");
  const time = getCurrentTime();
  const status = isSuccess
    ? `<span class="status-icon status-success">✔</span>`
    : `<span class="status-icon status-error">✖</span>`;

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="text-start status-col">${status}</td>
    <td class="text-start index-col">${logCounter++}</td>
    <td class="text-start time-col">${time}</td>
    <td class="text-start font-monospace">${sql}</td>
    <td class="text-start ${isSuccess ? "" : "text-danger"}">${message}</td>
    <td class="text-start duration-col">${duration}</td>
  `;
  tbody.prepend(tr);

  while (tbody.rows.length > 3) {
    tbody.deleteRow(tbody.rows.length - 1);
  }
}

function openChartModal() {
  // ✅ 선택값 초기화
  const chartSelect = document.getElementById("chartTypeSelect");
  chartSelect.value = "line";

  // 차트 렌더링
  const isValid = renderChartFromTableData("line");

  if (!isValid) {
    alert("차트를 그릴 수 있는 데이터가 부족합니다.");
    return;
  }

  // ✅ 모달 표시
  const modal = new bootstrap.Modal(document.getElementById("chartModal"));
  modal.show();

  // ✅ 차트 종류 변경 이벤트 핸들링
  chartSelect.onchange = (e) => {
    renderChartFromTableData(e.target.value);
  };
}

function renderChartFromTableData(type = "line") {
  const table = document.querySelector("#result-table");
  if (!table) return false;

  const headers = Array.from(table.querySelectorAll("thead th")).map(th => th.innerText.trim());
  const rows = table.querySelectorAll("tbody tr");

  if (rows.length === 0 || headers.length < 2) return false;

  const labels = [];
  const datasets = headers.slice(1).map((label, idx) => ({
    label,
    data: [],
    backgroundColor: getColor(idx, 0.5),
    borderColor: getColor(idx, 1),
    borderWidth: 2
  }));

  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    labels.push(cells[0].innerText.trim()); // 첫 번째 열은 시간축

    for (let i = 1; i < headers.length; i++) {
      const val = parseInt(cells[i].innerText.trim(), 10);
      datasets[i - 1].data.push(isNaN(val) ? 0 : val);
    }
  });

  const ctx = document.getElementById("chartCanvas").getContext("2d");
  if (window.chartInstance) window.chartInstance.destroy();

  window.chartInstance = new Chart(ctx, {
    type,
    data: {
      labels,
      datasets
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });

  return true;
}

// 🎨 동적으로 색상 생성
function getColor(index, opacity) {
  const colors = [
    "rgba(54, 162, 235, OPACITY)",
    "rgba(255, 99, 132, OPACITY)",
    "rgba(255, 206, 86, OPACITY)",
    "rgba(75, 192, 192, OPACITY)",
    "rgba(153, 102, 255, OPACITY)",
    "rgba(255, 159, 64, OPACITY)"
  ];
  return colors[index % colors.length].replace("OPACITY", opacity);
}

function openDownloadModal() {
  const modal = new bootstrap.Modal(document.getElementById("downloadModal"));
  modal.show();
}

function downloadCsv() {
  const table = document.querySelector("#result-table");
  if (!table) {
    alert("📄 다운로드할 테이블이 없습니다.");
    return;
  }

  const rows = Array.from(table.querySelectorAll("tr"));
  const csvRows = rows.map(row => {
    const cells = Array.from(row.querySelectorAll("th, td"));
    return cells.map(cell => `"${cell.innerText.replace(/"/g, '""')}"`).join(",");
  });

  const csvContent = "\uFEFF" + csvRows.join("\n"); // UTF-8 BOM 추가
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const now = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const filename = `캠페인_보고서_${now}.csv`;

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function downloadExcel() {
  const table = document.querySelector("#result-table");
  if (!table) return alert("테이블이 없습니다.");

  const headers = Array.from(table.querySelectorAll("thead th")).map(th => th.innerText.trim());
  const rows = Array.from(table.querySelectorAll("tbody tr")).map(tr => 
    Array.from(tr.querySelectorAll("td")).map(td => td.innerText.trim())
  );

  axios.post("/sql-workbench/export-excel", { headers, rows }, {
    responseType: "blob"
  })
  .then(res => {
    const blob = new Blob([res.data], { type: res.headers['content-type'] });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  })
  .catch(err => {
    console.error("Excel 다운로드 실패:", err);
  });
}

// ✅ Bootstrap 모달 인스턴스 생성
let saveModalInstance;

document.addEventListener("DOMContentLoaded", () => {
  const saveModalEl = document.getElementById("saveModal");
  if (saveModalEl) {
    saveModalInstance = new bootstrap.Modal(saveModalEl);
  }

  // ✅ Save 아이콘 클릭 시 모달 열기
  const saveBtn = document.querySelector(".icon-save")?.closest("button");
  if (saveBtn && saveModalInstance) {
    saveBtn.addEventListener("click", () => {
      document.getElementById("save-filename").value = ""; // 입력값 초기화
      saveModalInstance.show();
    });
  }

  // ✅ 모달 내 저장 버튼 클릭 시 저장 실행
  const submitBtn = document.getElementById("save-modal-submit");
  if (submitBtn) {
    submitBtn.addEventListener("click", submitSqlSaveRequest);
  }

  const openBtn = document.querySelector(".icon-open")?.closest("button");
  const fileInput = document.getElementById("sql-file-input");
  const sqlTextarea = document.getElementById("sql-input");

  if (openBtn && fileInput && sqlTextarea) {
    openBtn.addEventListener("click", () => {
      fileInput.click(); // 숨겨진 파일 선택창 열기
    });

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        sqlTextarea.value = e.target.result;
      };
      reader.readAsText(file, "utf-8");
    });
  }
});

// ✅ 서버로 SQL 저장 요청 전송 함수
async function submitSqlSaveRequest() {
  const filenameInput = document.getElementById("save-filename");
  const sqlInput = document.getElementById("sql-input");

  const filename = filenameInput?.value.trim();
  const content = sqlInput?.value;

  if (!filename) {
    alert("파일 이름을 입력하세요.");
    filenameInput?.focus();
    return;
  }

  try {
    const response = await fetch("/save-sql-json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, content })
    });

    if (response.ok) {
      const result = await response.json();
      saveModalInstance?.hide();
      location.reload();
    } else {
      alert("서버 저장 실패");
    }
  } catch (error) {
    console.error("저장 오류:", error);
    alert("저장 중 오류 발생");
  }
}
