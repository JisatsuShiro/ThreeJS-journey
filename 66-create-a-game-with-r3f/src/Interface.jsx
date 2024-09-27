import { useKeyboardControls } from "@react-three/drei"
import useGame from "./stores/useGame"
import { useEffect, useRef } from "react"
import { addEffect } from "@react-three/fiber"

export default function Interface() {
    
    const time = useRef()
    
    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)
    const jump = useKeyboardControls((state) => state.jump)
    
    const restart = useGame((state) => state.restart)
    const phase = useGame((state) => state.phase)

    useEffect(() => {
        const unsubscribeEffect = addEffect(() => {
            const state = useGame.getState()
            let elapsedTime = 0
            if (state.phase === 'playing') {
                elapsedTime = Date.now() - state.startTime
            } else if(state.phase === 'ended') {
                elapsedTime = state.endTime - state.startTime
            }

            elapsedTime /= 1000
            elapsedTime = elapsedTime.toFixed(2)

            if (time.current) {
                time.current.textContent = elapsedTime
            }
        })

        return () => {
            unsubscribeEffect()
        }
    }, [])

    return <div className="interface">
        {/* Timer */}
        <div ref={time} className="time">0.00</div>
        
        {/* Restart btn */}
        { phase === 'ended' && <div className="restart" onClick={restart}>Restart</div> }

        {/* Controls */}
        <div className="controls">
            <div className="raw">
                <div className={ forward ? 'key active' : 'key'}></div>
            </div>
            <div className="raw">
                <div className={ leftward ? 'key active' : 'key'}></div>
                <div className={ backward ? 'key active' : 'key'}></div>
                <div className={ rightward ? 'key active' : 'key'}></div>
            </div>
            <div className="raw">
                <div className={ jump ? 'key large active' : 'key large'}></div>
            </div>
        </div>
    </div>
}