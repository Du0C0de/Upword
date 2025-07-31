export type Quote = { quote: string; author: string; date?: number | null };
import quotes from "../assets/quotes.json";

const DEBUG_AMOUNT_OF_QUOTES: number | "all" = "all";

const QUOTE_REFRESH_TIME_MINUTES: number = 0.3;
const DIFFERENT_AUTHOR_TRY_TIMES: number = 5;

let validQuotes: Quote[] = quotes
    //@ts-ignore
    .slice(0, DEBUG_AMOUNT_OF_QUOTES === "all" ? quotes.length : DEBUG_AMOUNT_OF_QUOTES)
    .reduce((inital, cur) => {
        inital.push(cur);
        return inital;
    }, [] as Quote[]);
console.debug(`Got ${validQuotes.length} valid quotes!`);

function removeQuote(index: number) {
    // Keep one quote in there as to not break app
    if (validQuotes.length === 1) {
        console.warn("Last Object has been reached!");
        return;
    }

    const quoteCopy = { ...validQuotes[index] };

    // @ts-ignore
    validQuotes[index] = null;
    validQuotes = validQuotes.filter((i) => i != null);

    setTimeout(() => {
        // console.debug(`Refreshing Quote: ${JSON.stringify(quoteCopy)}`);
        validQuotes.push(quoteCopy);
    }, QUOTE_REFRESH_TIME_MINUTES * 1000 * 60);
}

function getNewQuote(): [number, Quote] {
    let randIndex = Math.floor(Math.random() * validQuotes.length);
    let quote = { ...validQuotes[randIndex] };

    return [randIndex, quote];
}

let lastQuote: Quote | { author: null } = { author: null };
export default function getQuote(): Quote {
    let [index, quote] = getNewQuote();
    let iter = 0;
    while (
        validQuotes[index].author === lastQuote.author &&
        iter <= DIFFERENT_AUTHOR_TRY_TIMES
    ) {
        [index, quote] = getNewQuote();
        iter++;
    }

    if (iter >= DIFFERENT_AUTHOR_TRY_TIMES)
        console.warn(`FAILED to get a new author after ${iter} times!`);

    removeQuote(index);
    lastQuote = { ...quote };
    return quote;
}
