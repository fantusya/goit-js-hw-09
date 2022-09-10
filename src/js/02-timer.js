import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from 'notiflix';
require("flatpickr/dist/themes/confetti.css");

const input = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');
const fieldEl = document.querySelectorAll('.field');

startButton.addEventListener('click', onStartButtonClick);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      if (selectedDates[0] < new Date()) {
          Notiflix.Notify.failure("Please choose a date in the future");
          startButton.disabled = true;
      } else {
          startButton.disabled = false;
      };
  },
};

flatpickr(input, options);

startButton.disabled = true;

function onStartButtonClick() {
    let intervalId = setInterval(() => {
        startButton.disabled = true;
        let deltaTime = new Date(input.value) - new Date();

        if (deltaTime >= 0) {
            let timer = convertMs(deltaTime);
            updateClockFace(timer);
            if (deltaTime <= 60000) {
                for (const el of fieldEl) {
                    el.classList.add('end');
                }
            }
        } else {
            clearInterval(intervalId);
        }

    }, 1000);
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function updateClockFace({ days, hours, minutes, seconds }) {
    daysSpan.textContent = `${days}`;
    hoursSpan.textContent = `${hours}`;
    minutesSpan.textContent = `${minutes}`;
    secondsSpan.textContent = `${seconds}`;
}