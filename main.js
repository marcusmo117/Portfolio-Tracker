// api keys --> use apiKey for real data 
const sandboxKey = 'sandbox_cai0r9aad3i7auh4hp4g'
const apiKey = 'cai0r9aad3i7auh4hp40'

// api urls 
const quoteUrl = 'https://finnhub.io/api/v1/quote?'
const companyInfoUrl = 'https://finnhub.io/api/v1/stock/profile2?'
const companyNewsUrl = 'https://finnhub.io/api/v1/company-news?' 
const companyFinancials = 'https://finnhub.io/api/v1/stock/metric?symbol=AAPL&metric=all&token=' // optional, also hard coded for now 
// can add earnings calendar 
// can add social sentiment 
const companyEps = 'https://finnhub.io/api/v1/stock/earnings?'



// generic api function call 
async function fetchDataAsync(url, symbol, key) {
    const response = await fetch(url + 'symbol=' + symbol + '&token=' + key);
    const data = await response.json();
    console.log('data: ', data)
    return data
  }

// fetchDataAsync(quoteUrl, 'AAPL', sandboxKey)
// fetchDataAsync(companyEps, 'AAPL', apiKey)


// to retrieve input value 
function getInputValue() {
    const inputValue = document.getElementById("ticker-input").value
    console.log(inputValue)
    return inputValue
}

// to call quote api 
async function fetchQuoteApi(symbol) {
    const response = await fetch(quoteUrl + 'symbol=' + symbol + '&token=' + apiKey);
    const data = await response.json();
    console.log('data: ', data)
    return data
  }

// input data into table 
function inputSymbolToTable(symbol, data) {
    const tBody = document.querySelector("#table-body")
    const tr = document.createElement("tr")
    tr.setAttribute("id",symbol)
    const newSymbol = document.createElement("td")
    newSymbol.textContent = symbol
    const lastPrice = document.createElement("td")
    lastPrice.textContent = data['c']
    const change = document.createElement("td")
    change.textContent = data['d']
    const changePercent = document.createElement("td")
    changePercent.textContent = data['dp']
    const dayHigh = document.createElement("td")
    dayHigh.textContent = data['h']
    const dayLow = document.createElement("td")
    dayLow.textContent = data['l']
    const prevClose = document.createElement("td")
    prevClose.textContent = data['pc']
    tr.appendChild(newSymbol)
    tr.appendChild(lastPrice)
    tr.appendChild(change)
    tr.appendChild(changePercent)
    tr.appendChild(dayHigh)
    tr.appendChild(dayLow)
    tr.appendChild(prevClose)
    tBody.appendChild(tr)

    //adding news functionality when clicking
    tr.addEventListener("click", async() => {
      const responseNews = await fetchCompanyNewsApi(symbol)
      const mainList = document.querySelector("#news-list")
      const tickerNews = document.querySelector("#ticker-news-header")
      tickerNews.innerText = symbol + " news"
      if (mainList.childElementCount === 0) {
        inputNewsIntoList(responseNews)
      } else {
        const news1 = mainList.children[0]
        const news2 = mainList.children[1]
        const news3 = mainList.children[2]
        const news4 = mainList.children[3]
        const news5 = mainList.children[4]
        news1.remove();
        news2.remove();
        news3.remove();
        news4.remove();
        news5.remove();
        inputNewsIntoList(responseNews)
      }
    })
}

document.querySelector("#button").addEventListener("click", async() => {
    const response = await fetchQuoteApi(getInputValue())
    inputSymbolToTable(getInputValue(),response)
})



// to get today's date 
const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();
const todayDate = yyyy + '-' + mm + '-' + dd;
console.log(todayDate)

// to call company news api 
async function fetchCompanyNewsApi(symbol) {
  const response = await fetch(companyNewsUrl + 'symbol=' + symbol +'&from=2022-06-01&to=' + todayDate + '&token=' + apiKey);
  const data = await response.json();
  console.log('data: ', data[0], data[1], data[2], data[3], data[4])
  return data
}

// fetchCompanyNewsApi('MSFT')

// input news into list 
function inputNewsIntoList(data) {
  const newsList = document.querySelector("#news-list")

  const firstNews = document.createElement("a")
  firstNews.setAttribute("href",data[0]['url'])
  firstNews.setAttribute("class","list-group-item list-group-item-action")
  firstNews.textContent = data[0]['headline']

  const secondNews = document.createElement("a")
  secondNews.setAttribute("href",data[1]['url'])
  secondNews.setAttribute("class","list-group-item list-group-item-action")
  secondNews.textContent = data[1]['headline']

  const thirdNews = document.createElement("a")
  thirdNews.setAttribute("href",data[2]['url'])
  thirdNews.setAttribute("class","list-group-item list-group-item-action")
  thirdNews.textContent = data[2]['headline']

  const fourthNews = document.createElement("a")
  fourthNews.setAttribute("href",data[3]['url'])
  fourthNews.setAttribute("class","list-group-item list-group-item-action")
  fourthNews.textContent = data[3]['headline']

  const fifthNews = document.createElement("a")
  fifthNews.setAttribute("href",data[4]['url'])
  fifthNews.setAttribute("class","list-group-item list-group-item-action")
  fifthNews.textContent = data[4]['headline']

  newsList.appendChild(firstNews)
  newsList.appendChild(secondNews)
  newsList.appendChild(thirdNews)
  newsList.appendChild(fourthNews)
  newsList.appendChild(fifthNews)
}






// testing function
// function testFunction(url, symbol, key) {
//     const test = url + 'symbol=' + symbol + '&token=' + key
//     console.log(test)
// }

// testFunction(quoteUrl,'appl',apiKey)
