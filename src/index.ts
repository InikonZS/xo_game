import { Application, Assets, Sprite, Texture } from 'pixi.js';
import circle from './assets/images/circle.png';

async function init(){
    const app = new Application();
    document.body.appendChild(app.view as HTMLCanvasElement);
    const texture = await Assets.load(circle);

    const bunny = new Sprite(texture);
    bunny.interactive = true;
    bunny.on('click', ()=>{
        console.log('hi');
    })
    bunny.width = 100;

    bunny.x = app.renderer.width / 2;
    bunny.y = app.renderer.height / 2;

    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    app.stage.addChild(bunny);

    app.ticker.add(() => {
        bunny.rotation += 0.01;
    });
}

init();
