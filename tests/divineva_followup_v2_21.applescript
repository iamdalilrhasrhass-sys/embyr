-- Divineva Follow-up 21 - 70 users
set userIDs to {"10735406","10735938","10740364","10741433","10742361","10742566","10744797","10746577","10750324","10756575","10757162","10759237","10759414","10767133","10770963","10774629","10776600","10776997","10778468","10779202","10779317","10782614","10786415","10787570","10788757","10789661","10793481","10795109","10795258","10795746","10797129","10798107","10801015","10802927","10802975","10803043","10805524","10807591","10809224","10811518","10813231","10813788","10814097","10815003","10817298","10817823","10819001","10819007","10819485","10819670","10820021","10820439","10820554","10820727","10820857","10821108","10821219","10821618","10821997","10822426","10823862","10825175","10827361","10827616","10828387","10828698","10829009","10829600","10829627","10829850"}
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