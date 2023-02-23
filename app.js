const getUrl = currency => ` https://v6.exchangerate-api.com/v6/c0642ee39a539324f9c198bf/latest/${currency}`

const errorMessageContainerEl = document.querySelector('[data-js="container-error-message"]')
const errorMessageEl = document.querySelector('[data-js="error-message"]')
const buttonCloseEl = document.querySelector('[data-js="button-close"]')
const currencyOneEl = document.querySelector('[data-js="currency-one"]')
const currencyTwoEl = document.querySelector('[data-js="currency-two"]')
const convertedValueEl = document.querySelector('[data-js="converted-value"]')
const conversionPrecisionEl = document.querySelector('[data-js="conversion-precision"]')
const timesCurrencyOneEl = document.querySelector('[data-js="currency-one-times"]')

const optionTemplate = (selectedCurrency, currency) => `<option ${selectedCurrency === currency ? 'selected' : ''}>${currency}</option>`

let internalExchange = {}

const showAlertInfo = (err) => {
  errorMessageContainerEl.classList.remove('hidden')
  errorMessageContainerEl.classList.add('show')
  errorMessageEl.textContent = err.message
}

const fetchExchangeRate = async url => {
  try{
    const response = await fetch(url)

    if(!response.ok){
      throw new Error('Sua conexão falhou. Não foi possível obter as informações')
    }

    const exchangeRateData = await response.json()
    return exchangeRateData
  }catch(err){
    showAlertInfo(err)
  }
}

const getCurrency = currency => fetchExchangeRate(getUrl(currency))

const showInitialConverted = () => {
  const BRLCurrency = internalExchange.conversion_rates.BRL

  const getOption = selectedCurrency => Object.keys(internalExchange.conversion_rates)
    .map(currency => optionTemplate(selectedCurrency, currency))

  currencyOneEl.innerHTML = getOption('USD')
  currencyTwoEl.innerHTML = getOption('BRL')

  convertedValueEl.textContent = (BRLCurrency).toFixed(2)
  conversionPrecisionEl.textContent = `1 USD = ${BRLCurrency} BRL`
}

const init = async () => {
  internalExchange = {...(await getCurrency('USD'))}

  if(internalExchange.conversion_rates){
    showInitialConverted()
  }
}

const showUpdatedRates = () => {
  const currencyTwoValue = internalExchange.conversion_rates[currencyTwoEl.value]

  convertedValueEl.textContent = (timesCurrencyOneEl.value * currencyTwoValue).toFixed(2)
  conversionPrecisionEl.textContent = `1 ${currencyOneEl.value} = ${1 * currencyTwoValue} ${currencyTwoEl.value}`
}

const showTimesCurrency = () => {
  const currencyTwoValue = internalExchange.conversion_rates[currencyTwoEl.value]

  convertedValueEl.textContent = (timesCurrencyOneEl.value * currencyTwoValue).toFixed(2)
}

const closeErrorMessage = () => {
  errorMessageContainerEl.classList.add('hidden')
}

timesCurrencyOneEl.addEventListener('input', showTimesCurrency)
currencyTwoEl.addEventListener('input', showUpdatedRates)
currencyOneEl.addEventListener('input', async e => {
  internalExchange = {...(await getCurrency(e.target.value))}
  showUpdatedRates()
})
buttonCloseEl.addEventListener('click', closeErrorMessage())

init()