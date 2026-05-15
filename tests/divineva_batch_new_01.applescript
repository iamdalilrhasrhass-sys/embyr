-- Divineva Batch 01 - 70 users
set userIDs to {"7016","7026","7032","7040","7053","7063","7078","7092","7093","7096","7113","7114","1933357","3840825","4029002","4050470","4058573","4115719","4116621","4130182","4134413","4148713","4157026","4165238","4170194","4192804","4211832","4222839","4224928","4239439","4297758","4299864","4300716","4330911","4337092","4337513","4341071","4372185","4453670","4457530","4468758","4476286","4510470","4517690","4527948","4562305","4575566","4591753","4651905","4673195","4674816","4679230","4679841","4683780","4684119","4684902","4684961","4685101","4685238","4685244","4685480","4685734","4686014","4686086","4686125","4686507","4686588","4686943","4687264","4687534"}
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