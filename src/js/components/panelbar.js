import $ from "jquery";
import {ANIMATION_DURATION} from "../configuration";
import '../../data.json';

$(document).ready(function (){
    /// Making request to data
    $.ajax({
        url: './data.json',
        dataType: 'json',
        type: 'get',
        /// Manipulate fetched data
        success: function (data) {
            $(data.servicesDataArray).each(function (index, item) {
                $('.ps-panelbar-list').append(`
                <li class="ps-panelbar-list-item">
                <div class="ps-panelbar">
                    <div class="ps-icon ps-icon-${item.icon}-blue ps-panelbar-icon"></div>
                    <div class="ps-panelbar-content">
                        <div class="ps-panelbar-content-title">${item.service}</div>
                        <div class="ps-panelbar-content-text">${item.detail}</div>
                    </div>
                    <div class="ps-icon ps-icon-down-blue ps-panelbar-toogle-icon"></div>
                </div>
            </li>
            `);
            });

            /// Toggling opened class on panelbar list item
            /// as well as expanding its content if item is toggled
            $('.ps-panelbar-list-item').click(function () {
                $(this).children().toggleClass('opened');
                $(this).siblings().children().removeClass('opened');

                if ($('.ps-panelbar').hasClass('opened')) {
                    $('.ps-panelbar-content-text').slideDown({duration: ANIMATION_DURATION});
                    $(this).siblings().find('.ps-panelbar-content-text').hide();
                } else {
                    $('.ps-panelbar-content-text').slideUp({duration: ANIMATION_DURATION});
                }
            });
        }
    });
});