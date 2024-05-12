
const keywords = document.querySelectorAll(".keyword");

keywords.forEach((keyword, index) => {
  keyword.addEventListener("click", () => {
    keyword.classList.toggle("selected");
  });
});

//키워드 처리
document.querySelector(".letsmake").addEventListener("click", () => {
  const selectedIds = [];

  const selectedButtons =
    document.querySelectorAll(".keyword.selected");

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

// 추천곡 로테이션
const divs = ["content1", "content2", "content3"];

let currentIndex = 0;
const contentDivs = divs.map((id) => document.getElementById(id));

contentDivs.forEach((div, index) => {
  if (index !== 0) {
    div.style.display = "none";
  } else {
    div.style.display = "flex";
  }
});

function changeDiv() {
  contentDivs[currentIndex].style.display = "none";

  currentIndex = (currentIndex + 1) % divs.length;
  contentDivs[currentIndex].style.display = "flex";

  setTimeout(changeDiv, 3000);
}

setTimeout(changeDiv, 3000);