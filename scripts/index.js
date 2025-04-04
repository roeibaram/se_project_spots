const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const cardTemplate = document.querySelector("#card");
const cardsList = document.querySelector(".cards__list");
const previewModal = document.querySelector("#preview-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
const previewCloseButton = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);
const newCardButton = document.querySelector(".profile__add-button");
const editProfileButton = document.querySelector(".profile__edit-button");
const editModal = document.querySelector("#edit-modal");
const addCardModal = document.querySelector("#add-card-modal");
const editModalcloseButton = editModal.querySelector(".modal__close-btn");
const addModalCloseButton = addCardModal.querySelector(".modal__close-btn");
const cardSavebutton = document.querySelector(".modal__save-btn");

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

editProfileButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editModal);
});

newCardButton.addEventListener("click", () => {
  openModal(addCardModal);
});

editModalcloseButton.addEventListener("click", () => {
  closeModal(editModal);
});

addModalCloseButton.addEventListener("click", () => {
  closeModal(addCardModal);
});

previewCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const editModalDescriptionInput = document.querySelector("#description");
const editModalNameInput = document.querySelector("#name");
const desPlaceholder = document.querySelector("#description");
const modalSaveBtn = document.querySelector(".modal__save-btn");

const profileFormElement = document.querySelector(".modal__form");
profileFormElement.addEventListener("submit", handleProfileFormSubmit);

const cardFormElement = addCardModal.querySelector(".modal__form");
cardFormElement.addEventListener("submit", handleCardFormSubmit);
const cardModalLinkInput = document.querySelector("#add-card-link");
const cardModalCaptionInput = document.querySelector("#add-card-caption");

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const newCard = {
    link: cardModalLinkInput.value,
    name: cardModalCaptionInput.value,
  };
  initialCards.unshift(newCard);
  cardsList.prepend(getCardElement(newCard));
  cardFormElement.reset();
  closeModal(addCardModal);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardImageElement = cardElement.querySelector(".card__image");
  const cardNameElement = cardElement.querySelector(".card__title");
  const likeButtonElement = cardElement.querySelector(".card__like-button");
  const deleteButtonElement = cardElement.querySelector(".card__delete-button");

  // Set card content
  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  // Add event listeners
  likeButtonElement.addEventListener("click", () => {
    likeButtonElement.classList.toggle("card__like-button_active");
  });

  deleteButtonElement.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImageElement.addEventListener("click", () => {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.prepend(cardElement);
});
