import $ from "jquery";
import tippy from 'tippy.js';
import Swiper from './lib/swiper.js';
import formstyler from './lib/jquery.formstyler.js';

window.jQuery = $;
window.$ = $;

require('@fancyapps/fancybox');
require('datatables.net');

import a from './lib/jquery.mousewheel.js';
import b from './lib/jquery.jscrollpane.js';
import с from './lib/datepicker.js';
import d from './lib/jquery.photobox.js';
import ViewportChecker from './lib/viewport.checker.js';
import TableSlider from './table.slider.js';

function formatDate(date)
{
    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;

    return dd + '.' + mm + '.' + yy;
}

$(function() {

    // Стилизация элементов
    $('.select-btn').styler();
    $('.select-style').styler();
    $('.file-input').styler();

    /* - - - Подключение fancybox - - - */
    $('[data-fancybox]').fancybox({
        buttons: [
            "zoom",
            //"share",
            "slideShow",
            "fullScreen",
            //"download",
            //"thumbs",
            "close"
        ],
    });

    // Выбор даты
    $('.our-datepicker').datepicker({
        position: "bottom right",
        onSelect: function(formattedDate, date, inst) {

            if (inst.$el.val().length >= 1) inst.$el.addClass('filter-panel__date-input_active');
            else inst.$el.removeClass('filter-panel__date-input_active');
        }
    });

    $('.our-datepicker').each(function(){

        if ($(this).val().length >= 1) $(this).addClass('filter-panel__date-input_active');
    });

    if (typeof eventDates !== 'undefined')
    {
        $('.our-datepicker').datepicker({
            onRenderCell: function (date, cellType) {

                var currentDate = formatDate(date);

                if (cellType == 'day' && eventDates.indexOf(currentDate) != -1)
                {
                    return {
                        html: date.getDate() + '<span class="datepicker-event-date"></span>'
                    }
                }
            },
			onSelect: function (formattedDate, date, inst) {

				$(inst.el).trigger("change");
            },
        });
    }

    // Раскрытие меню на мобиле
    $('.menu-top-btn').click(function(){

        $('.menu-mobile').addClass('menu-mobile_open');
        $('body').css({'overflow': 'hidden'});
    });

    $('.menu-mobile__close').click(function(){

        $('.menu-mobile').removeClass('menu-mobile_open');
        $('body').css({'overflow': 'auto'});
    });

    // Окна (Показ)
    $('.window-cookies').addClass('window-cookies_active');
    $('#window-location').addClass('window-question_active');
    $('#window-notice').addClass('window-question_active');

    $('.js-show-subscription').click(function(){

        $('#window-subscription').addClass('window-question_active');
    });

    // Окна (Скрытие)
    $('.window-question .js-close-window').click(function(){

        $(this).parents('.window-question').removeClass('window-question_active');
    });

    // Показать / Скрыть Выбор региона
    $('.header-top__region-selection').click(function(){

        $('.region-select').slideToggle();
    });

    $('.region-select__close').click(function(){

        $('.region-select').slideUp();
    });

    // Показать / Скрыть Поиск
    $('.header-bottom__search').click(function(){

        $('.search-window').fadeIn(300);
        $('.main-body').addClass('main-body_shadow');
        $('#search-input').focus();
    });

    $('.search-window__close').click(function(){

        $('.search-window').fadeOut(300);
        $('.main-body').removeClass('main-body_shadow');
    });

     $("body").keyup(function(e) {

        if (e.which == 27 && $(this).hasClass('main-body_shadow'))
        {
            $('.search-window').fadeOut(300);
            $('.main-body').removeClass('main-body_shadow');

            return false;
        }
     });

    // Полоса прокрутки
    if ($(window).width() > 575)
    {
        $('.scroll-pane').jScrollPane({autoReinitialise: true});
    }

    // Подсказки
	tippy('[data-tippy-content]', {
        delay: [800, 200],
        allowHTML: true,
    });

    // Прокрутка На верх
    $(".to-top").bind('click', function(e){

        e.preventDefault();

        $('body,html').animate({scrollTop: 0}, 1000);    
    });

    // Вкладки
    $('.tabs-panel_active a').click(function(){

        let elem = $(this).parent('.tabs-panel');

        elem.find('.tabs-panel__link_active').removeClass('tabs-panel__link_active');
        $(this).addClass('tabs-panel__link_active');

        $('#' + elem.data('for')).find('.tabs-items__item_active').removeClass('tabs-items__item_active');
        $('#' + $(this).data('id')).addClass('tabs-items__item_active');

        return false;
    });

    $('.tabs-num_active a').click(function(){

        let elem = $(this).parent('.tabs-num');

        elem.find('.tabs-num__link_active').removeClass('tabs-num__link_active');
        $(this).addClass('tabs-num__link_active');

        $('#' + elem.data('for')).find('.tabs-items__item_active').removeClass('tabs-items__item_active');
        $('#' + $(this).data('id')).addClass('tabs-items__item_active');

        return false;
    });

    // Аккордеон
    $('.accordion-list__link').click(function(){

        $(this).toggleClass('accordion-list__link_open');

        if ($(this).hasClass('accordion-list__link_open'))
        {
            $(this).next('.accordion-list__block').slideDown(300, function(){

                $(this).addClass('accordion-list__block_open');
            });
        }
        else
        {
            $(this).next('.accordion-list__block').slideUp(300, function(){

                $(this).removeClass('accordion-list__block_open');
            });
        }
    });

    $('.accordion-list__btn').click(function(){

        var parentBlock = $(this).parents('.accordion-list__item');

        parentBlock.children('.accordion-list__link_open').removeClass('accordion-list__link_open');

        parentBlock.children('.accordion-list__block').slideUp(300, function(){

            $(this).removeClass('accordion-list__block_open');
        });
    });

    // Главный слайдер
    if ($('.slider-index__item').length > 1)
    {
        $('.slider-index__progressbar-count_last').text('0' + $('.slider-index__item').length);

        let mainSlider = new Swiper('.slider-index__slider', {
            spaceBetween: 10,
            loop: true,
            loopAdditionalSlides: 1,
            slideActiveClass: 'slider-index__item_active',
            autoplay: {
                delay: 10000,
            },
            breakpoints: {
                576: {
                    spaceBetween: 30
                }
            },
            pagination: {
                el: '.slider-index__pagination',
                clickable: true,
                bulletClass: 'slider-index__bullet',
                bulletActiveClass:  'slider-index__bullet_active',
            },
        });
    }
    else
    {
        $('.slider-index__progressbar-block').remove();
    }

    // Линия фотографий
    if ($(window).width() > 767)
    {
        new Swiper('.face-line', {
            loop: true,
            simulateTouch: false,
            loopAdditionalSlides: 1,
            autoplay: {
                delay: 0,
            },
            width: 2560,
            speed: 100000,
        });
    }

    // Слайдер таблиц
    new TableSlider();

    // Внутренние слайдеры картинок
    $('.slider-inner').each(function(){

        let elem = $(this);

        let count = elem.find('.slider-inner__item').length;

        elem.find('.slider-inner__count').text('1 из ' + count);

        let sliderInner = new Swiper(elem.children('.swiper-container'), {
            loop: true,
            navigation: {
                prevEl: elem.find('.slider-inner__prev'),
                nextEl: elem.find('.slider-inner__next'),
            },
            on: {
                slideChange: function () {

                    let step = sliderInner.activeIndex;

                    if (step > count) step = 1;
                    if (step < 1) step = count;

                    elem.find('.slider-inner__count').text(step + ' из ' + count);

                    elem.find('.slider-inner__title_active').removeClass('slider-inner__title_active');
                    elem.find('.js-title-' + step).addClass('slider-inner__title_active');
                },
            }
        })
    });

    // Слайдер Чемпионат
    let championshipSliderCount = $('.championship-slider__item').length;

    let championshipSlider = new Swiper('.championship-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        breakpoints: {
            576: {
                slidesPerView: 2
            },
            768: {
                slidesPerView: 3
            }
        },
        navigation: {
            nextEl: '.championship-slider__next',
            prevEl: '.championship-slider__prev',
            disabledClass: 'slider-str_disabled'
        },
    });

    if (championshipSliderCount)
    {
        championshipSlider.slideTo(championshipSliderCount, 0);
    }

    // Сортировка таблиц по датам
    $.fn.dataTableExt.oSort['math-path-asc'] = function(a,b) {
        let ruDatea=$.trim(a).split('.');
        let ruDateb=$.trim(b).split('.');

        if (ruDatea[2]*1<ruDateb[2]*1) return 1;
        if (ruDatea[2]*1>ruDateb[2]*1) return -1;
        if (ruDatea[2]*1 == ruDateb[2]*1) 
        {
            if (ruDatea[1]*1<ruDateb[1]*1) return 1;
            if (ruDatea[1]*1>ruDateb[1]*1) return -1;
            if (ruDatea[1]*1 == ruDateb[1]*1) 
            {
                if (ruDatea[0]*1<ruDateb[0]*1) return 1;
                if (ruDatea[0]*1>ruDateb[0]*1) return -1;
            }
            else return 0;
        }
    };

    $.fn.dataTableExt.oSort['math-path-desc'] = function(a,b) {
        let ruDatea=$.trim(a).split('.');
        let ruDateb=$.trim(b).split('.');

        if (ruDatea[2]*1<ruDateb[2]*1) return -1;
        if (ruDatea[2]*1>ruDateb[2]*1) return 1;
        if (ruDatea[2]*1 == ruDateb[2]*1) 
        {
            if (ruDatea[1]*1<ruDateb[1]*1) return -1;
            if (ruDatea[1]*1>ruDateb[1]*1) return 1;
            if (ruDatea[1]*1 == ruDateb[1]*1) 
            {
                if (ruDatea[0]*1<ruDateb[0]*1) return -1;
                if (ruDatea[0]*1>ruDateb[0]*1) return 1;
            }
            else return 0;
        }
    };

    // Сортировка таблиц
    $('.js-table-sort').each(function(){

        let col = [];

        $(this).find('th').each(function(){

            if ($(this).data('type') === 'date') col.push({"sType": "math-path"});
            else col.push(null);
        });

        $(this).dataTable({
            "columns": col,
          //  "sDom": '<t>'
        });
    });

    // Фотогалерея
    $('#album-gallery').photobox('a', { time: 3000 });

    // Показ скрытого текста
    $('.js-open-hide-text').click(function(){

        var parentBlock = $(this).parents('.hide-text');

        var innerBlock = parentBlock.children('.hide-text__inner');
        
        parentBlock.toggleClass('hide-text_open');

        if (parentBlock.hasClass('hide-text_open'))
        {
            innerBlock.css('height', 'auto');

            var height = innerBlock.height();

            innerBlock.removeAttr('style');

            innerBlock.height(height);
        }
        else
        {
            innerBlock.removeAttr('style');
        }
    });

    // Показ элементов при прокрутке
    $('.viewport-сhecker').viewportChecker({
        classToAdd: 'viewport-visible',
        offset: 200
    });

    $(".go-to").click(function() {

        $('html, body').animate({
            scrollTop: $($(this).data('to')).offset().top
        }, 1000);
    });
});