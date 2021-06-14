import { GIFGroover } from './GIFGroover'
import GIF from './gif'

const gifCropper = (file: File, width: number, height: number): Promise<File> => {
  return new Promise((resolve) => {
    let url = new URL('./gif.js', window.location.origin)
    let worker = new Worker(url.toString())
    console.log(url)
    const myGif = GIFGroover()
    const reader = new FileReader()
    // @ts-ignore
    const gif = new GIF({
      workers: 2,
      quality: 10,
      workerScript: './gif.worker.js',
    })
    reader.onload = function () {
      myGif.onload = () => {
        const multiplier = Math.max(width / myGif.width, height / myGif.height)
        myGif.allFrames.forEach((item: HTMLCanvasElement) => {
          let destCanvas = document.createElement('canvas')
          destCanvas.width = width
          destCanvas.height = height
          const multiplerWidth = myGif.width * multiplier
          const multiplerHeight = myGif.height * multiplier
          destCanvas
            .getContext('2d')!
            .drawImage(
              item,
              (width - multiplerWidth) / 2,
              (height - multiplerHeight) / 2,
              multiplerWidth,
              multiplerHeight
            )
          // @ts-ignore
          gif.addFrame(destCanvas, { delay: myGif.duration / myGif.allFrames.length })
        })
        gif.on('finished', function (blob: Blob) {
          resolve(new File([blob], file.name, { type: 'image/gif' }))
        })
        // @ts-ignore
        gif.render()
      }
      myGif.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
export default gifCropper
