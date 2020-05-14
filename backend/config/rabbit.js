import amqp from 'amqplib/callback_api';
const CONN_URL = 'amqp://prlxsowt:pfsmbEMuL5cvirDWLujyosdGAi6yyR_p@lionfish.rmq.cloudamqp.com/prlxsowt' 

let ch = null;
amqp.connect(CONN_URL, function (err, conn) {
   conn.createChannel(function (err, channel) {
      ch = channel;
   });
});
