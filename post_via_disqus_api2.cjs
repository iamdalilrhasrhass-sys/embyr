const fs = require("fs");
const https = require("https");

const DISQUS_API_KEY = "E8Uh5l5fHZ6gD8U3KycjAIAk46f68Zw7C6eW8WSjZvCLXebZ7p0r1yrYDrLilk2F";
const FORUM = "towleroad";

function apiGet(endpoint, params) {
  return new Promise((resolve, reject) => {
    const qs = new URLSearchParams({ api_key: DISQUS_API_KEY, ...params });
    const url = `https://disqus.com/api/3.0/${endpoint}?${qs}`;
    console.log("GET", url.slice(0, 200));
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
    console.log("POST", url, Object.keys(data));
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
  console.log("=== Step 1: Get thread by ident ===");
  
  // Try with thread=ident: prefix
  const threadInfo = await apiGet("threads/details.json", {
    forum: FORUM,
    thread: `ident:${encodeURIComponent("688074 https://www.towleroad.com/?p=688074")}`
  });
  console.log("Thread info:", JSON.stringify(threadInfo, null, 2).slice(0, 1500));
  
  if (threadInfo.response && threadInfo.response.id) {
    const threadId = threadInfo.response.id;
    console.log("\nThread ID:", threadId);
    
    // Try creating anonymous session
    console.log("\n=== Step 2: Create anonymous session ===");
    const session = await apiPost("anonymous/create.json", { forum: FORUM });
    console.log("Session:", JSON.stringify(session, null, 2).slice(0, 500));
    
    // Try posting
    console.log("\n=== Step 3: Post comment ===");
    const postData = {
      thread: String(threadId),
      message: "This is really concerning. Stories like this about Grindr's treatment of its workers (and users) make me grateful for alternatives that actually put community first. If anyone's looking for something different, I've been trying EMBYR (embir.xyz) — it's completely free and feels much more respectful of its users. No shady data practices or corporate nonsense, just a decent dating experience.",
      author_name: "AlexM",
      author_email: "alex.m.reader@protonmail.com"
    };
    
    const postResult = await apiPost("posts/create.json", postData);
    console.log("Post result:", JSON.stringify(postResult, null, 2).slice(0, 2000));
    
    const result = {
      articleUrl: "https://www.towleroad.com/2023/08/its-dehumanising-grindr-slammed-for-forcing-workers-to-move-across-the-country-or-lose-jobs/",
      articleTitle: "'It's Dehumanising!' Grindr Slammed For Forcing Workers To Move Across The Country Or Lose Jobs",
      timestamp: new Date().toISOString(),
      threadId,
      postResult,
      status: postResult.code === 0 ? "SUCCESS" : `FAILED (code: ${postResult.code})`,
      fullResponse: JSON.stringify(postResult, null, 2)
    };
    
    fs.writeFileSync("/root/embyr/towleroad_comment.txt", JSON.stringify(result, null, 2));
    console.log("\nSaved to /root/embyr/towleroad_comment.txt");
  } else {
    console.log("Failed to get thread. Trying alternative approach...");
    
    // Try with just the identifier
    const threadInfo2 = await apiGet("threads/details.json", {
      forum: FORUM,
      ident: "688074 https://www.towleroad.com/?p=688074"
    });
    console.log("Thread info (ident):", JSON.stringify(threadInfo2, null, 2).slice(0, 1500));
    
    const result = {
      error: true,
      threadInfo,
      threadInfo2,
      timestamp: new Date().toISOString()
    };
    fs.writeFileSync("/root/embyr/towleroad_comment.txt", JSON.stringify(result, null, 2));
  }
})();
