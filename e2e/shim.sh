#!/bin/bash
# Khởi động lại shim (dựng lại DB nếu truyền "reset")
cd "$(dirname "$0")/.."
[ -f /tmp/shim.pid ] && kill "$(cat /tmp/shim.pid)" 2>/dev/null
sleep 0.5
if [ "$1" = reset ]; then bash supabase/tests/run.sh >/dev/null 2>&1; fi
DEBUG=1 nohup node e2e/shim/server.mjs > /tmp/shim.log 2>&1 &
echo $! > /tmp/shim.pid
sleep 1.5
curl -s -XPOST localhost:54399/__ctl/seed-objects -d '{}' >/dev/null
echo shim up
