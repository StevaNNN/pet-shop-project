import $ from "jquery";
import { ANIMATION_DURATION } from "../configuration";

$(document).ready(function() {

    /// Toggling active class on clicked nav item
    /// as well as scrolling to specific section
    $('.ps-nav-list-item').click(function () {
        $(this).addClass('active');
        $(this).siblings().removeClass('active');

        if ($(this).hasClass('services')) {
            $('html, body').animate({
                scrollTop: $('#services').offset().top
            }, ANIMATION_DURATION);
        }
        if ($(this).hasClass('contact')) {
            $('html, body').animate({
                scrollTop: $('#contact').offset().top
            }, ANIMATION_DURATION);
        }
    });

    /// Toggling nav list below 767px
    let navListRef = '.ps-nav-list';

    $('.ps-hamburger-menu').click(function (){
        $(navListRef).toggleClass('show');

        if($(navListRef).hasClass('show')){
            $(navListRef).slideDown({ duration: ANIMATION_DURATION });
        } else {
            $(navListRef).slideUp({ duration: ANIMATION_DURATION});
        }
    });
});