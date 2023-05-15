import { GameModel } from './gameModel';
import { WinMessage } from './winMessage';
import { GameField } from './gameField';
import { AnimatedSprite, Application, Assets, BitmapFont, BitmapText, Container, LoadAsset, Point, Sprite, Spritesheet, Text, Texture } from 'pixi.js';
import { IVector, Sign } from './types';
import { Resources } from './preloader';
import { Spine } from 'pixi-spine';
import './style.css';

async function init(){    
    const app = new Application();
    document.body.appendChild(app.view as HTMLCanvasElement);
    const resources = new Resources();
    console.log('loading...');
    await resources.load();
    console.log('loaded');
    app.resizeTo = document.body;
    window.addEventListener('resize', ()=>{   
        //app.resize();
    })
    const background = new Sprite(resources.background);
    background.anchor.set(0.5, 0.5);
    background.position.set(app.screen.width / 2, app.screen.height / 2);
    app.stage.addChild(background);
    const model = new GameModel();
    const gameField = new GameField(app, model, resources);

    model.onWin = (sign, data)=>{
        const winMessage = new WinMessage(app, sign);
        gameField.setWinData(data).then(()=>{
            winMessage.onPlayAgain = ()=>{
                winMessage.onPlayAgain = null;
                winMessage.destroy();
                model.start();
                gameField.reset();
            }
        });
        
    }

    model.onChange = (pos)=>{
        gameField.update(pos);
    };

}

init();
