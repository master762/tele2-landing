document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const phoneInput = document.getElementById("phone");
  const consentCheckbox = document.getElementById("consent");
  const phoneError = document.getElementById("phone-error");
  const consentError = document.getElementById("consent-error");
  const successMessage = document.querySelector(".form__success-message");

  // localstorage
  const getSubmittedPhones = () => {
    const phones = localStorage.getItem("submittedPhones");
    return phones ? new Set(JSON.parse(phones)) : new Set();
  };

  const addSubmittedPhone = (phone) => {
    const phones = getSubmittedPhones();
    phones.add(phone);
    localStorage.setItem("submittedPhones", JSON.stringify([...phones]));
  };

  const isPhoneSubmitted = (phone) => {
    return getSubmittedPhones().has(phone);
  };

  // маска
  IMask(phoneInput, {
    mask: "+{7} (000) 000-00-00",
    lazy: false,
    placeholderChar: "_",
  });

  // валидация формы
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.classList.remove("form--error", "form--success");

    // очистка
    phoneError.textContent = "";
    consentError.textContent = "";
    phoneError.style.display = "none";
    consentError.style.display = "none";

    // валидация
    const isPhoneValid = /\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}/.test(
      phoneInput.value
    );
    const isConsentValid = consentCheckbox.checked;

    // проверка на уже введенный номер
    if (isPhoneValid && isPhoneSubmitted(phoneInput.value)) {
      form.classList.add("form--error");
      phoneError.textContent = "На этот номер уже выслан промокод";
      phoneError.style.display = "block";
      return;
    }

    if (!isPhoneValid || !isConsentValid) {
      form.classList.add("form--error");

      if (!isPhoneValid) {
        phoneError.textContent = "Введите корректный номер телефона";
        phoneError.style.display = "block";
      }

      if (!isConsentValid) {
        consentError.textContent = "Необходимо ваше согласие";
        consentError.style.display = "block";
      }
      return;
    }

    // блокировка кнопки на время обработки
    const submitButton = form.querySelector("button");
    submitButton.disabled = true;

    try {
      addSubmittedPhone(phoneInput.value);
      form.classList.add("form--success");
      successMessage.hidden = false;
      successMessage.style.display = "flex";
      form.reset();
      setTimeout(() => {
        successMessage.hidden = true;
        successMessage.style.display = "";
      }, 5000);
    } catch (error) {
      console.error("Ошибка:", error);
      form.classList.add("form--error");
      phoneError.textContent = "Ошибка отправки, попробуйте позже";
      phoneError.style.display = "block";
    } finally {
      submitButton.disabled = false;
    }
  });
  phoneInput.addEventListener("input", () => {
    phoneError.textContent = "";
    phoneError.style.display = "none";
  });

  consentCheckbox.addEventListener("change", () => {
    consentError.textContent = "";
    consentError.style.display = "none";
  });
});
