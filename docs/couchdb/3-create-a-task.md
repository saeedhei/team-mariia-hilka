curl -X POST \
 http://admin:secret123@127.0.0.1:5984/kanban_test \
 -H "Content-Type: application/json" \
 -d '{
"type": "task",
"title": "Learn CouchDB",
"description": "Learn CRUD with CouchDB API",
"completed": false
}'
