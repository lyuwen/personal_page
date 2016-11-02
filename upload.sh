#!/bin/bash
rsync -a --exclude=".DS_Store" ../personal/ web:public_html/me
