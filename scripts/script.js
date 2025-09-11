// ---------------- variables ----------------

const API_URL = 'https://api.thecatapi.com/v1/images/search?limit=10';
const API_KEY = 'dfd'

const galleryEl = document.querySelector('.gallery');

let images = [];

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