function showModal(title, message) {
  // 기존 모달이 있다면 제거
  const existing = document.getElementById("customMessageModal");
  if (existing) existing.remove();

  // 모달 HTML 템플릿 생성
  const modalHTML = `
    <div class="modal fade" id="customMessageModal" tabindex="-1" aria-labelledby="customMessageModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="customMessageModalLabel">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="닫기"></button>
          </div>
          <div class="modal-body">
            <p id="rejectionReason" class="mb-0 text-secondary">${message}</p> 
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // DOM에 삽입
  const wrapper = document.createElement("div");
  wrapper.innerHTML = modalHTML;
  document.body.appendChild(wrapper);

  // Bootstrap 모달 실행
  const modal = new bootstrap.Modal(document.getElementById("customMessageModal"));
  modal.show();
}

function showConfirmModal(title, message) {
  return new Promise((resolve) => {
    // 기존 모달이 있다면 제거
    const existing = document.getElementById("customConfirmModal");
    if (existing) existing.remove();

    const modalHTML = `
      <div class="modal fade" id="customConfirmModal" tabindex="-1" aria-labelledby="customConfirmModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="customConfirmModalLabel">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="닫기"></button>
            </div>
            <div class="modal-body">
              <p class="mb-0 text-secondary">${message}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="confirmCancelBtn">취소</button>
              <button type="button" class="btn btn-primary" id="confirmOkBtn">확인</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = modalHTML;
    document.body.appendChild(wrapper);

    const modalElement = document.getElementById("customConfirmModal");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    // 이벤트 연결
    document.getElementById("confirmOkBtn").addEventListener("click", () => {
      resolve(true);
      modal.hide();
    });

    document.getElementById("confirmCancelBtn").addEventListener("click", () => {
      resolve(false);
      modal.hide();
    });

    // ESC로 닫히거나 backdrop 클릭할 때도 false 리턴
    modalElement.addEventListener("hidden.bs.modal", () => {
      resolve(false);
    });
  });
}
