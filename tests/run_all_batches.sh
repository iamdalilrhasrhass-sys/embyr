#!/bin/bash
# Run all Divineva batches sequentially

BATCHES=14

for i in $(seq 1 $BATCHES); do
    echo "=== BATCH $i/$BATCHES ==="
    scp -i /root/.ssh/ark_mac_key /root/embyr/tests/divineva_batch_${i}.applescript dalilrhasrhass@100.125.175.17:/tmp/divineva_current.applescript 2>&1 && \
    ssh -i /root/.ssh/ark_mac_key -o ConnectTimeout=400 dalilrhasrhass@100.125.175.17 'osascript /tmp/divineva_current.applescript' 2>&1
    echo "=== DONE BATCH $i ==="
    sleep 5
done

echo "ALL BATCHES COMPLETE"