const fs = require('fs');
const path = require('path');

const ignore = ['node_modules', '.git'];

function tree(dir, prefix = '') {
  const files = fs.readdirSync(dir);
  const filteredFiles = files.filter((file) => !ignore.includes(file));

  filteredFiles.forEach((file, index) => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    const isLast = index === filteredFiles.length - 1;

    console.log(`${prefix}${isLast ? '└─' : '├─'} ${file}`);

    if (stats.isDirectory()) {
      tree(fullPath, `${prefix}${isLast ? '  ' : '│ '}`);
    }
  });
}

tree(process.cwd());
