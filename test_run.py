import os
import sys

from pelican import main

BASEDIR = os.getcwd()
INPUT_DIR = os.path.join(BASEDIR, 'content')
OUTPUT_DIR = os.path.join(BASEDIR, 'dev_output')
CONF_FILE = os.path.join(BASEDIR, 'pelicanconf.py')


argv = [INPUT_DIR, '-o', OUTPUT_DIR, '-s', CONF_FILE, '--debug']

main(argv)



