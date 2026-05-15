-- Divineva Follow-up Batch 12 - 70 users
set userIDs to {"8752310","8758596","8759249","8761501","8771801","8774266","8774858","8781287","8781502","8782585","8782934","8784456","8790736","8800388","8832010","8832552","8836006","8836349","8836643","8839030","8839675","8853516","8856045","8866165","8866710","8867552","8870060","8870650","8872485","8873520","8883501","8885382","8888830","8889331","8894530","8902478","8903258","8905545","8906200","8906566","8909089","8910217","8912288","8913077","8915075","8917167","8919065","8919121","8936654","8938603","8942241","8942496","8943806","8948909","8949536","8952195","8953636","8954635","8963524","8963554","8965070","8965401","8972510","8977071","8979591","8980713","8982740","8985299","8991486","8994788"}
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