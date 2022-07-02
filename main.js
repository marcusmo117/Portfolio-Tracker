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
    if (data.d == null) {
      return "error - no such symbol"
    } else {
      console.log('data: ', data)
      return data
    }
}


// input data into table 
function inputSymbolToTable(symbol, data) {
    const tBody = document.querySelector("#table-body")
    const tr = document.createElement("tr")
    tr.setAttribute("id",symbol)
    tr.setAttribute("role", "button")
    const newSymbol = document.createElement("td")
    newSymbol.textContent = symbol
    const lastPrice = document.createElement("td")
    lastPrice.textContent = toMakeNum(data['c'])
    const change = document.createElement("td")
    change.textContent = toMakeNum(data['d'])
    const changePercent = document.createElement("td")
    changePercent.textContent = toMakeNum(roundToTwo(data['dp']))
    const dayHigh = document.createElement("td")
    dayHigh.textContent = toMakeNum(roundToTwo(data['h']))
    const dayLow = document.createElement("td")
    dayLow.textContent = toMakeNum(roundToTwo(data['l']))
    const prevClose = document.createElement("td")
    prevClose.textContent = toMakeNum(data['pc'])
    const deleteTd = document.createElement("td")
    const deleteBtn = document.createElement("button")
    deleteBtn.setAttribute("type", "button")
    deleteBtn.setAttribute("class", "btn-close")
    deleteBtn.setAttribute("aria-label", "Close")
    deleteBtn.setAttribute("title", "Click to delete, check holdings before deleting!")
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
        removeAllChildNodes(mainList)
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
      const holdingsStorage1 = JSON.parse(localStorage.getItem("holdings"))
      console.log(holdingsStorage1)
      if (holdingsStorage1) {
        for (let iholding = 0; iholding < holdingsStorage1.length; iholding++) {
            console.log("holdings tickers: " + holdingsStorage1[iholding][0])
            console.log("tr id: " + tr.id)
            if (holdingsStorage1[iholding][0] === tr.id) {
                const modal = new bootstrap.Modal(document.querySelector("#error-modal-holdings"))
                modal.show()
                event.stopPropagation()
                return
            }
        }
      }
      
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
      removeAllChildNodes(mainList)
    })
}


function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}


// Add symbol button
document.querySelector("#button").addEventListener("click", async() => {
  const inputValue = document.querySelector("#ticker-input")
  const tickerStorage = JSON.parse(localStorage.getItem("tickers"))
  if (tickerStorage) {
    for (let iInput = 0; iInput < tickerStorage.length; iInput++) {
        console.log("inputvalue: " + inputValue.value)
        console.log(tickerStorage[iInput])
        if (tickerStorage[iInput] === inputValue.value) {
            const modal = new bootstrap.Modal(document.querySelector("#error-modal-repeat"))
            modal.show()
            inputValue.value = ""
            return
        }
    }
  }
  const response = await fetchQuoteApi(getInputValue())
  if (response === "error - no such symbol") {
      const modal = new bootstrap.Modal(document.querySelector("#error-modal"))
      modal.show()
      inputValue.value = ""
      return
  } else {
      inputSymbolToTable(getInputValue(),response)
      saveInputValue()
      inputValue.value = ""
  }
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


// input news into list 
function inputNewsIntoList(data) {
  const newsList = document.querySelector("#news-list")
  createNews(newsList, 5, data)
}


// making news to input into list (no. of news configurable) 
function createNews(newsHeader, noOfNews, data) {
  for (iNews = 0; iNews < noOfNews; iNews++) {
      this["News"+iNews] = document.createElement("a")
      this["News"+iNews].setAttribute("href",data[iNews]['url'])
      this["News"+iNews].setAttribute("class","list-group-item list-group-item-action")
      this["News"+iNews].textContent = data[iNews]['headline']
      newsHeader.appendChild(this["News"+iNews])
  }
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
    yearHighValue.textContent = toMakeNum(roundToTwo(data['metric']['52WeekHigh'])) + " (" + data['metric']['52WeekHighDate'] + ")"
    trLeft1.appendChild(yearHigh)
    trLeft1.appendChild(yearHighValue)
    tBodyLeft.appendChild(trLeft1)
    tableLeft.appendChild(tBodyLeft)

    // creating 2nd row of table - 52 week low
    const trLeft2 = document.createElement("tr")
    const yearLow = document.createElement("td")
    yearLow.textContent = "52-week low:"
    const yearLowValue = document.createElement("td")
    yearLowValue.textContent = toMakeNum(roundToTwo(data['metric']['52WeekLow'])) + " (" + data['metric']['52WeekLowDate'] + ")"
    trLeft2.appendChild(yearLow)
    trLeft2.appendChild(yearLowValue)
    tBodyLeft.appendChild(trLeft2)
     
    // creating 3rd row of table - Market cap
    tableRowAdder("Market cap:", "marketCapitalization", data, tBodyLeft)

    // creating 4th row of table - Beta
    tableRowAdder("Beta:", "beta", data, tBodyLeft)

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
    peValue.textContent = toMakeNum(roundToTwo(data['metric']['peBasicExclExtraTTM']))
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
  financialValue.textContent = toMakeNum(roundToTwo(data['metric'][apiKey]))
  tr.appendChild(financial)
  tr.appendChild(financialValue)
  tBody.appendChild(tr)
}

// function to round to dp
function roundToTwo(num) {
  return + (Math.round(num + "e+2")  + "e-2");
}

// to add commas 
function toMakeNum(num) {
  const number = (parseFloat(num)).toLocaleString()
  return number 
}

// to convert str with commas to numbers 
function convStrCom(str) {
  const num = parseFloat(str.replace(/,/g, ''))
  return num
}


// enter function on add symbol
// Get the input field
var input = document.getElementById("ticker-input");

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("button").click();
  }
});






//-----------------------------------

// OLD input news into list 
// function inputNewsIntoList(data) {
//   const newsList = document.querySelector("#news-list")

  // const firstNews = document.createElement("a")
  // firstNews.setAttribute("href",data[0]['url'])
  // firstNews.setAttribute("class","list-group-item list-group-item-action")
  // firstNews.textContent = data[0]['headline']

  // const secondNews = document.createElement("a")
  // secondNews.setAttribute("href",data[1]['url'])
  // secondNews.setAttribute("class","list-group-item list-group-item-action")
  // secondNews.textContent = data[1]['headline']

  // const thirdNews = document.createElement("a")
  // thirdNews.setAttribute("href",data[2]['url'])
  // thirdNews.setAttribute("class","list-group-item list-group-item-action")
  // thirdNews.textContent = data[2]['headline']

  // const fourthNews = document.createElement("a")
  // fourthNews.setAttribute("href",data[3]['url'])
  // fourthNews.setAttribute("class","list-group-item list-group-item-action")
  // fourthNews.textContent = data[3]['headline']

  // const fifthNews = document.createElement("a")
  // fifthNews.setAttribute("href",data[4]['url'])
  // fifthNews.setAttribute("class","list-group-item list-group-item-action")
  // fifthNews.textContent = data[4]['headline']

  // newsList.appendChild(firstNews)
  // newsList.appendChild(secondNews)
  // newsList.appendChild(thirdNews)
  // newsList.appendChild(fourthNews)
  // newsList.appendChild(fifthNews)
// }