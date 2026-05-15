-- Divineva Batch 06 - 70 users
set userIDs to {"9131073","9140482","9147944","9151195","9153601","9166312","9167718","9173493","9180682","9182122","9208536","9209541","9219229","9228349","9233894","9240290","9254949","9281396","9291584","9293608","9318746","9324596","9330490","9332357","9336855","9342962","9351281","9359409","9363778","9365883","9369089","9400324","9403725","9412481","9413170","9417457","9419022","9435784","9437507","9447173","9448546","9453849","9470638","9472758","9478374","9494026","9521017","9527892","9543609","9583325","9620192","9630934","9633286","9634865","9646521","9660698","9664971","9701939","9711403","9738427","9741201","9741461","9741738","9755346","9755518","9760534","9765288","9771254","9797727","9801869"}
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
	var ta = document.getElementById(\'message-input\');
	if (!ta) return \'NOTA\';
	var nl = String.fromCharCode(10);
	ta.value = \'Salut, On lance Femynia, une nouvelle plateforme de rencontre gratuite pendant son lancement. Tu peux creer ton profil ici : https://feminya.xyz\';
	ta.dispatchEvent(new Event(\'input\', {bubbles: true}));
	ta.dispatchEvent(new Event(\'change\', {bubbles: true}));
	var sb = document.getElementById(\'send-button\');
	if (sb) { sb.click(); return \'OK\'; }
	return \'NOBTN\';
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