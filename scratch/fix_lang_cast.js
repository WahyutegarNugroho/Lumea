import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else {
            results.push(fullPath);
        }
    });
    return results;
}

const files = walk('src/pages/[...lang]');
files.filter(f => f.endsWith('.astro')).forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    // Match lang={lang} where lang is exactly that
    let newContent = content.replace(/lang=\{lang\}/g, 'lang={lang as any}');
    if (content !== newContent) {
        fs.writeFileSync(f, newContent);
        console.log(`Updated ${f}`);
    }
});
