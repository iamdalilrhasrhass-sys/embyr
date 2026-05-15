-- Divineva Follow-up Batch 01 - 70 users
set userIDs to {"7016","7026","7032","7040","7053","7063","7078","7092","7093","7096","7113","7114","1933357","3657194","3840825","3843221","3877353","3964391","3970672","3997046","3998868","4029002","4037195","4039235","4044328","4050470","4057672","4058573","4059546","4065356","4072864","4083757","4085251","4114970","4115719","4116621","4127830","4130182","4133969","4134413","4148713","4150878","4154437","4157026","4157796","4165238","4170194","4190834","4192804","4198381","4205016","4211368","4211832","4222839","4223967","4224928","4226036","4235457","4239244","4239439","4240986","4242004","4242324","4272913","4291436","4297758","4299864","4300716","4305353","4320079"}
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