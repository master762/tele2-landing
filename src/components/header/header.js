const triggerModal = document.querySelector(".header__location");
const modal = document.querySelector(".modal");
const locationText = document.querySelector(".header__location-text");

document.addEventListener("DOMContentLoaded", () => {
  const savedCity = localStorage.getItem("selectedCity");
  if (savedCity) {
    locationText.textContent = savedCity;
  }
});

modal.style.cssText =
  "display: block; visibility: hidden; opacity: 0; transition: opacity 0.3s ease-in-out;";

let isModalOpen = false;

const openModal = () => {
  modal.style.visibility = "visible";
  document.body.style.overflow = "hidden";
  modal.style.opacity = "1";
  triggerModal.setAttribute("aria-expanded", "true");
  isModalOpen = true;
};

const closeModal = () => {
  modal.style.opacity = "0";
  triggerModal.setAttribute("aria-expanded", "false");
  isModalOpen = false;
  setTimeout(() => {
    document.body.style.overflow = "";
    modal.style.visibility = "hidden";
  }, 300);
};

const toggleModal = () => {
  if (isModalOpen) {
    closeModal();
  } else {
    openModal();
  }
};

triggerModal.addEventListener("click", toggleModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isModalOpen) {
    closeModal();
  }
});

const handleCitySelect = (city) => {
  locationText.textContent = city;
  localStorage.setItem("selectedCity", city);
  closeModal();
};

document.querySelectorAll(".modal__city-item").forEach((cityElement) => {
  cityElement.addEventListener("click", () => {
    handleCitySelect(cityElement.textContent);
  });
});
