#!/bin/bash
# Check if Mac is reachable via Tailscale and set up SSH SOCKS proxy
MAC_IP="100.125.175.17"
SOCKS_PORT="1080"

# Test connection
ssh -o ConnectTimeout=3 -o BatchMode=yes -i /root/.ssh/ark_mac_key dalilrhasrhass@$MAC_IP "echo ALIVE" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "MAC_ONLINE"
    # Start SOCKS proxy through Mac
    ssh -o ExitOnForwardFailure=yes -f -N -D $SOCKS_PORT -i /root/.ssh/ark_mac_key dalilrhasrhass@$MAC_IP 2>/dev/null
    echo "SOCKS_PROXY_READY:$SOCKS_PORT"
    # Test that proxy works (will show Mac's residential IP)
    PROXY_IP=$(curl -s --max-time 5 --socks5 "localhost:$SOCKS_PORT" "https://api.ipify.org" 2>/dev/null)
    echo "PROXY_EXTERNAL_IP:$PROXY_IP"
else
    echo "MAC_OFFLINE"
    exit 1
fi
