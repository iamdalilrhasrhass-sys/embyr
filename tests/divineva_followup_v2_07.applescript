-- Divineva Follow-up 07 - 70 users
set userIDs to {"6490772","6492417","6493280","6504538","6519425","6527092","6531938","6536852","6541050","6544956","6553542","6556263","6560627","6572324","6576675","6596725","6596879","6613814","6615309","6616175","6643502","6647646","6652088","6658054","6659366","6679467","6683205","6703699","6704089","6707725","6718810","6721068","6750672","6754915","6773996","6776995","6783553","6815654","6815914","6819431","6821228","6824169","6829752","6839539","6839601","6843138","6850277","6853492","6854214","6878233","6880743","6904982","6905480","6910282","6920152","6926961","6927663","6932240","6940131","6940728","6955994","6966940","6969037","6973142","6977373","6984326","6996583","7002960","7004643","7013412"}
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