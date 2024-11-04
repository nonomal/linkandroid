import {app, BrowserWindow, ipcMain, screen, shell} from "electron";
import {WindowConfig} from "../../config/window";
import {AppRuntime} from "../env";
import {isMac} from "../../lib/env";


const getWindowByName = (name: string) => {
    if (!name || 'main' === name) {
        return AppRuntime.mainWindow
    }
    return AppRuntime.windows[name]
}

const getCurrentWindow = (window, e) => {
    let originWindow = BrowserWindow.fromWebContents(e.sender);
    // if (originWindow !== window) originWindow = detachInstance.getWindow();
    return originWindow;
}

const winPosition = {
    x: 0,
    y: 0,
    id: -1,
    getPosition(): { x: number; y: number } {
        const {x, y} = screen.getCursorScreenPoint();
        const currentDisplay = screen.getDisplayNearestPoint({x, y});
        if (winPosition.id !== currentDisplay.id) {
            winPosition.id = currentDisplay.id;
            winPosition.x = parseInt(
                String(
                    currentDisplay.workArea.x + currentDisplay.workArea.width / 2 - 400
                )
            );
            winPosition.y = parseInt(
                String(
                    currentDisplay.workArea.y + currentDisplay.workArea.height / 2 - 200
                )
            );
        }
        return {
            x: winPosition.x,
            y: winPosition.y,
        };
    },
    setPosition(x: number, y: number): void {
        winPosition.x = x;
        winPosition.y = y;
    },
};

const quit = () => {
    app.quit()
}

const windowMin = () => {
    AppRuntime.mainWindow?.minimize()
}

const windowMax = () => {
    if (AppRuntime.mainWindow.isFullScreen()) {
        AppRuntime.mainWindow.setFullScreen(false)
        AppRuntime.mainWindow.unmaximize()
        AppRuntime.mainWindow.center()
    } else if (AppRuntime.mainWindow.isMaximized()) {
        AppRuntime.mainWindow.unmaximize()
        AppRuntime.mainWindow.center()
    } else {
        AppRuntime.mainWindow.setMinimumSize(WindowConfig.minWidth, WindowConfig.minHeight)
        AppRuntime.mainWindow.maximize()
    }
}

const windowSetSize = (width: number, height: number) => {
    AppRuntime.mainWindow.setMinimumSize(width, height)
    AppRuntime.mainWindow.setSize(width, height)
    AppRuntime.mainWindow.center()
}

ipcMain.handle('app:quit', () => {
    quit()
})

ipcMain.handle('app:openExternalWeb', (event, url: string) => {
    return shell.openExternal(url)
})

ipcMain.handle('window:min', () => {
    windowMin()
})
ipcMain.handle('window:max', () => {
    windowMax()
})
ipcMain.handle('window:setSize', (event, width: number, height: number) => {
    windowSetSize(width, height)
})

ipcMain.handle('window:close', (event, name: string) => {
    getWindowByName(name)?.close()
})

ipcMain.handle('window:hide', (event, name: string) => {
    getWindowByName(name)?.hide()
    if (isMac) {
        app.dock.hide()
    }
})

ipcMain.handle('window:move', (event, name: string | null, data: {
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
}) => {
    const {x, y} = screen.getCursorScreenPoint();
    const originWindow = getWindowByName(name);
    if (!originWindow) return;
    originWindow.setBounds({x: x - data.mouseX, y: y - data.mouseY, width: data.width, height: data.height});
    winPosition.setPosition(x - data.mouseX, y - data.mouseY);
})

export default {
    quit
}
