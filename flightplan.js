const plan = require('flightplan');
const package = require('./package.json');

plan.target('staging', {
    host: 'playground.wangboyang.com',
    port: 22,
    username: 'root',
    privateKey: 'C:\\Users\\wangb\\.ssh\\id_rsa',
});
const gitDir = `/var/www/${package.name}`;
plan.remote(['clean-deploy', 'deploy', 'start'], (remote) => {
    remote.sudo(`npm --prefix ${gitDir} stop`, { failsafe: true });
});
plan.remote(['clean-deploy'], (remote) => {
    remote.rm(`-rf -- ${gitDir}`);
    remote.sudo('cd /var/www && git clone ${package.repository.url}');
});
plan.remote(['clean-deploy', 'deploy'], (remote) => {
    remote.sudo(`cd ${gitDir} && git pull origin master`);
    remote.sudo(`npm --prefix ${gitDir} run full-build`);
});
plan.remote(['clean-deploy', 'deploy', 'start'], (remote) => {
    remote.sudo(`npm --prefix ${gitDir} start`);
});