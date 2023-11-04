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
		horse_scores = [];
		has_winner = false;
		player_bet = null;
		selected_horse_id = null;
		winning_horse_id = null;
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
	};

	class Horse {
		points = 0;
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



	let game1 = new Game();
	game1.startGame();
	
	let act = new Account(10);

	// loop through scores array
	let horse1 = game1.horses[0].getScores();
	let horse2 = game1.horses[1].getScores();
	let horse3 = game1.horses[2].getScores();
	let horse4 = game1.horses[3].getScores();

	let i=0;


	function getI() {
		return i++;
	}

	function gallop(){

		let count = getI();

		showMovement('horse1', horse1, count);
		showMovement('horse2', horse2, count);
		showMovement('horse3', horse3, count);
		showMovement('horse4', horse4, count);
	}


	function newGame() {
		location.reload();
	}


	/**
	** Show the horse icon moving on page
	** str_id - id of the element holding icon
	** horse_scores_array - array containing scores each time random number generated for horse
	** array_pos - the particular point in the array that holds the score
	**/
	function showMovement(str_id, horse_scores_array, array_pos){
		if(array_pos < horse_scores_array.length){

			let pos = horse_scores_array[array_pos];
			//console.log('position: ' + pos);

			if(pos > 0) {
				document.getElementById(str_id).style.paddingLeft = pos + "0%";

				// when we have a winner change text to green
				if((pos + "0%") == "100%"){
					document.getElementById(str_id).style.color = "green";
					document.getElementById(str_id).style.fontWeight = "bold";
					
					var winner = document.getElementById('winning-horse');
					winner.innerHTML = "Winner is: " + str_id;
					winner.classList.add('alert');
					winner.classList.add('alert-success');
					
					// compare the winning horse and selected
					// if same then increase balance by bet

					game1.winning_horse_id = str_id
					
					// @TODO NOte: do a substring myhorseX to make this work
					var sh = game1.selected_horse_id.substring(2);
					if (sh == game1.winning_horse_id) {
						// FOR NOW JUST GIVE WINNER BACK THEIR BET * 2
						act.increase(game1.player_bet * 2);
					} else {
						//act.decrease(game1.player_bet);
					}

					// update balance in view
					document.getElementById('bal').innerHTML = act.getBalance() + " SAT";

				}
			}
		}
	}

	/**
	** Do the horse movement logic every 1 second
	**/
	function startRace(){

		setInterval(gallop, 1000);

	}


	/**
	** Show the horse selection and start the game
	**/
	function pickHorse(chosen_horse, icon_id) {
		//console.log('horse is: ' + chosen_horse);
		// chose horse
		var elem = document.getElementById('selected-horse');
		elem.innerHTML = "You chose: " + chosen_horse.value;
		elem.classList.add('alert');
		elem.classList.add('alert-danger');
		
		var selected_btn = document.getElementById(chosen_horse.id);
		selected_btn.classList.remove('btn-primary');
		selected_btn.classList.add('btn-warning');
		
		var foo = document.getElementById(icon_id);
		foo.classList.remove('foo');
		foo.classList.add('icon_selected');

		game1.selected_horse_id = chosen_horse.id;

	}
	
	
	function setAmt(selectObject) {
		var betValue = selectObject.value;  
		
		// amt of bet
		document.getElementById('bet').innerHTML = betValue + " SAT";
		
		// decrease balance. update object
		document.getElementById('bal').innerHTML = (10 - betValue) - 1 + " SAT";
		
		act.decrease(parseInt(betValue) + 1);

		game1.player_bet = parseInt(betValue);
	}
	
	function start() {
		
		var btn = document.getElementById("play");
		
		btn.disabled = true;
		startRace();
	}
