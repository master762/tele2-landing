document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector(".hero__modal");
  const triggerButton = document.querySelector(".hero__left-button");

  modal.style.cssText = `
    display: flex;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  `;

  const openModal = () => {
    modal.style.visibility = "visible";
    document.body.style.overflow = "hidden";
    modal.style.opacity = "1";
    triggerButton.setAttribute("aria-expanded", "true");
  };

  const closeModal = () => {
    modal.style.opacity = "0";
    triggerButton.setAttribute("aria-expanded", "false");
    setTimeout(() => {
      document.body.style.overflow = "";
      modal.style.visibility = "hidden";
    }, 300);
  };

  triggerButton.addEventListener("click", openModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.visibility === "visible") {
      closeModal();
    }
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  const form = document.querySelector(".hero__modal-form");
  const phoneInput = document.getElementById("input");
  const consentCheckbox = document.getElementById("error");
  const phoneError = document.querySelector("#phone-error");
  const consentError = document.querySelector("#consent-error");
  const successMessage = document.querySelector(".form__submit-success");

  // Проверка, что все элементы найдены
  if (
    !form ||
    !phoneInput ||
    !consentCheckbox ||
    !consentError ||
    !successMessage
  ) {
    console.error("Не найдены необходимые элементы формы");
    return;
  }

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

    // Сброс ошибок
    if (phoneError) phoneError.style.display = "none";
    consentError.style.display = "none";

    // валидация
    const isPhoneValid = /\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}/.test(
      phoneInput.value
    );
    const isConsentValid = consentCheckbox.checked;

    // проверка на уже введенный номер
    if (isPhoneValid && isPhoneSubmitted(phoneInput.value)) {
      if (phoneError) {
        phoneError.textContent = "На этот номер уже выслан промокод";
        phoneError.style.display = "block";
      }
      return;
    }

    if (!isPhoneValid || !isConsentValid) {
      if (!isPhoneValid && phoneError) {
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
      successMessage.hidden = false;
      form.reset();

      setTimeout(() => {
        successMessage.hidden = true;
        closeModal();
      }, 5000);
    } catch (error) {
      console.error("Ошибка:", error);
      if (phoneError) {
        phoneError.textContent = "Ошибка отправки, попробуйте позже";
        phoneError.style.display = "block";
      }
    } finally {
      submitButton.disabled = false;
    }
  });

  // Очистка
  phoneInput.addEventListener("input", () => {
    if (phoneError) phoneError.style.display = "none";
  });

  consentCheckbox.addEventListener("change", () => {
    consentError.style.display = "none";
  });
});
