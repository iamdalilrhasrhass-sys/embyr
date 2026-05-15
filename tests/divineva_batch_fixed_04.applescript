-- Divineva Batch 04 - 70 users
set userIDs to {"6996583","7002960","7004643","7013412","7037465","7088243","7104814","7111845","7123900","7142526","7185621","7193224","7234597","7289499","7304938","7364234","7365337","7382365","7382437","7399628","7438515","7441337","7456435","7457876","7487929","7499394","7564901","7574234","7595658","7624073","7638904","7669688","7708300","7727961","7729338","7738400","7752374","7754106","7786790","7792862","7801017","7801284","7817950","7830251","7945359","7963443","7985107","7998286","8010858","8017458","8038173","8040059","8064786","8067306","8081162","8120727","8159368","8205162","8232583","8250931","8276909","8294875","8298130","8300135","8316194","8330442","8333099","8336538","8355245","8356156"}
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