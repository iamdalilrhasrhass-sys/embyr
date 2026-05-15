-- Divineva Batch 09 - 21 users
set userIDs to {"10820857","10821108","10821618","10822426","10825175","10827361","10827616","10829009","10829600","10831476","10832458","10832996","10833030","10833033","10834562","10834819","10834893","10835092","10835347","10835561","10835640"}
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