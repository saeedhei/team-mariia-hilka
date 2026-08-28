The important thing about CouchDB here is that you must have the current \_rev.

curl -X PUT \
 http://admin:secret123@127.0.0.1:5984/kanban_test/abc123 \
 -H "Content-Type: application/json" \
 -d '{
"\_rev": "1-xxxx",
"type": "task",
"title": "Learn CouchDB",
"description": "Updated description",
"completed": true
}'
