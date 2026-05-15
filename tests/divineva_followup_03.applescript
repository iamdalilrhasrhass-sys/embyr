-- Divineva Follow-up Batch 03 - 70 users
set userIDs to {"4686943","4687264","4687534","4687781","4687782","4687906","4687934","4688150","4688174","4688223","4688526","4688540","4688565","4688568","4688594","4688604","4688611","4688624","4688697","4688750","4688906","4689020","4689140","4689159","4689562","4689907","4696960","4704487","4715329","4720867","4721682","4729858","4730999","4733798","4740234","4743080","4744895","4754516","4756284","4759999","4762200","4762405","4768092","4771643","4779086","4802221","4815134","4816924","4823530","4829245","4829472","4832056","4834690","4838705","4846268","4850647","4854124","4863485","4864434","4868823","4870932","4875678","4878396","4880406","4888156","4890177","4904466","4905018","4911664","4917362"}
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