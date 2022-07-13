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
    tr.setAttribute("id", symbol)
    
    // adding dropdown button icon
    const holdingsDropdown = document.createElement("td")
    holdingsDropdown.setAttribute("data-bs-toggle", "collapse")
    holdingsDropdown.setAttribute("data-bs-target", "#"+symbol+"dropdown")
    holdingsDropdown.setAttribute("role", "button")
    holdingsDropdown.setAttribute("title", "Click to show holdings")
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
    modalButton.setAttribute("title", "Click to add holdings")
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
    const mainBody = document.querySelector("#modal-portion")
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
        modBodyInp1Text.setAttribute("type", "date")
        // modBodyInp1Text.setAttribute("type", "reset")
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
        modBodyInp2Text.setAttribute("type", "number")
        // modBodyInp2Text.setAttribute("type", "reset")
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
        modBodyInp3Text.setAttribute("type", "number")
        // modBodyInp3Text.setAttribute("type", "reset")
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
     const modBodyInp4 = document.createElement("form")
        modBodyInp4.setAttribute("class", "form-floating mb-3")
    const modBodyInp4Text = document.createElement("input")
        modBodyInp4Text.setAttribute("type", "text")
        // modBodyInp3Text.setAttribute("type", "reset")
        modBodyInp4Text.setAttribute("class", "form-control")
        modBodyInp4Text.setAttribute("id", symbol+"Category")
        modBodyInp4Text.setAttribute("placeholder", "Category")
        // modBodyInp4Text.setAttribute("value", "Category")
    const modBodyInp4Label = document.createElement("label")
        modBodyInp4Label.setAttribute("for", "Category")
        modBodyInp4Label.textContent = "Category:"
    modBodyInp4.appendChild(modBodyInp4Text)
    modBodyInp4.appendChild(modBodyInp4Label)
    modBody.appendChild(modBodyInp4)
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
    lastPrice.setAttribute("id", symbol + "last-price")
    lastPrice.textContent = (toMakeNum(data['c']))
    const lastPriceVal = data['c']
    // const change = document.createElement("td")
    // change.textContent = data['d']
    const changePercent = document.createElement("td")
    changePercent.setAttribute("id", symbol + "change%")
    changePercent.textContent = toMakeNum(roundToTwo(data['dp']))
    const changePercentVal = data['dp']
    const shares = document.createElement("td")
    // calculations portion
    const ttlSharesData = JSON.parse(localStorage.getItem("holdings"))
    const avgCost = document.createElement("td")
    const mktValue = document.createElement("td")
    const dayGain = document.createElement("td")
    const dayGainPer = document.createElement("td")
    const ttlGain = document.createElement("td")
    const ttlGainPer = document.createElement("td")
    if (ttlSharesData) {
        // for determining total shares from local storage
        let ttlShares = 0
        for (k=0; k<ttlSharesData.length; k++) {
            this["Share"+k] = ttlSharesData[k][0]
            if (tr.id === this["Share"+k]) {
                ttlShares += parseFloat(ttlSharesData[k][2], 10)
            } else {
                ttlShares = ttlShares
            }
        }
        const sharesVal = ttlShares
        if (sharesVal === 0) {
            shares.textContent = "-"
        } else {
            shares.textContent = toMakeNum(ttlShares)
        }
        // for determining avg cost/share from local storage 
        let ttlCost = 0
        for (j=0; j<ttlSharesData.length; j++) {
            this["Cost"+j] = ttlSharesData[j][0]
            if (tr.id === this["Cost"+j]) {
                ttlCost += parseFloat(ttlSharesData[j][2], 10) * parseFloat(ttlSharesData[j][3], 10)
            } else {
                ttlCost = ttlCost
            }
        }
        const avgCostVal = (ttlCost / ttlShares)
        if (avgCostVal !== avgCostVal) {
            avgCost.textContent = "-"
        } else {
            avgCost.textContent = toMakeNum(roundToTwo((ttlCost / ttlShares)))
        }
        // for determining mkt value
        const mktValueVal = (parseFloat(lastPriceVal, 10) * parseFloat(sharesVal, 10))
        if (mktValueVal === 0) {
            mktValue.textContent = "-"
        } else {
            mktValue.textContent = toMakeNum(roundToTwo((parseFloat(lastPriceVal, 10) * parseFloat(sharesVal, 10))))
        }
        // for determining day gain
        dayGain.textContent = toMakeNum(roundToTwo((parseFloat(mktValueVal, 10) * ((roundToTwo(parseFloat(changePercentVal, 10)))/100))))
        const dayGainVal = (parseFloat(mktValueVal, 10) * ((roundToTwo(parseFloat(changePercentVal, 10)))/100))
        // for determining day gain %
        dayGainPer.textContent = toMakeNum(roundToTwo(data['dp']))
        const dayGainPerVal = data['dp']
        // for determining ttl gain
        ttlGain.textContent = toMakeNum(roundToTwo(((parseFloat(lastPriceVal, 10)) - (parseFloat(avgCostVal, 10))) * (ttlShares)))
        const ttlGainVal = ((parseFloat(lastPriceVal, 10)) - (parseFloat(avgCostVal, 10))) * (ttlShares)
        // for determining ttl gain %
        ttlGainPer.textContent = toMakeNum(roundToTwo(((parseFloat(lastPriceVal, 10) - parseFloat(avgCostVal, 10)) / parseFloat(avgCostVal, 10)) * 100))
        const ttlGainPerVal = ((parseFloat(lastPriceVal, 10) - parseFloat(avgCostVal, 10)) / parseFloat(avgCostVal, 10)) * 100
    
        // validation for no holdigs (market value = 0)
        if (mktValue.textContent === "-") {
            dayGain.textContent = "-"
            dayGainPer.textContent = "-"
            ttlGain.textContent = "-"
            ttlGainPer.textContent = "-"
        }
    } else {}
    
    // adding delete button icon 
    const deleteTd = document.createElement("td")
    const deleteBtn = document.createElement("button")
    deleteBtn.setAttribute("type", "button")
    deleteBtn.setAttribute("class", "btn-close")
    deleteBtn.setAttribute("aria-label", "Close")
    deleteBtn.setAttribute("title", "Click to delete, check holdings before deleting!")
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

    // adding delete button functionality
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
                    return
                }
            }
        }
        
      // removing ticker from local storage 
      deleteInputValue(JSON.stringify(tr.id))

      // removing row in table
      event.stopPropagation()
      tr.remove()
    })
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


// holdings page functionalities
// saving info from modal 
function saveModal(symbol) {
    const array = []
    let existingData = JSON.parse(localStorage.getItem("holdings"))
    const saveTradeDate = document.getElementById(symbol+"DateInputValue").value
    const saveShares = document.getElementById(symbol+"SharesInputValue").value
    const saveCost = document.getElementById(symbol+"CostInputValue").value
    const saveCat = document.getElementById(symbol+"Category").value
    const uuid = crypto.randomUUID()
    array.push(symbol)
    array.push(saveTradeDate)
    array.push(saveShares)
    array.push(saveCost)
    array.push(saveCat)
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
        const holdingsDropdown = document.getElementById(this["row"+i] + "dropdown")
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
        holdingsDataShares.textContent = toMakeNum(data[i][2])
        const holdingsDataSharesVal = data[i][2]
        const holdingsDataCost = document.createElement("td")
        holdingsDataCost.textContent = toMakeNum(roundToTwo(data[i][3]))
        const holdingsDataCostVal = data[i][3]
        // calculations portion 
        const liveChangePer = document.getElementById(this["row"+i] + "change%")
        const liveLastP = document.getElementById(this["row"+i] + "last-price")
        const holdingsDataMktVal = document.createElement("td")
        holdingsDataMktVal.setAttribute("colspan", "2")
        holdingsDataMktVal.textContent = toMakeNum(roundToTwo(parseFloat(holdingsDataSharesVal, 10) * convStrCom(liveLastP.textContent)))
        const holdingsDataMktValVal = parseFloat(holdingsDataSharesVal, 10) * convStrCom(liveLastP.textContent)
        const holdingsDataDay = document.createElement("td")
        holdingsDataDay.setAttribute("colspan", "2")
        holdingsDataDay.textContent = toMakeNum(roundToTwo((parseFloat(holdingsDataMktValVal, 10)) * ((roundToTwo(convStrCom(liveChangePer.textContent)))/100))) + " (" + toMakeNum(roundToTwo(convStrCom(liveChangePer.textContent)))+ ")"
        const holdingsDataTtl = document.createElement("td")
        holdingsDataTtl.setAttribute("colspan", "2")
        const totalGainForm = roundToTwo((convStrCom(liveLastP.textContent) - parseFloat(holdingsDataCostVal, 10)) * parseFloat(holdingsDataSharesVal, 10))
        const totalCostForm = roundToTwo(parseFloat(holdingsDataSharesVal, 10) * (parseFloat(holdingsDataCostVal, 10)))
        holdingsDataTtl.textContent = toMakeNum(totalGainForm) + " (" + toMakeNum(roundToTwo(100*(totalGainForm / totalCostForm))) + ")"
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
            location.reload()
        })
        holdingsData.appendChild(holdingsDataDate)
        holdingsData.appendChild(holdingsDataShares)
        holdingsData.appendChild(holdingsDataCost)
        holdingsData.appendChild(holdingsDataMktVal)
        holdingsData.appendChild(holdingsDataDay)
        holdingsData.appendChild(holdingsDataTtl)
        holdingsData.appendChild(deleteTd)
        insertAfter(holdingsData, holdingsDropdown)
        // console.log('retrieve holdings working')
        }
}


// function to insert node after element
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
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


// to get total holdings and % gain 
function getTotalHoldings() {
    const holdingsData = JSON.parse(localStorage.getItem("holdings"))
    const tickerData = JSON.parse(localStorage.getItem("tickers"))
    let totalHoldingsValue = 0
    let totalHoldingsCost = 0
    let holdingsPerGain = 0
    for (iTickers = 0; iTickers < tickerData.length; iTickers++) {
        this["ticker"+iTickers] = tickerData[iTickers]
        const tickerMktValue = document.getElementById(this["ticker"+iTickers] + "last-price")
        for (iHoldings = 0; iHoldings < holdingsData.length; iHoldings++) {
            if (holdingsData[iHoldings][0] === this["ticker"+iTickers]) {
                const holdingsValue = (parseFloat(holdingsData[iHoldings][2])) * (convStrCom(tickerMktValue.textContent))
                const costValue = (parseFloat(holdingsData[iHoldings][2])) * (parseFloat(holdingsData[iHoldings][3]))
                // holdingsPerGain = (holdingsValue - costValue)/ costValue 
                totalHoldingsValue += holdingsValue
                totalHoldingsCost += costValue
        }
    } 
    const totalHoldingsDom = document.querySelector("#total-holdings-value")
    totalHoldingsDom.textContent = "Total holdings: $" + toMakeNum(roundToTwo((parseFloat(totalHoldingsValue))))
    holdingsPerGain = ((totalHoldingsValue - totalHoldingsCost)/ totalHoldingsCost) * 100
    const totalHoldignsPerDom = document.querySelector("#total-holdings-gain")
    totalHoldignsPerDom.textContent = "Total gain: " + toMakeNum(roundToTwo((holdingsPerGain))) + "%"
}}

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


const ctxLeft = document.getElementById('myChartLeft').getContext('2d');
const myChartLeft = new Chart(ctxLeft, {
    type: 'pie',
    data: {
        labels: [
            'Red',
            'Blue',
            'Yellow'
          ],
          datasets: [{
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
          }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


const ctxRight = document.getElementById('myChartRight').getContext('2d');
const myChartRight = new Chart(ctxRight, {
    type: 'line',
    data: {
        labels: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});



// -----------------------------
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


