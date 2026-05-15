-- Divineva Follow-up Batch 13 - 70 users
set userIDs to {"8996197","8999698","9004256","9004824","9006269","9007427","9011449","9013928","9015937","9021988","9032231","9036336","9038761","9044704","9055429","9057420","9063852","9064682","9067633","9077585","9080165","9080522","9083549","9089152","9091616","9094277","9096248","9099606","9117433","9119867","9120837","9122266","9122306","9128645","9130961","9131073","9131465","9137360","9138896","9140482","9147874","9147944","9148875","9149886","9150907","9151153","9151195","9151250","9152198","9153253","9153601","9159913","9160902","9164863","9166312","9166718","9167662","9167718","9172131","9173493","9173602","9176546","9178781","9180682","9182122","9183327","9186920","9191554","9198041","9198828"}
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