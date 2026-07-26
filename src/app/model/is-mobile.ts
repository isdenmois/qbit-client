const mobileQuery = matchMedia('(max-width: 639px)')

export const setMobile = () => {
  document.body.id = mobileQuery.matches ? 'mobile' : ''
}

mobileQuery.addEventListener('change', setMobile)
