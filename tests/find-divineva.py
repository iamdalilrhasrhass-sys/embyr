import subprocess
import json

def run_cmd(cmd):
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30, shell=True)
    return result.stdout.strip(), result.stderr.strip()

# Write script to temp file on mac, then execute
script = """
tell application "Safari"
    set winCount to count of windows
    set results to {}
    repeat with w from 1 to winCount
        set tabCount to count of tabs of window w
        repeat with t from 1 to tabCount
            set tabURL to URL of tab t of window w
            if tabURL contains "divineva" then
                set end of results to "Window " & w & ", Tab " & t & ": " & tabURL
            end if
        end repeat
    end repeat
    if results is {} then
        return "NO_DIVINEVA"
    end if
    set AppleScript's text item delimiters to linefeed
    return results as string
end tell
"""

# Write to remote temp file
cmd1 = f"ssh -i /root/.ssh/ark_mac_key -o ConnectTimeout=10 dalilrhasrhass@100.125.175.17 'cat > /tmp/find_divineva.scpt <<\\\"SCRIPT_END\\\"\\n{script}\\nSCRIPT_END'"
out1, err1 = run_cmd(cmd1)
print(f"Write: {out1} {err1}")

# Execute
cmd2 = "ssh -i /root/.ssh/ark_mac_key -o ConnectTimeout=10 dalilrhasrhass@100.125.175.17 'osascript /tmp/find_divineva.scpt 2>&1'"
out2, err2 = run_cmd(cmd2)
print(f"Result: {out2}")
print(f"Err: {err2}")
