import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera"
import { Vector3 } from "@babylonjs/core/Maths/math"
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture"
import { Button, TextBlock } from "@babylonjs/gui"

import SceneBase from "./scene_base"

export default class MainMenuScene extends SceneBase {

    camera: FreeCamera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene)
    guiTexture: AdvancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI("MAIN_MENU_UI")

    sceneTitle: TextBlock = new TextBlock()
    dodgeSceneButton: Button = Button.CreateSimpleButton("btn_dodge_scene", "Play Dodge")

    public initialize() {
        const { guiTexture, sceneTitle, dodgeSceneButton } = this

        sceneTitle.text = "Main Menu"
        sceneTitle.color = "white"
        sceneTitle.fontSize = 50
        sceneTitle.top = "-100px"

        guiTexture.addControl(sceneTitle)

        dodgeSceneButton.width = "200px"
        dodgeSceneButton.height = "50px"
        dodgeSceneButton.color = "white"

        guiTexture.addControl(dodgeSceneButton)
    }

    public sceneLoop() {

    }
}
