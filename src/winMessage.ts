import { Application, BitmapText } from "pixi.js";
import { Sign } from "./types";

export class WinMessage{
    onPlayAgain: ()=>void;
    protected app: Application;
    winMessage: BitmapText;

    constructor(app: Application, sign: Sign){
        this.app = app;

        const text = ['', 'cross win', 'circle win', 'no winner'][sign];
        const winMessage = new BitmapText(text, {
            fontName: sign == Sign.circle ? 'lightFont' : 'darkFont'
        });
        this.winMessage = winMessage;
        let scaler = 0;
        winMessage.scale.set(scaler, scaler);
        winMessage.anchor.set(0.5, 0.5);
        winMessage.position.set(app.screen.width/2, winMessage.fontSize / 2);
        const h = ()=>{
            scaler+=0.05;
            if (scaler>=1){
                scaler = 1;
                app.ticker.remove(h);
            }
            winMessage.scale.set(scaler, scaler);
        }
        const ticker = app.ticker.add(h);
        app.stage.addChild(winMessage);
        winMessage.interactive = true;
        winMessage.on('click', ()=>{
            this.onPlayAgain?.();
        })
    }

    destroy(){
        this.app.stage.removeChild(this.winMessage);
        this.winMessage.destroy();
    }
}