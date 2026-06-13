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

function apiPost(endpoint, data) {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams({ api_key: DISQUS_API_KEY, ...data });
    const url = `https://disqus.com/api/3.0/${endpoint}`;
    const req = https.request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      }
    }, (res) => {
      let responseData = "";
      res.on("data", chunk => responseData += chunk);
      res.on("end", () => {
        try { resolve(JSON.parse(responseData)); } 
        catch(e) { resolve({ raw: responseData.slice(0, 500) }); }
      });
    });
    req.write(body.toString());
    req.end();
    req.on("error", reject);
  });
}

(async () => {
  console.log("=== Try 1: Get forum details ===");
  const forum = await apiGet("forums/details.json", { forum: FORUM });
  console.log("Forum:", JSON.stringify(forum, null, 2).slice(0, 500));
  
  console.log("\n=== Try 2: List threads (limit 5) ===");
  const threads = await apiGet("forums/listThreads.json", { 
    forum: FORUM, 
    limit: 5, 
    order: "desc" 
  });
  console.log("Threads:", JSON.stringify(threads, null, 2).slice(0, 2000));
  
  // Try to find our specific thread
  if (threads.response) {
    const ourThread = threads.response.find(t => 
      t.identifiers && t.identifiers.some(id => id.includes("688074"))
    );
    if (ourThread) {
      console.log("\nFound our thread!", ourThread.id);
    }
  }
  
  // Try categories
  console.log("\n=== Try 3: List categories ===");
  const cats = await apiGet("forums/listCategories.json", { forum: FORUM });
  console.log("Categories:", JSON.stringify(cats, null, 2).slice(0, 500));
})();
