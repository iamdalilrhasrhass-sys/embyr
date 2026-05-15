-- Divineva Follow-up 09 - 70 users
set userIDs to {"7574234","7576260","7595658","7599155","7610609","7620363","7622688","7624073","7625644","7637669","7638904","7639177","7655844","7661569","7669688","7679148","7691031","7708300","7709262","7727961","7729338","7738400","7746970","7747951","7752374","7754106","7758180","7758661","7760142","7761302","7772324","7781671","7784567","7786790","7792862","7799698","7801017","7801284","7806684","7817950","7830251","7830479","7837975","7849767","7849821","7875563","7878396","7903568","7911282","7921492","7945359","7948503","7963443","7968306","7972151","7974723","7977945","7985107","7988244","7998286","8010858","8012635","8017458","8038173","8040059","8043468","8058981","8060215","8062029","8064786"}
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