#!/usr/bin/env bash
# Deja la base lista: levanta el replica set (las transacciones de tickets lo
# exigen) y, si la base esta vacia, la reconstruye con dbData.js.
# Es idempotente: en cada despliegue se ejecuta y no toca nada si ya hay datos.
set -euo pipefail

HOST="${MONGO_HOST:-mongo}"
DB="${DB_NAME:-cinecampus}"
RS="${REPLICA_SET_NAME:-rs0}"

ADMIN_URI="mongodb://${HOST}:27017/admin?directConnection=true"
DB_URI="mongodb://${HOST}:27017/${DB}?directConnection=true"

echo "[init] esperando a que mongod responda en ${HOST}..."
until mongosh "$ADMIN_URI" --quiet --eval 'db.adminCommand({ping:1})' >/dev/null 2>&1; do
  sleep 2
done

if mongosh "$ADMIN_URI" --quiet --eval 'rs.status().ok' >/dev/null 2>&1; then
  echo "[init] el replica set ${RS} ya estaba iniciado"
else
  echo "[init] iniciando el replica set ${RS}"
  mongosh "$ADMIN_URI" --quiet --eval "rs.initiate({_id:'${RS}',members:[{_id:0,host:'${HOST}:27017'}]})"
fi

echo "[init] esperando a que el nodo sea primario..."
until [ "$(mongosh "$ADMIN_URI" --quiet --eval 'print(db.hello().isWritablePrimary)')" = "true" ]; do
  sleep 2
done

COUNT="$(mongosh "$DB_URI" --quiet --eval 'print(db.movies.countDocuments({}))')"
if [ "$COUNT" -gt 0 ]; then
  echo "[init] la base ${DB} ya tiene datos (${COUNT} peliculas): no se reconstruye"
else
  echo "[init] reconstruyendo ${DB} a partir de dbData.js"
  mongosh "$DB_URI" --quiet /seed/dbData.js
  echo "[init] reconstruida:"
  mongosh "$DB_URI" --quiet --eval 'db.getCollectionNames().forEach(c => print("  " + c + ": " + db[c].countDocuments({})))'
fi

echo "[init] listo"
