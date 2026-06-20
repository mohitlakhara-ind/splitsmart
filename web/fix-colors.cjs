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

const files = [
    ...walk(path.join(__dirname, 'pages')),
    ...walk(path.join(__dirname, 'components')),
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace bg-white (but not bg-white/something)
    content = content.replace(/\bbg-white\b(?!\/)/g, 'bg-[var(--color-fintech-bg-alt)]');
    
    // Replace bg-slate-50
    content = content.replace(/\bbg-slate-50\b(?!\/)/g, 'bg-[var(--color-fintech-bg)]');
    
    // Replace bg-slate-100
    content = content.replace(/\bbg-slate-100\b(?!\/)/g, 'bg-[var(--color-fintech-border)]');
    
    // Replace text-slate-XYZ
    content = content.replace(/\btext-slate-[789]00\b/g, 'text-[var(--color-fintech-text)]');
    content = content.replace(/\btext-slate-[456]00\b/g, 'text-[var(--color-fintech-text-muted)]');
    
    // Replace border-slate-XYZ
    content = content.replace(/\bborder-slate-[123]00\b/g, 'border-[var(--color-fintech-border)]');

    fs.writeFileSync(file, content, 'utf8');
});

console.log('Fixed colors in ' + files.length + ' files.');
