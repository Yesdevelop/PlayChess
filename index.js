import board from "./xiangqi.js"

alert("loading")

try {
  board.mount("board")
  alert("OK")
}
catch(err) {
  alert(err)
}