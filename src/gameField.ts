import { AnimatedSprite, Application, Container, Sprite, Texture } from "pixi.js";
import { IVector, Sign } from "./types";
import { GameModel } from "./gameModel";
import { Resources } from "./preloader";

export class GameField{
    model: GameModel;
    views: Array<Array<Cell>>;
    resources: Resources;
    fieldContainer: Container;
    cellSize: number;
    constructor(app: Application, model: GameModel, resources: Resources){
        this.model = model;
        this.resources = resources;
        const fieldSprite = new Sprite(resources.fieldTexture);
        const fieldContainer = new Container();
        this.fieldContainer = fieldContainer;
        fieldContainer.position.set(300, 200);
        fieldSprite.height = 325;
        fieldSprite.width = 325;
        const cellSize = (fieldSprite.width + 15) / 3 - 15;
        this.cellSize = cellSize;
        //fieldSprite.width = (cellSize + 15) * 3 - 15;
        //fieldSprite.height = (cellSize + 15) * 3 - 15;
        fieldContainer.addChild(fieldSprite);
        app.stage.addChild(fieldContainer);

        const views: Array<Array<Cell>> = model.field.map((row, y)=>{
            return row.map((sign, x)=> {
                const cell = new Cell(model, resources, x, y, cellSize);
                fieldContainer.addChild(cell);
                return cell;
            })
        });
        this.views = views;
    }

    update(pos: IVector){
        console.log(pos)
        const model = this.model;
        const cellSize = this.cellSize;
        model.field.map((row, y)=>{
            return row.map((sign, x)=> {
                if (pos.x == x && pos.y ==y){
                    const aniSprite = new AnimatedSprite(this.resources.frameAnimations.animations[['', 'cross', 'circle'][sign]]);
                    //aniSprite.texture = Texture.WHITE;
                    //aniSprite.
                    aniSprite.play();
                    aniSprite.x = x * (cellSize + 15)-32;
                    aniSprite.y = y * (cellSize +15)-32;
                    aniSprite.width = cellSize * 1.63;
                    aniSprite.height = cellSize * 1.63;
                    //aniSprite.width = cellSize * 1.53;
                    //aniSprite.height = cellSize * 1.53;
                    this.fieldContainer.addChild(aniSprite);
                    aniSprite.loop = false;
                    aniSprite.onComplete = ()=>{
                        //aniSprite.
                        console.log('complete circle');
                        aniSprite.stop();
                        this.fieldContainer.removeChild(aniSprite);
                        this.views[y][x].setSign(sign);
                        if (model.currentPlayerIndex ==  1){
                            model.botMove();
                        }
                    }
                }
                //views[y][x].texture = [Texture.WHITE, crossTexture, circleTexture][sign];
            });
        });
    }

    reset(){
        this.model.field.map((row, y)=>{
            return row.map((sign, x)=> {
                this.views[y][x].setSign(sign);
            //views[y][x].texture = [Texture.WHITE, crossTexture, circleTexture][sign];   
            });
        });
    }

    destroy(){

    }
}

class Cell extends Container{
    cell: Sprite;
    resources: Resources;
    constructor(model: GameModel, resources: Resources, x: number, y: number, cellSize: number){
        super();
        this.resources = resources;
        const cell = new Sprite(Texture.WHITE);
        this.cell = cell;
        cell.x = x * (cellSize + 15);
        cell.y = y * (cellSize + 15);
        cell.width = cellSize;
        cell.height = cellSize;
        cell.interactive = true;
        cell.on('click', ()=>{
            model.move({x, y}, Sign.cross);
        });
        cell.on('mouseenter', ()=>{
            //cell.width = cellSize + 3;
        });
        cell.on('mouseleave', ()=>{
            //cell.width = cellSize;
        });

            
        this.addChild(cell);
    }

    setSign(sign:Sign){
        this.cell.texture = [Texture.WHITE, this.resources.crossTexture, this.resources.circleTexture][sign];
    }
}