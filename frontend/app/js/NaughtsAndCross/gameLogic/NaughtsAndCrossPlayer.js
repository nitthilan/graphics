MyAppServices.service('NaughtsAndCrossPlayer', ['NACCoinAndGrid',function(NACCoinAndGrid){
	'use strict';
	
	this.init = function(){
		this.lastPlayer = "Player2";
		this.lastPlayedPosition = [0,0,0];
		this.newPositionSet = false;
	};

	this.getCurrentPlayer = function(){
		if(this.lastPlayer === "Player1") return "Player2";
		else return "Player1";
	};
	
	this.setPositionAndToggle = function(i,j,k){
		var coinType = "Naught";
		if(this.getCurrentPlayer() === "Player1"){
			coinType = "Cross";
		}
		this.lastPlayedCoin = NACCoinAndGrid.addCoin(coinType, [i,j,k]); 
		this.lastPlayedPosition = [i, j, k];
		this.lastPlayer = this.getCurrentPlayer();
		this.newPositionSet = true;
	};
	this.getlastPlayedState = function(){
		return this.lastPlayedPosition;
	};
	this.undoLastMove = function(){
		// toggle previous move only when new position is set
		if(this.newPositionSet){
			this.lastPlayer = this.getCurrentPlayer();
			this.newPositionSet=false;
			NACCoinAndGrid.removeCoin(this.lastPlayedCoin);
		}
	};
	this.init();
}]);