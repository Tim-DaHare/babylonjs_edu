import React, { useEffect } from "react"
import BabylonInstance from "./babylon_instance"

const App: React.FC = () => {
    const initializeBabylon: () => void = () => {
        const babylonInstance = new BabylonInstance()
        babylonInstance.start()

        return () => babylonInstance.stop()
    }

    useEffect(initializeBabylon, [])

    return (
        <div className="app">
            <canvas
                style={{
                    width: '100%',
                    height: '100vh'
                }}
                id="app_canvas"
                touch-action="none"
            ></canvas>
        </div>
    )
}

export default App
