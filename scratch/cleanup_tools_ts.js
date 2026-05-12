import fs from 'fs';
import path from 'path';

const toolsDir = 'src/components/tools';
const files = fs.readdirSync(toolsDir);

files.forEach(file => {
    if (!file.endsWith('.tsx')) return;
    const filePath = path.join(toolsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Fix Blob part
    content = content.replace(/new Blob\(\[pdfBytes\]/g, 'new Blob([pdfBytes as any]');
    
    // Fix page.render - variant 1
    content = content.replace(/page\.render\(\{ canvasContext: context, viewport \}\)/g, 'page.render({ canvasContext: context as any, viewport } as any)');
    
    // Remove unused React imports
    content = content.replace(/import React, \{/g, 'import {');
    // If it's just import React from 'react';
    content = content.replace(/import React from 'react';\n/g, '');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`Cleaned up ${file}`);
    }
});
