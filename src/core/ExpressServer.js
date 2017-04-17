"use strict";

import express from 'express';
import expressWs from 'express-ws';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import debug from 'debug';
import http from 'http';



/**
 *
 * Create a HTTP-Server with Express and a WebSocket-Server with ws.
 *
 *  * @TODO: Check if compression https://github.com/websockets/ws#websocket-compression is really disabled?
 */
export default class ExpressServer {

  constructor(param) {

    this.port = param.port || 3000;
    this.config = param.config;
    this.app = express();

    // Create HTTP server
    this.server = http.createServer(this.app);

    this.server.listen(this.config.server.port);
    this.server.on('error', this.onError.bind(this));
    this.server.on('listening', this.onListening.bind(this));

    //const index = require('./routes/index');

    let express_ws = expressWs(this.app, this.server, {
      perMessageDeflate: false
    });
    this.app = express_ws.app;

    // view engine setup
    this.app.set('views', path.join(__dirname, '../../public/views'));
    this.app.set('view engine', 'jade');

    // uncomment after placing your favicon in /public
    //this.app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    //this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, '../../public')));



    // Root route
    this.app.get('/', (req, res, next) => {
      res.render('index', { title: 'VisionLord', mydata: JSON.stringify(this.config) });
    });

    // WebSocket route
    this.app.ws(this.config.server.websocket.path, (ws, req) => {
      console.log('WebSocket opened');

      ws.send("Hello my friend FUCK SHIT");

      ws.on('message', msg => {
        ws.send(msg);
      });

      ws.on('text', msg => {
        ws.send(msg);
      });

      ws.on('error', msg => {
        ws.send(msg);
      });

      ws.on('close', () => {
        console.log('WebSocket closed');
        console.log(this.config.log.separator);
      });
    });


    // Catch 404 and forward to error handler
    this.app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // Error handler
    this.app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // Render the error page
      res.status(err.status || 500);
      res.render('error');
    });


    console.log('Started Server: Express + WebSocket on port', this.config.server.port);
    console.log(this.config.log.separator);
  }



  // Event listener for HTTP server "listening" event
  onListening() {
    var addr = this.server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }


  // Event listener for HTTP server "error" event
  onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + this.port : 'Port ' + this.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

}