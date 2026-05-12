#!/bin/bash

trap 'kill 0' EXIT

MAGENTA=$'\033[35m'
CYAN=$'\033[36m'
RESET=$'\033[0m'

(cd server && npm run dev 2>&1 | while IFS= read -r line; do echo "${MAGENTA}[server]${RESET} $line"; done) &
(cd client && npm run dev 2>&1 | while IFS= read -r line; do echo "${CYAN}[client]${RESET} $line"; done) &

wait
