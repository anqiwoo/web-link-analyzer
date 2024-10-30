const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, crawledPageCountMap) {
  // Make sure currentURL has the same domain as baseURL
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return crawledPageCountMap;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);
  if (crawledPageCountMap[normalizedCurrentURL] > 0) {
    crawledPageCountMap[normalizedCurrentURL]++;
    return crawledPageCountMap;
  }

  crawledPageCountMap[normalizedCurrentURL] = 1;
  console.log(`Actively crawling: ${currentURL}`);
  try {
    const resp = await fetch(currentURL);
    if (resp.status > 399) {
      console.log(
        `Error in fetch with status code: ${resp.status}, on page ${currentURL}`
      );
      return crawledPageCountMap;
    }
    const contentType = resp.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(
        `Non-HTML content type: ${contentType}, on page ${currentURL}`
      );
      return crawledPageCountMap;
    }
    const htmlBody = await resp.text();
    const nextURLs = getURLsFromHTML(htmlBody, baseURL);
    for (const nextURL of nextURLs) {
      crawlPage(baseURL, nextURL, crawledPageCountMap);
    }
  } catch (err) {
    console.log(`Error in fetch: ${err.message}, on page ${currentURL}`);
  }
  return crawledPageCountMap;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    var urlObj = null;
    try {
      if (linkElement.href.startsWith("/")) {
        urlObj = new URL(`${baseURL}${linkElement.href}`);
      } else {
        urlObj = new URL(linkElement.href);
      }
      urls.push(urlObj.href);
    } catch (err) {
      console.log(err);
    }
  }
  return urls;
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.endsWith("/")) {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
