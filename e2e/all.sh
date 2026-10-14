#!/bin/bash
# Chạy toàn bộ bài test giao diện (cần shim đang chạy và dist đã build bằng e2e/build.sh)
cd "$(dirname "$0")/.."
for t in s1_friends_group s2_offline s3_catchup s4_mail_profile; do node e2e/$t.mjs 2>&1 | grep -v "agent-proxy\|googleapis\|accounts.google\|android.clients\|For details\|oldest\|^$"; done
