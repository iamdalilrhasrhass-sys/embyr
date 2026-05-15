-- Divineva Batch 07 - 70 users
set userIDs to {"9805017","9829073","9853415","9874955","9905542","9906987","9945854","9951212","9952006","9998202","10001928","10007209","10020228","10025580","10028563","10028961","10029043","10039060","10043293","10045112","10053642","10070839","10097651","10105693","10113544","10114190","10142547","10149002","10150896","10159135","10182745","10188536","10189871","10195856","10203784","10216620","10218182","10220669","10224401","10228109","10240618","10254374","10275329","10281486","10307768","10311078","10317272","10333603","10334154","10335199","10338361","10342753","10342993","10357643","10360419","10361726","10364567","10371250","10376662","10376881","10396340","10401548","10401806","10404685","10413688","10414744","10447463","10458819","10462493","10479199"}
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