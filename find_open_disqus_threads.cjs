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
  console.log("=== Listing threads with isClosed=false ===");
  
  // Try threads/list with include parameter
  let cursor = null;
  let found = [];
  
  for (let page = 0; page < 5; page++) {
    const params = {
      forum: FORUM,
      limit: 100,
      include: "open"
    };
    if (cursor) params.cursor = cursor;
    
    const threads = await apiGet("threads/list.json", params);
    
    if (threads.code !== 0 || !threads.response) {
      console.log("API error:", JSON.stringify(threads).slice(0, 200));
      break;
    }
    
    console.log(`Page ${page + 1}: ${threads.response.length} threads, hasNext: ${threads.cursor?.hasNext}`);
    
    // Check which are open
    const openThreads = threads.response.filter(t => !t.isClosed);
    const closedThreads = threads.response.filter(t => t.isClosed);
    
    console.log(`  Open: ${openThreads.length}, Closed: ${closedThreads.length}`);
    
    openThreads.forEach(t => {
      found.push(t);
      console.log(`  OPEN: ${t.id} - ${t.title?.slice(0, 80)} - ${t.link?.slice(0, 80)}`);
    });
    
    if (!threads.cursor?.hasNext || openThreads.length > 0) break;
    cursor = threads.cursor.next;
  }
  
  console.log(`\nTotal open threads found: ${found.length}`);
  found.forEach(t => {
    console.log(`\nID: ${t.id}`);
    console.log(`Title: ${t.title}`);
    console.log(`Link: ${t.link}`);
    console.log(`Created: ${t.createdAt}`);
  });
})();
