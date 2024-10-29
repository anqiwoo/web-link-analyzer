const { JSDOM } = require("jsdom");

async function crawlPage(currentURL) {
  console.log(`Actively crawling: ${currentURL}`);

  try {
    const resp = await fetch(currentURL);
    console.log(await resp.text());
  } catch (err) {
    console.log(`Error in fetch: ${err.message}, on page ${currentURL}`);
  }
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
