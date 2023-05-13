import { IVector, Sign } from "./types";

export class GameModel{
    field: Array<Array<Sign>>;
    onChange: (pos: IVector)=>void;
    onWin: (sign: Sign)=>void;
    currentPlayerIndex: number = 0;

    constructor(){
        this.start();
    }

    start(){
        const size = 3;
        this.field = new Array(size).fill(null).map(() => new Array(size).fill(Sign.empty));
    }

    move(position: IVector, sign: Sign){
        this.field[position.y][position.x] = sign;
        const playersCount = 2;
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % playersCount;
        this.onChange?.(position);
        if (this.checkWinner(Sign.cross)){
            console.log('cross wins');
            this.onWin?.(Sign.cross);
        };
        if (this.checkWinner(Sign.circle)){
            console.log('circle wins');
            this.onWin?.(Sign.circle);
        };

        /*if (this.currentPlayerIndex == 1){
            this.botMove();
        }*/
    }

    private checkWinner(sign: Sign){
        const size = this.field.length;

        //horizontal check
        for (let i=0; i < size; i++){
            let isLine = true;
            for (let j=0; j < size; j++){
                if (this.field[i][j] != sign){
                    isLine = false;
                    break;
                }
            }
            if (isLine){
                return true;
            }
        }

        //vertical check
        for (let i=0; i < size; i++){
            let isLine = true;
            for (let j=0; j < size; j++){
                if (this.field[j][i] != sign){
                    isLine = false;
                    break;
                }
            }
            if (isLine){
                return true;
            }
        }

        //diagonal check
        let isMainLine = true;
        for (let j=0; j < size; j++){
            if (this.field[j][j] != sign){
                isMainLine = false;
                break;
            }
        }
        if (isMainLine){
            return true;
        }

        let isSecondLine = true;
        for (let j=0; j < size; j++){
            if (this.field[j][size - j - 1] != sign){
                isSecondLine = false;
                break;
            }
        }
        if (isSecondLine){
            return true;
        }

        return false;
    }

    botMove(){
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
            return;
        }
        this.move(empties[Math.floor(Math.random() * empties.length)], Sign.circle);
    }
}