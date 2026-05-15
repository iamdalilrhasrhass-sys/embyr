-- Divineva Follow-up 16 - 70 users
set userIDs to {"9741461","9741738","9753020","9755346","9755518","9760534","9762491","9765288","9771254","9773997","9787013","9789139","9797727","9801869","9802879","9805017","9811534","9817350","9817789","9819969","9827052","9829073","9829562","9853415","9856032","9874955","9878599","9883448","9887784","9889743","9894903","9905542","9906577","9906987","9907788","9917685","9918181","9925087","9944497","9945854","9951212","9952006","9954009","9967945","9986803","9988418","9996437","9996524","9998202","10001928","10002370","10004011","10007209","10010685","10016045","10016390","10020228","10022881","10025580","10026207","10028563","10028961","10029043","10030523","10037919","10038961","10039060","10043293","10045112","10047593"}
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