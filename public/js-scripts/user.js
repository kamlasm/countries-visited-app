function colourCountries() {
    const svgCountries = document.querySelectorAll('path')

    svgCountries.forEach(svgCountry => {
        svgCountry.classList.remove('visited')
    })

    const countriesVisited = document.querySelectorAll('li')

    countriesVisited.forEach(country => {
        
        const svgCountryEls = document.querySelectorAll(`path.${country.classList.value}`)

        if (svgCountryEls.length === 0) {
            const svgCountryEl = document.querySelector(`path#${country.classList.value}`)

            svgCountryEl.classList.add('visited')

        } else {
            svgCountryEls.forEach(svgCountryEl => {
                svgCountryEl.classList.add('visited')
            })
        }
    })
}

window.addEventListener("load", colourCountries)