export const welcomeEmail = (userName: string) => `
<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
.container{max-width:600px;margin:0 auto;padding:20px}
.header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:30px;text-align:center;border-radius:10px 10px 0 0}
.content{background:#f9f9f9;padding:30px;border-radius:0 0 10px 10px}
.cta{display:inline-block;background:#667eea;color:white;padding:12px 30px;text-decoration:none;border-radius:5px;margin:20px 0}
.footer{text-align:center;padding:20px;font-size:12px;color:#999}
</style></head>
<body><div class="container">
<div class="header"><h1>Welcome to Embir!</h1></div>
<div class="content">
<p>Hey ${userName},</p>
<p>Thanks for joining Embir — the gay dating app built for authentic connections.</p>
<p><strong>Get started:</strong></p>
<ol>
<li>Complete your profile with photos and bio</li>
<li>Verify your identity for a trust badge</li>
<li>Start connecting with amazing people</li>
</ol>
<p style="text-align:center"><a href="https://embir.xyz" class="cta">Complete Your Profile</a></p>
<p>— The Embir Team</p>
</div>
<div class="footer"><p>Embir — Gay Dating for Authentic Connections</p><p>&copy; 2026 Embir</p></div>
</div></body></html>`;

export const profileReminderEmail = (userName: string, completionPercent: number) => `
<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
.container{max-width:600px;margin:0 auto;padding:20px}
.header{background:#f0f0f0;padding:30px;text-align:center;border-radius:10px 10px 0 0}
.progress{background:#e0e0e0;height:20px;border-radius:10px;overflow:hidden;margin:20px 0}
.progress-bar{background:linear-gradient(90deg,#667eea 0%,#764ba2 100%);height:100%}
.content{background:#f9f9f9;padding:30px;border-radius:0 0 10px 10px}
.cta{display:inline-block;background:#667eea;color:white;padding:12px 30px;text-decoration:none;border-radius:5px;margin:20px 0}
</style></head>
<body><div class="container">
<div class="header"><h1>You're ${completionPercent}% there! 🚀</h1></div>
<div class="content">
<p>Hey ${userName},</p>
<p>Your profile is <strong>${completionPercent}% complete</strong>. Finish it to get more matches!</p>
<div class="progress"><div class="progress-bar" style="width:${completionPercent}%"></div></div>
<p style="text-align:center"><a href="https://embir.xyz" class="cta">Finish Your Profile</a></p>
</div></div></body></html>`;

export const weeklyDigestEmail = (userName: string, newMatches: number, topArticles: Array<{title: string, url: string}>) => `
<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
.container{max-width:600px;margin:0 auto;padding:20px}
.header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:30px;text-align:center;border-radius:10px 10px 0 0}
.content{background:#f9f9f9;padding:30px;border-radius:0 0 10px 10px}
.match-box{background:white;padding:20px;border-radius:10px;margin:20px 0;text-align:center}
.match-number{font-size:48px;font-weight:bold;color:#667eea}
.article{background:white;padding:15px;border-radius:5px;margin:10px 0}
.article a{color:#667eea;text-decoration:none;font-weight:600}
.cta{display:inline-block;background:#667eea;color:white;padding:12px 30px;text-decoration:none;border-radius:5px;margin:20px 0}
</style></head>
<body><div class="container">
<div class="header"><h1>Your Weekly Embir Digest</h1></div>
<div class="content">
<p>Hey ${userName},</p>
<div class="match-box"><div class="match-number">${newMatches}</div><p>profile views this week</p></div>
<h3>Top Articles</h3>
${topArticles.map(a => `<div class="article"><a href="${a.url}">${a.title}</a></div>`).join('')}
<p style="text-align:center"><a href="https://embir.xyz" class="cta">Open Embir</a></p>
</div></div></body></html>`;
