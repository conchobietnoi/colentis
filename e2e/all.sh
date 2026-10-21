#!/bin/bash
# Chạy toàn bộ bài test giao diện (cần shim đang chạy và dist đã build bằng e2e/build.sh)
cd "$(dirname "$0")/.."
# s7, s8 cần ảnh concept thật (CONCEPT_DIR=thư mục chứa c1-0.webp, pano-1.webp, ultra-1.mp4, songs/0.mp4...) để shim phát lại
T="s1_friends_group s2_offline s3_catchup s4_mail_profile s5_crawl s6_mua_concept s9_admin s10_checkin"; [ -n "$CONCEPT_DIR" ] && T="$T s7_concept_p2 s8_concept_flows"
for t in $T; do node e2e/$t.mjs 2>&1 | grep -v "agent-proxy\|googleapis\|accounts.google\|android.clients\|For details\|oldest\|^$"; done
