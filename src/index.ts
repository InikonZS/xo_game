import { GameModel } from './gameModel';
import { WinMessage } from './winMessage';
import { GameField } from './gameField';
import { AnimatedSprite, Application, Assets, BitmapFont, BitmapText, Container, LoadAsset, Point, Sprite, Spritesheet, Text, Texture } from 'pixi.js';
import { Sign } from './types';
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
    const model = new GameModel();
    const gameField = new GameField(app, model, resources);

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
