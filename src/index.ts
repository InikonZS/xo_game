import { GameModel } from './gameModel';
import { WinMessage } from './winMessage';
import { GameField } from './gameField';
import { AnimatedSprite, Application, Assets, BitmapFont, BitmapText, Container, LoadAsset, Point, Sprite, Spritesheet, Text, Texture } from 'pixi.js';
import { Sign } from './types';
import { Resources } from './preloader';
import { Spine } from 'pixi-spine';

async function init(){    
    const app = new Application();
    document.body.appendChild(app.view as HTMLCanvasElement);
    const resources = new Resources();
    console.log('loading...');
    await resources.load();
    console.log('loaded');

    const model = new GameModel();
    const gameField = new GameField(app, model, resources);
    const aniSprite = new AnimatedSprite(resources.frameAnimations.animations['circle']);
    aniSprite.play();
    aniSprite.x = 600;
    aniSprite.y = 600;
    app.stage.addChild(aniSprite);
    aniSprite.loop = false;
    aniSprite.onComplete = ()=>{
        console.log('complete circle');
        aniSprite.stop();
    }

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
    }

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

    aniSprite.x = app.renderer.width / 2;
    aniSprite.y = app.renderer.height / 2;

    model.onWin = (sign)=>{
        const winMessage = new WinMessage(app, sign);
        winMessage.onPlayAgain = ()=>{
            winMessage.destroy();
            model.start();
            gameField.reset();
        }
    }

    model.onChange = (pos)=>{
        gameField.update(pos);
    };

}

init();
