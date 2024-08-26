<script setup>
import { formatMovieShowtime } from '@utils/date.js';
import { defineProps } from 'vue'

const props = defineProps({
 movie: {  
    type: Object,
    required: true
 },
 movieVenue: {  
    type: String,
    required: true
 },
 movieShowtime: {  
    type: String,
    required: true
 }
})

</script>

<template>
    <div class="movie-card">
        {{console.log(props.movie)}}
        <img :src="props.movie.img? props.movie.img : 'https://m.media-amazon.com/images/M/MV5BNzRiMjg0MzUtNTQ1Mi00Y2Q5LWEwM2MtMzUwZDU5NmVjN2NkXkEyXkFqcGc@._V1_.jpg'" :alt=" props.movie.title ? movie.title : 'No title'" class="movie-poster">
        <div class="movie-info">
            <div class="screening-info">
                <h2 class="movie-title">{{ props.movie.title ? props.movie.title : "No title" }}</h2>
                <p class="movie-genre">{{ props.movie.genre ? props.movie.genre : "No genre" }}</p>
            </div>
            <div class="venue-info">
                <p class="movie-venue">{{props.movieVenue ? props.movieVenue : "No venue" }}</p>
                <p class="movie-showtime">{{ props.movieShowtime ? formatMovieShowtime(props.movieShowtime)  : "No showtime" }}</p>
            </div>
        </div>
    </div>
</template>
  
<style lang="scss" scoped>
  .movie-card {
    position: relative;
    padding: 29px 0 41px 30px ;
    display: flex;
    gap: 15px;

    .movie-poster {
        width:112px;
        border-radius: 10px;
        height: 143px;
        object-fit: cover;
    }

    .movie-info {
        display: flex;
        flex-direction: column;
        gap: 25px;
        .screening-info{
            line-height: 1;
            display: flex;
            flex-direction: column;
            gap: 5px;
            .movie-title{
                padding: 0 56px 0 0;
                margin: 0;
                color: var(--primary-color);
                font-size: 16px;
                font-weight: 600;
                font-family: var(--font-inter);
            }
            .movie-genre{
                padding: 0;
                margin: 0;
                color: rgba(from var(--text-color) r g b / 50%);
                font-size: 13px;
                font-weight: 600;
                font-family: var(--font-inter);
            }
        
        }

        .venue-info{
            line-height: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
            .movie-venue{
                padding: 0 46px 0 0;
                margin: 0;
                font-size: 14px;
                font-weight: 600;
                font-family: var(--font-inter);
                text-transform: uppercase;
            }
            .movie-showtime{
                padding: 0;
                margin: 0;
                color: rgba(from var(--text-color) r g b / 50%);
                font-size: 13px;
                font-weight: 600;
                font-family: var(--font-inter);

            }
        }
    }


  }
  
  
  
 
  .movie-title {
    color: #ff0000;
    margin: 0 0 8px 0;
  }
  
  .movie-genre, .movie-venue, .movie-showtime {
    margin: 4px 0;
  }
  </style>