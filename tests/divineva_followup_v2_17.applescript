-- Divineva Follow-up 17 - 70 users
set userIDs to {"10047706","10053642","10061769","10070839","10083240","10095681","10097589","10097651","10103146","10104127","10105693","10110085","10111810","10113544","10114190","10114228","10118046","10119741","10122313","10127412","10128203","10128330","10130384","10132976","10139569","10142547","10143442","10144171","10144385","10149002","10149131","10149784","10150896","10159135","10165047","10167257","10173509","10173752","10177844","10180420","10182745","10188536","10189470","10189871","10190603","10190617","10194465","10195048","10195856","10202133","10203784","10204183","10207576","10216620","10218182","10220669","10222715","10224401","10228109","10231782","10237729","10237927","10238650","10240618","10241727","10248495","10254374","10255468","10257629","10257859"}
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