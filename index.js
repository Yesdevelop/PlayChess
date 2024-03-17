import { Board, defs } from "./xiangqi.js"

// 图床url
const imagesHosting = {
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

// 本地图库url
const imagesLocal = {
  board: "./assets/chess_images/board.png",
  redRook: "./assets/chess_images/red_rook.png",
  redKnight: "./assets/chess_images/red_knight.png",
  redBishop: "./assets/chess_images/red_bishop.png",
  redGuard: "./assets/chess_images/red_guard.png",
  redKing: "./assets/chess_images/red_king.png",
  redCannon: "./assets/chess_images/red_cannon.png",
  redPawn: "./assets/chess_images/red_pawn.png",
  blackRook: "./assets/chess_images/black_rook.png",
  blackKnight: "./assets/chess_images/black_knight.png",
  blackBishop: "./assets/chess_images/black_bishop.png",
  blackGuard: "./assets/chess_images/black_guard.png",
  blackKing: "./assets/chess_images/black_king.png",
  blackCannon: "./assets/chess_images/black_cannon.png",
  blackPawn: "./assets/chess_images/black_pawn.png",
  redChosen: "./assets/chess_images/red_chosen.png",
  blackChosen: "./assets/chess_images/black_chosen.png"
}

let images = null

/*
if (location.href.match(/(localhost)|(127\.0\.0\.1)/g)) {
  images = imagesLocal
}
else {
  images = imagesHosting
}
*/
images = imagesLocal

/**
 * 根据棋子id获取图片地址
 * @param {number} id 棋子id
 * @returns 图片地址
 */
function getUrlById(id) {
  switch (id) {
    case defs.red * defs.rook:
      return images.redRook
    case defs.red * defs.knight:
      return images.redKnight
    case defs.red * defs.bishop:
      return images.redBishop
    case defs.red * defs.guard:
      return images.redGuard
    case defs.red * defs.king:
      return images.redKing
    case defs.red * defs.cannon:
      return images.redCannon
    case defs.red * defs.pawn:
      return images.redPawn
    case defs.black * defs.rook:
      return images.blackRook
    case defs.black * defs.knight:
      return images.blackKnight
    case defs.black * defs.bishop:
      return images.blackBishop
    case defs.black * defs.guard:
      return images.blackGuard
    case defs.black * defs.king:
      return images.blackKing
    case defs.black * defs.cannon:
      return images.blackCannon
    case defs.black * defs.pawn:
      return images.blackPawn
    default:
      throw new Error("Error: No Chess Matched width id called " + id)
  }
}

let boardEl = null
let highlights = []

const redChosen = 1
const blackChosen = 2

/**
 * 选中棋子
 * @param {number} x
 * @param {number} y
 */
function selectChess(x, y) {
  if (
    board.chessOn(x, y) > 0 && board.isRedTurn === true ||
    board.chessOn(x, y) < 0 && board.isRedTurn === false
  ) {
    highlights.forEach((v) => v.style.backgroundImage = "none")
    highlights = []

    const squareContentEl = document.querySelector(`div[pos-x="${x}"][pos-y="${y}"]`)
    const squareEl = squareContentEl.parentElement
    const id = board.chessOn(x, y)
    const moves = board.getMovesOfChess(x, y)
    let chosen = null

    if (id > 0) {
      highlight(squareEl, redChosen)
      chosen = redChosen
    }
    else {
      highlight(squareEl, blackChosen)
      chosen = blackChosen
    }

    moves.forEach((v) => {
      const squareContentEl = document.querySelector(`div[pos-x="${v.x}"][pos-y="${v.y}"]`)
      const squareEl = squareContentEl.parentElement
      squareContentEl.onclick = () => move(x, y, v.x, v.y)
      highlight(squareEl, chosen)
    })
  }
}

/**
 * 移动棋子
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
function move(x1, y1, x2, y2) {
  board.moveTo(x1, y1, x2, y2)
  board.view.render(board)
}

/**
 * 高亮某个元素
 * @param {Element} el
 * @param {number} style
 */
function highlight(el, style) {
  switch (style) {
    case redChosen:
      el.style.backgroundImage = `url(${images.redChosen})`
      break
    case blackChosen:
      el.style.backgroundImage = `url(${images.blackChosen})`
      break
  }
  highlights.push(el)
}

const board = new Board({
  /**
   * 设置棋盘挂载的元素
   * @param {string} elementSelector 元素的selector
   */
  setElement(elementSelector) {
    boardEl = document.querySelector(elementSelector)
    boardEl.style.backgroundImage = `url(${images.board})`
  },

  /**
   * 渲染棋盘
   * @param {Board} boardObj
   */
  render(boardObj) {
    boardEl.innerHTML = ""

    boardObj.chessMap.forEach((col, x) => {
      let colEl = document.createElement("div")
      colEl.className = "col"

      col.forEach((id, y) => {
        let squareEl = document.createElement("div")
        squareEl.className = "square"

        let squareContent = document.createElement("div")
        squareContent.className = "square-content"
        squareContent.setAttribute("pos-x", x)
        squareContent.setAttribute("pos-y", y)

        if (id !== 0) {
          const imgurl = getUrlById(id)
          squareContent.style.backgroundImage = `url(${imgurl})`
          squareContent.onclick = () => selectChess(x, y)
        }

        squareEl.appendChild(squareContent)

        colEl.appendChild(squareEl)
      })

      boardEl.appendChild(colEl)
    })
  }
})

board.view.setElement("#board")
board.view.render(board)
