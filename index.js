import { Board, defs } from "./xiangqi.js"

// 图床urls
const images = {
  board: "https://pic.imgdb.cn/item/65e455a19f345e8d03007ee8.png",
  redRook: "https://pic.imgdb.cn/item/65e455ad9f345e8d0300a7f8.png",
  redPawn: "https://pic.imgdb.cn/item/65e455ad9f345e8d0300a7a2.png",
  redGuard: "https://pic.imgdb.cn/item/65e455a79f345e8d030091f1.png",
  redChosen: "https://pic.imgdb.cn/item/65e455a79f345e8d0300919f.png",
  redCannon: "https://pic.imgdb.cn/item/65e455a69f345e8d0300914a.png",
  redKnight: "https://pic.imgdb.cn/item/65e455a69f345e8d030090fd.png",
  redKing: "https://pic.imgdb.cn/item/65e455a69f345e8d03009093.png",
  redBishop: "https://pic.imgdb.cn/item/65e455a19f345e8d03007be5.png",
  blackRook: "https://pic.imgdb.cn/item/65e455a19f345e8d03007d9e.png",
  blackPawn: "https://pic.imgdb.cn/item/65e455a19f345e8d03007c44.png",
  blackKnight: "https://pic.imgdb.cn/item/65e455a19f345e8d03007c06.png",
  blackChosen: "https://pic.imgdb.cn/item/65e4559a9f345e8d030062b8.png",
  blackCannon: "https://pic.imgdb.cn/item/65e4559a9f345e8d03006286.png",
  blackBishop: "https://pic.imgdb.cn/item/65e4559a9f345e8d0300622d.png",
  blackKing: "https://pic.imgdb.cn/item/65e4559a9f345e8d030061aa.png",
  blackGuard: "https://pic.imgdb.cn/item/65e455999f345e8d030060f0.png"
}

let element = null

const board = new Board({
  /**
   * 设置棋盘挂载的元素
   * @param {string} elementSelector 元素的selector
   */
  setElement(elementSelector) {
    element = document.querySelector(elementSelector)
  },

  /**
   * 渲染棋盘
   * @param {Board} boardObj
   */
  render(boardObj) {
    for (let col of boardObj.chessMap) {
      for (let v of col) {
        let element = document.createElement("div")
        // TODO
      }
    }
  }
})