const { crawlPage } = require("./crawl.js");

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

  for (const pageCount of Object.entries(crawledPageCountMap)) {
    console.log(`Page: ${pageCount[0]} was crawled ${pageCount[1]} times`);
  }
}

main();
