import {BrowserWindow} from "electron";
import {preloadDefault} from "../lib/env-main";
import {AppRuntime} from "../mapi/env";
import {t} from "../config/lang";
import {Page} from "./index";

export const PageUser = {
    NAME: 'user',
    open: async (option: any) => {
        const win = new BrowserWindow({
            title: t('用户中心'),
            parent: AppRuntime.mainWindow,
            minWidth: 800,
            minHeight: 600,
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                webSecurity: false,
                preload: preloadDefault,
                webviewTag: true,
            },
            show: true,
            frame: false,
            center: true,
            transparent: false,
        });
        return Page.openWindow(PageUser.NAME, win, "page/user.html");
    }
}
