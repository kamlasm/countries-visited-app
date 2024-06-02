function colourCountries() {
    const svgCountries = document.querySelectorAll('path')

    svgCountries.forEach(svgCountry => {
        svgCountry.classList.remove('visited')
    })

    const countriesVisited = document.querySelectorAll('li')

    countriesVisited.forEach(country => {
        
        const svgCountryEl = document.querySelector(`path#${country.classList.value}`)     
           
        svgCountryEl.classList.add('visited')
    })
}

window.addEventListener("load", colourCountries)

function filterCountries(event) {
    const input = event.target.value
    const regex = new RegExp(`${input}`, 'i')
    countryList.forEach(country => {
        if (!input) {
            country.classList.remove('hide')
        } else if (regex.test(country.innerText)) {
            country.classList.remove('hide')
        } else {
            country.classList.add('hide')
    }
    })
    continents.forEach(continent => {
        if (!input) {
            continent.classList.remove('hide')
        } else if (regex.test(continent.innerText)) {
            continent.classList.remove('hide')
        } else {
            continent.classList.add('hide')
    }
    })
}

const countryList = document.querySelectorAll('li')
const continents = document.querySelectorAll('.continents')
const searchInput = document.querySelector('.search-input')
searchInput.addEventListener("input", filterCountries)