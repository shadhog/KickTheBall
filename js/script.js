$( document ).ready(function() {
	
	
	var getUrlParameter = function getUrlParameter(sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	};
	
	var mkw = 60;
	//var mkw = getUrlParameter('mkw');


	var winDiv = $('#win');
	var container = document.getElementById('container');
	
	var canvas = document.getElementById('background');
		canvas.width = container.offsetWidth;
		//canvas.height = container.offsetHeight;
		//canvas.height = 700;
		canvas.height = window.innerHeight - $('.header').height() - 5;
		if(canvas.height > 700) canvas.height = 700;
	var c = canvas.getContext('2d');
	console.log(window.innerHeight);

	window.addEventListener('resize', function(event) {
		canvas.width = container.offsetWidth;
		//canvas.height = container.offsetHeight;
		//canvas.height = 700;
		canvas.height = window.innerHeight - $('.header').height() - 5;
		if(canvas.height > 700) canvas.height = 700;
		loop();
	});
	
	
	var grass = new Image();
	grass.src = './images/grass.jpg';
	var ball = new Image();
	ball.src = './images/ball.png';
	var shoe = new Image();
	shoe.src = './images/shoe.png';
	
	
	var centerX = canvas.width / 2,
		centerY = canvas.height / 2,
		radius = 60,
		startSpeed = 20,
		speed = startSpeed,
		avarageSpeed = startSpeed,
		backgroundY = 1,
		distance = 10,
		delta = 10,
		ballY = 1,
		win = (Math.floor(Math.random() * 15) + 5) * delta,
		speedDevide = avarageSpeed/win,
		run = false,
		done = false,
		x,
		y;
		
	if( typeof mkw !== 'undefined') win = mkw;
		
		console.log('>> WIN: ' + win);

	grass.onload = function() {
		//ball.onload = function() {
			c.font = '30px Arial';
			c.textAlign = 'center';
			loop();
		//};
	};
	
var complete = false;
var grassPrecent;
var fieldPrecent;
	
	var grd = c.createRadialGradient(centerX + 1, centerY + 1, 0, centerX - 4 , centerY - 4 , radius);
		grd.addColorStop(0, '#00000000');
		grd.addColorStop(0.40, '#00000000');
		grd.addColorStop(0.85, '#0000005f');
		grd.addColorStop(1, '#00000091');
	
	function loop() {
		//c.clearRect(0, 0, canvas.width, canvas.height);
		if(run) {
			backgroundY += speed;
			ballY += speed;
		}

		c.drawImage(grass, 0, backgroundY, canvas.width, canvas.height);
		c.drawImage(grass, 0, backgroundY - canvas.height , canvas.width, canvas.height);
		if(backgroundY >= canvas.height) {
			backgroundY = 0;
			distance += delta;
		}

		
		
		grassPrecent = ((CalcPrecent(backgroundY, 1, canvas.height)/10) + distance - delta);
		fieldPrecent = CalcPrecent(grassPrecent, 0, win-2);
		
		//console.log('>> ' + (15-((fieldPrecent/99)*15)));
		
		//if(distance > win*0.75 && run) {
		if(distance > win - 30 && run) {
			//avarageSpeed = (win-distance + delta) * speedDevide;
			avarageSpeed = (startSpeed-(fieldPrecent/99)*(startSpeed+0.5));
			if(speed > avarageSpeed) {
				speed *= 0.99;
				//speed *= 0.9928;
			}
			else {
				speed = avarageSpeed;
				//speed = (startSpeed-(fieldPrecent/99)*startSpeed);
			}
		}
		
		if(canvas.height < 700 && fieldPrecent > 95) {
			speed *= 0.97;
		}
		
		if(fieldPrecent > 100) {
		//if(distance == win && backgroundY > canvas.height) {
			run = false;
			done = true;
		}
	
		
		if(backgroundY > centerY) lineColor = 'yellow';
		else lineColor = '#ffffff';
		//backgroundY = 50;
		c.save();
			c.beginPath();
				c.moveTo(0, backgroundY);
				c.lineTo(centerX - 60, backgroundY);
				c.moveTo(centerX + 60, backgroundY);
				c.lineTo(canvas.width, backgroundY);
				c.strokeStyle = lineColor;
				c.lineWidth = 4;
					c.shadowBlur = 10;
					c.shadowColor = '#000000';
					c.shadowOffsetX = 0;
					c.shadowOffsetY = 5;
				c.stroke();
			c.closePath();
		c.restore();
		
		c.save();
			c.fillStyle = lineColor;
				c.shadowBlur = 10;
				c.shadowColor = '#000000';
				c.shadowOffsetX = 0;
				c.shadowOffsetY = 5;
			c.fillText(distance + 'm',centerX, backgroundY + 10);
		c.restore();
		
		c.save();
			c.save();
				c.beginPath();
					c.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);			
						c.shadowBlur = 50;
						c.shadowColor = '#000000';
						c.shadowOffsetX = 0;
						c.shadowOffsetY = 0;
					c.fill();
				
				c.closePath();

					
			c.restore();
			c.clip();
			c.drawImage(ball, centerX - ball.width/2,  centerY - radius - ballY);
			c.drawImage(ball, centerX - ball.width/2,  centerY - radius - ballY + ball.height);
			if(ballY >= ball.height) ballY = 0;
			
			c.fillStyle = grd;
				
			c.fill();

		c.restore();
		
		if(!run && distance <= 10) {
			c.save();
				c.beginPath();
					//c.arc(x - shoe.width/2, y - shoe.height/2, radius, 0, 2 * Math.PI, false);			
					c.shadowBlur = 75;
					c.shadowColor = '#000000';
					c.shadowOffsetX = 0;
					c.shadowOffsetY = 0;
					c.drawImage(shoe, x - shoe.width/2 , y - shoe.height/2);
					//c.fillStyle = '#00000000';
					c.fill();
				c.closePath();
			c.restore();
		}
		
		
			
		if(distance == win && backgroundY > canvas.height/1.7 && !complete) {
			winDiv.html('<div>WIN! ' + win + '<br><br><a href="#" class="button">CTA</a></div>').fadeIn();
			complete = true;
		}
		
		
		if(!done) requestAnimationFrame(loop);
	}
	
	
	canvas.addEventListener('mousemove', mouseMove);
	
	var oldy = 0;
	function mouseMove(e) {
		var elementOffset = $(this).offset();
		x = e.pageX - elementOffset.left;
		y = e.pageY - elementOffset.top;
		//console.log('>> X: ' + x + ' >> Y: ' + y);

		if(run == false) {
			if (y < oldy) {
				if(x > centerX - radius - shoe.width*0.1 && x < centerX + radius + shoe.width*0.1 &&
				   y > centerY - radius - shoe.height*0.25 && y < centerY + radius + shoe.height*0.25) {
					run = true;
					canvas.removeEventListener('mousemove', mouseMove);
				}
			} 
		}
		oldy = y;
	}
	
	function CalcPrecent(input, min, max) {
		var range = max - min;
		var i = input - min;
		return ( (i * 100) / range );
	}
	

});

