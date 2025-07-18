import { writeFile } from "node:fs"
import quotes from "./cleanedQuotes.json" with {type: "json"}

const sortBy: "quote" |"author" = "quote"

const sorted = quotes.sort((a, b)=>a[sortBy].localeCompare(b[sortBy]))

writeFile("./sortedQuotes.json", "[" + sorted.map(i=>JSON.stringify(i)).join(",") + "]", ()=>console.log("Done!"))