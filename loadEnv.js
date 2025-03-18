require('dotenv').config();
const fs = require('fs');
const yaml = require('js-yaml');

const configPath = './_config.yml';
const config = yaml.load(fs.readFileSync(configPath, 'utf8'));

if (process.env.GIT_DEPLOY_KEY) {
  config.deploy.repo = config.deploy.repo.replace(
    '${GIT_DEPLOY_KEY}',
    process.env.GIT_DEPLOY_KEY
  );
  fs.writeFileSync(configPath, yaml.dump(config));
  console.log('🔑 Injected environment variables into _config.yml');
}

// Deploy Hexo
const { execSync } = require('child_process');
try {
  execSync('hexo clean && hexo generate && hexo deploy', { stdio: 'inherit' });
  console.log('🚀 Hexo deployed successfully');
} catch (error) {
  console.error('❌ Deployment failed', error);
}

config.deploy.repo = config.deploy.repo.replace(
  process.env.GIT_DEPLOY_KEY,
  '${GIT_DEPLOY_KEY}'
);
fs.writeFileSync(configPath, yaml.dump(config));
console.log('🔄 Restored placeholder in _config.yml');
