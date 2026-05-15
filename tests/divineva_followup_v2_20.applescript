-- Divineva Follow-up 20 - 70 users
set userIDs to {"10615556","10617300","10617639","10617959","10619017","10621104","10621212","10622334","10624977","10626825","10626865","10626997","10632955","10633332","10633553","10634042","10634195","10634894","10636459","10636757","10637159","10637560","10638468","10640685","10644555","10644764","10645971","10649502","10650084","10651938","10654109","10656648","10657688","10657701","10659369","10659759","10659810","10668985","10671350","10672390","10677479","10677798","10678051","10678942","10679455","10682137","10682155","10688141","10689375","10689497","10691519","10693060","10695267","10699011","10701276","10701433","10705180","10706065","10706597","10707504","10708872","10713039","10713617","10715271","10721825","10722827","10727592","10728848","10728903","10732174"}
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