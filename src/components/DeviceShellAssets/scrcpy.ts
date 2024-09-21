import {debounce} from 'lodash-es'
import {createStderr, createStdout, textFormatter} from 'vue-command'
import {useFixCursor} from "./index";

export const useScrcpyCommand = ({loading, vueCommand, history}) => {
    const scrcpyCommand = async (args) => {
        loading.value = true
        const command = args.slice(1).join(' ')
        const appendToHistory = debounce(vueCommand.value.appendToHistory, 500)
        let stdoutText = ''
        let stderrText = ''
        window.$mapi.scrcpy.spawnShell(command, {
            stdout(text) {
                loading.value = false
                stdoutText += text
                useFixCursor(history)
                appendToHistory(createStdout(stdoutText))
            },
            stderr(text) {
                loading.value = false
                stderrText += text
                useFixCursor(history)
                appendToHistory(createStderr(stderrText))
            },
        })
        return textFormatter('Waiting...')
    }

    return {
        scrcpyCommand
    }
}
