/**
 * 象棋
 * @author 夜水
 * @version 1.0.0
 */

// DEFINES

const rook = 1
const knight = 2
const bishop = 3
const guard = 4
const king = 5
const cannon = 6
const pawn = 7
const red = 1
const black = -1

// UTILS

let isRed = (id) => id > 0
let pos = (x, y) => { return { x, y } }
let isInKingzone = (x, y, team) => {
  if (team === red) return x >= 3 && x <= 5 && y >= 0 && y <= 2
  else return x >= 3 && x <= 5 && y >= 7 && y <= 9
}
let isInHome = (x, y, team) => {
  if (team === red) return x >= 0 && x <= 8 && y >= 0 && y <= 4
  else return x >= 0 && x <= 8 && y >= 5 && y <= 9
}
let isInRange = (x, y) => x >= 0 && x <= 8 && y >= 0 && y <= 9

// BOARD

let board = {
  width: 9,
  height: 10,
  isRedTurn: true,
  moves: [],
  chessMap: [
    [rook * red, 0, 0, pawn * red, 0, 0, pawn * black, 0, 0, rook * black],
    [knight * red, 0, cannon * red, 0, 0, 0, 0, cannon * black, 0, knight * black],
    [bishop * red, 0, 0, pawn * red, 0, 0, pawn * black, 0, 0, bishop * black],
    [guard * red, 0, 0, 0, 0, 0, 0, 0, 0, guard * black],
    [king * red, 0, 0, pawn * red, 0, 0, pawn * black, 0, 0, king * black],
    [guard * red, 0, 0, 0, 0, 0, 0, 0, 0, guard * black],
    [bishop * red, 0, 0, pawn * red, 0, 0, pawn * black, 0, 0, bishop * black],
    [knight * red, 0, cannon * red, 0, 0, 0, 0, cannon * black, 0, knight * black],
    [rook * red, 0, 0, pawn * red, 0, 0, pawn * black, 0, 0, rook * black],
  ]
}

// BOARD UTILS

// 获取指定位置上的棋子
board.chessOn = (x, y) => {
  if (board.chessMap[x]) {
    return board.chessMap[x][y]
  }
}

// 获取指定位置上的棋子的队伍
board.teamOn = (x, y) => isRed(board.chessOn(x, y)) ? red : black

// 计算是否可以从位置一走棋到位置二
board.canMove = (x1, y1, x2, y2) => {
  if (isInRange(x2, y2) === false) {
    return false
  }
  let chess = board.chessOn(x2, y2)
  if (chess === 0) {
    return true
  }
  let team1 = board.teamOn(x1, y1)
  let team2 = board.teamOn(x2, y2)
  if (team2 !== team1) {
    return true
  }
  return false
}

// 获取指定位置上的棋子的所有可行着法
board.getMovesOfChess = (x, y) => {
  let team = board.teamOn(x, y)
  let chess = Math.abs(board.chessOn(x, y))

  switch (chess) {
    case king:
      return board.king(x, y)
    case guard:
      return board.guard(x, y)
    case bishop:
      return board.bishop(x, y)
    case knight:
      return board.knight(x, y)
    case pawn:
      return board.pawn(x, y)
    case rook:
      return board.rook(x, y)
    case cannon:
      return board.cannon(x, y)
  }
}

// BOARD CHESS MOVE FUNCTIONS

// 帅
board.king = (x, y) => {
  const team = board.teamOn(x, y)
  let result = [
    pos(x + 1, y), pos(x - 1, y),
    pos(x, y + 1), pos(x, y - 1)
  ]

  result = result.filter((v) => isInKingzone(v.x, v.y, team) && board.canMove(x, y, v.x, v.y))

  // 白脸将
  board.chessMap[x].forEach((v, k) => {
    if (Math.abs(v) === king && k !== y) {
      result.push(pos(x, k))
    }
  })

  return result
}

// 士
board.guard = (x, y) => {
  const team = board.teamOn(x, y)
  let result = [
    pos(x + 1, y + 1), pos(x + 1, y - 1),
    pos(x - 1, y + 1), pos(x - 1, y - 1)
  ]

  result = result.filter((v) => isInKingzone(v.x, v.y, team) && board.canMove(x, y, v.x, v.y))

  return result
}

// 相
board.bishop = (x, y) => {
  const team = board.teamOn(x, y)
  let result = []

  if (board.chessOn(x + 1, y + 1) === 0 && board.canMove(x, y, x + 2, y + 2))
    result.push(pos(x + 2, y + 2))
  if (board.chessOn(x + 1, y - 1) === 0 && board.canMove(x, y, x + 2, y - 2))
    result.push(pos(x + 2, y - 2))
  if (board.chessOn(x - 1, y + 1) === 0 && board.canMove(x, y, x - 2, y + 2))
    result.push(pos(x - 2, y + 2))
  if (board.chessOn(x - 1, y - 1) === 0 && board.canMove(x, y, x - 2, y - 2))
    result.push(pos(x - 2, y - 2))

  result = result.filter((v) => isInHome(v.x, v.y, team))

  return result
}

// 马
board.knight = (x, y) => {
  let result = []

  if (board.chessOn(x + 1, y) === 0) {
    result.push(pos(x + 2, y + 1))
    result.push(pos(x + 2, y - 1))
  }
  if (board.chessOn(x - 1, y) === 0) {
    result.push(pos(x - 2, y + 1))
    result.push(pos(x - 2, y - 1))
  }
  if (board.chessOn(x, y + 1) === 0) {
    result.push(pos(x + 1, y + 2))
    result.push(pos(x - 1, y + 2))
  }
  if (board.chessOn(x, y - 1) === 0) {
    result.push(pos(x + 1, y - 2))
    result.push(pos(x - 1, y - 2))
  }

  return result.filter((v) => board.canMove(x, y, v.x, v.y))
}

// 兵
board.pawn = (x, y) => {
  const team = board.teamOn(x, y)

  if (isInHome(x, y, team)) {
    if (team === red) {
      return [pos(x, y + 1)].filter((v) => board.canMove(x, y, v.x, v.y))
    }
    else {
      return [pos(x, y - 1)].filter((v) => board.canMove(x, y, v.x, v.y))
    }
  }
  else {
    if (team === red) {
      return [pos(x + 1, y), pos(x - 1, y),
      pos(x, y + 1)].filter((v) => board.canMove(x, y, v.x, v.y))
    }
    else {
      return [pos(x + 1, y), pos(x - 1, y),
      pos(x, y - 1)].filter((v) => board.canMove(x, y, v.x, v.y))
    }
  }
}

// 车
board.rook = (x, y) => {
  let result = []
  let x_ = x
  let y_ = y
  let rookMove = (x_, y_) => {
    if (board.chessOn(x_, y_) === 0) {
      result.push(pos(x_, y_))
    }
    else if (board.canMove(x, y, x_, y_)) {
      result.push(pos(x_, y_))
      return 1
    }
    else {
      return 1
    }
  }

  while (x_ < 8) {
    x_++
    if (rookMove(x_, y) === 1) break
  }

  x_ = x
  while (x_ > 0) {
    x_--
    if (rookMove(x_, y) === 1) break
  }

  while (y_ < 9) {
    y_++
    if (rookMove(x, y_) === 1) break
  }

  y_ = y
  while (y_ > 0) {
    y_--
    if (rookMove(x, y_) === 1) break
  }

  return result
}

// 炮
board.cannon = (x, y) => {
  const team = board.teamOn(x, y)
  let result = []
  let x_ = x
  let y_ = y

  while (x_ < 8) {
    x_++
    if (board.chessOn(x_, y) === 0) result.push(pos(x_, y))
    else {
      while (x_ < 8) {
        x_++
        if (board.teamOn(x_, y) !== team && board.chessOn(x_, y) !== 0) {
          result.push(pos(x_, y))
          break
        }
      }
      break
    }
  }

  x_ = x
  while (x_ > 0) {
    x_--
    if (board.chessOn(x_, y) === 0) result.push(pos(x_, y))
    else {
      while (x_ > 0) {
        x_--
        if (board.teamOn(x_, y) !== team && board.chessOn(x_, y) !== 0) {
          result.push(pos(x_, y))
          break
        }
      }
      break
    }
  }

  while (y_ < 9) {
    y_++
    if (board.chessOn(x, y_) === 0) result.push(pos(x, y_))
    else {
      while (y_ < 9) {
        y_++
        if (board.teamOn(x, y_) !== team && board.chessOn(x, y_) !== 0) {
          result.push(pos(x, y_))
          break
        }
      }
      break
    }
  }

  y_ = y
  while (y_ > 0) {
    y_--
    if (board.chessOn(x, y_) === 0) result.push(pos(x, y_))
    else {
      while (y_ > 0) {
        y_--
        if (board.teamOn(x, y_) !== team && board.chessOn(x, y_) !== 0) {
          result.push(pos(x, y_))
          break
        }
      }
      break
    }
  }

  return result
}

// WEB ACTIONS

let el = null

/**
 * 获取指定位置的square
 */
board.square = (x, y) => el.children[x].children[y]

/**
 * 注册棋盘到指定id的div
 * @param {string} elementid 
 */
board.mount = (elementid) => {
  el = document.getElementById(elementid)
  board.render()
}

/**
 * 根据id获取棋子名称
 * @param {number} id 
 */
board.chessName = (id) => {
  switch (Math.abs(id)) {
    case king:
      return isRed(id) ? "帅" : "将"
    case guard:
      return isRed(id) ? "仕" : "士"
    case bishop:
      return isRed(id) ? "相" : "象"
    case knight:
      return "马"
    case rook:
      return "車"
    case cannon:
      return "炮"
    case pawn:
      return isRed(id) ? "兵" : "卒"
  }
}

/**
 * 渲染棋盘到指定DOM
 * @param {Element} elementid
 */
board.render = () => {
  board.chessMap.forEach((col, x) => {
    let colNode = document.createElement("div")
    colNode.className = "col"
    let colElement = el.appendChild(colNode)

    col.forEach((v, y) => {
      let squareNode = document.createElement("div")
      squareNode.className = "square"
      let squareElement = colElement.appendChild(squareNode)

      if (v !== 0) {
        let chessNode = document.createElement("div")
        let team = board.teamOn(x, y) === red ? "red" : "black"
        chessNode.textContent = board.chessName(v)
        chessNode.className = "chess " + team
        chessNode.x = x
        chessNode.y = y
        chessNode.onclick = () => board.select(x, y)
        squareElement.appendChild(chessNode)
      }
    })
  })
}

let selection = null
let moveablePositions = []

/**
 * 走棋
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 */
board.moveChess = (x1, y1, x2, y2) => {
  board.chessMap[x2][y2] = board.chessMap[x1][y1]
  board.chessMap[x1][y1] = 0
  board.moves.push({ from: pos(x1, y1), to: pos(x2, y2) })
  // toggle isredturn
  board.isRedTurn = !board.isRedTurn
  // render
  el.innerHTML = ""
  board.render()
}

/**
 * 选中某位置
 * @param {number} x 
 * @param {number} y 
 * @returns 
 */
board.select = (x, y) => {
  // 根据当前回合决定是否理会玩家的点击事件
  let condition1 = board.isRedTurn === true && board.teamOn(x, y) === black
  let condition2 = board.isRedTurn === false && board.teamOn(x, y) === red
  if (condition1 || condition2) {
    return false
  }
  
  // 清除上一次高亮
  if (selection) {
    let chessElement = board.square(selection.x, selection.y).children[0]
    if (chessElement) {
      chess.removeAttribute("style")
    }
  }
  moveablePositions.forEach((v) => {
    let square = board.square(v.x, v.y)
    square.removeAttribute("style")
    let chessElement = square.children[0]
    if (chessElement) {
      chessElement.removeAttribute("style")
    }
  })
  
  // 设置选中的棋子
  selection = pos(x, y)
  board.highlight(x, y, 1)
  
  // 获取并高亮所有着法
  moveablePositions = board.getMovesOfChess(x, y)
  moveablePositions.forEach((v) => {
    board.highlight(v.x, v.y, 2)
    board.square(v.x, v.y).onclick = () => board.moveChess(x, y, v.x, v.y)
  })
}

/**
 * 高亮某个位置
 * @param {number} x 
 * @param {number} y 
 * @param {number} style 1: select 2: moveable
 */
board.highlight = (x, y, style) => {
  const selectStyle = "var(--highlight-select-outline)"
  const moveableStyle = "var(--highlight-moveable-background)"
  
  switch (style) {
    case 1:
      board.square(x, y).children[0].style.outline = selectStyle
      break
    case 2:
      let square = board.square(x, y)
      square.style.backgroundColor = moveableStyle
      square.style.borderRadius = "100%"
      break
  }
}

export default board
