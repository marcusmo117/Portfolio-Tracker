// api keys --> use apiKey for real data 
const sandboxKey = 'sandbox_cai0r9aad3i7auh4hp4g'
const apiKey = 'cai0r9aad3i7auh4hp40'

// api urls 
const quoteUrl = 'https://finnhub.io/api/v1/quote?'
const companyInfoUrl = 'https://finnhub.io/api/v1/stock/profile2?'
const companyNewsUrl = 'https://finnhub.io/api/v1/company-news?' 
const companyFinancials = 'https://finnhub.io/api/v1/stock/metric?'  
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
    // console.log(inputValue)
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
    const deleteTd = document.createElement("td")
    const deleteBtn = document.createElement("button")
    deleteBtn.setAttribute("type", "button")
    deleteBtn.setAttribute("class", "btn-close")
    deleteBtn.setAttribute("aria-label", "Close")
    deleteTd.appendChild(deleteBtn)
    tr.appendChild(newSymbol)
    tr.appendChild(lastPrice)
    tr.appendChild(change)
    tr.appendChild(changePercent)
    tr.appendChild(dayHigh)
    tr.appendChild(dayLow)
    tr.appendChild(prevClose)
    tr.appendChild(deleteTd)
    tBody.appendChild(tr)

    //adding news functionality when clicking
    tr.addEventListener("click", async() => {
      const responseNews = await fetchCompanyNewsApi(symbol)
      const tickerNews = document.querySelector("#ticker-news-header")
      tickerNews.innerText = symbol + " news"
      const mainList = document.querySelector("#news-list")
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

    // adding ticker information functionality when clicking (using loops for removing)
    tr.addEventListener("click", async() => {
      const responseFinancials = await fetchCompanyFinancials(symbol)
      
      const tickerInfo = document.querySelector('#ticker-information')
      tickerInfo.innerText = symbol + ' information'
      const infoTableLeft = document.querySelector('#ticker-info-left-parent')
      const infoTableRight = document.querySelector('#ticker-info-right-parent')
      if (infoTableLeft.childElementCount === 0) {
        inputFinancialsIntoList(responseFinancials)
      } else {
        while (infoTableLeft.firstChild) {
          infoTableLeft.removeChild(infoTableLeft.lastChild)
          infoTableRight.removeChild(infoTableRight.lastChild)
        }
        inputFinancialsIntoList(responseFinancials)
      }
    })

    // adding delete button 
    deleteBtn.addEventListener("click", (event) => {


      // removing ticker from local storage 
      deleteInputValue(JSON.stringify(tr.id))

      // removing row in table
      event.stopPropagation()
      tr.remove()

      // removing financial info
      const tickerInfo = document.querySelector('#ticker-information')
      tickerInfo.innerText = 'Ticker information'
      const infoTableLeft = document.querySelector('#ticker-info-left')
      const infoTableRight = document.querySelector('#ticker-info-right')
      infoTableLeft.remove()
      infoTableRight.remove()
      
      // removing news 
      const tickerNews = document.querySelector("#ticker-news-header")
      tickerNews.innerText = "Ticker news"
      const mainList = document.querySelector("#news-list")
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

      // // removing symbol from local storage
      // const identifyTicker = tr.textContent
      // const symbols1 = symbols.filter(ticker => ticker !== identifyTicker)
      // localStorage.setItem("tickers", JSON.stringify(symbols1))
      // console.log('test symbol getting deleted')
    })

}

// Add symbol button
document.querySelector("#button").addEventListener("click", async() => {
    const response = await fetchQuoteApi(getInputValue())
    inputSymbolToTable(getInputValue(),response)
    saveInputValue()
})

 

// to get today's date and time
const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();
const todayDate = yyyy + '-' + mm + '-' + dd;
console.log(todayDate)

// setting date-time refresh (interval)
const zeroFill = n => {
  return ('0' + n).slice(-2);
}
const interval = setInterval(() => {
  const today = new Date();
  const time = zeroFill(today.getHours()) + ":" + zeroFill(today.getMinutes()) + ":" + zeroFill(today.getSeconds());
  const dateTime = todayDate + ' ' + time
  document.getElementById('date-time').innerHTML = dateTime;
  }, 1000);

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


// to call Company Financials API
async function fetchCompanyFinancials(symbol) {
  const response = await fetch(companyFinancials + 'symbol=' + symbol +'&metric=all&token=' + apiKey);
  const data = await response.json();
  console.log('data: ', data['metric']['52WeekHigh'], data['metric']['52WeekHighDate'], data['metric']['52WeekLow'], data['metric']['52WeekLowDate'], data['metric']['marketCapitalization'], data['metric']['beta'], data['metric']['peBasicExclExtraTTM'], data['metric']['psTTM'], data['metric']['totalDebt/totalEquityAnnual'], data['metric']['roeTTM'])
  return data
}


// input financials into list
function inputFinancialsIntoList(data) {
  // creating left side of ticker financials 
  const tableLeftParent = document.querySelector("#ticker-info-left-parent")
  const tableLeft = document.createElement("table")
  tableLeft.setAttribute("class", "table table-hover text-center")
  tableLeft.setAttribute("id", "ticker-info-left")
  tableLeftParent.appendChild(tableLeft)

    // creating table head
    const headLeft = document.createElement("thead")
    const trLeft = document.createElement("tr")
    const column1Left = document.createElement("th")
    column1Left.setAttribute("scope","col")
    const column2Left = document.createElement("th")
    column2Left.setAttribute("scope","col")
    trLeft.appendChild(column1Left)
    trLeft.appendChild(column2Left)
    headLeft.appendChild(trLeft)
    tableLeft.appendChild(headLeft)

    // creating 1st row of table - 52 week high
    const tBodyLeft = document.createElement("tbody")
    const trLeft1 = document.createElement("tr")
    const yearHigh = document.createElement("td")
    yearHigh.textContent = "52-week high:"
    const yearHighValue = document.createElement("td")
    yearHighValue.textContent = data['metric']['52WeekHigh'] + " (" + data['metric']['52WeekHighDate'] + ")"
    trLeft1.appendChild(yearHigh)
    trLeft1.appendChild(yearHighValue)
    tBodyLeft.appendChild(trLeft1)
    tableLeft.appendChild(tBodyLeft)

    // creating 2nd row of table - 52 week low
    const trLeft2 = document.createElement("tr")
    const yearLow = document.createElement("td")
    yearLow.textContent = "52-week low:"
    const yearLowValue = document.createElement("td")
    yearLowValue.textContent = data['metric']['52WeekLow'] + " (" + data['metric']['52WeekLowDate'] + ")"
    trLeft2.appendChild(yearLow)
    trLeft2.appendChild(yearLowValue)
    tBodyLeft.appendChild(trLeft2)
     
    // creating 3rd row of table - Market cap
    const trLeft3 = document.createElement("tr")
    const marketCap = document.createElement("td")
    marketCap.textContent = "Market cap:"
    const marketCapValue = document.createElement("td")
    marketCapValue.textContent = data['metric']['marketCapitalization']
    trLeft3.appendChild(marketCap)
    trLeft3.appendChild(marketCapValue)
    tBodyLeft.appendChild(trLeft3)

    // creating 4th row of table - Beta
    const trLeft4 = document.createElement("tr")
    const beta = document.createElement("td")
    beta.textContent = "Beta:"
    const betaValue = document.createElement("td")
    betaValue.textContent = data['metric']['beta']
    trLeft4.appendChild(beta)
    trLeft4.appendChild(betaValue)
    tBodyLeft.appendChild(trLeft4)


  // creating Right side of ticker financials
  const tableRightParent = document.querySelector("#ticker-info-right-parent")
  const tableRight = document.createElement("table")
  tableRight.setAttribute("class", "table table-hover text-center")
  tableRight.setAttribute("id", "ticker-info-right")
  tableRightParent.appendChild(tableRight)

    // creating table head
    const headRight = document.createElement("thead")
    const trRight = document.createElement("tr")
    const column1Right = document.createElement("th")
    column1Right.setAttribute("scope","col")
    const column2Right = document.createElement("th")
    column2Right.setAttribute("scope","col")
    trRight.appendChild(column1Right)
    trRight.appendChild(column2Right)
    headRight.appendChild(trRight)
    tableRight.appendChild(headRight)

    // creating 1st row of table - PE ratio
    const tBodyRight = document.createElement("tbody")
    const trRight1 = document.createElement("tr")
    const peRatio = document.createElement("td")
    peRatio.textContent = "P/E ratio (TTM):"
    const peValue = document.createElement("td")
    peValue.textContent = data['metric']['peBasicExclExtraTTM']
    trRight1.appendChild(peRatio)
    trRight1.appendChild(peValue)
    tBodyRight.appendChild(trRight1)
    tableRight.appendChild(tBodyRight)

    // creating 2nd row of table - PS ratio (with function)
    tableRowAdder('P/S ratio (TTM):', 'psTTM', data, tBodyRight)

    // creating 3rd row of table - DE ratio (with function)
    tableRowAdder('D/E ratio:', 'totalDebt/totalEquityAnnual', data, tBodyRight)

    // creating 4th row of table - ROE (with function)
    tableRowAdder('ROE (TTM):', 'roeTTM', data, tBodyRight)

}


function tableRowAdder(financialKey, apiKey, data, tBody) {
  const tr = document.createElement("tr")
  const financial = document.createElement("td")
  financial.textContent = financialKey
  const financialValue = document.createElement("td")
  financialValue.textContent = data['metric'][apiKey]
  tr.appendChild(financial)
  tr.appendChild(financialValue)
  tBody.appendChild(tr)
}



