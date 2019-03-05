import {BrowserWindow} from 'electron'

const WIDTH = 400
const HEIGHT = 24

// globals
// =

var windows = {} // map of {[parent.id] => BrowserWindow}

// exported api
// =

export function setup (parent) {
  windows[parent.id] = new BrowserWindow({
    width: WIDTH,
    height: HEIGHT,
    parent,
    frame: false,
    transparent: true,
    resizable: false,
    maximizable: false,
    show: false,
    fullscreenable: false,
    hasShadow: false,
    webPreferences: {
      defaultEncoding: 'utf-8'
    }
  })
  windows[parent.id].loadFile('status-bar.html')
}

export function destroy (parent) {
  if (get(parent)) {
    get(parent).close()
    delete windows[parent.id]
  }
}

export function get (parent) {
  return windows[parent.id]
}

export function reposition (parent) {
  var win = get(parent)
  if (win) {
    var {x, y, height} = parent.getBounds()
    win.setBounds({x, y: y + height - HEIGHT})
  }
}

export function show (parent) {
  var win = get(parent)
  if (win) {
    reposition(parent)
    win.showInactive()
  }
}

export function hide (parent) {
  if (get(parent)) {
    get(parent).hide()
  }
}

export function set (parent, value) {
  var win = get(parent)
  if (win) {
    if (value) {
      show(parent)
      win.webContents.executeJavaScript(`set('${value}')`)
    } else {
      hide(parent)
    }
  }
}