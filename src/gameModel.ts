import { IVector, Sign } from "./types";

export class GameModel{
    field: Array<Array<Sign>>;
    onChange: (pos: IVector)=>void;
    onWin: (sign: Sign, data: Array<IVector>)=>void;
    currentPlayerIndex: number = 0;
    winner: Sign = Sign.empty;

    constructor(){
        this.start();
    }

    start(){
        console.log('restart game');
        const size = 3;
        this.currentPlayerIndex = 0;
        this.winner = Sign.empty;
        this.field = new Array(size).fill(null).map(() => new Array(size).fill(Sign.empty));
    }

    move(position: IVector, sign: Sign){
        if (this.winner != Sign.empty){
            return false;
        }
        console.log('allow move');
        if((sign - 1)!=this.currentPlayerIndex){
            return false;
        }
        if (this.field[position.y][position.x]!=Sign.empty){
            return false;
        }
        this.field[position.y][position.x] = sign;
        const playersCount = 2;
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % playersCount;
        this.onChange?.(position);
        let crossData = this.checkWinner(Sign.cross);
        if (crossData){
            console.log('cross wins');
            this.winner = Sign.cross;
            this.onWin?.(Sign.cross, crossData);
        };
        let circleData = this.checkWinner(Sign.circle)
        if (circleData){
            console.log('circle wins');
            this.winner = Sign.circle;
            this.onWin?.(Sign.circle, circleData);
        };
        return true;

        /*if (this.currentPlayerIndex == 1){
            this.botMove();
        }*/
    }

    private checkWinner(sign: Sign){
        const size = this.field.length;
        let lineData = [];
        //horizontal check
        for (let i=0; i < size; i++){
            let isLine = true;
            for (let j=0; j < size; j++){
                lineData.push({x:j, y:i});
                if (this.field[i][j] != sign){
                    isLine = false;
                    lineData = [];
                    break;
                }
            }
            if (isLine){
                return lineData;
            }
        }

        //vertical check
        for (let i=0; i < size; i++){
            let isLine = true;
            for (let j=0; j < size; j++){
                lineData.push({x:i, y:j});
                if (this.field[j][i] != sign){
                    isLine = false;
                    lineData = [];
                    break;
                }
            }
            if (isLine){
                return lineData;
            }
        }

        //diagonal check
        let isMainLine = true;
        for (let j=0; j < size; j++){
            lineData.push({x:j, y:j});
            if (this.field[j][j] != sign){
                lineData = [];
                isMainLine = false;
                break;
            }
        }
        if (isMainLine){
            return lineData;
        }

        let isSecondLine = true;
        for (let j=0; j < size; j++){
            lineData.push({x:j, y:size - j - 1});
            if (this.field[j][size - j - 1] != sign){
                isSecondLine = false;
                lineData = [];
                break;
            }
        }
        if (isSecondLine){
            return lineData;
        }

        return null;
    }

    handleLines(callback:(line: Array<{x: number, y: number, value: Sign}>)=>void){
        const size = this.field.length;
        
        //horizontal check
        for (let i=0; i < size; i++){
            let lineData = [];
            for (let j=0; j < size; j++){
                lineData.push({x:j, y:i, value: this.field[i][j]});
            }
            callback(lineData);
        }

        //vertical check
        for (let i=0; i < size; i++){
            let lineData = [];
            for (let j=0; j < size; j++){
                lineData.push({x:i, y:j, value: this.field[j][i]});
            }
            callback(lineData);
        }

        //diagonal check
        let lineData = [];
        for (let j=0; j < size; j++){
            lineData.push({x:j, y:j, value: this.field[j][j]});
        }
        callback(lineData);

        lineData = [];
        for (let j=0; j < size; j++){
            lineData.push({x:j, y:size - j - 1, value: this.field[size - j - 1][j]});
        }
        callback(lineData);
    }

    botMoveRandom(){
        const empties: Array<IVector> = [];
        this.field.map((row, y)=>{
            row.map((sign, x)=>{
                if (sign == Sign.empty){
                    empties.push({x, y});
                }
            })
        });
        if (empties.length == 0){
            console.log('no empty cell');
            this.onWin(Sign.nothing, []);
            return;
        }
        this.move(empties[Math.floor(Math.random() * empties.length)], Sign.circle);
    }

    botMove(){
        const defend: Array<IVector> = [];
        let attack: Array<IVector> = [];
        const win: Array<IVector> = [];
        this.handleLines((line)=>{
            const count = {
                [Sign.cross]: 0,
                [Sign.circle]: 0,
                [Sign.empty]: 0,
                [Sign.nothing]: 0
            }
            line.forEach(it=>{
                count[it.value]+=1;
            });
            if (count[Sign.cross] == 2 && count[Sign.empty] == 1){
                defend.push(line.find(it=> it.value == Sign.empty));
            }
            if (count[Sign.circle] == 1 && count[Sign.empty] == 2){
                attack = attack.concat(line.filter(it=> it.value == Sign.empty));
            }
            if (count[Sign.circle] == 2 && count[Sign.empty] == 1){
                win.push(line.find(it=> it.value == Sign.empty));
            }
        })
        console.log(attack, defend)
        const defendAttack: Array<IVector> = defend.filter(it=>{
            return attack.find(jt=>{
                return jt.x == it.x && it.x == jt.x;
            }) !=null
        })
        if (win.length){
            this.move(win[Math.floor(Math.random() * win.length)], Sign.circle);
        } else if (defendAttack.length){
            console.log('defend attack');
            this.move(defendAttack[Math.floor(Math.random() * defendAttack.length)], Sign.circle);
        } else if (defend.length){
            this.move(defend[Math.floor(Math.random() * defend.length)], Sign.circle);
        } else if (attack.length){
            this.move(attack[Math.floor(Math.random() * attack.length)], Sign.circle);
        } else {
            this.botMoveRandom();
        }
    }

}