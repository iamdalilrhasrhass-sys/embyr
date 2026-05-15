-- Divineva Follow-up Batch 05 - 70 users
set userIDs to {"5377238","5390207","5425465","5428485","5446494","5458345","5475598","5484268","5484554","5496074","5503597","5504338","5505090","5510227","5537011","5541798","5554539","5561160","5564001","5571447","5575173","5576160","5597064","5600818","5605016","5613754","5615338","5617905","5627863","5631330","5642304","5646225","5648031","5670800","5698699","5704680","5724912","5726215","5744382","5747166","5747250","5768796","5770906","5782175","5782545","5785312","5786508","5798697","5827571","5829212","5840182","5882561","5886580","5891392","5906209","5912363","5913629","5921051","5923577","5942125","5946138","5947905","5960988","5961450","5964378","5969163","5970782","5998462","6019487","6022662"}
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