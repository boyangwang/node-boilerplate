casper.on('remote.message', function(message) {
    this.echo(message);
});
casper.on('page.error', function(e) {
    this.echo(e);
});
casper.test.begin('Sanity', 1, function suite(test) {
    casper
        .start('https://google.com/', function() {
            test.assertHttpStatus(200);
        })
        .run(function() {
            test.done();
        });
});
