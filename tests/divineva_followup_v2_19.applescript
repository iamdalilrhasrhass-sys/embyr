-- Divineva Follow-up 19 - 70 users
set userIDs to {"10464237","10466655","10467092","10467506","10468684","10468862","10469912","10471096","10471197","10479199","10480351","10481465","10482677","10484622","10485001","10487898","10492343","10495394","10500587","10508766","10512341","10514990","10519896","10521312","10526464","10534066","10537719","10537881","10539211","10541435","10544794","10548247","10548738","10550149","10552894","10553174","10554011","10554318","10555101","10556336","10559934","10561041","10564130","10566766","10569955","10571828","10574130","10576865","10581329","10583769","10583862","10586743","10587175","10588457","10593568","10594571","10595822","10597532","10598617","10599605","10599773","10604075","10604798","10606003","10606658","10606690","10607765","10609025","10609958","10614575"}
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