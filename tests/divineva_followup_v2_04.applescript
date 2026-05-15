-- Divineva Follow-up 04 - 70 users
set userIDs to {"4933619","4939492","4943416","4945131","4965477","4978899","4984221","4989865","4996304","5018900","5035826","5043603","5044136","5054091","5055125","5065121","5067885","5077000","5078004","5083139","5084417","5086047","5090500","5093870","5116402","5118167","5126546","5126667","5129043","5142160","5148893","5149393","5151650","5157708","5163552","5166254","5177566","5178003","5178171","5185702","5194547","5197351","5198349","5201645","5207975","5209931","5215365","5223158","5226284","5229082","5230250","5237780","5239647","5247991","5252599","5260943","5280792","5280816","5289126","5290798","5315389","5325376","5335179","5345963","5349984","5355841","5362972","5365904","5367421","5369261"}
set sentCount to 0
set errorCount to 0
repeat with i from 1 to count of userIDs
	set userId to item i of userIDs
	tell application "Safari"
		tell window 1
			set URL of tab 11 to "https://www.divineva.com/chat.php?id=" & userId
		end tell
	end tell
	delay 2
	tell application "Safari"
		tell window 1
			set result to do JavaScript "
(function() {
	var ta = document.getElementById('message-input');
	if (!ta) return 'NOTA';
	var nl = String.fromCharCode(10);
	ta.value = 'Petit rappel : Femynia est en phase de lancement GRATUIT. Rejoins la communaute fondatrice sur https://feminya.xyz :)';
	ta.dispatchEvent(new Event('input', {bubbles: true}));
	ta.dispatchEvent(new Event('change', {bubbles: true}));
	var sb = document.getElementById('send-button');
	if (sb) { sb.click(); return 'OK'; }
	return 'NOBTN';
})();
" in tab 11
		end tell
	end tell
	if result is "OK" then
		set sentCount to sentCount + 1
	else
		set errorCount to errorCount + 1
	end if
end repeat
return (sentCount as text) & ",  sent, , " & (errorCount as text) & ",  errors"