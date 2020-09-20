/*  
 스크롤 할 때, visible class가 왔다갔다 하는 것
 스크립트로 스크롤 구간에 따라서 그래픽 아이템들의 visible 클래스를 붙였다 떼었다 하면 됨
 기본은 opacity :0 , visible -> opacity :1

 !!! 뭘 기준으로 visible을 붙일까?
 - 이미지는 내용에 맞춰서 보여줘야함, 내용하고 이미지가 짝이 맞아야 함
 -> 스크롤을 할 때, 각 말풍선의 위치를 기준으로 잡을거임 -> rec
 -> 말풍선의 위치를 기준으로, 말풍선이 어느정도 올라왔다고 하면, 말풍선에 해당하는 이미지로 바꿔줌
 -> 그러면 쌍을 맞춰야함 (말풍선 - 이미지) 

 -> 단순하게 말풍선(step)에 index를 붙여주고, 이미지들도 index를 붙여줌
 -> step의 index가 5번이면, 5번째 이미지를 보여주
 
 -> data-index="0" data-으로 시작하는 속성은 Html 표준임
 -> 표준으로 custom 속성을 만들 수 있음

 -> js로 loop 돌면서 자동으로 붙여줘볼께요
 -

 -> 전역 변수 사용을 회피하기 위해서 (()=>{})() 즉시 실행 익명함수를 만든다. 
*/

// IntersectionObserver

const actions = {
  birdFlies(isStart) {
    const birdElement = document.querySelector('[data-index="2"] .bird');
    if (isStart) {
      birdElement.style.transform = `translateX(${window.innerWidth}px)`;
    } else {
      birdElement.style.transform = `translateX(-100%)`;
    }
  },
  birdFlies2(isStart) {
    const birdElement = document.querySelector('[data-index="5"] .bird');
    if (isStart) {
      birdElement.style.transform = `translate(${window.innerWidth}px,${
        -window.innerHeight * 0.7
      }px)`;
    } else {
      birdElement.style.transform = `translateX(-100%)`;
    }
  },
};

(() => {
  const stepElems = document.querySelectorAll(".step");
  const graphicElems = document.querySelectorAll(".graphic-item");
  let currentItem = graphicElems[0]; // 현재 활성화된(visible 클래스가 붙은) .grapic-item 지정
  let ioIndex = 0;
  // Intersection Observer 객체가,
  // observe로 관찰하는 대상이 되는 객체들이 사라지거나 나타날 때,
  // 그 시점마다 callback함수가 실행이 된다.
  const io = new IntersectionObserver((entries, observer) => {
    ioIndex = Number(entries[0].target.dataset.index);
  });

  for (let i = 0; i < stepElems.length; i++) {
    io.observe(stepElems[i]);
    stepElems[i].dataset.index = i;
    graphicElems[i].dataset.index = i;
  }

  function activate() {
    currentItem.classList.add("visible");

    const actionName = currentItem.dataset.action;
    if (actionName && typeof actionName !== "undefined") {
      actions[actionName](true);
    }
  }

  function inactivate() {
    currentItem.classList.remove("visible");

    const actionName = currentItem.dataset.action;
    if (actionName && typeof actionName !== "undefined") {
      actions[actionName](false);
    }
  }

  window.addEventListener("scroll", () => {
    let step;
    let boundingRect;

    for (let i = ioIndex > 0 ? ioIndex - 1 : 0; i <= ioIndex + 1; i++) {
      step = stepElems[i];
      boundingRect = step.getBoundingClientRect();

      if (
        boundingRect.top > window.innerHeight * 0.1 &&
        boundingRect.top < window.innerHeight * 0.8
      ) {
        inactivate();
        currentItem = graphicElems[step.dataset.index];
        activate();
      }
    }
  });

  window.addEventListener("load", () => {
    setTimeout(() => scrollTo(0, 0), 100);
  });
  activate();
})();
