#!/bin/bash

# Get registration page and extract form fields
REGPAGE=$(curl -s -c /tmp/jb_cookies.txt 'https://forums.justusboys.com/login/register')
echo "$REGPAGE" > /tmp/regpage.html

# Extract _xfToken
XFTOKEN=$(echo "$REGPAGE" | grep -oP 'name="_xfToken" value="\K[^"]+')
echo "xfToken: $XFTOKEN"

# Extract the dynamic field names
USERNAME_FIELD=$(echo "$REGPAGE" | grep -oP 'name="[a-f0-9]{40}"' | head -1 | grep -oP 'name="\K[^"]+')
EMAIL_FIELD=$(echo "$REGPAGE" | grep -oP 'type="email"[^>]*name="\K[^"]+')
PASSWORD_FIELD=$(echo "$REGPAGE" | grep -oP 'type="password"[^>]*name="\K(?!password_confirm)[^"]+')
echo "username_field: $USERNAME_FIELD"
echo "email_field: $EMAIL_FIELD"
echo "password_field: $PASSWORD_FIELD"

# Extract captcha question
CAPTCHA_QUESTION=$(echo "$REGPAGE" | grep -oP 'class="spaminator-captcha-question"[^>]*>\K[^<]+')
echo "Captcha question: $CAPTCHA_QUESTION"

# Extract captcha hash
CAPTCHA_HASH=$(echo "$REGPAGE" | grep -oP 'name="captcha_question_hash" value="\K[^"]+')
echo "Captcha hash: $CAPTCHA_HASH"

# Generate random username and email
UID=$RANDOM
USERNAME="guyseeker${UID}"
EMAIL="guyseeker${UID}$(date +%s)@gmail.com"
PASSWORD="ForumPass2024!"

echo "Username: $USERNAME"
echo "Email: $EMAIL"

# Submit registration
echo "Submitting registration..."
RESULT=$(curl -s -c /tmp/jb_cookies.txt -b /tmp/jb_cookies.txt \
  -X POST 'https://forums.justusboys.com/login/register-register' \
  -d "_xfToken=${XFTOKEN}" \
  -d "${USERNAME_FIELD}=${USERNAME}" \
  -d "${EMAIL_FIELD}=${EMAIL}" \
  -d "${PASSWORD_FIELD}=${PASSWORD}" \
  -d "password_confirm=${PASSWORD}" \
  -d "dob_day=15" \
  -d "dob_month=6" \
  -d "dob_year=1990" \
  -d "location=USA" \
  -d "captcha_question_answer=rainbow" \
  -d "captcha_question_hash=${CAPTCHA_HASH}" \
  -d "accept=1" \
  -d "name_cb=1" \
  -d "email_cb=1" \
  -d "email_hp=1" \
  -d "password_cb=1" \
  -d "username=1" \
  -d "email=1" \
  -d "timetaken=15")

echo "$RESULT" | head -100
echo "---"
echo "$RESULT" | grep -oP '(Thanks for registering|The requested user|could not be found|error|Error|already taken)'
echo "---"

# Check if registration succeeded
if echo "$RESULT" | grep -q 'Thanks for registering'; then
    echo "Registration successful!"
    
    # Now log in
    echo "Logging in..."
    LOGIN_RESULT=$(curl -s -c /tmp/jb_cookies.txt -b /tmp/jb_cookies.txt \
      -X POST 'https://forums.justusboys.com/login/login' \
      -d "_xfToken=${XFTOKEN}" \
      -d "login=${USERNAME}" \
      -d "password=${PASSWORD}" \
      -d "remember=1" \
      -d "_xfRedirect=https://forums.justusboys.com/")
    
    echo "Login test (check if Log in still visible):"
    echo "$LOGIN_RESULT" | grep -i 'log in\|log out' | head -5
    
    # Access Gay Discussion
    echo "Accessing Gay Discussion..."
    GD_PAGE=$(curl -s -b /tmp/jb_cookies.txt 'https://forums.justusboys.com/forums/gay-discussion.38/')
    echo "$GD_PAGE" | grep -oP '<title>\K[^<]+'
    
    # Check if we can post
    echo "Page preview:"
    echo "$GD_PAGE" | sed 's/<[^>]*>//g' | head -30
fi
