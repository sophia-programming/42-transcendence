#!/bin/bash

KIBANA_HOST="http://kibana:5601"
KIBANA_USER="elastic"
KIBANA_PASS=${KIBANA_PASSWORD}
INDEX_PATTERN_ID="logstash-"
INDEX_PATTERN_TITLE="logstash-*"

cat <<EOF > index-pattern.json
{
  "attributes": {
    "title": "${INDEX_PATTERN_TITLE}",
    "timeFieldName": "@timestamp"
  }
}
EOF

curl -X POST "${KIBANA_HOST}/api/saved_objects/index-pattern/${INDEX_PATTERN_ID}" \
  -H "kbn-xsrf: true" \
  -H "Content-Type: application/json" \
  -u ${KIBANA_USER}:${KIBANA_PASS} \
  --data @index-pattern.json

rm index-pattern.json
