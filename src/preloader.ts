import { Assets, LoadAsset, Spritesheet, Texture } from "pixi.js";
import circle from './assets/images/tiles/circle.png';
import cross from './assets/images/tiles/cross.png';
import lightFontPath from './assets/fonts/lightFont.fnt';
import lightFontImgPath from './assets/fonts/lightFont.png';
import darkFontPath from './assets/fonts/darkFont.fnt';
import darkFontImgPath from './assets/fonts/darkFont.png';
import aniPath from './assets/png_sequences/sequence.json';
import aniImgPath from './assets/png_sequences/sequence.png';
import fieldBackground from './assets/images/playfield.png';
import spineCircleData from './assets/export_spine/skeletons/circle.json';
import spineCrossData from './assets/export_spine/skeletons/cross.json';
import sa from './assets/export_spine/spine.atlas';
import sp from'./assets/export_spine/spine.png';
import winPath from './assets/images/win_highlight.png';

lightFontImgPath;
darkFontImgPath;
aniImgPath; 
sp;

export class Resources{
    frameAnimations: Spritesheet;
    lightFont: any;
    spineCircleData: any;
    spineCrossData: any;
    circleTexture: Texture;
    crossTexture: Texture;
    fieldTexture: Texture;
    darkFont: any;
    winTexture: Texture;
    constructor(){

    }

    async load(){
        this.frameAnimations = await Assets.load(aniPath) as Spritesheet;
        this.frameAnimations.animations['cross'] = new Array(20).fill(0).map((it, i)=> {
            return this.frameAnimations.textures['cross-draw_'+ (i<10 ? '0'+ i : i.toString())];
        });
        this.frameAnimations.animations['circle'] = new Array(20).fill(0).map((it, i)=> {
            return this.frameAnimations.textures['circle-draw_'+ (i<10 ? '0'+ i : i.toString())];
        });

        this.lightFont = await Assets.load(lightFontPath);
        this.darkFont = await Assets.load(darkFontPath);
        const circleAssetData: LoadAsset = {
            src: spineCircleData,
            data: {
                spineAtlasFile: sa
            }
        }
        this.spineCircleData = await Assets.load(circleAssetData);
        
        const crossAssetData: LoadAsset = {
            src: spineCrossData,
            data: {
                spineAtlasFile: sa
            }
        }
        this.spineCrossData = await Assets.load(crossAssetData);
        this.circleTexture = await Assets.load(circle);
        this.crossTexture= await Assets.load(cross);
        this.fieldTexture = await Assets.load(fieldBackground);
        this.winTexture= await Assets.load(winPath);
    }
}