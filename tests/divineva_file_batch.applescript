-- Divineva Batch - reads IDs from text file
set idsFile to "/tmp/divineva_batch_ids.txt"

try
    set fileRef to open for access idsFile
    set fileContent to read fileRef
    close access fileRef
on error
    return "0,  sent,  ERROR: cannot read file"
end try

set AppleScript's text item delimiters to {return, linefeed}
set userIDs to every text item of fileContent

-- Remove empty items
set cleanIDs to {}
repeat with uid in userIDs
    set trimmed to my trim(uid)
    if length of trimmed > 0 then
        set end of cleanIDs to trimmed
    end if
end repeat

set sentCount to 0
set errorCount to 0
set totalCount to count of cleanIDs

repeat with i from 1 to totalCount
    set userId to item i of cleanIDs
    try
        tell application "Safari"
            tell window 1
                set URL of tab 10 to "https://www.divineva.com/chat.php?id=" & userId
            end tell
        end tell
        delay 2
        tell application "Safari"
            tell window 1
                do JavaScript "document.getElementById('message-input') ? document.getElementById('message-input').value = 'Salut, On lance Femynia, une nouvelle plateforme de rencontre gratuite pendant son lancement. Tu peux cr\u00e9er ton profil ici : https://feminya.xyz' : ''" in tab 10
                delay 0.3
                do JavaScript "document.getElementById('send-button') ? document.getElementById('send-button').click() : ''" in tab 10
            end tell
        end tell
        set sentCount to sentCount + 1
    on error
        set errorCount to errorCount + 1
    end try
end repeat
return (sentCount as text) & ",  sent, , " & (errorCount as text) & ",  errors"

on trim(t)
    set tStr to t as string
    repeat while tStr starts with space or tStr starts with tab
        set tStr to text 2 thru -1 of tStr
    end repeat
    repeat while tStr ends with space or tStr ends with tab or tStr ends with return or tStr ends with linefeed
        set tStr to text 1 thru -2 of tStr
    end repeat
    return tStr
end trim
