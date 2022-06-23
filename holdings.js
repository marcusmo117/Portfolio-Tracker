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
    tr.setAttribute("id", symbol)
    
    // adding dropdown button icon
    const holdingsDropdown = document.createElement("td")
    holdingsDropdown.setAttribute("data-bs-toggle", "collapse")
    holdingsDropdown.setAttribute("data-bs-target", "#"+symbol+"dropdown")
    holdingsDropdown.setAttribute("role", "button")
    holdingsDropdown.setAttribute("aria-expanded", "false")
    holdingsDropdown.setAttribute("aria-controls", "#"+symbol+"dropdown")
    const holdingsSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    holdingsSvg.setAttribute("width", "16")
    holdingsSvg.setAttribute("height", "16")
    holdingsSvg.setAttribute("fill", "currentColor")
    holdingsSvg.setAttribute("class", "bi bi-caret-down-square")
    holdingsSvg.setAttribute("viewBox", "0 0 16 16")
    const holdingsSvgPath1 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    holdingsSvgPath1.setAttribute("d", "M3.626 6.832A.5.5 0 0 1 4 6h8a.5.5 0 0 1 .374.832l-4 4.5a.5.5 0 0 1-.748 0l-4-4.5z")
    const holdingsSvgPath2 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    holdingsSvgPath2.setAttribute("d", "M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2z")
    holdingsSvg.appendChild(holdingsSvgPath1)
    holdingsSvg.appendChild(holdingsSvgPath2)
    holdingsDropdown.appendChild(holdingsSvg)

    // adding dropdown table (header)
    const ddTr = document.createElement("tr")
    ddTr.setAttribute("class", "collapse")
    ddTr.setAttribute("id", symbol+"dropdown")
    const ddTradeDate = document.createElement("th")
    ddTradeDate.setAttribute("scope", "col")
    ddTradeDate.setAttribute("colspan", "4")
    ddTradeDate.textContent = "Trade Date"
    const ddShares = document.createElement("th")
    ddShares.setAttribute("scope", "col")
    ddShares.textContent = "Shares"
    const ddCostShare = document.createElement("th")
    ddCostShare.setAttribute("scope", "col")
    ddCostShare.textContent = "Cost/share"
    const ddMktVal = document.createElement("th")
    ddMktVal.setAttribute("scope", "col")
    ddMktVal.setAttribute("colspan", "2")
    ddMktVal.textContent = "Market value"
    const ddDayGain = document.createElement("th")
    ddDayGain.setAttribute("scope", "col")
    ddDayGain.setAttribute("colspan", "2")
    ddDayGain.textContent = "Day gain (%)"
    const ddTtlGain = document.createElement("th")
    ddTtlGain.setAttribute("scope", "col")
    ddTtlGain.setAttribute("colspan", "2")
    ddTtlGain.textContent = "Total gain (%)"
    const ddDeleteBtn = document.createElement("th")
    ddDeleteBtn.setAttribute("scope", "col")
    ddTr.appendChild(ddTradeDate)
    ddTr.appendChild(ddShares)
    ddTr.appendChild(ddCostShare)
    ddTr.appendChild(ddMktVal)
    ddTr.appendChild(ddDayGain)
    ddTr.appendChild(ddTtlGain)
    ddTr.appendChild(ddDeleteBtn)


    // adding modal button icon
    const modalButton = document.createElement("td")
    modalButton.setAttribute("data-bs-toggle", "modal")
    modalButton.setAttribute("data-bs-target", "#"+symbol+"modal")
    modalButton.setAttribute("role", "button")
    const modalSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    modalSvg.setAttribute("width", "16")
    modalSvg.setAttribute("height", "16")
    modalSvg.setAttribute("fill", "currentColor")
    modalSvg.setAttribute("class", "bi bi-plus-lg")
    modalSvg.setAttribute("viewBox", "0 0 16 16")
    const modalSvgPath1 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    modalSvgPath1.setAttribute("fill-rule", "evenodd")
    modalSvgPath1.setAttribute("d", "M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z")
    modalSvg.appendChild(modalSvgPath1)
    modalButton.appendChild(modalSvg)

    // dynamically creating modal (for each asset)
    const mainBody = document.querySelector("#main-body")
    const modDiv1 = document.createElement("div")
        modDiv1.setAttribute("class", "modal fade")
        modDiv1.setAttribute("id", symbol+"modal")
        modDiv1.setAttribute("tabindex", "-1")
        modDiv1.setAttribute("aria-labelledby", "exampleModalLabel")
        modDiv1.setAttribute("aria-hidden", "true")
    const modDiv2 = document.createElement("div")
        modDiv2.setAttribute("class", "modal-dialog")
    const modDiv3 = document.createElement("div")
        modDiv3.setAttribute("class", "modal-content")
    const modHeader = document.createElement("div")
        modHeader.setAttribute("class", "modal-header")
    const modHeadTitle = document.createElement("h5")
        modHeadTitle.setAttribute("class", "modal-title")
        modHeadTitle.setAttribute("id", "exampleModalLabel")
        modHeadTitle.textContent = "New " + symbol + " holding"
    const modHeadBtn = document.createElement("button")
        modHeadBtn.setAttribute("type", "button")
        modHeadBtn.setAttribute("class", "btn-close")
        modHeadBtn.setAttribute("data-bs-dismiss", "modal")
        modHeadBtn.setAttribute("aria-label", "Close")
    modHeader.appendChild(modHeadTitle)
    modHeader.appendChild(modHeadBtn)
    const modBody = document.createElement("div")
        modBody.setAttribute("class", "modal-body")
    const modBodyInp1 = document.createElement("form")
        modBodyInp1.setAttribute("class", "form-floating mb-3")
    const modBodyInp1Text = document.createElement("input")
        modBodyInp1Text.setAttribute("type", "text")
        modBodyInp1Text.setAttribute("class", "form-control")
        modBodyInp1Text.setAttribute("id", symbol+"DateInputValue")
        modBodyInp1Text.setAttribute("placeholder", "YYYY-MM-DD")
        modBodyInp1Text.setAttribute("value", "YYYY-MM-DD")
    const modBodyInp1Label = document.createElement("label")
        modBodyInp1Label.setAttribute("for", "DateInputValue")
        modBodyInp1Label.textContent = "Trade Date:"
    modBodyInp1.appendChild(modBodyInp1Text)
    modBodyInp1.appendChild(modBodyInp1Label)
    modBody.appendChild(modBodyInp1)
    const modBodyInp2 = document.createElement("form")
        modBodyInp2.setAttribute("class", "form-floating mb-3")
    const modBodyInp2Text = document.createElement("input")
        modBodyInp2Text.setAttribute("type", "text")
        modBodyInp2Text.setAttribute("class", "form-control")
        modBodyInp2Text.setAttribute("id", symbol+"SharesInputValue")
        modBodyInp2Text.setAttribute("placeholder", "No. of shares")
        modBodyInp2Text.setAttribute("value", "No. of shares")
    const modBodyInp2Label = document.createElement("label")
        modBodyInp2Label.setAttribute("for", "SharesInputValue")
        modBodyInp2Label.textContent = "Shares:"
    modBodyInp2.appendChild(modBodyInp2Text)
    modBodyInp2.appendChild(modBodyInp2Label)
    modBody.appendChild(modBodyInp2)
    const modBodyInp3 = document.createElement("form")
        modBodyInp3.setAttribute("class", "form-floating mb-3")
    const modBodyInp3Text = document.createElement("input")
        modBodyInp3Text.setAttribute("type", "text")
        modBodyInp3Text.setAttribute("class", "form-control")
        modBodyInp3Text.setAttribute("id", symbol+"CostInputValue")
        modBodyInp3Text.setAttribute("placeholder", "Avg. cost/share")
        modBodyInp3Text.setAttribute("value", "Avg. cost/share")
    const modBodyInp3Label = document.createElement("label")
        modBodyInp3Label.setAttribute("for", "CostInputValue")
        modBodyInp3Label.textContent = "Cost/share:"
    modBodyInp3.appendChild(modBodyInp3Text)
    modBodyInp3.appendChild(modBodyInp3Label)
    modBody.appendChild(modBodyInp3)
    const modFooter = document.createElement("div")
        modFooter.setAttribute("class", "modal-footer")
    const modFooterbtn1 = document.createElement("button")
        modFooterbtn1.setAttribute("type", "button")
        modFooterbtn1.setAttribute("class", "btn btn-secondary")
        modFooterbtn1.setAttribute("data-bs-dismiss", "modal")
        modFooterbtn1.textContent = "Just kidding"
    const modFooterbtn2 = document.createElement("button")
        modFooterbtn2.setAttribute("type", "button")
        modFooterbtn2.setAttribute("class", "btn btn-primary")
        modFooterbtn2.setAttribute("data-bs-dismiss", "modal")
        modFooterbtn2.textContent = "Add " + symbol
    modFooter.appendChild(modFooterbtn1)
    modFooter.appendChild(modFooterbtn2)
    modDiv3.appendChild(modHeader)
    modDiv3.appendChild(modBody)
    modDiv3.appendChild(modFooter)
    modDiv2.appendChild(modDiv3)
    modDiv1.appendChild(modDiv2)
    mainBody.appendChild(modDiv1)
    // modal functionallity 
    modFooterbtn2.addEventListener("click", () => {
        saveModal(symbol)
        // retrieveHoldingsOne(symbol)
        retrieveHoldings()
        location.reload()
    })

    // adding table data 
    const newSymbol = document.createElement("td")
    newSymbol.textContent = symbol
    const lastPrice = document.createElement("td")
    lastPrice.textContent = data['c']
    // const change = document.createElement("td")
    // change.textContent = data['d']
    const changePercent = document.createElement("td")
    changePercent.textContent = data['dp']
    const shares = document.createElement("td")
    // shares.textContent = data['h']
    const avgCost = document.createElement("td")
    // avgCost.textContent = data['l']
    const mktValue = document.createElement("td")
    // mktValue.textContent = data['pc']
    const dayGain = document.createElement("td")
    // dayGain.textContent = data['pc']
    const dayGainPer = document.createElement("td")
    // dayGainPer.textContent = data['pc']
    const ttlGain = document.createElement("td")
    // ttlGain.textContent = data['pc']
    const ttlGainPer = document.createElement("td")
    // ttlGainPer.textContent = data['pc']

    // adding delete button icon 
    const deleteTd = document.createElement("td")
    const deleteBtn = document.createElement("button")
    deleteBtn.setAttribute("type", "button")
    deleteBtn.setAttribute("class", "btn-close")
    deleteBtn.setAttribute("aria-label", "Close")
    deleteTd.appendChild(deleteBtn)

    // appending data to table
    tr.appendChild(holdingsDropdown)
    tr.appendChild(modalButton)
    tr.appendChild(newSymbol)
    tr.appendChild(lastPrice)
    tr.appendChild(changePercent)
    tr.appendChild(shares)
    tr.appendChild(avgCost)
    tr.appendChild(mktValue)
    tr.appendChild(dayGain)
    tr.appendChild(dayGainPer)
    tr.appendChild(ttlGain)
    tr.appendChild(ttlGainPer)
    tr.appendChild(deleteTd)
    tBody.appendChild(tr)
    tBody.appendChild(ddTr)

    //adding news functionality when clicking
    // tr.addEventListener("click", async() => {
    //   const responseNews = await fetchCompanyNewsApi(symbol)
    //   const tickerNews = document.querySelector("#ticker-news-header")
    //   tickerNews.innerText = symbol + " news"
    //   const mainList = document.querySelector("#news-list")
    //   if (mainList.childElementCount === 0) {
    //     inputNewsIntoList(responseNews)
    //   } else {
    //     const news1 = mainList.children[0]
    //     const news2 = mainList.children[1]
    //     const news3 = mainList.children[2]
    //     const news4 = mainList.children[3]
    //     const news5 = mainList.children[4]
    //     news1.remove();
    //     news2.remove();
    //     news3.remove();
    //     news4.remove();
    //     news5.remove();
    //     inputNewsIntoList(responseNews)
    //   }
    // })

    // adding ticker information functionality when clicking (using loops for removing)
    // tr.addEventListener("click", async() => {
    //   const responseFinancials = await fetchCompanyFinancials(symbol)
      
    //   const tickerInfo = document.querySelector('#ticker-information')
    //   tickerInfo.innerText = symbol + ' information'
    //   const infoTableLeft = document.querySelector('#ticker-info-left-parent')
    //   const infoTableRight = document.querySelector('#ticker-info-right-parent')
    //   if (infoTableLeft.childElementCount === 0) {
    //     inputFinancialsIntoList(responseFinancials)
    //   } else {
    //     while (infoTableLeft.firstChild) {
    //       infoTableLeft.removeChild(infoTableLeft.lastChild)
    //       infoTableRight.removeChild(infoTableRight.lastChild)
    //     }
    //     inputFinancialsIntoList(responseFinancials)
    //   }
    // })

    // adding delete button functionality
    deleteBtn.addEventListener("click", (event) => {


      // removing ticker from local storage 
      deleteInputValue(JSON.stringify(tr.id))

      // removing row in table
      event.stopPropagation()
      tr.remove()

    //   // removing financial info
    //   const tickerInfo = document.querySelector('#ticker-information')
    //   tickerInfo.innerText = 'Ticker information'
    //   const infoTableLeft = document.querySelector('#ticker-info-left')
    //   const infoTableRight = document.querySelector('#ticker-info-right')
    //   infoTableLeft.remove()
    //   infoTableRight.remove()
      
    //   // removing news 
    //   const tickerNews = document.querySelector("#ticker-news-header")
    //   tickerNews.innerText = "Ticker news"
    //   const mainList = document.querySelector("#news-list")
    //   const news1 = mainList.children[0]
    //   const news2 = mainList.children[1]
    //   const news3 = mainList.children[2]
    //   const news4 = mainList.children[3]
    //   const news5 = mainList.children[4]
    //   news1.remove();
    //   news2.remove();
    //   news3.remove();
    //   news4.remove();
    //   news5.remove();
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


// holdings page functionalities
// saving info from modal 
function saveModal(symbol) {
    const array = []
    let existingData = JSON.parse(localStorage.getItem("holdings"))
    const saveTradeDate = document.getElementById(symbol+"DateInputValue").value
    const saveShares = document.getElementById(symbol+"SharesInputValue").value
    const saveCost = document.getElementById(symbol+"CostInputValue").value
    const uuid = crypto.randomUUID()
    array.push(symbol)
    array.push(saveTradeDate)
    array.push(saveShares)
    array.push(saveCost)
    array.push(uuid)
    if (existingData === null){
        existingData = []
        existingData.push(array)
        localStorage.setItem("holdings", JSON.stringify(existingData))
    } else {
        existingData.push(array)
        localStorage.setItem("holdings", JSON.stringify(existingData))
    }
}

// adding holdings to table (all at once)
function retrieveHoldings() {
    const data = JSON.parse(localStorage.getItem("holdings"))
    for (i=0; i<data.length; i++) {
        this["row"+i] = data[i][0]
        // console.log(this["row"+i]) 
        const holdingsDropdown = document.getElementById(this["row"+i]+"dropdown")
        // console.log(holdingsTradeDate)
        const holdingsData = document.createElement("tr")
        if (holdingsDropdown.className === "collapse") {
            holdingsData.setAttribute("class", "collapse")
        } else {
            holdingsData.setAttribute("class", "collapse show")
        }
        holdingsData.setAttribute("id", this["row"+i]+"dropdown")
        const holdingsDataDate = document.createElement("td")
        holdingsDataDate.setAttribute("colspan", "4")
        holdingsDataDate.textContent = data[i][1]
        const holdingsDataShares = document.createElement("td")
        holdingsDataShares.textContent = data[i][2]
        const holdingsDataCost = document.createElement("td")
        holdingsDataCost.textContent = data[i][3]
        const holdingsDataMktVal = document.createElement("td")
        holdingsDataMktVal.setAttribute("colspan", "2")
        holdingsDataMktVal.textContent = Math.round(parseFloat(holdingsDataShares.textContent, 10) * parseFloat(holdingsDataCost.textContent, 10))
        // adding delete button + functionality
        const deleteTd = document.createElement("td")
        const deleteBtn = document.createElement("button")
        deleteBtn.setAttribute("type", "button")
        deleteBtn.setAttribute("class", "btn-close")
        deleteBtn.setAttribute("id", data[i][4])
        deleteBtn.setAttribute("aria-label", "Close")
        deleteTd.appendChild(deleteBtn)
        deleteBtn.addEventListener("click", (event) => {
        // removing ticker from local storage 
        // deleteInputValue(JSON.stringify(tr.id))
            deleteHoldingsRow(deleteBtn.id)     
            holdingsData.remove()
        })
        holdingsData.appendChild(holdingsDataDate)
        holdingsData.appendChild(holdingsDataShares)
        holdingsData.appendChild(holdingsDataCost)
        holdingsData.appendChild(holdingsDataMktVal)
        holdingsData.appendChild(deleteTd)
        insertAfter(holdingsData, holdingsDropdown)
        // console.log('retrieve holdings working')
        }
}

// function to insert node after element
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
}



// // adding holdings to table (one by one) --> on hold because don't need (just reload page)
// function retrieveHoldingsOne(symbol) {
//     const tradeDate = document.getElementById(symbol+"DateInputValue").value
//     const shares = document.getElementById(symbol+"SharesInputValue").value
//     const cost = document.getElementById(symbol+"CostInputValue").value
//     const holdingsDropdown = document.getElementById(symbol+"dropdown")
//     const holdingsData = document.createElement("tr")
//     if (holdingsDropdown.className === "collapse") {
//         holdingsData.setAttribute("class", "collapse")
//     } else {
//         holdingsData.setAttribute("class", "collapse show")
//     }
//     holdingsData.setAttribute("id", symbol+"dropdown")
//     const holdingsDataDate = document.createElement("td")
//     holdingsDataDate.setAttribute("colspan", "4")
//     holdingsDataDate.textContent = tradeDate
//     const holdingsDataShares = document.createElement("td")
//     holdingsDataShares.textContent = shares
//     const holdingsDataCost = document.createElement("td")
//     holdingsDataCost.textContent = cost
//     // adding delete button + functionality
//     const deleteTd = document.createElement("td")
//     const deleteBtn = document.createElement("button")
//     deleteBtn.setAttribute("type", "button")
//     deleteBtn.setAttribute("class", "btn-close")
//     deleteBtn.setAttribute("aria-label", "Close")
//     deleteTd.appendChild(deleteBtn)
//     deleteBtn.addEventListener("click", (event) => {
//         holdingsData.remove()
//     })
//     holdingsData.appendChild(holdingsDataDate)
//     holdingsData.appendChild(holdingsDataShares)
//     holdingsData.appendChild(holdingsDataCost)
//     holdingsData.appendChild(deleteTd)
//     insertAfter(holdingsData, holdingsDropdown)
// }


