#!/bin/bash
rsync -a --exclude=".DS_Store" --exclude=".git" --exclude=".gitignore" ../personal/ web:public_html/me
