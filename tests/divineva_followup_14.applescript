-- Divineva Follow-up Batch 14 - 70 users
set userIDs to {"9208095","9208536","9209061","9209541","9211251","9214980","9219229","9224515","9228349","9231220","9233894","9234098","9234907","9240290","9241013","9245311","9246889","9251733","9254949","9264816","9270515","9273485","9278139","9280328","9281396","9283049","9291584","9293393","9293608","9300742","9313933","9318746","9318843","9324596","9330490","9332357","9336855","9339846","9342962","9351281","9356510","9359409","9360643","9363778","9365883","9369089","9383714","9386439","9391928","9393616","9398521","9400324","9403133","9403201","9403725","9410849","9412481","9413170","9413832","9414045","9414610","9417457","9419022","9419787","9431021","9433724","9435784","9437507","9442593","9443899"}
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