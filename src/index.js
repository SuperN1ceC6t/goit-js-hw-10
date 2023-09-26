import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import SlimSelect from 'slim-select'
import 'slim-select/dist/slimselect.css'

const catSelector = document.querySelector('.breed-select');
const loaderTitle = document.querySelector('.loader');
const errorTitle = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info')

catSelector.classList.add("is-hidden");
errorTitle.classList.add("is-hidden");
let breedsArr = [];
fetchBreeds()
fetch("https://api.thecatapi.com/v1/breeds")
  .then(response => {
    if (!response.ok) {
      throw new Error(response.status);
        errorTitle.classList.remove("is-hidden");
    }
    catSelector.classList.remove("is-hidden");
    loaderTitle.classList.add("is-hidden");
    return response.json();
  })
  .then(data => {
    data.forEach(element => {
        breedsArr.push({text: element.name, value: element.id});
    });
    new SlimSelect({
        select: catSelector,
        data: breedsArr
    });
    loaderTitle.classList.add("is-hidden");
    })
  .catch(() => {
      // Error handling
    loaderTitle.classList.add("is-hidden");
    errorTitle.classList.remove("is-hidden");
  });

  catSelector.addEventListener('change', onSelectBreed);

function onSelectBreed(event) {
  loaderTitle.classList.replace('is-hidden', 'loader');
  catSelector.classList.add('is-hidden');
  catInfo.classList.add('is-hidden');

  const breedId = event.currentTarget.value;
  fetchCatByBreed(breedId)
    .then(data => {
        loaderTitle.classList.replace('loader', 'is-hidden');
        catSelector.classList.remove('is-hidden');
      const { url, breeds } = data[0];

      catInfo.innerHTML = `<div class="box-img"><img src="${url}" alt="${breeds[0].name}" width="400"/></div><div class="box"><h1>${breeds[0].name}</h1><p>${breeds[0].description}</p><p><b>Temperament:</b> ${breeds[0].temperament}</p></div>`
        catInfo.classList.remove('is-hidden');
    })
}