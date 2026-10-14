#!/bin/bash
# Dựng lại DB thử và chạy migration + test. Dùng: bash tests/run.sh [file_test.sql ...]
chmod -R a+rX /tmp/claude-0 2>/dev/null
cd "$(dirname "$0")/.."
DB=colentis_test
su postgres -c "psql -q -c 'drop database if exists $DB' -c 'create database $DB'" >/dev/null
P="su postgres -c"
run(){ su postgres -c "psql -q -v ON_ERROR_STOP=1 -d $DB -f $PWD/$1" 2>&1; }
run tests/00_stub.sql || exit 1
for f in migrations/*.sql; do echo "== $f"; run $f || exit 1; done
for f in "$@"; do echo "== TEST $f"; run $f || exit 1; done
