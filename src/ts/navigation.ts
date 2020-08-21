import Mmenu from "mmenu-js";

/** навигация */
export namespace Navigation {
    let API: any
    export function init() {
        if (window.innerWidth < 992) $('header').addClass('sticky');
        else {
            window.addEventListener('scroll', headerSticky)
            headerSticky()
        }
        if (!$("#mobile-menu").length) return;
        API = new Mmenu("#mobile-menu", {
            "extensions": [
                /*"fx-panels-none",
                "position-front",*/
                "pagedim-black",
                "shadow-page"
            ],

            "navbars": [
                document.querySelector('.header-mobile__auth-wrapper') ? {
                    "position": "top",
                    "content": [
                        `
                        <div class="header-mobile__auth">
                        ${document.querySelector('.header-mobile__auth-wrapper').innerHTML}
                       </div>
                       `,
                    ]
                } : {},
                {
                    "position": "bottom",
                    "content": [
                        `${document.querySelector('.header-mobile__tel') ? document.querySelector('.header-mobile__tel').innerHTML : ''}`
                    ]
                }
            ],
            "iconbar": {
                "add": true,
                "top": [].map.call(document.querySelectorAll('.icon-top li'), (el: HTMLElement) => el.innerHTML),
                "bottom": [].map.call(document.querySelectorAll('.icon-bottom li'), (el: HTMLElement) => el.innerHTML)
            }
        }, {
            // configuration
            offCanvas: {
                pageSelector: "#page"
            },
        });
        if (document.querySelector('.icon-bottom')) $(document.querySelector('.icon-bottom')).remove();
        if (document.querySelector('.icon-top')) $(document.querySelector('.icon-top')).remove();
        if (document.querySelector('.header-mobile__tel')) $(document.querySelector('.header-mobile__tel')).remove();
        if (document.querySelector('.header-mobile__auth-wrapper')) {
            $(document.querySelector('.header-mobile__auth-wrapper')).remove();
            $('.header-mobile__menu').addClass('is-auth');
        }

        API.bind("open:start", function () {
            $('.hamburger').addClass('event-none')
            setTimeout(() => {
                $('.hamburger').addClass('is-active')
            }, 0);
        });
        API.bind("open:finish", function () {
            $('.hamburger').removeClass('event-none')
        });
        API.bind("close:start", function () {

            $('.hamburger').addClass('event-none')
            setTimeout(() => {
                $('.hamburger').removeClass('is-active')
            }, 0);
        });
        API.bind("close:finish", function () {
            $('.hamburger').removeClass('event-none')
        });

        $('.hamburger').click((e) => {
            $(e.currentTarget).toggleClass('is-active')

            if ($(e.currentTarget).hasClass('is-active')) API.open()
            else API.close()
        })
    }

    function headerSticky() {
        if (window.scrollY > 50) $('header').addClass('sticky')
        else $('header').removeClass('sticky');
    }
}