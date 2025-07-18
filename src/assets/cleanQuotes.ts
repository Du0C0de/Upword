import { writeFile } from "node:fs";
import quotes from "./newQuotes.json" with {type: "json"};

const out: { author: string; quote: string }[] = [];
const ogLength = Object.keys(quotes).length

console.log(`"${ogLength}" Objects to try...`)
for (let i = 0; i < Object.keys(quotes).length; i++) {
// for (let i = 0; i < 30; i++) {
    const tryQuote = quotes[i];
    let goodQuote = true;

    console.log(`Testing object at index: ${i}`)

    for (let ii = 0; ii < Object.keys(quotes).length; ii++) {
    // for (let ii = 0; ii < 30; ii++) {
        if (i !== ii && quotes[ii].quote === quotes[i].quote) goodQuote = false;
    }

    if (goodQuote) out.push(tryQuote);
    console.log("\tDone...\n")
    console.log(`${Math.floor((i / ogLength) * 100)}% done...`)
}

const fileContents = "[" + out.map(i=>JSON.stringify(i)).join(",") + "]";
writeFile("./cleanedQuotes.json", fileContents, ()=>console.log("Done!"))
