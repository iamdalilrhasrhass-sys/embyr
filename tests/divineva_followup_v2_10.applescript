-- Divineva Follow-up 10 - 70 users
set userIDs to {"8067306","8072798","8078931","8081162","8082150","8108084","8120727","8125151","8126199","8130703","8134600","8136950","8136990","8137111","8139975","8141431","8144205","8153932","8158889","8159368","8162261","8164438","8171026","8171769","8179094","8189608","8197143","8202354","8205162","8217332","8224225","8224524","8225205","8226667","8232583","8232613","8238874","8250931","8251065","8260916","8272792","8276867","8276909","8278775","8279599","8287604","8294875","8298130","8300135","8302705","8311220","8311663","8316194","8318545","8330442","8333099","8335407","8336538","8343643","8345327","8351535","8355245","8356156","8360849","8362890","8365829","8376273","8376286","8385281","8403962"}
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