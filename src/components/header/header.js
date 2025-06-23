const triggerModal = document.querySelector(".header__location");
const modal = document.querySelector(".modal");

modal.style.cssText =
  "display: block; visibility: hidden; opacity: 0; transition: opacity 0.3s ease-in-out;";

let isModalOpen = false;

const openModal = () => {
  modal.style.visibility = "visible";
  modal.style.opacity = "1";
  triggerModal.setAttribute("aria-expanded", "true");
  isModalOpen = true;
};

const closeModal = () => {
  modal.style.opacity = "0";
  triggerModal.setAttribute("aria-expanded", "false");
  isModalOpen = false;

  setTimeout(() => {
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
