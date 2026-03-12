const fs = require('fs');
const path = require('path');

// Files that need simple import updates (CMS routes that just fetch data)
const cmsRoutes = [
  'app/api/cms/about/route.js',
  'app/api/cms/contact/route.js',
  'app/api/cms/hero/route.js',
  'app/api/cms/services/route.js',
  'app/api/cms/services/[id]/route.js',
  'app/api/cms/settings/route.js',
  'app/api/cms/social/route.js',
  'app/api/cms/social/[id]/route.js',
  'app/api/bookings/[id]/route.js',
  'app/api/dashboard/stats/route.js'
];

cmsRoutes.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace import statement
    content = content.replace(
      "import { prisma } from '@/lib/prisma';",
      "import { query } from '@/lib/db';"
    );
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Updated: ${filePath}`);
  } else {
    console.log(`✗ Not found: ${filePath}`);
  }
});

console.log('\nImport statements updated. Note: You still need to update the Prisma queries to SQL.');
console.log('This script only updated the import statements.');
