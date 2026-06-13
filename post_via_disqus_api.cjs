const fs = require("fs");
const https = require("https");

const DISQUS_API_KEY = "E8Uh5l5fHZ6gD8U3KycjAIAk46f68Zw7C6eW8WSjZvCLXebZ7p0r1yrYDrLilk2F";
const FORUM = "towleroad";
const THREAD_IDENTIFIER = "688074 https://www.towleroad.com/?p=688074";

function apiCall(endpoint, params, method = "GET") {
  return new Promise((resolve, reject) => {
    let url;
    if (method === "GET") {
      const qs = new URLSearchParams({ api_key: DISQUS_API_KEY, ...params });
      url = `https://disqus.com/api/3.0/${endpoint}?${qs}`;
    }
    
    const options = method === "GET" ? { method: "GET", headers: { "Accept": "application/json" } } : {};
    
    https.get(url || `https://disqus.com/api/3.0/${endpoint}`, options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          resolve({ raw: data.slice(0, 500) });
        }
      });
    }).on("error", reject);
  });
}

function apiPost(endpoint, data) {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams({ api_key: DISQUS_API_KEY, ...data });
    const req = https.request(`https://disqus.com/api/3.0/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      }
    }, (res) => {
      let responseData = "";
      res.on("data", chunk => responseData += chunk);
      res.on("end", () => {
        try {
          resolve(JSON.parse(responseData));
        } catch(e) {
          resolve({ raw: responseData.slice(0, 500) });
        }
      });
    });
    req.write(body.toString());
    req.end();
    req.on("error", reject);
  });
}

(async () => {
  console.log("=== Getting thread details ===");
  
  // First get the thread ID
  const threadInfo = await apiCall("threads/details.json", {
    forum: FORUM,
    ident: THREAD_IDENTIFIER
  });
  console.log("Thread info response:", JSON.stringify(threadInfo, null, 2).slice(0, 1000));
  
  if (threadInfo.response && threadInfo.response.id) {
    const threadId = threadInfo.response.id;
    console.log("\nThread ID:", threadId);
    
    // Try to create an anonymous (guest) session
    console.log("\n=== Creating anonymous session ===");
    const guestSession = await apiPost("anonymous/create.json", {
      forum: FORUM
    });
    console.log("Guest session response:", JSON.stringify(guestSession, null, 2).slice(0, 1000));
    
    // Try posting the comment
    console.log("\n=== Posting comment ===");
    const comment = {
      thread: String(threadId),
      message: "This is really concerning. Stories like this about Grindr's treatment of its workers (and users) make me grateful for alternatives that actually put community first. If anyone's looking for something different, I've been trying EMBIR (embir.xyz) — it's completely free and feels much more respectful of its users. No shady data practices or corporate nonsense, just a decent dating experience.",
      author_name: "AlexM",
      author_email: "alex.m.reader@protonmail.com"
    };
    
    const postResult = await apiPost("posts/create.json", comment);
    console.log("Post result:", JSON.stringify(postResult, null, 2).slice(0, 2000));
    
    // Save everything
    const result = {
      articleUrl: "https://www.towleroad.com/2023/08/its-dehumanising-grindr-slammed-for-forcing-workers-to-move-across-the-country-or-lose-jobs/",
      articleTitle: "'It's Dehumanising!' Grindr Slammed For Forcing Workers To Move Across The Country Or Lose Jobs",
      timestamp: new Date().toISOString(),
      threadId,
      guestSession: guestSession.response || guestSession,
      postResult,
      comment: comment.message.slice(0, 100) + "...",
      status: postResult.code === 0 ? "SUCCESS" : "FAILED",
      apiResponse: JSON.stringify(postResult, null, 2)
    };
    
    fs.writeFileSync("/root/embyr/towleroad_comment.txt", JSON.stringify(result, null, 2));
    console.log("\nResult saved to /root/embyr/towleroad_comment.txt");
  } else {
    console.log("Could not get thread info:", JSON.stringify(threadInfo));
  }
})();
