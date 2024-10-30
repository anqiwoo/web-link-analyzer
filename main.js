const { crawlPage } = require("./crawl.js");
const { printReport } = require("./report.js");

async function main() {
  if (process.argv.length < 3) {
    console.log("No website provided");
    process.exit(1);
  } else if (process.argv.length > 3) {
    console.log("Too many command line args");
    process.exit(1);
  }
  const baseURL = process.argv[2];
  console.log(`Starting crawling of ${baseURL} ...`);
  const crawledPageCountMap = await crawlPage(baseURL, baseURL, {});
  printReport(crawledPageCountMap);
}

main();
