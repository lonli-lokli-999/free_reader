	'use strict';

const express	= require('express');
const app		= express();
const path		= require( 'path' );
const flibapi	= require('./modules/flibapi');
const port		= process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use( express.static(path.join(__dirname, 'public') ) );

app.use( '/js', express.static( __dirname + '/node_modules/vue/dist') );
app.use( '/js', express.static( __dirname + '/node_modules/jszip/dist') );
app.use( '/css', express.static( __dirname + '/node_modules/font-awesome/css') );
app.use( '/fonts', express.static( __dirname + '/node_modules/font-awesome/fonts') );


app.get('/', (req, res) => {
	res.render('index');
});

app.get('/search/:bookname/', (req, res) => {
	let
		{bookname} = req.params;

	flibapi.search( bookname )
		.then( result => {
			res.send( JSON.stringify( result ) );
		} )
});

app.get('/read/:id/', (req, res) => {
	let
		{id} = req.params;

	flibapi.read( id )
		.then( result => {
			res.send( result );
		} )
});

app.listen(port, () => {
	console.log( __dirname );
	console.log( `Listening Port http://localhost:${port}` );
});
