-- Divineva Follow-up Batch 15 - 70 users
set userIDs to {"9447173","9448546","9453849","9470638","9472758","9478374","9481658","9488262","9490775","9492228","9494026","9499766","9500539","9505690","9509042","9521017","9524851","9527892","9534770","9541153","9543609","9544088","9551978","9561308","9564415","9565778","9577433","9579197","9583325","9592808","9594158","9597948","9601477","9615888","9618668","9619636","9620192","9625442","9630821","9630934","9632862","9633286","9634865","9639608","9643965","9646521","9649078","9649925","9655623","9660698","9661258","9662864","9664971","9666063","9672291","9672495","9672800","9678544","9680881","9682427","9690773","9694531","9701939","9709586","9711403","9725422","9732029","9734649","9738427","9741201"}
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