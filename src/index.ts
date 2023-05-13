import { GameModel } from './gameModel';
import { WinMessage } from './winMessage';
import { GameField } from './gameField';
import { AnimatedSprite, Application, Assets, BitmapFont, BitmapText, Container, LoadAsset, Point, Sprite, Spritesheet, Text, Texture } from 'pixi.js';
/*import circle from './assets/images/tiles/circle.png';
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
import sp from'./assets/export_spine/spine.png';*/
import { Sign } from './types';
import { Resources } from './preloader';
import { Spine } from 'pixi-spine';
//console.log(aniImgPath, lightFontImgPath, sp);

async function init(){
    const resources = new Resources();
    console.log('loading...');
    await resources.load();
    console.log('loaded');
    const app = new Application();
    document.body.appendChild(app.view as HTMLCanvasElement);
    //const texture = await Assets.load(circle);
    const model = new GameModel();
    const gameField = new GameField(app, model, resources);
    //const ani = await Assets.load(aniPath) as Spritesheet;
    //const aniImg = await Assets.load(aniImgPath);
    //ani.animations['cross'] = new Array(20).fill(0).map((it, i)=> ani.textures['cross-draw_'+ (i<10 ? '0'+ i : i.toString())]);
    //ani.animations['circle'] = new Array(20).fill(0).map((it, i)=> ani.textures['circle-draw_'+ (i<10 ? '0'+ i : i.toString())]);
    const aniSprite = new AnimatedSprite(resources.frameAnimations.animations['circle']);
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
    //console.log(ani)
    //const fnt = await Assets.load(lightFontPath);
    //const fontTexture = await Assets.load(lightFontImgPath);
    //const lightFont = new BitmapFont(fnt, [], true);
    /*let a: LoadAsset = {
        src: spineCircleData,
        data: {
            spineAtlasFile: sa
        }
    }
    Assets.load(a).then((resource) => {*/
    {
        const resource = resources.spineCircleData;
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
    }///);

    //Assets.load(b).then((resource) => {
    {
        const resource = resources.spineCrossData;
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
    };

    const txt = new BitmapText('test bitmap', {fontName: 'lightFont'});
    app.stage.addChild(txt);
    /*const circleTexture = await Assets.load(circle);
    const crossTexture= await Assets.load(cross);
    const fieldTexture = await Assets.load(fieldBackground);
    */
    /*const bunny = new Sprite(texture);
    bunny.interactive = true;
    bunny.on('click', ()=>{
        console.log('hi');
    })
    bunny.width = 100;
    */
    aniSprite.x = app.renderer.width / 2;
    aniSprite.y = app.renderer.height / 2;

    //bunny.anchor.x = 0.5;
    //bunny.anchor.y = 0.5;

    //app.stage.addChild(bunny);

    app.ticker.add(() => {
       // bunny.rotation += 0.01;
    });

    model.onWin = (sign)=>{
        const winMessage = new WinMessage(app, sign);
        winMessage.onPlayAgain = ()=>{
            winMessage.destroy();
            model.start();
            gameField.reset();
            /*model.field.map((row, y)=>{
                return row.map((sign, x)=> {
                views[y][x].texture = [Texture.WHITE, crossTexture, circleTexture][sign];   
                });
            });*/
        }
    }

    model.onChange = (pos)=>{
        gameField.update(pos);
    };

    /*const views: Array<Array<Sprite>> = model.field.map((row, y)=>{
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
    })*/
}

init();
