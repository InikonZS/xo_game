import { AnimatedSprite, Application, Container, Sprite, Texture } from "pixi.js";
import { IVector, Sign } from "./types";
import { GameModel } from "./gameModel";
import { Resources } from "./preloader";
import { Spine } from "pixi-spine";

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
                const cell = new Cell(app, model, resources, x, y, cellSize);
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
                    this.views[y][x].animateSign(sign);    
                }
            });
        });
    }

    reset(){
        this.model.field.map((row, y)=>{
            return row.map((sign, x)=> {
                this.views[y][x].setSign(sign);  
            });
        });
    }

    destroy(){

    }
}

class Cell extends Container{
    cell: Sprite;
    resources: Resources;
    posX: number;
    posY: number;
    cellSize: number;
    model: GameModel;
    app: Application;
    constructor(app: Application, model: GameModel, resources: Resources, x: number, y: number, cellSize: number){
        super();
        this.app = app;
        this.posX = x;
        this.posY = y;
        this.model = model;
        this.cellSize = cellSize;
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

    animateSign1(sign: Sign){
        const cellSize = this.cellSize;

        const aniSprite = new AnimatedSprite(this.resources.frameAnimations.animations[['', 'cross', 'circle'][sign]]);
        //  aniSprite.texture = Texture.WHITE;
        aniSprite.play();
        aniSprite.x = this.posX * (cellSize + 15)-32;
        aniSprite.y = this.posY * (cellSize +15)-32;
        aniSprite.width = cellSize * 1.63;
        aniSprite.height = cellSize * 1.63;

        this.addChild(aniSprite);
        aniSprite.loop = false;
        aniSprite.onComplete = ()=>{
            console.log('complete circle');
            aniSprite.stop();
            this.removeChild(aniSprite);
            this.setSign(sign);
            //this.views[y][x].setSign(sign);
            if (this.model.currentPlayerIndex ==  1){
                this.model.botMove();
            }
        }
    }

    animateSign(sign: Sign){
        const cellSize = this.cellSize;

        const resource = [null, this.resources.spineCrossData, this.resources.spineCircleData][sign];
        //resource.width = cellSize;
        //resource.height = cellSize;
        console.log(resource)
        const animation = new Spine(resource.spineData);
        if (animation.state.hasAnimation('draw')) {
            // run forever, little boy!
            animation.state.setAnimation(0, 'draw', false);
            // dont run too fast
            animation.state.timeScale = 0.5;
            // update yourself
            animation.autoUpdate = false;
        }
        let stop: boolean = false;
        const h = (t: number)=>{
            //console.log(t);
            if (stop == true){
                this.app.ticker.remove(h);
                aniSprite.destroy();
                this.removeChild(aniSprite);
                return;
            }
            aniSprite.update(t/100);
        };
        this.app.ticker.add(h);
        animation.pivot.set(-100,-100)
        //animation.position.set(100, 100);
        animation.state.addListener({
            complete:(e)=>{
                
                console.log('complete circle');
            aniSprite.autoUpdate = false;
            stop = true;
            //aniSprite.destroy();
            //this.removeChild(aniSprite);
            this.setSign(sign);
            //this.views[y][x].setSign(sign);
            if (this.model.currentPlayerIndex ==  1){
                this.model.botMove();
            }
                //console.log('complete spine')
            },
            event: (e)=>{
                console.log(e);
            }
        })
        const aniSprite = animation;
        //const aniSprite = new AnimatedSprite(this.resources.frameAnimations.animations[['', 'cross', 'circle'][sign]]);
        //aniSprite.texture = Texture.WHITE;
        //aniSprite.play();
        aniSprite.x = this.posX * (cellSize + 15)-32;
        aniSprite.y = this.posY * (cellSize +15)-32;
        aniSprite.scale.set(0.8,0.8);
        //aniSprite.width = cellSize * 1.63;
        //aniSprite.height = cellSize * 1.63;
        this.addChild(aniSprite);
        console.log(aniSprite.width, aniSprite.height, aniSprite.getBounds());
        //aniSprite.width = 10;
        //aniSprite.height = 10;
        
        /*aniSprite.loop = false;
        aniSprite.onComplete = ()=>{
            console.log('complete circle');
            aniSprite.stop();
            this.removeChild(aniSprite);
            this.setSign(sign);
            //this.views[y][x].setSign(sign);
            if (this.model.currentPlayerIndex ==  1){
                this.model.botMove();
            }
        }*/    
    }
}
