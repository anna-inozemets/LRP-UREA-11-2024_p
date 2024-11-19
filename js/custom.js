// main variables that used in code
const slideContainer = document.querySelector('.slide__container')
const rotateBlock = document.querySelector('.rotate__block');
const agreementButton = document.querySelector('.agree');
const nextSlideButton = document.querySelector('.arrow--next');
const prevSlideButton = document.querySelector('.arrow--prev');

// additional variables for timeout Ids
let nextButtonTimeout;
let prevButtonTimeout;
let lastSlideActionTimeout;

// additional variables for arrows
const hiddenArrowClass = 'hidden';
let nextArrowDelay = 1;

// additional varibles for slides
const totalSlideAmount = 10;
const pathNames = Array.from(
  { length: totalSlideAmount }, (_, i) => ({ count: i + 1, pathName:`./slides/slide--${i + 1}.html` })
);

// additional function for detecting correct font-size
function heightDetect(percent) {
  const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  return (percent * (height - 6)) / 100;
}
function widthDetect(percent) {
  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  return (percent * width) / 100;
}
function setResponsiveFontSize() {
  $('.slide__container').css({
    'font-size': `clamp(1px, ${heightDetect(0.925925)}px,${widthDetect(0.520833)}px)`
  });
  $('.arrows').css({
    'font-size': `clamp(1px, ${heightDetect(0.925925)}px,${widthDetect(0.520833)}px)`
  });
}

// function for action after last slide
function lastSlideAction() {
  let id = $('#presentation', window.parent.document).attr('data-id');
  let $url = "https://www.dermaclub.com.ua/courses/send/presa";
  let href = $('#presentation', window.parent.document).attr('data-href');
  let $token = $('meta[name="csrf-token"]', window.parent.document).attr('content');
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $token
    }
  });
  $.ajax({
    type: "POST",
    url: $url,
    data: {"id": id},
    success: function (data) {
      if (data !== false) {
        parent.location.href = href;
      }
    },
    error: function (data) {
      console.log(data);
    }
  });
}

// function that animate number from 0 to correct num
function animateNumber(delay, duration = 2.5) {
  const allElements = document.querySelectorAll('[data-number]');

  allElements.forEach(el => {
    const targetNumber = Number(el.getAttribute('data-number'));

    gsap.to(el, {
      duration: duration,
      innerHTML: targetNumber,
      delay,
      onUpdate: () => {
        el.innerHTML = Math.round(el.innerHTML);
      },
      onComplete: () => {
        el.innerHTML = targetNumber;
      }
    });
  });
}

// object that store manipulations with slides
const slideActions = {
  1: () => {
    nextArrowDelay = 1;
  },
  2: () => {
    animateNumber(1, 0.75);
    gsap.from('.slide--2-bottle img', { opacity: 0, duration: 0.75, delay: 1, scale: 0, y: 75 });
    nextArrowDelay = 2;
  },
  3: () => {
    gsap.from('.slide--3-compound-block.first', { opacity: 0, duration: 0.75, delay: 1, y: 60 });
    gsap.from('.slide--3-compound-block.second', { opacity: 0, duration: 0.75, delay: 1.3, y: 60 });
    gsap.from('.slide--3-compound-block.third', { opacity: 0, duration: 0.75, delay: 1.6, y: 60 });
    nextArrowDelay = 2.6;
  },
  4: () => {
    gsap.from('.slide--4-bottle-block', { opacity: 0, duration: 1.9, delay: 1, y: -80 });
    gsap.from('.slide--4-decorator', { opacity: 0, duration: 1.9, delay: 1})
    gsap.from('.slide--4-content-block-1', { opacity: 0, duration: 0.75, delay: 1, y: 60 });
    gsap.from('.slide--4-content-block-2', { opacity: 0, duration: 0.75, delay: 1.3, y: 60 });
    gsap.from('.slide--4-content-block-3', { opacity: 0, duration: 0.75, delay: 1.6, y: 60 });
    gsap.from('.slide--4-content-block-4', { opacity: 0, duration: 0.75, delay: 1.9, y: 60 });
    nextArrowDelay = 2.9;
  },
  5: () => {
    gsap.from('.slide--5-bottle img', { opacity: 0, duration: 0.75, delay: 1, y: 300 });
    nextArrowDelay = 2;
  },
  6: () => {
    animateNumber(1);
    nextArrowDelay = 3.5;
  },
  7: () => {
    gsap.from('.slide--7 .first', { opacity: 0, duration: 0.75, delay: 1 });
    gsap.from('.slide--7 .second', { opacity: 0, duration: 0.75, delay: 1.6 });
    gsap.from('.slide--7 .third', { opacity: 0, duration: 0.75, delay: 2.2 });
    gsap.from('.slide--7 .fourth', { opacity: 0, duration: 0.75, delay: 2.8 });
    nextArrowDelay = 3.8;
  },
  8: () => {
    animateNumber(1, 1);
    gsap.from('.slide--8__left-block.first', { opacity: 0, duration: 0.75, delay: 1, x: -30 });
    gsap.from('.slide--8__left-block.second', { opacity: 0, duration: 0.75, delay: 1, x: 30 });
    nextArrowDelay = 2.25;
  },
  9: () => {
    clearTimeout(lastSlideActionTimeout);
    gsap.from('.slide--9 .first', { opacity: 0, duration: 0.75, delay: 1 });
    gsap.from('.slide--9 .second', { opacity: 0, duration: 0.75, delay: 1.6 });
    gsap.from('.slide--9 .third', { opacity: 0, duration: 0.75, delay: 2.2 });
    gsap.from('.slide--9 .fourth', { opacity: 0, duration: 0.75, delay: 2.8 });
    nextArrowDelay = 3.8;
  },
  10: () => {
    gsap.from('.slide--10-block-1', { opacity: 0, duration: 0.75, delay: 1, x: 30 });
    gsap.from('.slide--10-block-2', { opacity: 0, duration: 0.75, delay: 1.6, x: 30 });
    gsap.from('.slide--10-block-3', { opacity: 0, duration: 0.75, delay: 2.2, x: 30 });

    lastSlideActionTimeout = setTimeout(() => {
      lastSlideAction();
    }, 8.5 * 1000);
  }
}
// function that add animation for element
function animateSlide(slideNum = 1) {
  gsap.from('.slide', { opacity: 0, duration: 0.75 });

  slideActions[slideNum]();
}
// function that detect oriental of device
function updateRotateBlockVisibility() {
  const isPortrait = window.matchMedia('(orientation: portrait)').matches;

  $(rotateBlock).toggleClass('visible', isPortrait);
}
// function that load slide without reloading page
async function loadComponent(componentPathName, slideNum) {
  const response = await fetch(componentPathName);
  const data = await response.text();

  slideContainer.innerHTML = data;
  animateSlide(slideNum);
}
// function that update info about prev/next button
function updateNavigationButtons(currentSlide) {
  clearTimeout(nextButtonTimeout);
  clearTimeout(prevButtonTimeout);

  $(nextSlideButton).addClass(hiddenArrowClass);
  $(prevSlideButton).addClass(hiddenArrowClass);

  switch (currentSlide) {
    case 0:
      break;
    case 1:
      $(nextSlideButton).removeClass(hiddenArrowClass);
      break;
    case totalSlideAmount:
      $(prevSlideButton).removeClass(hiddenArrowClass);
      break;
    default:
      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
        $(prevSlideButton).removeClass(hiddenArrowClass);
      }, nextArrowDelay * 1000);
  }
}
// function that change slide on the screen
async function changeSlide(direction) {
  const currentSlideNum = slideContainer.getAttribute('data-current-slide');

  let newSlideNum;

  if (direction === 'next') {
    newSlideNum = Number(currentSlideNum) + 1;
  } else if (direction === 'prev') {
    newSlideNum = Number(currentSlideNum) - 1;
  }

  const { pathName } = pathNames.find(pathNameInfo => pathNameInfo.count === +newSlideNum);

  await loadComponent(pathName, newSlideNum);

  slideContainer.setAttribute('data-current-slide', newSlideNum);
  updateNavigationButtons(newSlideNum);
}

//window and document listeners
$(document).ready(function () {
  setResponsiveFontSize();
  updateRotateBlockVisibility();
});
$(window).on('resize', function () {
  setResponsiveFontSize();
  updateRotateBlockVisibility();
});
$(window).on('orientationchange', function () {
  updateRotateBlockVisibility();
});

// button listeners
$(agreementButton).on('click', () => {
  loadComponent(pathNames[0].pathName);
  slideContainer.setAttribute('data-current-slide', 1);
  updateNavigationButtons(1);
});
$(nextSlideButton).on('click', () => {
  changeSlide('next')
})
$(prevSlideButton).on('click', () => {
  changeSlide('prev')
});
