import { Application, BitmapText } from "pixi.js";
import { Sign } from "./types";

export class WinMessage{
    onPlayAgain: ()=>void;
    protected app: Application;
    winMessage: BitmapText;

    constructor(app: Application, sign: Sign){
        this.app = app;

        const text = ['', 'cross win', 'circle win'][sign];
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
           /* app.stage.removeChild(winMessage);
            winMessage.destroy();
            model.start();
            model.field.map((row, y)=>{
                return row.map((sign, x)=> {
                views[y][x].texture = [Texture.WHITE, crossTexture, circleTexture][sign];   
                });
            });*/
            this.onPlayAgain?.();
        })
    }

    destroy(){
        this.app.stage.removeChild(this.winMessage);
        this.winMessage.destroy();
    }
}