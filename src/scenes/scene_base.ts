import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'


export default abstract class SceneBase {

    public canvas: HTMLCanvasElement;
    public readonly scene: Scene;

    constructor(canvas: HTMLCanvasElement, engine: Engine) {
        this.scene = new Scene(engine);
        this.canvas = canvas
    }

    public abstract initialize(): void
    public abstract sceneLoop(): void
}