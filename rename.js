const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\cosmo\\job-apply\\splitwiser';

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            if (['node_modules', '.git', '.next', '.expo', 'android', 'ios'].includes(name)) return;
            walkSync(filePath, callback);
        }
    });
}

walkSync(dir, function(filePath) {
    if (!['.js', '.ts', '.tsx', '.jsx', '.html', '.md', '.json', '.yaml', '.yml', '.css'].includes(path.extname(filePath))) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content
        .replace(/Splitwiser/g, 'Splitwiser')
        .replace(/splitwiser/g, 'splitwiser')
        .replace(/com\.mohitlakhara\.splitwiser/g, 'com.mohitlakhara.splitsmart') // Revert
        .replace(/splitsmart-app-18342/g, 'splitsmart-app-18342') // Revert
        .replace(/splitsmart-gmfd/g, 'splitsmart-gmfd') // Revert
        .replace(/splitsmart-backend/g, 'splitsmart-backend'); // Revert
        
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('Updated', filePath);
    }
});
