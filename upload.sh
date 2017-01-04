#!/bin/bash
#rsync -a --exclude=".DS_Store" --exclude=".git" --exclude=".gitignore" ../personal-v2/ web:public_html/me
rsync -a --exclude=".DS_Store" --exclude=".git" --exclude=".gitignore" ../personal-v2/ web:public_html
