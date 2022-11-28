import React from "react"

const Enemy = () => {
    let enemySize = 400
    let bit = enemySize / 10

    const canvas = React.useRef();

    let specials = {
        gold:{
            chanceToRender: 1,
            chanceToSpread: 90,
            color: "gold", 
            priority: 10
        }
    }


    React.useEffect(() => {
        let specialCount = 0;
        const t0 = performance.now()

        let ctx = canvas.current.getContext("2d", {
            willReadFrequently: true
        })
        

        //SQUARE DEFINITION
        function square(x, y, size, color) {
            ctx.fillStyle = color
            ctx.fillRect(x, y, size, size )
        }

        //BASE, renders all black/empty squares
        function renderBase() {
            for (let i = 0; i <= enemySize; i += bit) {
                for (let k = 0; k <= enemySize; k += bit) {
                    square(i, k, bit, "rgb(1,1,1)") 
                } 
            } 
        }

        renderBase()
        
        //Special squares
        let toCheck = []
        //generate starting 
        function baseSpecial(type){
            let roll;

            for (let i = 0; i <= enemySize; i += bit) {
                for (let k = 0; k <= enemySize; k += bit) {
                    roll = Math.random()*100
                    if(roll <= type.chanceToRender){
                        square(i, k, bit, `${type.color}`)
                        toCheck.push([i, k])
                        specialCount++;
                    }
                }
            }
        }

        baseSpecial(specials.gold)

        //given [x, y] arr returns color at that pixel
        function checkColor(arr){
            let x = arr[0]
            let y = arr[1]

            let r,g,b;

            [r,g,b] = ctx.getImageData(x, y, 1, 1).data

            return `rgb(${r}, ${g}, ${b})`
        }

        
        //given an array[x,y] returns its neighbours, can return out of bound 
        function getSurrounding(arr){
            let x = arr[0]
            let y = arr[1]
    
            return [[x-bit, y-bit], [x-bit,y], [x-bit, y +bit], [x, y-bit], [x, y+bit], [x+bit, y-bit], [x+bit, y], [x+bit, y+bit]]
        }

        function recurse(type, point){
            //Base case
            if(toCheck.length === 0 || specialCount > Math.pow((enemySize/bit), 2)){
                return 
            }

            let arr = getSurrounding(point)

            for (let i = 0; i < arr.length; i++) {
                if(checkColor(arr[i]) === `rgb(1, 1, 1)`){
                    let roll = Math.random()
                    if(roll*100 <= type.chanceToSpread){
                        square(arr[i][0], arr[i][1], bit, `${type.color}`)
                        specialCount++
                        recurse(type, arr[i])
                    }
                }

                
            }
        }

        function spread(type, arr){ 
            for (let i = toCheck.length - 1; i > 0; i--) {
                recurse(type, arr[i])
                toCheck.pop()
            }
        }

        spread(specials.gold, toCheck)
        console.log("Specials: " + specialCount);

        const t1 = performance.now()
        console.log("Load: " + Math.ceil(t1 - t0) + " ms");

        }
    )

  return (
    <canvas width={`${enemySize}px`} height={`${enemySize}px`} id="enemyCanvas" ref={canvas}></canvas>
  )
}

export default Enemy