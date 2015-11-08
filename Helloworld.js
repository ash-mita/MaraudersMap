var http = require("http"),
fs = require('fs'),
url = require('url');
	http.createServer(function (request, response) {
		var url_parts = url.parse(request.url, true);
		var queryObject = url_parts.query;
		switch(url_parts.pathname) {
			case '/':
				show_login(response);
				break;
			case '/map':
				show_map(response);
				break;
			case '/createuser':
				break;
			case '/getlocations':
				console.log('Receiving request...');
				var callback = function(err, result) {
					response.writeHead(200, {
						'Content-Type' : 'x-application/json'
					});
					console.log('json', result);
					response.end(result);
				};
				getSQL(callback, 'SELECT * FROM user_location');
				break;
			case '/savelocation':
				console.log('Receiving request...');
				var callback = function(err, result) {
					response.writeHead(200, {
						'Content-Type' : 'x-application/json'
					});
					console.log('json', result);
					response.end(result);
				};
				var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
				
				getSQL(callback, "INSERT INTO `tracker`.`user_location` (`latitude`, `longitude`, `time_stamp`, `user_id`) VALUES (" + queryObject.lat + ", " + queryObject.lon + ", '" + date + "', " + queryObject.id +")");
				break;
			case '/getid':
				console.log('Receiving request...');
				var callback = function(err, result) {
					response.writeHead(200, {
						'Content-Type' : 'x-application/json'
					});
					console.log('json', result);
					response.end(result);
				};
				getSQL(callback, "SELECT id FROM user WHERE username = '"+ queryObject.username + "'" );
				
			default:
				show_login(response);
		}

		function show_login(response) {
			fs.readFile('Views/Login.html', function (err, html) {
				if (err) {
				throw err;
				}
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write(html);
			response.end();
			});
		}
		
		function show_map(response) {
			fs.readFile('Views/Map.html', function (err, html) {
				if (err) {
				throw err;
				}
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write(html);
			response.end();
			});
		}
		function getSQL(callback, query) {
			var mysql = require('mysql');
			var connection = mysql.createConnection ({
				host:'ec2-54-225-199-108.compute-1.amazonaws.com:5432',
				user:'dcoafuayimenim',
				password: 'nEdkKRAl2jbP4ldwejt7v0OHds',
				database : 'daad1ukmfam4uc',
			});
			connection.connect();
			var json = '';
			connection.query(query, function (err, results, fields) {
				if (err)
					return callback(err, null);
				
				console.log('The query-result is :', results[0]);
				
				json = JSON.stringify(results);
				connection.end();
				console.log('JSON-result', json);
				callback(null, json);
			});
		}
	}).listen(process.env.PORT || 8080);
console.log("Server running at http://127.0.0.1:8081/");
