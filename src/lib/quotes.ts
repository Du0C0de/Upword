export type Quote = { quote: string; author: string; date?: number };
import quotes from "../assets/quotes.json";

export default function getQuote(params = { author: "*" }): Quote {
    const pool = quotes.filter(
        (quote) => quote.author === params.author || params.author === "*"
    );
    const randIndex = Math.floor(Math.random() * pool.length);
    return pool[randIndex] as Quote;
}
