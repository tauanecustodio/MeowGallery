// ---------------- variables ----------------

const API_URL = 'https://api.thecatapi.com/v1/images/search?limit=10';
const API_KEY = 'dfd'

const galleryEl = document.querySelector('.gallery');

const modalEl = document.querySelector('.modal');
const modalImgContainerEl = document.querySelector('.modal__img-container');
const modalCloseBtnEl = document.querySelector('.modal__close-btn');
const modalImgEl = document.querySelector('.modal__img');
const modalPrevEl = document.querySelector('.modal__prev');
const modalNextEl = document.querySelector('.modal__next');

let images = [];
let appStates = {
    modalImgPosition: undefined //position of the array that the image displayed in the modal belongs to - to use in prev and next
};

// ---------------- functions ----------------

async function fetchImagesData(url) {
    try {
        const response = await fetch(url);
        if(!response.ok) throw new Error('Erro ao buscar imagens');

        const imagesData = await response.json();
        console.log('images Data: ', imagesData); 

        return imagesData;
    } catch (error) {
        console.error('Error ao buscar as imagens', error.message);
        return null;
    }
}

function createGalleryItem(img) {
    const galleryItem = document.createElement('li');
    galleryItem.className = 'gallery__item';
    galleryItem.setAttribute('id', img.id);
    galleryItem.addEventListener('click', function() {
        const imgId = this.id;
        const imagemExibida = images.find(img => img.id === imgId);
        const indexOfImg = images.indexOf(imagemExibida);
        appStates.modalImgPosition = indexOfImg;

        displayImageModal();
    })
    
    const galleryImg = document.createElement('img');
    galleryImg.setAttribute('src', img.url);
    galleryImg.className = 'gallery__img';

    galleryItem.appendChild(galleryImg);
    
    return galleryItem;
}

function displayImages(images) {
    images.forEach(image => {
        galleryEl.appendChild(createGalleryItem(image));        
    });
}

function openModal() {
    modalEl.style.display = 'grid';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalEl.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function displayImageModal() {
    const img = images[appStates.modalImgPosition];
    modalImgEl.setAttribute('src', img.url);
    openModal();

    if (appStates.modalImgPosition === 0) {
        modalPrevEl.disabled = true;
    } else {
        modalPrevEl.disabled = false;
    }

    if (appStates.modalImgPosition === images.length - 1) {
        modalNextEl.disabled = true;
    } else {
        modalNextEl.disabled = false;
    }
}

// ---------------- events ----------------

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const meowGalleryImages = localStorage.getItem('meowGalleryImages');
    
        if(!meowGalleryImages) {
            images = await fetchImagesData(API_URL); 
            localStorage.setItem('meowGalleryImages', JSON.stringify(images));
        } else {
            images = JSON.parse(meowGalleryImages);
        }
    
        displayImages(images);
    } catch(error) {
        console.error('Erro ao carregar as imagens: ', error);
    }
}) 

modalCloseBtnEl.addEventListener('click', closeModal);

modalNextEl.addEventListener('click', function() {
    appStates.modalImgPosition++;
    displayImageModal();
})

modalPrevEl.addEventListener('click', function() {
    appStates.modalImgPosition--;
    displayImageModal();
})

modalEl.addEventListener('click', function(e) {
    const clickedInsideInteractiveArea = 
        modalImgEl.contains(e.target) ||
        modalCloseBtnEl.contains(e.target) ||
        modalPrevEl.contains(e.target) ||
        modalNextEl.contains(e.target);

    if(!clickedInsideInteractiveArea) {
        closeModal();
    }
})