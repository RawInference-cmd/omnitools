// importing currency codes list
import { currency_list } from "./currencyCodes.js";

const fromCurrencySelectTag = document.querySelector("#fromCurrency");
const toCurrencySelectTag = document.querySelector("#toCurrency");
const resultTag = document.querySelector("#result");
const btn = document.querySelector("#btn");
const status = document.querySelector("#status");
const inverseRate = document.querySelector("#inverse-rate");
const rateTimestamp = document.querySelector("#rate-timestamp");
const numberInputField = document.getElementById("userValue");

// Cache rates to avoid redundant fetches
const rateCache = {};

// Populate currency dropdowns
currency_list.forEach((currency) => {
    const code = currency[0];
    const countryName = currency[1];

    const newElement = document.createElement("option");
    newElement.value = code;
    newElement.textContent = `${code} — ${countryName}`;

    if (code === "USD") newElement.selected = true;
    fromCurrencySelectTag.append(newElement);

    const newElementTo = newElement.cloneNode(true);
    if (code === "INR") newElementTo.selected = true;
    toCurrencySelectTag.append(newElementTo);
});

// Swap currencies
document.getElementById("switchCurrency").onclick = () => {
    const fromValue = fromCurrencySelectTag.value;
    fromCurrencySelectTag.value = toCurrencySelectTag.value;
    toCurrencySelectTag.value = fromValue;
    triggerConversion();
};

// Preset Amount buttons
document.querySelectorAll(".preset-btn").forEach(preset => {
    preset.addEventListener("click", () => {
        numberInputField.value = preset.getAttribute("data-amt");
        triggerConversion();
    });
});

// Popular pairs buttons
document.querySelectorAll(".quick-pair").forEach(card => {
    card.addEventListener("click", () => {
        const from = card.getAttribute("data-from");
        const to = card.getAttribute("data-to");
        fromCurrencySelectTag.value = from;
        toCurrencySelectTag.value = to;
        triggerConversion();
    });
});

// Listen for enter key or change
numberInputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") triggerConversion();
});
fromCurrencySelectTag.addEventListener("change", () => triggerConversion());
toCurrencySelectTag.addEventListener("change", () => triggerConversion());

btn.onclick = () => triggerConversion();

function triggerConversion() {
    const userEnteredAmount = parseFloat(numberInputField.value);

    if (isNaN(userEnteredAmount) || userEnteredAmount <= 0) {
        resultTag.textContent = "Please enter a valid amount";
        resultTag.classList.add("text-rose-500");
        return;
    }

    resultTag.classList.remove("text-rose-500");
    btn.disabled = true;
    btn.innerHTML = `
        <svg class="animate-spin h-4 w-4 text-white inline-block mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
        <span>Fetching Rates...</span>
    `;

    convertAmount(userEnteredAmount);
}

// Convert amount using open exchange API
async function convertAmount(amount) {
    const fromCode = fromCurrencySelectTag.value;
    const toCode = toCurrencySelectTag.value;

    try {
        let rates;
        const now = Date.now();

        // Use cache if fresh (within 10 minutes)
        if (rateCache[fromCode] && (now - rateCache[fromCode].timestamp < 600000)) {
            rates = rateCache[fromCode].rates;
        } else {
            const data = await fetchData(`https://open.er-api.com/v6/latest/${fromCode}`);
            if (!data.rates) throw new Error("Exchange rates currently unavailable");
            rates = data.rates;
            rateCache[fromCode] = { rates, timestamp: now };
        }

        if (!rates[toCode]) {
            throw new Error(`Rate for ${toCode} not found`);
        }

        const rate = rates[toCode];
        const convertedAmount = (amount * rate).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        const inverse = (1 / rate).toFixed(4);

        resultTag.textContent = `${convertedAmount} ${toCode}`;
        status.textContent = `1 ${fromCode} = ${rate.toFixed(4)} ${toCode}`;
        if (inverseRate) inverseRate.textContent = `1 ${toCode} = ${inverse} ${fromCode}`;
        if (rateTimestamp) rateTimestamp.textContent = `Updated ${new Date().toLocaleTimeString()}`;

    } catch (error) {
        console.error("Currency Conversion Error:", error);
        resultTag.textContent = `Conversion Error`;
        status.textContent = error.message;
    } finally {
        btn.disabled = false;
        btn.innerHTML = `
            <span>Convert Currency</span>
            <svg class="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        `;
    }
}

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
}

// Initial conversion on page load
triggerConversion();
