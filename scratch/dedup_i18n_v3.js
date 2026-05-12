import fs from 'fs';

const content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

function cleanBlock(block) {
    const lines = block.split('\n');
    const keys = new Set();
    const result = [];
    
    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        const match = line.match(/['"](.+?)['"]\s*:/);
        if (match) {
            const key = match[1];
            if (!keys.has(key)) {
                keys.add(key);
                result.unshift(line);
            }
        } else {
            result.unshift(line);
        }
    }
    return result.join('\n');
}

const enStart = content.indexOf('en: {');
const idStart = content.indexOf('id: {');
const esStart = content.indexOf('es: {');
const end = content.lastIndexOf('}');

const enBlock = content.substring(enStart + 5, idStart).trim().replace(/ \},$/, '');
const idBlock = content.substring(idStart + 5, esStart).trim().replace(/ \},$/, '');
const esBlock = content.substring(esStart + 5, end).trim();

const newContent = `export const translations = {
  en: {
${cleanBlock(enBlock)}
  },
  id: {
${cleanBlock(idBlock)}
  },
  es: {
${cleanBlock(esBlock)}
  }
};
`;

fs.writeFileSync('src/lib/i18n.ts', newContent);
console.log('Final deduplication complete.');
