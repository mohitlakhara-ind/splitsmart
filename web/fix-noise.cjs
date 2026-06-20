const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'pages'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove the background noise div
    content = content.replace(/<div\s+className="fixed inset-0 opacity-\[0\.03\] pointer-events-none mix-blend-overlay z-50"\s+style=\{\{\s*backgroundImage:\s*`url\('https:\/\/grainy-gradients\.vercel\.app\/noise\.svg'\)`\s*\}\}\s*\/>/g, '');
    
    fs.writeFileSync(file, content, 'utf8');
});

console.log('Removed noise from files.');
