-- Divineva Follow-up Batch 02 - 70 users
set userIDs to {"4320553","4330911","4331346","4336108","4337092","4337513","4341071","4347648","4355989","4368470","4372185","4392840","4402976","4407382","4419690","4453670","4457530","4465005","4466742","4468758","4476286","4510470","4512434","4513051","4517690","4517797","4523807","4527948","4533281","4534380","4543122","4547131","4548785","4562305","4574521","4575566","4579797","4581695","4589013","4591753","4596091","4602821","4610431","4632878","4651905","4655052","4658457","4659775","4668657","4671353","4673195","4674816","4679230","4679841","4682831","4683780","4684119","4684902","4684961","4685101","4685238","4685244","4685480","4685734","4686014","4686086","4686125","4686507","4686588","4686799"}
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