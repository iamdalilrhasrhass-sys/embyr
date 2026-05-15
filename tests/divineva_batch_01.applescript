-- Divineva Batch 1 - 70 users
set userIDs to {"3657194","3843221","3877353","3964391","3970672","3997046","3998868","4037195","4039235","4044328","4057672","4059546","4065356","4072864","4083757","4085251","4114970","4127830","4133969","4150878","4154437","4157796","4190834","4198381","4205016","4211368","4223967","4226036","4235457","4239244","4240986","4242004","4242324","4272913","4291436","4305353","4320079","4320553","4331346","4336108","4347648","4355989","4368470","4392840","4402976","4407382","4419690","4465005","4466742","4512434","4513051","4517797","4523807","4533281","4534380","4540749","4543122","4547131","4548785","4574521","4579797","4581695","4589013","4596091","4602821","4610431","4632878","4655052","4658457"}
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
	var ta = document.getElementById('message-input');
	if (!ta) return 'NOTA';
	var nl = String.fromCharCode(10);
	ta.value = 'Salut,' + nl + nl + 'On lance Femynia, une nouvelle plateforme de rencontre gratuite pendant son lancement.' + nl + 'L' + String.fromCharCode(39) + 'idee est simple : creer une alternative plus moderne, plus elegante et plus accessible, avec des profils reels et une ambiance plus respectueuse.' + nl + nl + 'Les premiers inscrits auront des avantages fondateurs et du Premium offert plus tard.' + nl + nl + 'Tu peux creer ton profil ici :' + nl + 'https://feminya.xyz' + nl + nl + 'Go now';
	ta.dispatchEvent(new Event('input', {bubbles: true}));
	ta.dispatchEvent(new Event('change', {bubbles: true}));
	var sb = document.getElementById('send-button');
	if (sb) { sb.click(); return 'OK'; }
	return 'NOBTN';
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
return sentCount & " sent, " & errorCount & " errors"
