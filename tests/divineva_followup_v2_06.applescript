-- Divineva Follow-up 06 - 70 users
set userIDs to {"6032507","6036526","6036552","6052432","6053861","6059655","6072048","6087764","6088003","6089244","6093275","6096593","6096632","6106556","6113464","6124494","6140612","6157602","6161389","6168912","6175477","6178908","6206752","6208332","6210070","6214727","6232009","6234302","6241057","6251917","6255876","6259827","6260447","6261820","6268276","6270906","6279726","6281912","6285123","6294360","6298366","6299025","6339041","6341022","6342723","6345032","6347755","6349320","6356792","6362228","6369823","6372112","6373322","6382700","6390776","6392463","6396267","6397321","6413475","6421915","6429333","6442559","6444013","6448984","6456176","6458226","6459446","6461242","6466171","6466916"}
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