import { AnimatedSprite, Application, Assets, BitmapFont, BitmapText, Container, LoadAsset, Point, Sprite, Spritesheet, Text, Texture } from 'pixi.js';
import circle from './assets/images/tiles/circle.png';
import cross from './assets/images/tiles/cross.png';
import lightFontPath from './assets/fonts/lightFont.fnt';
import lightFontImgPath from './assets/fonts/lightFont.png';
import aniPath from './assets/png_sequences/sequence.json';
import aniImgPath from './assets/png_sequences/sequence.png';
import fieldBackground from './assets/images/playfield.png';
import { Spine, TextureAtlas } from 'pixi-spine';
import spineCircleData from './assets/export_spine/skeletons/circle.json';
import spineCrossData from './assets/export_spine/skeletons/cross.json';
import sa from './assets/export_spine/spine.atlas';
import sp from'./assets/export_spine/spine.png';
console.log(aniImgPath, lightFontImgPath, sp);

interface IVector{
    x: number;
    y: number
}

enum Sign{
    empty = 0,
    cross = 1,
    circle = 2
}

class GameModel{
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

async function init(){
    const app = new Application();
    document.body.appendChild(app.view as HTMLCanvasElement);
    const texture = await Assets.load(circle);

    const ani = await Assets.load(aniPath) as Spritesheet;
    //const aniImg = await Assets.load(aniImgPath);
    ani.animations['cross'] = new Array(20).fill(0).map((it, i)=> ani.textures['cross-draw_'+ (i<10 ? '0'+ i : i.toString())]);
    ani.animations['circle'] = new Array(20).fill(0).map((it, i)=> ani.textures['circle-draw_'+ (i<10 ? '0'+ i : i.toString())]);
    const aniSprite = new AnimatedSprite(ani.animations['circle']);
    aniSprite.play();
    aniSprite.x = 600;
    aniSprite.y = 600;
    app.stage.addChild(aniSprite);
    aniSprite.loop = false;
    aniSprite.onComplete = ()=>{
        //aniSprite.
        console.log('complete circle');
        aniSprite.stop();
    }
    console.log(ani)
    const fnt = await Assets.load(lightFontPath);
    //const fontTexture = await Assets.load(lightFontImgPath);
    //const lightFont = new BitmapFont(fnt, [], true);
    let a: LoadAsset = {
        src: spineCircleData,
        data: {
            spineAtlasFile: sa
        }
    }
    Assets.load(a).then((resource) => {
        console.log(resource)
        const animation = new Spine(resource.spineData);
        animation.position.set(100, 100);
        animation.state.addListener({
            complete:(e)=>{
                console.log('complete spine')
            }
        })
        app.stage.addChild(animation);
    
        // add the animation to the scene and render...
        app.stage.addChild(animation);
        
        if (animation.state.hasAnimation('draw')) {
            // run forever, little boy!
            animation.state.setAnimation(0, 'draw', true);
            // dont run too fast
            animation.state.timeScale = 0.1;
            // update yourself
            animation.autoUpdate = true;
        }
    });

    let b: LoadAsset = {
        src: spineCrossData,
        data: {
            spineAtlasFile: sa
        }
    }
    Assets.load(b).then((resource) => {
        console.log(resource)
        const animation = new Spine(resource.spineData);
        animation.position.set(200, 100);
        app.stage.addChild(animation);
    
        // add the animation to the scene and render...
        app.stage.addChild(animation);
        
        if (animation.state.hasAnimation('draw')) {
            // run forever, little boy!
            animation.state.setAnimation(0, 'draw', true);
            // dont run too fast
            animation.state.timeScale = 0.1;
            // update yourself
            animation.autoUpdate = true;
        }
    });

    const txt = new BitmapText('test bitmap', {fontName: 'lightFont'});
    app.stage.addChild(txt);
    const circleTexture = await Assets.load(circle);
    const crossTexture= await Assets.load(cross);
    const fieldTexture = await Assets.load(fieldBackground);
    const fieldSprite = new Sprite(fieldTexture);
    const fieldContainer = new Container();
    fieldContainer.position.set(300, 200);
    fieldSprite.height = 325;
    fieldSprite.width = 325;
    const cellSize = (fieldSprite.width + 15) / 3 - 15;
    //fieldSprite.width = (cellSize + 15) * 3 - 15;
    //fieldSprite.height = (cellSize + 15) * 3 - 15;
    fieldContainer.addChild(fieldSprite);
    app.stage.addChild(fieldContainer);
    const bunny = new Sprite(texture);
    bunny.interactive = true;
    bunny.on('click', ()=>{
        console.log('hi');
    })
    bunny.width = 100;

    aniSprite.x = app.renderer.width / 2;
    aniSprite.y = app.renderer.height / 2;

    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    app.stage.addChild(bunny);

    app.ticker.add(() => {
        bunny.rotation += 0.01;
    });

    const model = new GameModel();
    model.onWin = (sign)=>{
        const text = ['', 'cross win', 'circle win'][sign];
        const winMessage = new BitmapText(text, {
            fontName: 'lightFont'
        });
        let scaler = 0;
        winMessage.scale.set(scaler, scaler);
        const h = ()=>{
            scaler+=0.05;
            if (scaler>=1){
                scaler = 1;
                app.ticker.remove(h);
                //ticker.stop();
            }
            winMessage.scale.set(scaler, scaler);
            //ticker.destroy();
            //app.ticker.remove()
        }
        const ticker = app.ticker.add(h);
        app.stage.addChild(winMessage);
        winMessage.interactive = true;
        winMessage.on('click', ()=>{
            app.stage.removeChild(winMessage);
            winMessage.destroy();
            model.start();
            model.field.map((row, y)=>{
                return row.map((sign, x)=> {
                views[y][x].texture = [Texture.WHITE, crossTexture, circleTexture][sign];   
                });
            });
        })
       // winMessage.destroy();
    }

    model.onChange = (pos)=>{
        model.field.map((row, y)=>{
            return row.map((sign, x)=> {
                if (pos.x == x && pos.y ==y){
                    const aniSprite = new AnimatedSprite(ani.animations[['', 'cross', 'circle'][sign]]);
                    //aniSprite.texture = Texture.WHITE;
                    //aniSprite.
                    aniSprite.play();
                    aniSprite.x = x * (cellSize + 15)-32;
                    aniSprite.y = y * (cellSize +15)-32;
                    aniSprite.width = cellSize * 1.63;
                    aniSprite.height = cellSize * 1.63;
                    //aniSprite.width = cellSize * 1.53;
                    //aniSprite.height = cellSize * 1.53;
                    fieldContainer.addChild(aniSprite);
                    aniSprite.loop = false;
                    aniSprite.onComplete = ()=>{
                        //aniSprite.
                        console.log('complete circle');
                        aniSprite.stop();
                        fieldContainer.removeChild(aniSprite);
                        views[y][x].texture = [Texture.EMPTY, crossTexture, circleTexture][sign];
                        if (model.currentPlayerIndex ==  1){
                            model.botMove();
                        }
                    }
                }
                //views[y][x].texture = [Texture.WHITE, crossTexture, circleTexture][sign];
            });
        });
    };

    const views: Array<Array<Sprite>> = model.field.map((row, y)=>{
        return row.map((sign, x)=> {
            const cell = new Sprite(Texture.WHITE);
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
            
            fieldContainer.addChild(cell);
            return cell;
        })
    })
}

init();
