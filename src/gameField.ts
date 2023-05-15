import { AnimatedSprite, Application, Container, Sprite, Texture } from "pixi.js";
import { IVector, Sign } from "./types";
import { GameModel } from "./gameModel";
import { Resources } from "./preloader";
import { Spine } from "pixi-spine";
import { Signal } from "./common/signal";

const spineEnabled = true;

export class GameField{
    model: GameModel;
    views: Array<Array<Cell>>;
    resources: Resources;
    fieldContainer: Container;
    cellSize: number;
    cancellationToken: Signal<void>;
    asyncOperation: Promise<void|any>;
    constructor(app: Application, model: GameModel, resources: Resources){
        this.cancellationToken = new Signal();
        this.model = model;
        this.resources = resources;
        const fieldSprite = new Sprite(resources.fieldTexture);
        fieldSprite.anchor.set(0.5, 0.5);
        const fieldContainer = new Container();
        this.fieldContainer = fieldContainer;
        fieldContainer.position.set(app.screen.width/2, app.screen.height/2);
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
                    //this.asyncOperation = (this.asyncOperation || Promise.resolve()).then(()=>this.views[y][x].animateSign(sign, this.cancellationToken));  
                    this.asyncOperation = Promise.all([(this.asyncOperation || Promise.resolve()), this.views[y][x].animateSign(sign, this.cancellationToken)])  
                }
            });
        });
    }

    reset(){
        this.cancellationToken.emit();
        this.cancellationToken = new Signal();
        this.model.field.map((row, y)=>{
            return row.map((sign, x)=> {
                this.views[y][x].setSign(sign); 
                this.views[y][x].setWin(false, this.cancellationToken); 
            });
        });
    }

    setWinData(data: Array<IVector>){
        return (this.asyncOperation || Promise.resolve()).then(()=>{
            data.forEach(it=>{
                this.views[it.y][it.x].setWin(true, this.cancellationToken);
            })
        })     
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
    highlight: Sprite;
    hover: Sprite;
    signSpine: Spine;
    constructor(app: Application, model: GameModel, resources: Resources, x: number, y: number, cellSize: number){
        super();
        this.app = app;
        this.posX = x;
        this.posY = y;
        this.model = model;
        this.cellSize = cellSize;
        this.resources = resources;
        this.highlight = new Sprite(resources.winTexture);
        this.highlight.anchor.set(0.5,0.5);
        this.highlight.width = cellSize;
        this.highlight.height = cellSize;
        this.highlight.visible = false;
        this.addChild(this.highlight);

        this.hover = new Sprite(resources.winTexture);
        this.hover.anchor.set(0.5,0.5);
        this.hover.width = cellSize;
        this.hover.height = cellSize;
        this.hover.visible = true;
        this.hover.alpha = 0;

        this.addChild(this.hover);
        const cell = new Sprite(Texture.EMPTY);
        this.cell = cell;
        cell.anchor.set(0.5, 0.5);
        //cell.x = (x - 1) * (cellSize + 15);
        //cell.y = (y - 1) * (cellSize + 15);
        cell.width = cellSize;
        cell.height = cellSize;
        cell.interactive = true;
        cell.on('click', ()=>{
            const result = model.move({x, y}, Sign.cross);
            console.log(result);
        });
        cell.on('mouseenter', ()=>{
            this.hover.alpha = 0.1;
            //cell.width = cellSize + 3;
        });
        cell.on('mouseleave', ()=>{
            this.hover.alpha = 0;
        });
        this.x = (x - 1) * (cellSize + 15);
        this.y = (y - 1) * (cellSize + 15);
            
        this.addChild(cell);
    }

    setSign(sign:Sign){
        this.cell.texture = [Texture.EMPTY, this.resources.crossTexture, this.resources.circleTexture][sign];
        this.cell.width = this.cellSize;
        this.cell.height = this.cellSize;
    }

    setWin(value: boolean, cancellationToken: Signal<void>){
        this.highlight.visible = value;
        const animation = this.signSpine;
        if (value == false) {
            animation?.destroy();
            this.signSpine = null;
            this.removeChild(animation);
            return;
        }
        let stop: boolean = false;
        const h = (t: number)=>{
            if (stop == true){
                this.app.ticker.remove(h);
                //aniSprite.destroy();
                //this.removeChild(aniSprite);
                return;
            }
            animation.update(t/100);
        };
        cancellationToken.add(()=>{
            stop = true;
        })
        this.app.ticker.add(h);
        animation.state.addListener({
            complete:(e)=>{
                stop = true;
            },
        })
        if (animation.state.hasAnimation('win')) {
            animation.state.setAnimation(0, 'win', false);
            animation.state.timeScale = 0.5;
            animation.autoUpdate = false;
        }
        //this.cell.texture = this.resources.winTexture;
    }

    animateSignFrames(sign: Sign, cancellationToken: Signal<void>){
        const cellSize = this.cellSize;

        const aniSprite = new AnimatedSprite(this.resources.frameAnimations.animations[['', 'cross', 'circle'][sign]]);
        //aniSprite.texture = Texture.WHITE;
        aniSprite.anchor.set(0.5, 0.5);
        aniSprite.play();
        cancellationToken.add(()=>{
            aniSprite.stop();
            this.removeChild(aniSprite);
            this.setSign(sign);
        })
        //aniSprite.x = (this.posX - 1) * (cellSize + 15);
        //aniSprite.y = (this.posY - 1) * (cellSize + 15);
        aniSprite.width = cellSize * 1.52;
        aniSprite.height = cellSize * 1.52;
        console.log(aniSprite.texture.orig, aniSprite.getBounds(), cellSize, aniSprite);

        this.addChild(aniSprite);
        aniSprite.loop = false;
        aniSprite.onComplete = ()=>{
            console.log('complete circle');
            aniSprite.stop();
            this.removeChild(aniSprite);
            this.setSign(sign);
            //this.views[y][x].setSign(sign);
            //if (this.model.currentPlayerIndex ==  1){
            this.model.botMove();
            //}
        }
    }

    animateSignSpine(sign: Sign, cancellationToken: Signal<void>): Promise<void>{
        return new Promise((resolve)=>{
           const cellSize = this.cellSize;
            const resource = [null, this.resources.spineCrossData, this.resources.spineCircleData][sign];
            console.log(resource)
            const animation = new Spine(resource.spineData);
            this.signSpine = animation;
            if (animation.state.hasAnimation('draw')) {
                animation.state.setAnimation(0, 'draw', false);
                animation.state.timeScale = 0.5;
                animation.autoUpdate = false;
            }
            let stop: boolean = false;
            const h = (t: number)=>{
                if (stop == true){
                    this.app.ticker.remove(h);
                    resolve();
                    //aniSprite.destroy();
                    //this.removeChild(aniSprite);
                    return;
                }
                aniSprite.update(t/100);
            };
            cancellationToken.add(()=>{
                stop = true;
            })
            this.app.ticker.add(h);
            animation.state.addListener({
                complete:(e)=>{
                    console.log('complete circle');
                    stop = true;
                    //this.setSign(sign);
                    this.model.botMove();
                }
            })
            const aniSprite = animation;
            
            aniSprite.width = cellSize * 1;
            aniSprite.height =  cellSize * 1;
            this.addChild(aniSprite);  
        })
        
    }

    animateSign(sign: Sign, cancellationToken: Signal<void>){
        if (spineEnabled){
            return this.animateSignSpine(sign, cancellationToken)
        }  else {
            this.animateSignFrames(sign, cancellationToken);
        }
    }
}
