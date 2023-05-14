import { IVector, Sign } from "./types";

export class GameModel{
    field: Array<Array<Sign>>;
    onChange: (pos: IVector)=>void;
    onWin: (sign: Sign, data: Array<IVector>)=>void;
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
        let crossData = this.checkWinner(Sign.cross);
        if (crossData){
            console.log('cross wins');
            this.onWin?.(Sign.cross, crossData);
        };
        let circleData = this.checkWinner(Sign.circle)
        if (circleData){
            console.log('circle wins');
            this.onWin?.(Sign.circle, circleData);
        };

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