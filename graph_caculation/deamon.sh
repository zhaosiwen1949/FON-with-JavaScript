#!/bin/bash
nohup node ./neo4j_operation/reset_resource.js > reset.log 2>&1 && node mutiple_mapping.js>result.txt 2>&1 &
