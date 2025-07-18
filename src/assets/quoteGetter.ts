import { writeFile } from "node:fs";
import _quotes from "./quotes.json" with {type: "json"}

const quotes = [..._quotes]

type QuotableQuote = {
    _id: string,
    content: string,
    author: string,
    authorSlug: string,
    length: number,
    tags: string[]
}

async function wait(_for: number) {
    return new Promise(res=>setTimeout(res, _for * 1000))
}

function addQuotes(passedQuotes: QuotableQuote[]){
    for (let i = 0; i < passedQuotes.length; i++) {
        let isBad = false;
        for (let ii = 0; ii < Object.keys(quotes).length; ii++) {
            if(passedQuotes[i].content === quotes[ii].quote){
                isBad = true;
                break;
            }
        }

        if(isBad)
            continue

        quotes.push({author: passedQuotes[i].author, quote: passedQuotes[i].content})
    }

    writeFile("./quotesNew.json", JSON.stringify(quotes), ()=>console.log("Done"))
}

const main = async ()=>{
    while(true){
        const req = await fetch("http://api.quotable.io/quotes/random?limit=50")
        const json = await req.json()
        console.log(`Adding quote list starting with "${JSON.stringify(json[0], null, 2)}"`)
        addQuotes(json)

        await wait(1)
    }
}

main()