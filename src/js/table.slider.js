export default class TableSlider
{
    constructor()
    {
        /* Номера Левого и Правого активного столбцов */
        this.tsLeft = false;
        this.tsRight = false;

        let len = $('.table-slider__item').length;

        if ($('.table-slider').data('slider-plus'))
        {
            len -= $('.table-slider').data('slider-plus');
        }

        let i = 2;

        /* Скрываем все столбцы кроме последних двух, их номера запоминаем */
        $('.table-slider__item').each((n, e) => {

            let ind = $(e).index();

            if (i < len) this.hideOne(ind);
            if (i == len) this.tsLeft = ind;
            if (i > len) this.tsRight = ind;

            i++;
        });

        this.setStrActive();

        $('.slider-str__prev').click(e => this.goPrev(e));

        $('.slider-str__next').click(e => this.goNext(e));
    }

    /* Проверяем активность стрелок */
    setStrActive()
    {
        if ($('.table-slider th').eq(this.tsLeft - 1).hasClass('table-slider__item'))
        {
            $('.slider-str__prev').removeClass('slider-str_disabled');
        }
        else
        {
            $('.slider-str__prev').addClass('slider-str_disabled');
        }

        if ($('.table-slider th').eq(this.tsRight + 1).hasClass('table-slider__item'))
        {
            $('.slider-str__next').removeClass('slider-str_disabled');
        }
        else
        {
            $('.slider-str__next').addClass('slider-str_disabled');
        }
    }

    /* Переходи к предыдущему столбцу */
    goPrev(e)
    {
        if (!$(e.target).hasClass('slider-str_disabled'))
        {
            this.tsLeft--;

            this.shwoOne(this.tsLeft);

            this.hideOne(this.tsRight);

            this.tsRight--;

            this.setStrActive();
        }
    }

    /* Переходи к следующему столбцу */
    goNext(e)
    {
        if (!$(e.target).hasClass('slider-str_disabled'))
        {
            this.tsRight++;

            this.shwoOne(this.tsRight);

            this.hideOne(this.tsLeft);

            this.tsLeft++;

            this.setStrActive();
        }
    }

    /* Показываем один столбец (num) */
    shwoOne(num)
    {
        $('.table-slider th').eq(num).show();

        $('.table-slider tr').each((n, e) => {

            $(e).find('td').eq(num).show();
        });
    }

    /* Скрываем один столбец (num) */
    hideOne(num)
    {
        $('.table-slider th').eq(num).hide();

        $('.table-slider tr').each((n, e) => {

            $(e).find('td').eq(num).hide();
        });
    }
}