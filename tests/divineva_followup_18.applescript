-- Divineva Follow-up Batch 18 - 70 users
set userIDs to {"10266299","10271573","10272656","10275329","10280983","10281486","10281495","10283956","10294592","10297779","10307768","10308173","10311078","10314741","10317272","10321415","10322552","10323488","10326271","10330220","10332305","10333603","10334154","10335199","10335222","10335668","10336379","10338361","10339282","10340921","10342573","10342753","10342993","10350250","10350718","10350946","10356319","10357643","10358119","10360419","10361215","10361726","10364239","10364567","10365049","10366637","10370546","10371250","10374224","10376662","10376881","10383968","10396340","10399527","10401548","10401806","10404685","10411502","10413688","10414744","10429651","10429960","10430989","10431643","10432410","10432825","10435106","10447463","10458819","10462493"}
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