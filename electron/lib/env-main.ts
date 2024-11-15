import url, {fileURLToPath} from "node:url";
import {BrowserView, BrowserWindow} from "electron";
import {isPackaged} from "./env";
import path, {join} from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, 'public')
    : RENDERER_DIST

export const preloadDefault = path.join(MAIN_DIST, 'preload/index.mjs')

export const rendererLoadPath = (window: BrowserWindow | BrowserView, fileName: string) => {
    if (!isPackaged && process.env.VITE_DEV_SERVER_URL) {
        const x = new url.URL(rendererDistPath(fileName));
        if (window instanceof BrowserView) {
            window.webContents.loadURL(x.toString());
        } else {
            window.loadURL(x.toString());
        }
    } else {
        if (window instanceof BrowserView) {
            window.webContents.loadFile(rendererDistPath(fileName));
        } else {
            window.loadFile(rendererDistPath(fileName));
        }
    }
}

function rendererDistPath(fileName: string) {
    if (!isPackaged && process.env.VITE_DEV_SERVER_URL) {
        return `${process.env.VITE_DEV_SERVER_URL}/${fileName}`;
    }
    return join(RENDERER_DIST, fileName);
}
