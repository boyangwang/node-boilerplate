const plan = require('flightplan');
const packageJson = require('./package.json');

plan.target('staging', {
    host: 'playground.wangboyang.com',
    port: 22,
    username: 'root',
    privateKey: 'C:\\Users\\wangb\\.ssh\\id_rsa',
});
const gitDir = `/var/www/${packageJson.name}`;
plan.remote(['clean-deploy', 'deploy', 'start'], (remote) => {
    remote.sudo(`npm --prefix ${gitDir} stop`, { failsafe: true });
});
plan.remote(['clean-deploy'], (remote) => {
    remote.rm(`-rf -- ${gitDir}`);
    remote.sudo(`cd /var/www && git clone ${packageJson.repository.url.substr(4)}`);
});
plan.remote(['clean-deploy', 'deploy'], (remote) => {
    remote.sudo(`cd ${gitDir} && git pull origin master`);
    remote.sudo(`npm --prefix ${gitDir} run full-build`);
});
plan.remote(['clean-deploy', 'deploy', 'start'], (remote) => {
    remote.sudo(`npm --prefix ${gitDir} start`);
});
