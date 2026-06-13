const fs = require("fs");
const https = require("https");

const DISQUS_API_KEY = "E8Uh5l5fHZ6gD8U3KycjAIAk46f68Zw7C6eW8WSjZvCLXebZ7p0r1yrYDrLilk2F";
const FORUM = "towleroad";

function apiGet(endpoint, params) {
  return new Promise((resolve, reject) => {
    const qs = new URLSearchParams({ api_key: DISQUS_API_KEY, ...params });
    const url = `https://disqus.com/api/3.0/${endpoint}?${qs}`;
    https.get(url, { headers: { "Accept": "application/json" } }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); } 
        catch(e) { resolve({ raw: data.slice(0, 500) }); }
      });
    }).on("error", reject);
  });
}

(async () => {
  // Try to get the thread by link
  console.log("=== Search thread by link ===");
  const searchRes = await apiGet("threads/list.json", {
    forum: FORUM,
    limit: 100,
    include: "open"
  });
  console.log("Threads list code:", searchRes.code);
  
  if (searchRes.response) {
    // Look for thread with matching link
    const targetUrl = "https://www.towleroad.com/2023/08/its-dehumanising-grindr-slammed-for-forcing-workers-to-move-across-the-country-or-lose-jobs/";
    const found = searchRes.response.find(t => t.link === targetUrl);
    if (found) {
      console.log("Found thread:", found.id, found.title);
    } else {
      console.log("Thread not found in first 100. Sample threads:");
      searchRes.response.slice(0, 5).forEach(t => {
        console.log(`  ${t.id}: ${t.title?.slice(0, 60)} -> ${t.link?.slice(0, 80)}`);
      });
    }
  }
  
  // Try a different approach - posts/create with the right session
  console.log("\n=== Try creating anonymous session ===");
  // The anonymous/create endpoint needs a different key likely
  // Let's try the older API
  const sessionRes = await apiGet("anonymous/create.json", {
    forum: FORUM,
    force: 1
  });
  console.log("Session response:", JSON.stringify(sessionRes, null, 2).slice(0, 500));
})();
