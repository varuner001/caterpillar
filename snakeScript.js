$(document).ready(function(){
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	

	//Painting the canvas
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, w, h);
	ctx.strokeStyle = "black";
	ctx.strokeRect(0, 0, w, h);

	//Snake element
	var snake;
	var cw = 10; // width of each snake element
	var speed;
	var direction;
	var food;
	var increaseSpeedLength;


	function init()
	{
		direction = "right"; //default direction
		speed = 150;
		increaseSpeedLength = 9;
		createSnake();
		create_food();

		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, speed);
	}

	init();

	function createSnake() {
		var length = 5;
		snake = [];
		for(var i=length-1; i>=0; i--) {
			snake.push({x:i, y:0});
		}
	}

	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
		};
		//This will create a cell with x/y between 0-44
		//Because there are 45(450/10) positions accross the rows and columns
	}




	//paint the snake



	function paint()
	{
		// paint the background at each point
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);

		//Movement of the snake
		var nx = snake[0].x;
		var ny = snake[0].y;
		
		if(direction === "right") nx++;
		else if(direction === "left") nx--;
		else if(direction === "up") ny--;
		else if(direction === "down") ny++;		

		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake))
		{
			//restart game
			init();
			//Lets organize the code a bit now.
			return;
		}
		

		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};			
			//Create new food
			create_food();
		}
		else
		{
			var tail = snake.pop(); //pops out the last cell
			tail.x = nx; tail.y = ny;
		}
		snake.unshift(tail);
		if(snake.length == increaseSpeedLength) increaseSpeed();




		for(var i = 0; i < snake.length; i++)
		{
			var c = snake[i];
			//10 px wide snake cells
			paint_cell(c.x, c.y);
		}
		paint_cell(food.x, food.y);
	}

	function paint_cell(x, y)
	{
		ctx.fillStyle = "blue";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}

	function check_collision(x, y, array)
	{
		//This function will check if the provided x/y coordinates exist
		//in an array of cells or not
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}

	function increaseSpeed() {
		speed -= 5;
		increaseSpeedLength += 4;
		clearInterval(game_loop)
		game_loop = setInterval(paint, speed);
	}

	//keyboard controls
	$(document).keydown(function(e){
		var key = e.which;
		//We will add another clause to prevent reverse gear
		if(key == "37" && direction != "right") direction = "left";
		else if(key == "38" && direction != "down") direction = "up";
		else if(key == "39" && direction != "left") direction = "right";
		else if(key == "40" && direction != "up") direction = "down";
	})	



})