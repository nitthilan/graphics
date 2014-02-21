MyAppServices.service('NaughtsAndCrossGrid', function(){
    'use strict';

    this.init = function(){
        // Create and initialise grid
        var gridSize = 3;
        this.gridState = new Array(gridSize);
        for(var i=0;i<gridSize;i++){
            this.gridState[i] = new Array(gridSize);
            for(var j=0;j<gridSize;j++){
                this.gridState[i][j] = new Array(gridSize);
                for(var k=0;k<gridSize;k++){
                    this.gridState[i][j][k] = 0;
                }
            }
        }
        this.winPositions = createAllPossibleWinPositions(gridSize);
        //console.log("Win positions "+JSON.stringify(this.winPositions));
        //console.log("Win positions Length "+this.winPositions.length);
	};

    // get the current state
    this.getPositionState = function(i,j,k){
        return this.gridState[i][j][k];
    };
    this.resetPositionState = function(i,j,k){
        this.gridState[i][j][k]=0;
    };
    this.setPositionState = function(i,j,k,state){
        if(i<0 || i>2 || j<0 || j>2 || k<0 || k>2){
			throw "Invalid position. Enter value between 0-2";
        }
        if(this.gridState[i][j][k] !== 0){
			throw "Position already taken. Try New position";
        }
        this.gridState[i][j][k]=state;
    };
    this.hasThePlayerWon = function(){
        var winPos = this.winPositions;
        var gs = this.gridState;
        for(var i=0;i<winPos.length;i++){
            var p0 = winPos[i][0];
            var p1 = winPos[i][1];
            var p2 = winPos[i][2];
            //console.log(" winpos "+winPos[i]+" "+i);
            //console.log(" position "+p0+p1+p2)
            if(gs[p0[0]][p0[1]][p0[2]] !== 0 &&
               gs[p0[0]][p0[1]][p0[2]] === gs[p1[0]][p1[1]][p1[2]] &&
               gs[p2[0]][p2[1]][p2[2]] === gs[p1[0]][p1[1]][p1[2]]){
                return true;
            }
        }
        return false;
    };

    var createAllPossibleWinPositions = function(gridSize){
        // Create all possible win positions
        // Refer: http://www.cs.rochester.edu/~brown/242/assts/studprojs/ttt10.pdf
        // To detect a win, this program simply looks at every possible row, column and diagonal 
        // to see if any one player’s pieces occupy all 4 spaces. This is achieved using a series 
        // of conditionals. There are 76 different possibilities for a win (16 rows in each direction, 
        // 2 diagonals per face in each direction (which makes 12 faces), and then 4 corner-to-corner diagonals),
        // and this algorithm checks each one in sequence.
        // => 16 * 3 dimensions + 4 * 3 dimensions * 2 diagonals/face + 4 = 76
        // generic formula: 3*(N^2) + N*3*2 + 4
        var winPositions = [];
        var i,j,k;
        // 3*N^2
        for(i=0;i<gridSize;i++){
            for(j=0;j<gridSize;j++){
                var winPositionX = new Array(gridSize);
                var winPositionY = new Array(gridSize);
                var winPositionZ = new Array(gridSize);
                for(k=0;k<gridSize;k++){
                    winPositionX[k] = [k,i,j];
                    winPositionY[k] = [i,k,j];
                    winPositionZ[k] = [i,j,k];
                }
                winPositions.push(winPositionX);
                winPositions.push(winPositionY);
                winPositions.push(winPositionZ);
            }
        }
        // N*3*2
        for(i=0;i<gridSize;i++){
            var winPostionDiagX1 = new Array(gridSize);
            var winPostionDiagX2 = new Array(gridSize);
            var winPostionDiagY1 = new Array(gridSize);
            var winPostionDiagY2 = new Array(gridSize);
            var winPostionDiagZ1 = new Array(gridSize);
            var winPostionDiagZ2 = new Array(gridSize);
            for(k=0;k<gridSize;k++){
                winPostionDiagX1[k] = [i,k,k];
                winPostionDiagX2[k] = [i,2-k,2-k];
                winPostionDiagY1[k] = [k,i,k];
                winPostionDiagY2[k] = [2-k,i,2-k];
                winPostionDiagZ1[k] = [k,k,i];
                winPostionDiagZ2[k] = [2-k,2-k,i];
            }
            winPositions.push(winPostionDiagX1);
            winPositions.push(winPostionDiagX2);
            winPositions.push(winPostionDiagY1);
            winPositions.push(winPostionDiagY2);
            winPositions.push(winPostionDiagZ1);
            winPositions.push(winPostionDiagZ2);
        }
        // 4
        winPositions.push([[0,0,0], [1,1,1], [2,2,2]]);
        winPositions.push([[2,0,0], [1,1,1], [0,2,2]]);
        winPositions.push([[0,2,0], [1,1,1], [2,0,2]]);
        winPositions.push([[0,0,2], [1,1,1], [2,2,0]]);
        return winPositions;
    };

    // Initialise
    this.init();
});