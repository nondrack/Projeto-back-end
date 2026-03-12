"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
async function run() {
    const [rawRows] = await database_1.default.query("SHOW INDEX FROM usuarios");
    const rows = rawRows;
    if (!Array.isArray(rows) || rows.length === 0) {
        console.log("Nenhum indice encontrado na tabela usuarios.");
        return;
    }
    const byIndexName = new Map();
    for (const row of rows) {
        const list = byIndexName.get(row.Key_name) || [];
        list.push(row);
        byIndexName.set(row.Key_name, list);
    }
    const seenSignatures = new Map();
    const duplicateIndexes = [];
    for (const [indexName, indexRows] of byIndexName.entries()) {
        if (indexName === "PRIMARY")
            continue;
        const ordered = [...indexRows].sort((a, b) => Number(a.Seq_in_index) - Number(b.Seq_in_index));
        const columns = ordered.map((item) => item.Column_name).join(",");
        const nonUnique = Number(ordered[0]?.Non_unique || 1);
        const signature = `${nonUnique}:${columns}`;
        if (seenSignatures.has(signature)) {
            duplicateIndexes.push(indexName);
        }
        else {
            seenSignatures.set(signature, indexName);
        }
    }
    if (duplicateIndexes.length === 0) {
        console.log("Nenhum indice duplicado encontrado em usuarios.");
        return;
    }
    console.log(`Indices duplicados encontrados: ${duplicateIndexes.join(", ")}`);
    for (const indexName of duplicateIndexes) {
        await database_1.default.query(`ALTER TABLE usuarios DROP INDEX \`${indexName}\``);
        console.log(`Indice removido: ${indexName}`);
    }
    const [afterRows] = await database_1.default.query("SHOW INDEX FROM usuarios");
    const total = Array.isArray(afterRows) ? afterRows.length : 0;
    console.log(`Limpeza concluida. Total de entradas de indice apos limpeza: ${total}`);
}
run()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error("Erro ao limpar indices duplicados de usuarios:", error);
    process.exit(1);
});
