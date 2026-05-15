-- Divineva Follow-up Batch 08 - 70 users
set userIDs to {"7037465","7049727","7060357","7061272","7076651","7088243","7095858","7103451","7104814","7110029","7111845","7123900","7127327","7127725","7132714","7133777","7139916","7142526","7142690","7163526","7172969","7183167","7184101","7185621","7192196","7193224","7234597","7255179","7263649","7289499","7304938","7331444","7349022","7357450","7363195","7364234","7365181","7365337","7379382","7382365","7382437","7396094","7399628","7409731","7417401","7426602","7431137","7435523","7438515","7441337","7442165","7455703","7456435","7456493","7457876","7458915","7470849","7487929","7491814","7492962","7499394","7502727","7509525","7518775","7524922","7540484","7556796","7557580","7564901","7572787"}
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
	var ta = document.getElementById(\'message-input\');
	if (!ta) return \'NOTA\';
	var nl = String.fromCharCode(10);
	ta.value = \'Petit rappel : Femynia est en phase de lancement GRATUIT. Rejoins la communaute fondatrice sur https://feminya.xyz :)\';
	ta.dispatchEvent(new Event(\'input\', {bubbles: true}));
	ta.dispatchEvent(new Event(\'change\', {bubbles: true}));
	var sb = document.getElementById(\'send-button\');
	if (sb) { sb.click(); return \'OK\'; }
	return \'NOBTN\';
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