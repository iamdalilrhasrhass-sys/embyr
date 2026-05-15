-- Divineva Batch 03 - 70 users
set userIDs to {"5627863","5670800","5698699","5747166","5770906","5782545","5798697","5829212","5886580","5912363","5921051","5946138","5947905","5961450","5970782","6022662","6036526","6053861","6059655","6072048","6124494","6157602","6161389","6208332","6210070","6232009","6255876","6259827","6261820","6279726","6285123","6294360","6347755","6362228","6369823","6372112","6373322","6396267","6397321","6413475","6429333","6466171","6519425","6527092","6531938","6536852","6541050","6544956","6553542","6576675","6596879","6613814","6616175","6643502","6652088","6659366","6679467","6707725","6824169","6829752","6850277","6853492","6854214","6904982","6926961","6927663","6966940","6969037","6973142","6984326"}
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