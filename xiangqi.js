// 这些变量是棋子常量 chessdef，加上队伍的形式为：chesstype * team
const rook = 1
const knight = 2
const bishop = 3
const guard = 4
const king = 5
const cannon = 6
const pawn = 7

const red = 1
const black = -1

export const defs = {
  rook, knight, bishop, guard, king, cannon, pawn, red, black
}

// 错误信息常量
const errPrefix = "[Board Error]: "

/**
 * 判断是否是红方
 */
function isRed(id) {
  return id > 0
}

/**
 * 构造位置
 */
function pos(x, y) {
  return { x, y }
}

/**
 * 是否在王区内
 */
function isInKingzone(x, y, team) {
  if (team === red) return x >= 3 && x <= 5 && y >= 0 && y <= 2
  else return x >= 3 && x <= 5 && y >= 7 && y <= 9
}

/**
 * 是否在家门内
 */
function isInHome(x, y, team) {
  if (team === red) return x >= 0 && x <= 8 && y >= 0 && y <= 4
  else return x >= 0 && x <= 8 && y >= 5 && y <= 9
}

/**
 * 是否在棋盘内
 */
function isInBoard(x, y) {
  return x >= 0 && x <= 8 && y >= 0 && y <= 9
}

/**
 * 获取棋子id * team对应的棋子类型（即id绝对值）
 */
function getChessdef(id) {
  return Math.abs(id)
}

/**
 * 棋盘类
 * 仅实现核心功能，ui部分需要constructor参数填写
 * @param {Object} view 装着所有ui方法
 */
export class Board {
  isRedTurn = true
  moves = []
  chessMap = [
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

  constructor(view) {
    this.view = view
  }

  /**
   * 获取指定位置上的棋子的所有可行着法
   * @param {number} x 横坐标，以0开始
   * @param {number} y 纵坐标，以0开始
   * @returns {Array} 所有走法构成的数组（暂时包括违规的走法，比如送将）
   */
  getMovesOfChess(x, y) {
    const chess = getChessdef(this.chessOn(x, y))
    switch (chess) {
      case king:
        return this.#king(x, y)
      case guard:
        return this.#guard(x, y)
      case bishop:
        return this.#bishop(x, y)
      case knight:
        return this.#knight(x, y)
      case pawn:
        return this.#pawn(x, y)
      case rook:
        return this.#rook(x, y)
      case cannon:
        return this.#cannon(x, y)
    }
  }

  /**
   * 获取指定位置上的棋子
   * @param {number} x
   * @param {number} y
   */
  chessOn(x, y) {
    if (this.chessMap[x]) {
      return this.chessMap[x][y]
    }
  }

  /**
   * 移动棋子到某处
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   */
  moveTo(x1, y1, x2, y2) {
    this.chessMap[x2][y2] = this.chessMap[x1][y1]
    this.chessMap[x1][y1] = 0
    this.isRedTurn = !this.isRedTurn
  }

  // Utils //

  /**
   *  获取指定位置上的棋子的队伍
   */
  #teamOn(x, y) {
    if (this.chessOn(x, y) !== 0) {
      return isRed(this.chessOn(x, y)) ? red : black
    }
    else {
      throw new Error(errPrefix + "attempt to get team type on an empty place!")
    }
  }

  /**
   * 计算是否可以从位置一走棋到位置二
   */
  #canMove(x1, y1, x2, y2) {
    console.log(isInBoard(x2, y2))
    if (isInBoard(x2, y2) === false) {
      return false
    }
    let chess = this.chessOn(x2, y2)
    if (chess === 0) {
      return true
    }
    let team1 = this.#teamOn(x1, y1)
    let team2 = this.#teamOn(x2, y2)
    if (team2 !== team1) {
      return true
    }
    return false
  }

  // ChessMoveMethods //

  /**
   * 帅
   */
  #king(x, y) {
    const team = this.#teamOn(x, y)
    const id = this.chessOn(x, y)
    let result = [
      pos(x + 1, y), pos(x - 1, y),
      pos(x, y + 1), pos(x, y - 1)
    ]
    result = result.filter((v) => isInKingzone(v.x, v.y, team) && this.#canMove(x, y, v.x, v.y))
    // 白脸将
    let enemyKingPos = null
    for (let k in this.chessMap[x]) {
      const chessid = this.chessMap[x][k]
      if (-chessid === id) {
        enemyKingPos = pos(x, k)
      }
      if (chessid !== 0 && getChessdef(chessid) !== king) {
        enemyKingPos = null
        break
      }
    }
    if (enemyKingPos) {
      result.push(enemyKingPos)
    }
    return result
  }

  /**
   * 士
   */
  #guard(x, y) {
    const team = this.#teamOn(x, y)
    let result = [
      pos(x + 1, y + 1), pos(x + 1, y - 1),
      pos(x - 1, y + 1), pos(x - 1, y - 1)
    ]
    result = result.filter((v) => isInKingzone(v.x, v.y, team) && this.#canMove(x, y, v.x, v.y))
    return result
  }

  /**
   * 相
   */
  #bishop(x, y) {
    const team = this.#teamOn(x, y)
    let result = []

    if (this.chessOn(x + 1, y + 1) === 0 && this.#canMove(x, y, x + 2, y + 2))
      result.push(pos(x + 2, y + 2))
    if (this.chessOn(x + 1, y - 1) === 0 && this.#canMove(x, y, x + 2, y - 2))
      result.push(pos(x + 2, y - 2))
    if (this.chessOn(x - 1, y + 1) === 0 && this.#canMove(x, y, x - 2, y + 2))
      result.push(pos(x - 2, y + 2))
    if (this.chessOn(x - 1, y - 1) === 0 && this.#canMove(x, y, x - 2, y - 2))
      result.push(pos(x - 2, y - 2))

    result = result.filter((v) => isInHome(v.x, v.y, team))

    return result
  }

  /**
   * 马
   */
  #knight(x, y) {
    let result = []

    if (this.chessOn(x + 1, y) === 0) {
      result.push(pos(x + 2, y + 1))
      result.push(pos(x + 2, y - 1))
    }
    if (this.chessOn(x - 1, y) === 0) {
      result.push(pos(x - 2, y + 1))
      result.push(pos(x - 2, y - 1))
    }
    if (this.chessOn(x, y + 1) === 0) {
      result.push(pos(x + 1, y + 2))
      result.push(pos(x - 1, y + 2))
    }
    if (this.chessOn(x, y - 1) === 0) {
      result.push(pos(x + 1, y - 2))
      result.push(pos(x - 1, y - 2))
    }
    return result.filter((v) => {
      console.log(this.#canMove(x, y, v.x, v.y))
      return this.#canMove(x, y, v.x, v.y)
    })
  }

  /**
   * 兵
   */
  #pawn(x, y) {
    const team = this.#teamOn(x, y)
    if (isInHome(x, y, team)) {
      if (team === red) {
        return [pos(x, y + 1)].filter((v) => this.#canMove(x, y, v.x, v.y))
      }
      else {
        return [pos(x, y - 1)].filter((v) => this.#canMove(x, y, v.x, v.y))
      }
    }
    else {
      if (team === red) {
        return [pos(x + 1, y), pos(x - 1, y),
        pos(x, y + 1)].filter((v) => this.#canMove(x, y, v.x, v.y))
      }
      else {
        return [pos(x + 1, y), pos(x - 1, y),
        pos(x, y - 1)].filter((v) => this.#canMove(x, y, v.x, v.y))
      }
    }
  }

  /**
   * 车
   */
  #rook(x, y) {
    let result = []
    let x_ = x
    let y_ = y
    let rookMove = (x_, y_) => {
      if (this.chessOn(x_, y_) === 0) {
        result.push(pos(x_, y_))
      }
      else if (this.#canMove(x, y, x_, y_)) {
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

  /**
   * 炮
   */
  #cannon(x, y) {
    const team = this.#teamOn(x, y)
    let result = []
    let x_ = x
    let y_ = y
    while (x_ < 8) {
      x_++
      if (this.chessOn(x_, y) === 0) {
        result.push(pos(x_, y))
      } else {
        while (x_ < 8) {
          x_++
          if (this.chessOn(x_, y) !== 0 && this.#teamOn(x_, y) !== team) {
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
      if (this.chessOn(x_, y) === 0) {
        result.push(pos(x_, y))
      } else {
        while (x_ > 0) {
          x_--
          if (this.chessOn(x_, y) !== 0 && this.#teamOn(x_, y) !== team) {
            result.push(pos(x_, y))
            break
          }
        }
        break
      }
    }
    while (y_ < 9) {
      y_++
      if (this.chessOn(x, y_) === 0) {
        result.push(pos(x, y_))
      } else {
        while (y_ < 9) {
          y_++
          if (this.chessOn(x, y_) !== 0 && this.#teamOn(x, y_) !== team) {
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
      if (this.chessOn(x, y_) === 0) {
        result.push(pos(x, y_))
      } else {
        while (y_ > 0) {
          y_--
          if (this.chessOn(x, y_) !== 0 && this.#teamOn(x, y_) !== team) {
            result.push(pos(x, y_))
            break
          }
        }
        break
      }
    }
    return result
  }
}
