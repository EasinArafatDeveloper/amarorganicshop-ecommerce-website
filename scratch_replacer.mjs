import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            if (dirPath.endsWith('.jsx') || dirPath.endsWith('.js')) {
                callback(dirPath);
            }
        }
    });
}

let modifiedCount = 0;

walkDir('./src', (filePath) => {
    let original = fs.readFileSync(filePath, 'utf8');
    let content = original;

    // Secondary (Orange) Theme Replacements
    content = content.replace(/bg-\[\#f39200\]/g, 'bg-secondary');
    content = content.replace(/text-\[\#f39200\]/g, 'text-secondary');
    content = content.replace(/border-\[\#f39200\]/g, 'border-secondary');
    content = content.replace(/ring-\[\#f39200\]/g, 'ring-secondary');
    content = content.replace(/hover:text-\[\#f39200\]/g, 'hover:text-secondary');
    content = content.replace(/hover:border-\[\#f39200\]/g, 'hover:border-secondary');
    
    // Exact dark orange hovers previously used
    content = content.replace(/hover:bg-\[\#d88200\]/g, 'hover:bg-secondary hover:brightness-90');
    content = content.replace(/hover:bg-\[\#e08600\]/g, 'hover:bg-secondary hover:brightness-95');
    
    // Light secondary backgrounds
    content = content.replace(/\bbg-orange-50\b/g, 'bg-secondary/10');
    content = content.replace(/\bring-orange-50\b/g, 'ring-secondary/10');
    content = content.replace(/\bshadow-orange-100\b/g, 'shadow-secondary/20');

    // Primary (Green) Theme Replacements
    content = content.replace(/\bbg-green-600\b/g, 'bg-primary');
    content = content.replace(/\btext-green-600\b/g, 'text-primary');
    content = content.replace(/\bborder-green-600\b/g, 'border-primary');
    content = content.replace(/\bring-green-600\b/g, 'ring-primary');
    content = content.replace(/\bshadow-green-600\/20\b/g, 'shadow-primary/20');
    content = content.replace(/\bshadow-green-500\/30\b/g, 'shadow-primary/30');
    content = content.replace(/\bbg-gradient-to-tr from-green-400 to-green-600\b/g, 'bg-primary');

    // Primary hovers
    content = content.replace(/hover:bg-green-700/g, 'hover:bg-primary hover:brightness-90');
    content = content.replace(/hover:bg-green-500/g, 'hover:bg-primary hover:brightness-110');
    content = content.replace(/hover:text-green-700/g, 'hover:text-primary scale-[0.98]');
    content = content.replace(/hover:text-green-600/g, 'hover:text-primary');
    content = content.replace(/hover:border-green-200/g, 'hover:border-primary/30');

    // Light primary backgrounds
    content = content.replace(/\bbg-green-50\b/g, 'bg-primary/10');
    content = content.replace(/\bbg-green-100\b/g, 'bg-primary/20');
    content = content.replace(/\btext-green-700\b/g, 'text-primary');
    content = content.replace(/\btext-green-800\b/g, 'text-primary');
    content = content.replace(/\bborder-green-200\b/g, 'border-primary/20');
    
    // Some random green elements missed
    content = content.replace(/\bbg-\[\#8ec63f\]\b/g, 'bg-primary opacity-80');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
        modifiedCount++;
    }
});

console.log(`\nReplacement complete. Modified ${modifiedCount} files.`);
