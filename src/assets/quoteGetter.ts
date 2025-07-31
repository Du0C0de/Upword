import { writeFile } from "node:fs";
import _quotes from "./quotes.json" with { type: "json" };

const quotes = [..._quotes];

type QuotableQuote = {
  _id: string;
  content: string;
  author: string;
  authorSlug: string;
  length: number;
  tags: string[];
};

async function wait(seconds: number) {
  return new Promise((res) => setTimeout(res, seconds * 1000));
}

function addQuotes(passedQuotes: QuotableQuote[]) {
  for (const quote of passedQuotes) {
    const isDuplicate = quotes.some((q) => q.quote === quote.content);
    if (!isDuplicate) {
      quotes.push({
        author: quote.author,
        quote: quote.content,
      });
    }
  }
}

async function fetchQuotesBatch(): Promise<QuotableQuote[] | null> {
  try {
    const res = await fetch("https://api.quotable.io/quotes/random?limit=50");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error("Failed to fetch quotes:", err);
    return null;
  }
}

const MAX_CYCLES = 10; // Number of 50-quote batches (total: 500)

const main = async () => {
  for (let i = 0; i < MAX_CYCLES; i++) {
    const quotesBatch = await fetchQuotesBatch();
    if (quotesBatch) {
      console.log(`Adding ${quotesBatch.length} quotes...`);
      addQuotes(quotesBatch);
    }
    await wait(1);
  }

  writeFile(
    "./quotesNew.json",
    JSON.stringify(quotes, null, 2),
    () => console.log("✅ Done writing to quotesNew.json")
  );
};

main();
