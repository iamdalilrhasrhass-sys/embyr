-- Divineva Follow-up: Message 2 to 883 users
set idFile to "/tmp/divineva_followup_ids.txt"
set fileRef to open for access idFile
set fileContent to read fileRef
close access fileRef

set userIDs to paragraphs of fileContent
set sentCount to 0
set errorCount to 0
set totalCount to count of userIDs

repeat with i from 1 to totalCount
    set userId to item i of userIDs
    if userId is not "" then
        try
            tell application "Safari"
                tell window 1
                    set URL of tab 10 to "https://www.divineva.com/chat.php?id=" & userId
                end tell
            end tell
            delay 2
            tell application "Safari"
                tell window 1
                    do JavaScript "document.getElementById('message-input') ? document.getElementById('message-input').value = 'Rappel : Femynia est gratuit pendant son lancement. Viens creer ton profil sur https://feminya.xyz' : ''" in tab 10
                    delay 0.3
                    do JavaScript "document.getElementById('send-button') ? document.getElementById('send-button').click() : ''" in tab 10
                end tell
            end tell
            set sentCount to sentCount + 1
        on error
            set errorCount to errorCount + 1
        end try
    end if
end repeat
return sentCount & ",  sent, , " & errorCount & ",  errors"