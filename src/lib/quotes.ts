export type Quote = { quote: string; author: string; date?: number | null };
import quotes from "../assets/quotes.json";

const QUOTE_REFRESH_TIME_MINUTES = 10;

type ValidQuoteOb = {
    [key: number]: Quote;
};

let validQuotes: ValidQuoteOb = quotes.reduce((inital, cur, index) => {
    inital[index] = cur;
    return inital;
}, {} as ValidQuoteOb);

function markQuote(index: number) {
    // Keep one quote in there as to not break shit
    if (Object.keys(validQuotes).length === 1) {
        console.warn("Last Object has been reached!");
        return;
    }

    const quote = { ...validQuotes[index] } as Quote;
    delete validQuotes[index];

    setTimeout(() => {
        console.debug(`Refreshed quote: ${JSON.stringify(quote)}`);
        validQuotes[index] = quote;
    }, QUOTE_REFRESH_TIME_MINUTES * 1000 * 60);
}

const NEW_AUTHOR_TRIES = 10;

function getNewAuthor(last: Quote): [number, Quote] {
    let finalIndex = 0;
    let finalQuote: Quote = { ...last };

    let iteration = 0;
    while (last.author === finalQuote.author && iteration <= NEW_AUTHOR_TRIES) {
        finalIndex = Math.floor(Math.random() * Object.keys(validQuotes).length);
        finalQuote = { ...validQuotes[finalIndex] };
        iteration = iteration + 1;

        console.debug(
            `Iteration: ${iteration}, isFinal: ${
                iteration >= NEW_AUTHOR_TRIES ? "true" : "false"
            }\n\t\b\bAuthor: ${last.author} -> ${finalQuote.author}`
        );
    }

    if (iteration > NEW_AUTHOR_TRIES)
        console.warn(`Tried ${iteration} iterations, failed to get new Author :(`);

    return [finalIndex, finalQuote];
}

export default function getQuote(): Quote {
    const quoteLength = Object.keys(validQuotes).length;

    let randIndex = Math.floor(Math.random() * quoteLength);
    let quote = { ...validQuotes[randIndex] };

    [randIndex, quote] = getNewAuthor(quote);

    markQuote(randIndex);
    console.debug(`Remaining Quotes: ${quoteLength - 1}`);
    return quote;
}
