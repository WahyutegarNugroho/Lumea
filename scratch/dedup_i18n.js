import fs from 'fs';

const content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

function deduplicateBlock(blockContent) {
    const lines = blockContent.split('\n');
    const resultLines = [];
    const keyMap = new Map();
    
    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        const match = line.match(/^\s*['"](.+?)['"]\s*:/);
        if (match) {
            const key = match[1];
            if (!keyMap.has(key)) {
                keyMap.set(key, true);
                resultLines.unshift(line);
            }
        } else {
            resultLines.unshift(line);
        }
    }
    return resultLines.join('\n');
}

const langRegex = /(en|id|es):\s*\{([\s\S]*?)\}(?=\s*,\s*(?:en|id|es):|\s*\}$)/g;

let newContent = content;
let match;
const matches = [];
while ((match = langRegex.exec(content)) !== null) {
    matches.push({
        fullMatch: match[0],
        lang: match[1],
        block: match[2]
    });
}

for (const m of matches) {
    const dedupedBlock = deduplicateBlock(m.block);
    const replacement = `${m.lang}: {${dedupedBlock}}`;
    newContent = newContent.replace(m.fullMatch, replacement);
}

fs.writeFileSync('src/lib/i18n.ts', newContent);
console.log('Deduplication complete.');
