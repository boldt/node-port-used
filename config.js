var config = {};
config.port = 8000;

config.tests = [
    {port: 80, name: 'Apache'},
    {port: 8080, name: 'Tomcat'}
];

module.exports = config;
