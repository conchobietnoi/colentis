#!/bin/bash
cd "$(dirname "$0")/.." && VITE_SUPABASE_URL=http://localhost:54399 VITE_SUPABASE_ANON_KEY=anon-test-key npx vite build --minify false 2>&1 | grep -E "error|Error|built in" 
