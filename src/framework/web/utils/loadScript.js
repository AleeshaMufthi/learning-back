// load third-party scripts, dynamically loads an external JavaScript script

export default function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }

        document.body.appendChild(script)
    })
}