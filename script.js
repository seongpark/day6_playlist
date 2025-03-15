const keywords = document.querySelectorAll(".keyword");

keywords.forEach((keyword, index) => {
  keyword.addEventListener("click", () => {
    keyword.classList.toggle("selected");
  });
});

//키워드 처리
document.querySelector(".letsmake").addEventListener("click", () => {
  const selectedIds = [];

  const selectedButtons = document.querySelectorAll(".keyword.selected");

  if (selectedButtons.length === 0) {
    alert("최소 1개의 키워드를 선택해야 합니다.");
    return;
  }

  if (selectedButtons.length > 3) {
    alert("최대 3개의 버튼만 선택할 수 있습니다.");
    return;
  }

  selectedButtons.forEach((button, index) => {
    selectedIds.push(`keyword${index + 1}=${button.id}`);
  });

  const queryString = selectedIds.join("&");
  window.location.href = `result.html?${queryString}`;
});
