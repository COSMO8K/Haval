"use strict";

const carsSlider = document.querySelector(".cars-slider");
const carCards = document.querySelectorAll(".car-card");
const modalForm = document.querySelector(".modal-form");

if (carsSlider) {
  new Swiper(carsSlider, {
    slidesPerView: 1,
    spaceBetween: 20,

    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
    },
  });
}

carCards.forEach((card) => {
  const carImage = card.querySelector("[data-car-image]");
  const carImageLink = card.querySelector("[data-car-image-link]");
  const colorButtons = card.querySelectorAll("[data-car-color]");

  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const imagePath = button.dataset.carColor;

      carImage.src = imagePath;
      carImageLink.href = imagePath;

      colorButtons.forEach((currentButton) => {
        currentButton.classList.remove("is-active");
      });

      button.classList.add("is-active");
    });
  });
});

if (modalForm) {
  modalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    modalForm.reset();
    $.fancybox.close();
  });
}

const timerItems = document.querySelectorAll("[data-timer-unit]");

if (timerItems.length) {
  const initialTime = getTimeFromMarkup(timerItems);
  const deadline = Date.now() + getTimeInMilliseconds(initialTime);

  updateTimer(timerItems, initialTime, deadline);

  const timerInterval = setInterval(() => {
    const isTimeLeft = updateTimer(timerItems, initialTime, deadline);

    if (!isTimeLeft) {
      clearInterval(timerInterval);
    }
  }, 1000);
}

function getTimeFromMarkup(items) {
  const time = {};

  items.forEach((item) => {
    const unit = item.dataset.timerUnit;
    const valueElement = item.querySelector("[data-timer-value]");

    time[unit] = Number(valueElement.textContent);
  });

  return time;
}

function getTimeInMilliseconds(time) {
  const days = time.days * 24 * 60 * 60 * 1000;
  const hours = time.hours * 60 * 60 * 1000;
  const minutes = time.minutes * 60 * 1000;
  const seconds = time.seconds * 1000;

  return days + hours + minutes + seconds;
}

function getTimeParts(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));

  const days = Math.floor(totalSeconds / 60 / 60 / 24);
  const hours = Math.floor((totalSeconds / 60 / 60) % 24);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const seconds = Math.floor(totalSeconds % 60);

  return { days, hours, minutes, seconds };
}

function updateTimer(items, initialTime, deadline) {
  const timeLeft = deadline - Date.now();
  const timeParts = getTimeParts(timeLeft);

  items.forEach((item) => {
    const unit = item.dataset.timerUnit;
    const valueElement = item.querySelector("[data-timer-value]");
    const value = timeParts[unit];

    valueElement.textContent = value;
    item.style.setProperty(
      "--progress",
      `${getProgress(unit, value, initialTime)}%`
    );
  });

  return timeLeft > 0;
}

function getProgress(unit, value, initialTime) {
  const maxValues = {
    days: initialTime.days || 1,
    hours: 24,
    minutes: 60,
    seconds: 60,
  };

  return (value / maxValues[unit]) * 100;
}
