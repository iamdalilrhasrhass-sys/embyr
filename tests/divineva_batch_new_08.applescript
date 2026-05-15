-- Divineva Batch 08 - 70 users
set userIDs to {"10484622","10495394","10521312","10534066","10541435","10548247","10550149","10552894","10554011","10555101","10571828","10581329","10587175","10593568","10594571","10599773","10606003","10615556","10624977","10626997","10632955","10633332","10634042","10634195","10634894","10636459","10637159","10640685","10645971","10649502","10656648","10659759","10672390","10682155","10689497","10695267","10701276","10701433","10705180","10707504","10713039","10721825","10722827","10727592","10728848","10732174","10735938","10740364","10741433","10742361","10744797","10757162","10767133","10770963","10778468","10779202","10787570","10788757","10793481","10802975","10803043","10805524","10807591","10811518","10813788","10817298","10819007","10820439","10820554","10820727"}
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