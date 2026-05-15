-- Divineva Batch 05 - 70 users
set userIDs to {"8360849","8365829","8376273","8376286","8385281","8414367","8433416","8435835","8454357","8475194","8519041","8521279","8521521","8536845","8537342","8543345","8544587","8554205","8601538","8620955","8621903","8634245","8636060","8642893","8649818","8665454","8684851","8685212","8687367","8697743","8698104","8703758","8728834","8742627","8747624","8750611","8759249","8761501","8774858","8782934","8790736","8836006","8836349","8856045","8870060","8883501","8885382","8912288","8919065","8919121","8954635","8963554","8965070","8977071","8979591","8982740","8999698","9004256","9006269","9007427","9013928","9021988","9036336","9044704","9057420","9063852","9064682","9067633","9122266","9130961"}
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