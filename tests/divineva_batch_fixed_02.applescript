-- Divineva Batch 02 - 70 users
set userIDs to {"4687781","4687782","4687906","4687934","4688150","4688174","4688223","4688526","4688540","4688565","4688568","4688594","4688604","4688611","4688624","4688697","4688750","4688906","4689020","4689140","4689159","4689907","4729858","4743080","4744895","4815134","4829245","4838705","4868823","4878396","4888156","4890177","4904466","4933619","4939492","4943416","4984221","5035826","5043603","5065121","5067885","5093870","5116402","5118167","5126667","5129043","5142160","5148893","5149393","5178003","5197351","5198349","5207975","5223158","5260943","5280816","5290798","5369261","5428485","5484268","5496074","5504338","5510227","5554539","5561160","5575173","5600818","5605016","5613754","5615338"}
set sentCount to 0
set errorCount to 0
repeat with i from 1 to count of userIDs
	set userId to item i of userIDs
	tell application "Safari"
		tell window 1
			set URL of tab 10 to "https://www.divineva.com/chat.php?id=" & userId
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
	ta.value = 'Salut, On lance Femynia, une nouvelle plateforme de rencontre gratuite pendant son lancement. Tu peux creer ton profil ici : https://feminya.xyz';
	ta.dispatchEvent(new Event('input', {bubbles: true}));
	ta.dispatchEvent(new Event('change', {bubbles: true}));
	var sb = document.getElementById('send-button');
	if (sb) { sb.click(); return 'OK'; }
	return 'NOBTN';
})();
" in tab 10
		end tell
	end tell
	if result is "OK" then
		set sentCount to sentCount + 1
	else
		set errorCount to errorCount + 1
	end if
end repeat
return (sentCount as text) & ",  sent, , " & (errorCount as text) & ",  errors"