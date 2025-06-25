import "../pages/index.css";
import "../vendor/fonts.css";
import {
  enableValidation,
  settings,
  showInputError,
  hideInputError,
  checkInputValidity,
  hasInvalidInput,
  toggleButtonState,
  disableButton,
  setEventListeners,
  resetValidation,
} from "../scripts/validation.js";
import avatarSrc from "../images/avatar.jpg";
import pencilIcon from "../images/pencil-light.svg";
import logo from "../images/spots_logo.svg";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "a0ff7229-663f-4e80-b652-bd3a7309c542",
    "Content-Type": "application/json",
  },
});

api
  .getInitialCards()
  .then((cards) => {
    cards.forEach((item) => {
      const cardEl = createCard(item);
      cardsList.append(cardEl);
    });
  })
  .catch((err) => {
    console.error(err);
  });

api
  .getUserInfo()
  .then((user) => {
    profileName.textContent = user.name;
    profileDescription.textContent = user.about;
    avatarImg.src = user.avatar;
  })
  .catch((err) => {
    console.error(err);
  });
const pencilIconImg = document.querySelector(".profile__pencil-icon");
pencilIconImg.src = pencilIcon;
const cardTemplate = document.querySelector("#card");
const cardsList = document.querySelector(".cards__list");
const logoImg = document.querySelector(".header__logo");
logoImg.src = logo;

const previewModal = document.querySelector("#preview-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn");

const editModal = document.querySelector("#edit-modal");
const addCardModal = document.querySelector("#add-card-modal");
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCancelBtn = deleteModal.querySelector(
  ".modal__button_type_cancel"
);
const deleteBtn = deleteForm.querySelector(".modal__button_type_delete");

const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileEditBtn = document.querySelector(".profile__edit-button");
const profileAddBtn = document.querySelector(".profile__add-button");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarImg = document.getElementById("profile-avatar");
avatarImg.src = avatarSrc;

const editForm = editModal.querySelector(".modal__form[name='edit-profile']");
const addCardForm = addCardModal.querySelector(".modal__form[name='add-card']");

const editNameInput = editForm.querySelector("#name");
const editDescriptionInput = editForm.querySelector("#description");
const addCardLinkInput = addCardForm.querySelector("#add-card-link");
const addCardCaptionInput = addCardForm.querySelector("#add-card-caption");

let selectedCard;
let selectedCardId;

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscClose);
}
function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const originalText = deleteBtn.textContent;
  deleteBtn.textContent = "Deleting...";

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      deleteBtn.textContent = originalText;
    });
}

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal.modal_opened");
    if (openedModal) closeModal(openedModal);
  }
}

function closeByOverlayClick(evt) {
  if (evt.target.classList.contains("modal_opened")) {
    closeModal(evt.target);
  }
}

function createCard(data) {
  const { name, link, isLiked } = data;
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteBtn = cardElement.querySelector(".card__delete-button");
  const likeBtn = cardElement.querySelector(".card__like-button");

  cardImage.src = link;
  cardImage.alt = name;
  cardTitle.textContent = name;

  if (isLiked) {
    likeBtn.classList.add("card__like-button_active");
  }

  likeBtn.addEventListener("click", () => {
    if (likeBtn.classList.contains("card__like-button_active")) {
      api
        .removeLike(data._id)
        .then((updatedCard) => {
          likeBtn.classList.remove("card__like-button_active");
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      api
        .addLike(data._id)
        .then((updatedCard) => {
          likeBtn.classList.add("card__like-button_active");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });

  deleteBtn.addEventListener("click", () => {
    handleDeleteCard(cardElement, data);
  });

  cardImage.addEventListener("click", () => {
    previewImage.src = link;
    previewImage.alt = name;
    previewCaption.textContent = name;
    openModal(previewModal);
  });

  return cardElement;
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const saveBtn = editForm.querySelector(".modal__save-btn");
  const originalText = saveBtn.textContent;
  saveBtn.textContent = "Saving...";

  api
    .editUserInfo({
      name: editNameInput.value,
      about: editDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      saveBtn.textContent = originalText;
    });
}

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  const saveBtn = addCardForm.querySelector(".modal__save-btn");
  const originalText = saveBtn.textContent;
  saveBtn.textContent = "Saving...";

  const newCard = {
    name: addCardCaptionInput.value,
    link: addCardLinkInput.value,
  };

  api
    .addCard(newCard)
    .then((cardData) => {
      cardsList.prepend(createCard(cardData));
      closeModal(addCardModal);
      addCardForm.reset();
      disableButton(saveBtn, settings);
    })
    .catch(console.error)
    .finally(() => {
      saveBtn.textContent = originalText;
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const saveBtn = avatarForm.querySelector(".modal__save-btn");
  const originalText = saveBtn.textContent;
  saveBtn.textContent = "Saving...";

  api
    .editAvatarInfo({ avatar: avatarInput.value })
    .then((data) => {
      avatarImg.src = data.avatar;
      closeModal(avatarModal);
      avatarInput.value = "";
      disableButton(saveBtn, settings);
    })
    .catch(console.error)
    .finally(() => {
      saveBtn.textContent = originalText;
    });
}

profileEditBtn.addEventListener("click", () => {
  editNameInput.value = profileName.textContent;
  editDescriptionInput.value = profileDescription.textContent;
  resetValidation(editForm, settings);
  openModal(editModal);
});

profileAddBtn.addEventListener("click", () => {
  openModal(addCardModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

document.querySelectorAll(".modal__close-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    closeModal(btn.closest(".modal"));
  });
});

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", closeByOverlayClick);
});

deleteModalCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

previewCloseBtn.addEventListener("click", () => closeModal(previewModal));

editForm.addEventListener("submit", handleEditFormSubmit);
addCardForm.addEventListener("submit", handleAddCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

enableValidation(settings);
