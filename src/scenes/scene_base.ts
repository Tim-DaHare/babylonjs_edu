import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import BabylonInstance from "../babylon_instance"

export default abstract class SceneBase {

    public babylonInstance: BabylonInstance
    public canvas: HTMLCanvasElement;
    public scene: Scene;

    constructor(babylonInstance: BabylonInstance) {
        this.babylonInstance = babylonInstance
        this.scene = new Scene(babylonInstance.engine)
        this.canvas = babylonInstance.canvas
    }

    public abstract initialize(): void
    public abstract sceneLoop(): void
}