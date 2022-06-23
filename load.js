// To save input value
function saveInputValue() {
    const symbols = []
    const toAdd = JSON.parse(localStorage.getItem("tickers"))
    // console.log(toAdd)
    if (toAdd===null) {
        const saveValue = document.getElementById("ticker-input").value
        symbols.push(saveValue)
        localStorage.setItem("tickers", JSON.stringify(symbols))
    } else {
        for (let i=0; i<toAdd.length; i++) {
            symbols.push(toAdd[i])
        }
        const saveValue = document.getElementById("ticker-input").value
        symbols.push(saveValue)
        localStorage.setItem("tickers", JSON.stringify(symbols))
    }
} 

window.onload = async () => {
    const symbolsToLoad = JSON.parse(localStorage.getItem("tickers"))
    for (i=0; i<symbolsToLoad.length; i++) {
        const response = await fetchQuoteApi(symbolsToLoad[i])
        inputSymbolToTable(symbolsToLoad[i],response)
        // saveInputValue()
    }
    retrieveHoldings()
}

function deleteInputValue(ticker) {
    const symbols = JSON.parse(localStorage.getItem("tickers"))
    // console.log(symbols)
    // console.log(ticker)
    for (let i=0; i<symbols.length; i++) {
        if (JSON.stringify(symbols[i]) === ticker) {
            symbols.splice(i,1)
            console.log(symbols)
            localStorage.setItem("tickers", JSON.stringify(symbols))
        }
    }
}   

function deleteHoldingsRow(identifier) {
    const holdingsData = JSON.parse(localStorage.getItem("holdings"))
    for (let i=0; i<holdingsData.length; i++) {
        if (holdingsData[i][4] === identifier) {
            holdingsData.splice(i,1)
            console.log(holdingsData)
            localStorage.setItem("holdings", JSON.stringify(holdingsData))
        }
    }
}