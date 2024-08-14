import { defineStore } from 'pinia'

export const useCarouselStore = defineStore('carousel', {
  state: () => ({
    images: [
      { id: 1, src: 'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/masterrepository/Fandango/234549/HaroldPurpleCrayon_2024.jpg', alt: 'Image 1' ,  title: 'Harold Purple Crayon 1', genre: 'Drama 1'},
      { id: 2, src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbnJ-pCKaRWbPKEH3U2eCYDrWSHUzL8xT7tQ&s', alt: 'Image 2' ,  title: 'Harold Purple Crayon 2', genre: 'Drama 2'},
      { id: 3, src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4dE6QfOiD4kuoEN9fYCFNonC7xf6cekSLpw&s', alt: 'Image 3' ,  title: 'Harold Purple Crayon 3', genre: 'Drama 3'},
      { id: 4, src: 'https://images.fandango.com/ImageRenderer/200/0/redesign/static/img/default_poster.png/0/images/masterrepository/Fandango/234549/HaroldPurpleCrayon_2024.jpg', alt: 'Image 1' ,  title: 'Harold Purple Crayon4', genre: 'Drama 4'},
      { id: 5, src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbnJ-pCKaRWbPKEH3U2eCYDrWSHUzL8xT7tQ&s', alt: 'Image 2' ,  title: 'Harold Purple Crayon 5', genre: 'Drama 5'},
    ],
    currentIndex: 0
  }),
  actions: {
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length
    },
    prevImage() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length
    }
  },
  getters: {
    imagesArray: (state) => state.images,
    currentImageIndex: (state) => state.currentIndex
  }
})