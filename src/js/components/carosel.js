import $ from "jquery";
import '../../data.json';

$(document).ready(function () {
    // Making request to data
    $.ajax({
        url: './data.json',
        dataType: 'json',
        type: 'get',
        /// Manipulate fetched data
        success: function (data) {
            $(data.carouselDataArray).each(function (index, item){
                $('.ps-carousel-track').append(`
                <li class="ps-carousel-card-container">
                    <div class="ps-carousel-card">
                        <img src="${item["item-src"]}" alt="carosel-item-${index}" class="ps-carousel-card-picture">
                        <p class="ps-carousel-card-detail">${item["item-detail"]}</p>
                        <p class="ps-carousel-card-price">${item["item-price"]}</p>
                    </div>
                </li>
            `)
            });

            /// Creating slider from scratch
            const prev  = document.querySelector('.prev');
            const next = document.querySelector('.next');
            const track = document.querySelector('.ps-carousel-track');
            let carouselWidth = document.querySelector('.ps-carousel-container').offsetWidth;

            window.addEventListener('resize', () => {
                carouselWidth = document.querySelector('.ps-carousel-container').offsetWidth;
            })

            let index = 0;

            next.addEventListener('click', () => {
                index++;
                prev.classList.add('show');
                track.style.transform = `translateX(-${index * carouselWidth}px)`;

                if (track.offsetWidth - (index * carouselWidth) < carouselWidth) {
                    next.classList.add('hide');
                }
            })

            prev.addEventListener('click', () => {
                index--;
                next.classList.remove('hide');
                if (index === 0) {
                    prev.classList.remove('show');
                }
                track.style.transform = `translateX(-${index * carouselWidth}px)`;
            })
        }
    });
});