-- Divineva Follow-up 11 - 70 users
set userIDs to {"8414367","8422226","8431184","8433416","8435835","8449465","8454357","8470136","8475194","8478222","8489476","8491500","8499707","8499772","8508178","8517928","8519041","8521279","8521521","8525034","8532820","8536845","8537342","8543345","8544587","8546436","8548552","8554108","8554205","8558822","8587635","8590949","8594423","8601538","8601575","8604485","8620955","8621903","8622103","8626842","8634245","8635663","8636060","8640923","8642893","8649818","8650165","8651128","8652492","8658599","8658748","8665454","8679442","8680658","8684851","8685212","8687367","8691126","8697743","8698104","8703758","8709623","8712963","8719034","8721361","8728834","8738974","8742627","8747624","8750611"}
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