	class Account {
		constructor(balance) {
			this.balance = balance;
		}
		getBalance() {
			return this.balance;
		}
		setBalance(bal) {
			this.balance = bal;
		}
		increase(incBal) {
			var bal = this.getBalance() + incBal;
			this.setBalance(bal);
		}
		decrease(decBal) {
			var bal = this.getBalance() - decBal;
			this.setBalance(bal);
		}		
	}
	class Game {
		horses = [];
		horse_scores = []; // [5, 8, 10, 2] - cummulative points for each horse
		has_winner = false;
		player_bet = null;
		selected_horse_id = null;
		winning_horse_id = null;
		i = 0;
		// TODO pass in an array of horses
		startGame() {
			let h1 = new Horse();
			h1.name = "Horse 1";
			let h2 = new Horse();
			h2.name = "Horse 2";
			let h3 = new Horse();
			h3.name = "Horse 3";
			let h4 = new Horse();
			h4.name = "Horse 4";

			// store all the horses in an array for use later
			this.horses.push(h1);
			this.horses.push(h2);
			this.horses.push(h3);
			this.horses.push(h4);

			// loop through, generating a number each time and seeing if any horse scored 10
			// ie. has_winner = true
			while (this.has_winner == false) {

				// move the horses along track
				h1.setPosition();
				h2.setPosition();
				h3.setPosition();
				h4.setPosition();

				this.horse_scores = [h1.points, h2.points, h3.points, h4.points];
				this.has_winner = this.horse_scores.includes(10);
			}

		}
		getI() {
			return this.i++;
		}
	};

	class Horse {
		points = 0; // [0, 1, 0, 0, 1] - points received each movement until total 10
		name = "";
		generateRandomNum() {
			return Math.random();
		}
		setPosition() {
			let num = this.generateRandomNum();

			// if above .5 horse gets 1 point
			if(num > .5) {
				this.points += 1;

				// store each score
				this.scores += this.points + ",";
			} else {
				this.scores += 0 + "," ;
				this.points += 0;
			}
		}
		getScores() {
			return this.scores.split(",");
		}

	};


	/**
	** Show the horse icon moving on page
	** str_id - id of the element holding icon
	** horse_scores_array - array containing scores each time random number generated for horse
		ex: horse_scores[1, 0, 0, 1, 0]
	** array_pos - the particular point in the array that holds the score
	**/
	function showMovement(game, str_id, horse_scores_array, array_pos){
		
		var hasWin = false;
		//console.log('i is:' + count);
		if(array_pos < horse_scores_array.length){

			let pos = horse_scores_array[array_pos];
			//console.log('position: ' + pos);

			if(pos > 0) {

				document.getElementById(str_id).style.paddingLeft = pos + "0%";

				// when we have a winner change text to green
				if((pos + "0%") == "100%"){
					
					hasWin = true;
					
					//document.getElementById(str_id).style.color = "green";
					//document.getElementById(str_id).style.fontWeight = "bold";
					
					var winner = document.getElementById('winning-horse');
					winner.innerHTML = "Winner is: " + str_id;
					winner.classList.add('alert');
					winner.classList.add('alert-success');
					
					// compare the winning horse and selected
					// if same then increase balance by bet

					game.winning_horse_id = str_id
					
					// @TODO NOte: do a substring myhorseX to make this work
					var sh = game.selected_horse_id.substring(2);
					if (sh == game.winning_horse_id) {
						// FOR NOW JUST GIVE WINNER BACK THEIR BET * 2
						act.increase(game.player_bet * 2);
					} else {
						//act.decrease(game1.player_bet);
					}

					// update balance in view
					document.getElementById('bal').innerHTML = act.getBalance() + " SAT";

				}
			}
		}
		
		if (hasWin) {
			clearInterval(gallopIntvalId);
			gallopIntvalId = null;
		}
	}


	/**
	** Show the horse selection and start the game
	**/
	function pickHorse(chosen_horse, icon_id) {
		
		// remove any existing selections
		var selected_btn_coll = document.getElementsByClassName("pick-btn");

		for (let i = 0; i < selected_btn_coll.length; i++) {

			selected_btn_coll[i].classList.remove('btn-warning');
			selected_btn_coll[i].classList.add('btn-primary');
		
		}
		
		
		// remove any sprite selected
		var sprite_selected_coll = document.getElementsByClassName("horse");

		for (let i = 0; i < sprite_selected_coll.length; i++) {

			sprite_selected_coll[i].firstChild.classList.remove('icon_selected');
			sprite_selected_coll[i].firstChild.classList.add('foo');
		
		}
		
		// chose horse
		var elem = document.getElementById('selected-horse');
		elem.innerHTML = "You chose: " + chosen_horse.value;
		elem.classList.add('alert');
		elem.classList.add('alert-danger');
		
		var selected_btn = document.getElementById(chosen_horse.id);
		selected_btn.classList.remove('btn-primary');
		selected_btn.classList.add('btn-warning');
		
		// horse selected Button
		selected_btn_horse = selected_btn;
		
		var foo = document.getElementById(icon_id);
		foo.classList.remove('foo');
		foo.classList.add('icon_selected');


		// horse on track
		selected_track_horse = foo;


	}
	
	
	function setAmt(selectObject) {
		var betValue = selectObject.value;  
		
		// amt of bet
		document.getElementById('bet').innerHTML = betValue + " SAT";
		
		// decrease balance. update object
		document.getElementById('bal').innerHTML = (act.balance - betValue) - 1 + " SAT";
		
		act.decrease(parseInt(betValue) + 1);

	}
	
	function start() {
		
		// check which horse was selected
		var selected_btn_coll = document.getElementsByClassName("pick-btn");

		// get the amount of the bet
		var betAmt = document.getElementById("sat-amt").value;
	
	
		let game1 = new Game();

		for (let i = 0; i < selected_btn_coll.length; i++) {

			// check if btn has class btn-warning
			if (selected_btn_coll[i].classList.contains('btn-warning')) {

				game1.selected_horse_id = selected_btn_coll[i].id;
			}
		
		}

		if(game1.selected_horse_id == null || parseInt(betAmt) == 0) {
			return;
		}

		//var btn = document.getElementById("play");

		game1.player_bet = parseInt(betAmt);
		game1.startGame();
		
		//btn.disabled = true;
		startRace(game1);
	}


	/**
	** Do the horse movement logic every 1 second
	**/
	function startRace(game){

		gallopIntvalId = setInterval(gallop, 1000, game);

	}


	function gallop(g){

		// the number movements made
		let count = g.getI();
		//console.log('i is:' + count);

		showMovement(g, 'horse1', g.horses[0].getScores(), count);
		showMovement(g, 'horse2', g.horses[1].getScores(), count);
		showMovement(g, 'horse3', g.horses[2].getScores(), count);
		showMovement(g, 'horse4', g.horses[3].getScores(), count);
	}


	let act = new Account(10);

	// interval of gallop
	let gallopIntvalId;
	
	// @TODO for now set 2 global var for UI reset
	let selected_track_horse;
	let selected_btn_horse;


	// reset UI
	function restUi() {
		
		document.getElementById('horse1').style.paddingLeft = 0;
		document.getElementById('horse2').style.paddingLeft = 0;
		document.getElementById('horse3').style.paddingLeft = 0;
		document.getElementById('horse4').style.paddingLeft = 0;

		document.getElementById('winning-horse').innerHTML = '';
		document.getElementById('selected-horse').innerHTML = '';
		
		// bet value reset		
		document.getElementById("sat-amt").selectedIndex = 0;

		// bet value reset		
		document.getElementById("bet").innerHTML = '';

		// horse sprite on track
		selected_track_horse.classList.remove('icon_selected');
		selected_track_horse.classList.add('foo');
		
		// horse button
		selected_btn_coll = document.getElementsByClassName("pick-btn");

		for (let i = 0; i < selected_btn_coll.length; i++) {

			selected_btn_coll[i].classList.remove('btn-warning');
			selected_btn_coll[i].classList.add('btn-primary');
		}


		// play Button
		//document.getElementById("play").disabled = false;			
	}

	function newGame() {

		restUi();

	}


