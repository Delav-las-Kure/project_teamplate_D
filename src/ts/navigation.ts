import Mmenu from 'mmenu-js'

/** навигация */
export namespace Navigation {
  let API: any
  export function init() {
    if (!document.querySelector('#mobile-menu')) return
    API = new Mmenu(
      '#mobile-menu',
      {
        extensions: ['pagedim-black', 'shadow-page'],

        navbars: [
          {
            position: 'bottom',
            content: [
              `${
                document.querySelector('.header-mobile__tel')
                  ? document.querySelector('.header-mobile__tel')?.innerHTML
                  : ''
              }`,
            ],
          },
        ],
        iconbar: {
          add: true,
          top: [].map.call(
            document.querySelectorAll('.icon-top li'),
            (el: HTMLElement) => el.innerHTML
          ),
          bottom: [].map.call(
            document.querySelectorAll('.icon-bottom li'),
            (el: HTMLElement) => el.innerHTML
          ),
        },
      },
      {
        offCanvas: {
          pageSelector: '#page',
        },
      }
    )
    if (document.querySelector('.icon-bottom'))
      document.querySelector('.icon-bottom')?.remove()
    if (document.querySelector('.icon-top')) document.querySelector('.icon-top')?.remove()
    if (document.querySelector('.header-mobile__tel'))
      document.querySelector('.header-mobile__tel')?.remove()
    if (document.querySelector('.header-mobile__auth-wrapper')) {
      document.querySelector('.header-mobile__auth-wrapper')?.remove()
      document.querySelector('.header-mobile__menu')?.classList.add('is-auth')
    }

    API.bind('open:start', function () {
      document.querySelector('.hamburger')?.classList.add('event-none')
      setTimeout(() => {
        document.querySelector('.hamburger')?.classList.add('is-active')
      }, 0)
    })
    API.bind('open:finish', function () {
      document.querySelector('.hamburger')?.classList.remove('event-none')
    })
    API.bind('close:start', function () {
      document.querySelector('.hamburger')?.classList.add('event-none')
      setTimeout(() => {
        document.querySelector('.hamburger')?.classList.remove('is-active')
      }, 0)
    })
    API.bind('close:finish', function () {
      document.querySelector('.hamburger')?.classList.remove('event-none')
    })

    document.querySelector('.hamburger')?.addEventListener('click', (e) => {
      ;(e.currentTarget as HTMLElement).classList.toggle('is-active')

      if ((e.currentTarget as HTMLElement).classList.contains('is-active')) API.open()
      else API.close()
    })
  }
}
