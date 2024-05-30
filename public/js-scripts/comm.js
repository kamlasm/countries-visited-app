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
}

const searchInput = document.querySelector('#search-input')
searchInput.addEventListener("input", filterCountries)

const countryList = document.querySelectorAll('.comm-countries')