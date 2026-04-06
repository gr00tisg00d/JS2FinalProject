<script>
import {
  difficultyMissions,
  projectFileBlueprints,
  singlePlayerDifficulties,
} from '@/data/homeChallenges.js'
import { themeOptions } from '@/data/themes.js'
import homeMenuLogo from '@/Images/website/owLJL.png'

const DEFAULT_IDE_PALETTE = {
  syntaxKeyword: '#ff8f70',
  syntaxFunction: '#ffd65a',
  syntaxVariable: '#8ee6ff',
  syntaxProperty: '#c9f27b',
  syntaxString: '#ffcf7d',
  syntaxNumber: '#ff9f9f',
  syntaxComment: '#6d8791',
}

const KEYWORD_PATTERN =
  /^(const|let|var|function|return|if|else|for|while|switch|case|break|continue|new|class|try|catch|finally|throw|true|false|null|undefined|typeof|instanceof|in|of)$/
const NUMBER_PATTERN = /^\d+(?:\.\d+)?$/
const TOKEN_PATTERN =
  /\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|[A-Za-z_$][\w$]*/g

function escapeHtml(value = '') {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function classifyIdentifier(line, startIndex, endIndex, value) {
  const before = line.slice(0, startIndex)
  const after = line.slice(endIndex)

  if (/\.\s*$/.test(before)) {
    return 'property'
  }

  if (/\bfunction\s+$/.test(before) || /^\s*\(/.test(after)) {
    return 'function'
  }

  if (/\b(?:const|let|var)\s+$/.test(before) || /^\s*(?:=|,|;)/.test(after)) {
    return 'variable'
  }

  if (/^\s*:/.test(after)) {
    return 'property'
  }

  return value ? '' : ''
}

function highlightJavaScriptLine(line = '') {
  if (!line) {
    return '&nbsp;'
  }

  let result = ''
  let cursor = 0

  line.replace(TOKEN_PATTERN, (match, offset) => {
    if (offset > cursor) {
      result += escapeHtml(line.slice(cursor, offset))
    }

    let tokenType = ''

    if (match.startsWith('//')) {
      tokenType = 'comment'
    } else if (/^["'`]/.test(match)) {
      tokenType = 'string'
    } else if (KEYWORD_PATTERN.test(match)) {
      tokenType = 'keyword'
    } else if (NUMBER_PATTERN.test(match)) {
      tokenType = 'number'
    } else {
      tokenType = classifyIdentifier(line, offset, offset + match.length, match)
    }

    const escapedMatch = escapeHtml(match)
    result += tokenType
      ? `<span class="token token--${tokenType}">${escapedMatch}</span>`
      : escapedMatch

    cursor = offset + match.length
    return match
  })

  if (cursor < line.length) {
    result += escapeHtml(line.slice(cursor))
  }

  return result || '&nbsp;'
}

const REVIEW_GUIDES = [
  {
    title: 'ReferenceError',
    summary: 'A name is being used before it exists in the current scope.',
    fix: 'Check spelling, confirm the variable was declared, and make sure the right object is being referenced.',
  },
  {
    title: 'TypeError',
    summary: 'JavaScript found a value, but the method or property on it is invalid.',
    fix: 'Verify the value type first, then use the exact method or property name that belongs to that type.',
  },
  {
    title: 'SyntaxError',
    summary: 'The parser hit invalid JavaScript before the code could run.',
    fix: 'Look for missing brackets, parentheses, commas, quotes, or mismatched template string expressions.',
  },
  {
    title: 'LogicError',
    summary: 'The code runs, but the output is still wrong.',
    fix: 'Trace inputs and intermediate values, then compare what the code does against what the result should be.',
  },
]

function normalizeCodeLine(line = '') {
  return line.replace(/\s+/g, ' ').trim()
}

function resolveModulePath(fromPath, specifier) {
  if (!specifier.startsWith('.')) {
    return specifier
  }

  const fromParts = fromPath.split('/')
  fromParts.pop()

  specifier.split('/').forEach((part) => {
    if (!part || part === '.') {
      return
    }

    if (part === '..') {
      fromParts.pop()
      return
    }

    fromParts.push(part)
  })

  return fromParts.join('/')
}

function buildBlueprintCode(file, useBuggyLines = false) {
  return file.entries
    .map((entry) => {
      if (typeof entry === 'string') {
        return entry
      }

      return useBuggyLines ? entry.buggy : entry.correct
    })
    .join('\n')
}

function transformVirtualModule(code) {
  const exportedNames = []

  let transformedCode = code.replace(
    /^\s*import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]([^'"]+)['"];?\s*$/gm,
    (_, imports, specifier) => `const { ${imports.trim()} } = require('${specifier}');`,
  )

  transformedCode = transformedCode.replace(
    /^\s*export\s+function\s+([A-Za-z_$][\w$]*)\s*\(/gm,
    (_, name) => {
      exportedNames.push(name)
      return `function ${name}(`
    },
  )

  transformedCode = transformedCode.replace(
    /^\s*export\s+const\s+([A-Za-z_$][\w$]*)\s*=\s*/gm,
    (_, name) => {
      exportedNames.push(name)
      return `const ${name} = `
    },
  )

  if (exportedNames.length > 0) {
    transformedCode += `\n${exportedNames.map((name) => `exports.${name} = ${name};`).join('\n')}`
  }

  return transformedCode
}

function extractExecutionLocation(error) {
  const stack = String(error?.stack ?? '')
  const match = stack.match(/<anonymous>:(\d+):(\d+)/)

  if (!match) {
    return null
  }

  return {
    lineNumber: Number(match[1]),
    columnNumber: Number(match[2]),
  }
}

function formatRuntimeError(error) {
  if (error instanceof SyntaxError) {
    return 'SyntaxError'
  }

  if (error instanceof TypeError) {
    return 'TypeError'
  }

  if (error instanceof ReferenceError) {
    return 'ReferenceError'
  }

  return error?.name || 'RuntimeError'
}

function createValidationEntry(errorName, filePath, message, location = null) {
  return {
    errorName,
    filePath,
    message,
    location,
  }
}
const GAME_MODE_OPTIONS = [
  {
    id: 'custom-lobby',
    title: 'Custom Lobby',
    iconClass: 'bi-people-fill',
    status: 'Online Soon',
    available: false,
  },
  {
    id: 'ranked-1v1',
    title: '1v1 Ranked',
    iconClass: 'bi-trophy-fill',
    status: 'Online Soon',
    available: false,
  },
  {
    id: 'single-player',
    title: 'Single Player',
    iconClass: 'bi-terminal-fill',
    status: 'Ready',
    available: true,
  },
]
const SINGLE_PLAYER_FORMATS = [
  {
    id: '3-minute',
    title: '3 Mins',
    subtitle: 'Classic sprint run with fast pressure.',
    seconds: 180,
  },
  {
    id: '5-minute',
    title: '5 Mins',
    subtitle: 'A more deliberate debug round.',
    seconds: 300,
  },
  {
    id: '10-minute',
    title: '10 Mins',
    subtitle: 'Long-form review with room to recover.',
    seconds: 600,
  },
  {
    id: 'infinite',
    title: 'Infinite Time',
    subtitle: 'Open practice mode without a countdown.',
    seconds: Number.POSITIVE_INFINITY,
  },
]

export default {
  name: 'HomePage',
  emits: ['panel-update'],
  props: {
    userProfile: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      homeView: 'menu',
      menuScreen: 'mode-select',
      menuNotice: '',
      selectedGameMode: '',
      selectedFormatId: SINGLE_PLAYER_FORMATS[0].id,
      selectedDifficultyId: singlePlayerDifficulties[0].id,
      activeModalSection: 'mission',
      missionFiles: [],
      activeFileId: '',
      activeBugs: [],
      consoleEntries: [],
      secondsLeft: 180,
      timerId: null,
      isSolved: false,
      missionExpired: false,
      missionsPlayed: 0,
      missionsCleared: 0,
      missionsExpired: 0,
      isRunningMission: false,
      runCount: 0,
      bestClearSeconds: null,
    }
  },
  computed: {
    gameModeOptions() {
      return GAME_MODE_OPTIONS
    },
    singlePlayerFormats() {
      return SINGLE_PLAYER_FORMATS
    },
    singlePlayerDifficulties() {
      return singlePlayerDifficulties
    },
    activeFormat() {
      return (
        this.singlePlayerFormats.find((format) => format.id === this.selectedFormatId) ??
        this.singlePlayerFormats[0]
      )
    },
    activeDifficulty() {
      return (
        this.singlePlayerDifficulties.find(
          (difficulty) => difficulty.id === this.selectedDifficultyId,
        ) ?? this.singlePlayerDifficulties[0]
      )
    },
    activeDifficultyConfig() {
      return difficultyMissions[this.selectedDifficultyId] ?? difficultyMissions.easy
    },
    activeTheme() {
      return (
        themeOptions.find((theme) => theme.name === this.userProfile.activeIDETheme) ??
        themeOptions[0]
      )
    },
    editorThemeStyle() {
      const palette = {
        ...DEFAULT_IDE_PALETTE,
        ...(this.activeTheme?.idePalette ?? {}),
      }

      return {
        '--home-editor-bg': this.activeTheme?.editor ?? '#10161b',
        '--home-editor-accent': this.activeTheme?.accent ?? '#ffd65a',
        '--home-editor-syntax-keyword': palette.syntaxKeyword,
        '--home-editor-syntax-function': palette.syntaxFunction,
        '--home-editor-syntax-variable': palette.syntaxVariable,
        '--home-editor-syntax-property': palette.syntaxProperty,
        '--home-editor-syntax-string': palette.syntaxString,
        '--home-editor-syntax-number': palette.syntaxNumber,
        '--home-editor-syntax-comment': palette.syntaxComment,
      }
    },
    currentFile() {
      return (
        this.missionFiles.find((file) => file.id === this.activeFileId) ??
        this.missionFiles[0] ??
        null
      )
    },
    currentCode: {
      get() {
        return this.currentFile?.currentCode ?? ''
      },
      set(value) {
        if (this.currentFile) {
          this.currentFile.currentCode = value
        }
      },
    },
    editorLineNumbers() {
      return this.currentCode.split('\n').map((_, index) => index + 1)
    },
    highlightedCodeLines() {
      return this.currentCode.split('\n').map((line) => highlightJavaScriptLine(line))
    },
    formattedTime() {
      if (!Number.isFinite(this.secondsLeft)) {
        return 'INF'
      }

      const minutes = String(Math.floor(this.secondsLeft / 60)).padStart(2, '0')
      const seconds = String(this.secondsLeft % 60).padStart(2, '0')

      return `${minutes}:${seconds}`
    },
    unresolvedBugCount() {
      return this.activeBugs.filter((bug) => {
        const file = this.missionFiles.find((entry) => entry.id === bug.fileId)
        const line = file?.currentCode.split('\n')[bug.lineNumber - 1] ?? ''

        return normalizeCodeLine(line) !== normalizeCodeLine(bug.correct)
      }).length
    },
    missionSummary() {
      if (this.isSolved) {
        return 'Patch applied. Clean run confirmed.'
      }

      if (this.missionExpired) {
        return 'Timer expired. Roll a fresh mission to keep playing.'
      }

      return `${this.activeDifficulty.title} mission: ${this.activeBugs.length} seeded issue(s) across ${this.missionFiles.length} file(s). ${this.unresolvedBugCount} still unresolved.`
    },
    isSinglePlayerSession() {
      return this.selectedGameMode === 'single-player'
    },
    panelState() {
      return {
        available: this.homeView === 'game',
        activeSection: this.activeModalSection,
        missionSummary: this.missionSummary,
        activeBugs: this.activeBugs.map((bug) => ({
          id: bug.id,
          errorName: bug.errorName,
          fileLabel: bug.fileLabel,
          lineNumber: bug.lineNumber,
          fix: bug.fix,
        })),
        unresolvedBugCount: this.unresolvedBugCount,
        reviewGuides: this.reviewGuides,
        seededBugCount: this.activeBugs.length,
        sessionStatCards: this.sessionStatCards,
      }
    },
    sessionStatCards() {
      return [
        { label: 'Runs', value: this.runCount },
        { label: 'Missions Cleared', value: this.missionsCleared },
        { label: 'Timer Losses', value: this.missionsExpired },
        {
          label: 'Best Clear',
          value:
            this.bestClearSeconds === null
              ? '--'
              : `${Math.floor(this.bestClearSeconds / 60)}m ${String(this.bestClearSeconds % 60).padStart(2, '0')}s`,
        },
      ]
    },
    reviewGuides() {
      return REVIEW_GUIDES
    },
    homeMenuLogo() {
      return homeMenuLogo
    },
  },
  watch: {
    panelState: {
      immediate: true,
      deep: true,
      handler(state) {
        this.$emit('panel-update', state)
      },
    },
  },
  mounted() {
    this.menuNotice = 'Select a queue to boot the debug rig.'
  },
  beforeUnmount() {
    this.stopTimer()
  },
  methods: {
    validateMissionRuntime() {
      const activeModules = new Map(
        this.missionFiles.map((file) => [file.path, { code: file.currentCode, label: file.label }]),
      )

      projectFileBlueprints.forEach((file) => {
        if (!activeModules.has(file.path)) {
          activeModules.set(file.path, {
            code: buildBlueprintCode(file, false),
            label: file.label,
          })
        }
      })

      const moduleCache = new Map()
      const syntaxFailures = []

      this.missionFiles.forEach((file) => {
        try {
          new Function('require', 'exports', 'module', transformVirtualModule(file.currentCode))
        } catch (error) {
          syntaxFailures.push(
            createValidationEntry(
              formatRuntimeError(error),
              file.path,
              error?.message ?? 'Unknown syntax failure.',
              extractExecutionLocation(error),
            ),
          )
        }
      })

      if (syntaxFailures.length > 0) {
        return syntaxFailures
      }

      const executeModule = (modulePath) => {
        if (moduleCache.has(modulePath)) {
          return moduleCache.get(modulePath)
        }

        const moduleEntry = activeModules.get(modulePath)

        if (!moduleEntry) {
          throw new Error(`Cannot resolve module '${modulePath}'.`)
        }

        const module = { exports: {} }
        moduleCache.set(modulePath, module.exports)

        const transformedCode = transformVirtualModule(moduleEntry.code)
        let runner

        try {
          runner = new Function('require', 'exports', 'module', transformedCode)
        } catch (error) {
          error.modulePath = modulePath
          throw error
        }

        const localRequire = (specifier) => {
          const resolvedPath = resolveModulePath(modulePath, specifier)
          return executeModule(resolvedPath)
        }

        try {
          runner(localRequire, module.exports, module)
        } catch (error) {
          if (!error.modulePath) {
            error.modulePath = modulePath
          }
          throw error
        }
        moduleCache.set(modulePath, module.exports)
        return module.exports
      }

      try {
        executeModule('src/main.js')
        return []
      } catch (error) {
        const location = extractExecutionLocation(error)
        const errorName = formatRuntimeError(error)
        const filePath = error?.modulePath ?? this.currentFile?.path ?? 'src/main.js'

        return [
          createValidationEntry(
            errorName,
            filePath,
            error?.message ?? 'Unknown runtime failure.',
            location,
          ),
        ]
      }
    },
    buildMission() {
      const activeBugIds = this.activeDifficultyConfig.bugIds
      const selectedFileIds = new Set(this.activeDifficultyConfig.fileIds)
      const missionFiles = []
      const activeBugs = []

      projectFileBlueprints
        .filter((file) => selectedFileIds.has(file.id))
        .forEach((file) => {
          const codeLines = []

          file.entries.forEach((entry, index) => {
            if (typeof entry === 'string') {
              codeLines.push(entry)
              return
            }

            if (activeBugIds.includes(entry.id)) {
              codeLines.push(entry.buggy)
              activeBugs.push({
                ...entry,
                fileId: file.id,
                fileLabel: file.label,
                filePath: file.path,
                lineNumber: index + 1,
              })
              return
            }

            codeLines.push(entry.correct)
          })

          const starterCode = codeLines.join('\n')
          missionFiles.push({
            id: file.id,
            label: file.label,
            path: file.path,
            starterCode,
            currentCode: starterCode,
          })
        })

      return {
        files: missionFiles,
        activeBugs,
      }
    },
    startTimer() {
      this.stopTimer()

      if (!Number.isFinite(this.secondsLeft)) {
        return
      }

      this.timerId = window.setInterval(() => {
        if (this.isSolved) {
          return
        }

        if (this.secondsLeft <= 1) {
          this.secondsLeft = 0
          this.missionExpired = true
          this.missionsExpired += 1
          this.stopTimer()
          this.consoleEntries = [
            {
              type: 'error',
              errorName: 'LogicError',
              text: 'Timer expired. Mission failed before a clean run.',
              hintText:
                'Reset the mission, reopen the first red error, and clear parser errors before tracing logic bugs.',
              showHint: false,
            },
            { type: 'info', text: 'Reset the mission to roll a fresh set of JavaScript errors.' },
          ]
          return
        }

        this.secondsLeft -= 1
      }, 1000)
    },
    stopTimer() {
      if (this.timerId !== null) {
        window.clearInterval(this.timerId)
        this.timerId = null
      }
    },
    resetMission() {
      const mission = this.buildMission()
      const roundSeconds = this.activeFormat?.seconds ?? 180

      this.missionsPlayed += 1
      this.missionFiles = mission.files
      this.activeFileId = mission.files[0]?.id ?? ''
      this.activeBugs = mission.activeBugs
      this.consoleEntries = [
        {
          type: 'info',
          text: `Mission ${this.missionsPlayed} loaded. ${mission.activeBugs.length} error(s) seeded across ${mission.files.length} project file(s).`,
        },
        {
          type: 'info',
          text: 'Open each file tab, trace the imports, and patch the broken lines before the clock hits zero.',
        },
      ]
      this.secondsLeft = roundSeconds
      this.isSolved = false
      this.missionExpired = false
      this.startTimer()
      this.$nextTick(() => {
        if (this.$refs.editorGutter) {
          this.$refs.editorGutter.scrollTop = 0
        }
      })
    },
    restoreStarterCode() {
      this.missionFiles = this.missionFiles.map((file) => ({
        ...file,
        currentCode: file.starterCode,
      }))
      this.consoleEntries = [
        {
          type: 'info',
          text: 'Starter project restored. Run again to recheck every linked file in the mission.',
        },
      ]
    },
    syncCurrentEditorBuffer() {
      const liveEditorValue = this.$refs.editorTextarea?.value

      if (typeof liveEditorValue === 'string' && this.currentFile) {
        this.currentFile.currentCode = liveEditorValue
      }
    },
    async runMission() {
      if (this.missionExpired) {
        this.resetMission()
        return
      }

      this.runCount += 1
      this.syncCurrentEditorBuffer()
      await this.$nextTick()

      const runLabel = `Run #${this.runCount}`

      this.isSolved = false
      this.isRunningMission = true
      this.consoleEntries = [
        {
          type: 'info',
          text: `${runLabel}: compiling ${this.missionFiles.length} file(s) and running mission validation...`,
        },
      ]

      await this.$nextTick()

      const unresolved = this.activeBugs.filter((bug) => {
        const file = this.missionFiles.find((entry) => entry.id === bug.fileId)
        const line = file?.currentCode.split('\n')[bug.lineNumber - 1] ?? ''

        return normalizeCodeLine(line) !== normalizeCodeLine(bug.correct)
      })

      const validationFailures = this.validateMissionRuntime()
      const runtimeFailureCount = validationFailures.length

      if (runtimeFailureCount > 0 || unresolved.length > 0) {
        const runtimeEntries = validationFailures.map((failure) => ({
          type: 'error',
          errorName: failure.errorName,
          text: `${failure.errorName}${failure.location ? ` in ${failure.filePath}:${failure.location.lineNumber}:${failure.location.columnNumber}` : ` in ${failure.filePath}`} - ${failure.message}`,
          showHint: false,
        }))

        this.consoleEntries = [
          {
            type: 'error',
            errorName: 'LogicError',
            text: `${runLabel} failed. ${unresolved.length} seeded issue(s) and ${runtimeFailureCount} validation error(s) still block execution.`,
            hintText:
              'Start with the first error below. Fix syntax errors first, then rerun so runtime and seeded line issues are easier to isolate.',
            showHint: false,
          },
          ...runtimeEntries,
          ...unresolved.map((bug) => ({
            type: 'error',
            errorName: bug.errorName,
            text: `${bug.errorName} in ${bug.filePath}:${bug.lineNumber} - ${bug.consoleText}`,
            hintText: bug.fix,
            showHint: false,
          })),
          {
            type: 'hint',
            text: 'Open the Review tab for the JavaScript error cheat sheet and fix patterns.',
          },
        ]
        this.isRunningMission = false
        return
      }

      this.isSolved = true
      this.stopTimer()
      const clearSeconds = Number.isFinite(this.secondsLeft)
        ? (this.activeFormat?.seconds ?? 180) - this.secondsLeft
        : null
      this.missionsCleared += 1

      if (
        clearSeconds !== null &&
        (this.bestClearSeconds === null || clearSeconds < this.bestClearSeconds)
      ) {
        this.bestClearSeconds = clearSeconds
      }

      this.consoleEntries = [
        { type: 'success', text: `${runLabel} succeeded. No seeded errors remain.` },
        { type: 'success', text: `Difficulty: ${this.activeDifficulty.title}` },
        { type: 'success', text: `Files scanned: ${this.missionFiles.length}` },
        { type: 'success', text: `Seeded errors cleared: ${this.activeBugs.length}` },
        {
          type: 'success',
          text: `Project chain: ${this.missionFiles.map((file) => file.label).join(' -> ')}`,
        },
        { type: 'success', text: 'Run complete.' },
      ]
      this.isRunningMission = false
    },
    syncEditorScroll(event) {
      if (this.$refs.editorGutter) {
        this.$refs.editorGutter.scrollTop = event.target.scrollTop
      }

      if (this.$refs.editorHighlight) {
        this.$refs.editorHighlight.scrollTop = event.target.scrollTop
        this.$refs.editorHighlight.scrollLeft = event.target.scrollLeft
      }
    },
    handleEditorTab(event) {
      const target = event.target
      const indent = '  '
      const start = target.selectionStart
      const end = target.selectionEnd

      this.currentCode = `${this.currentCode.slice(0, start)}${indent}${this.currentCode.slice(end)}`

      this.$nextTick(() => {
        target.selectionStart = start + indent.length
        target.selectionEnd = start + indent.length
      })
    },
    selectEditorFile(fileId) {
      this.activeFileId = fileId
      this.$nextTick(() => {
        if (this.$refs.editorGutter) {
          this.$refs.editorGutter.scrollTop = 0
        }

        if (this.$refs.editorHighlight) {
          this.$refs.editorHighlight.scrollTop = 0
          this.$refs.editorHighlight.scrollLeft = 0
        }
      })
    },
    selectSideTab(section) {
      this.activeModalSection = section
    },
    selectGameMode(mode) {
      if (!mode.available) {
        this.menuNotice = `${mode.title} unlocks in a later build.`
        return
      }

      this.selectedGameMode = mode.id
      this.menuScreen = 'single-player-formats'
      this.menuNotice = 'Pick a clock format and difficulty for the solo debug run.'
    },
    backToModeSelect() {
      this.menuScreen = 'mode-select'
      this.menuNotice = 'Select a queue to boot the debug rig.'
    },
    selectFormat(formatId) {
      this.selectedFormatId = formatId
    },
    selectDifficulty(difficultyId) {
      this.selectedDifficultyId = difficultyId
    },
    returnToMenu() {
      this.stopTimer()
      this.homeView = 'menu'
      this.menuScreen = 'mode-select'
      this.menuNotice = 'Select a queue to boot the debug rig.'
      this.selectedGameMode = ''
      this.activeModalSection = 'mission'
      this.missionFiles = []
      this.activeFileId = ''
      this.activeBugs = []
      this.consoleEntries = []
      this.missionExpired = false
      this.isSolved = false
    },
    launchSinglePlayer() {
      this.selectedGameMode = 'single-player'
      this.activeModalSection = 'mission'
      this.homeView = 'game'
      this.menuNotice = ''
      this.resetMission()
    },
    consoleEntryClass(type) {
      return {
        error: type === 'error',
        success: type === 'success',
        hint: type === 'hint',
        info: type === 'info',
      }
    },
    resolveConsoleHint(entry) {
      if (entry.hintText) {
        return entry.hintText
      }

      const guide = this.reviewGuides.find((item) => item.title === entry.errorName)

      if (guide) {
        return `${guide.summary} ${guide.fix}`
      }

      const fallbackGuide = this.reviewGuides.find((item) => item.title === 'LogicError')
      return fallbackGuide ? `${fallbackGuide.summary} ${fallbackGuide.fix}` : ''
    },
    shouldShowConsoleHintButton(entry) {
      return (
        this.isSinglePlayerSession &&
        entry.type === 'error' &&
        Boolean(this.resolveConsoleHint(entry))
      )
    },
    toggleConsoleHint(entry) {
      if (!this.shouldShowConsoleHintButton(entry)) {
        return
      }

      entry.hintText = this.resolveConsoleHint(entry)
      entry.showHint = !entry.showHint
    },
  },
}
</script>

<template>
  <main
    class="w-100 flex-grow-1 py-3 px-2 px-lg-3 d-flex flex-column overflow-hidden app-page-shell"
  >
    <section
      v-if="homeView === 'menu'"
      class="app-surface rounded p-3 p-lg-4 h-100 overflow-hidden home-menu-shell"
      :style="editorThemeStyle"
    >
      <div class="home-menu-frame">
        <div
          v-if="menuScreen === 'mode-select'"
          class="home-menu-brand"
          aria-label="Find The Err0r"
        >
          <!-- <img class="home-menu-brand-image" :src="homeMenuLogo" alt="Find The Err0r" /> -->
        </div>
        <div class="home-menu-panel">
          <div v-if="menuScreen === 'mode-select'" class="menu-option-grid">
            <button
              v-for="mode in gameModeOptions"
              :key="mode.id"
              class="menu-option-card"
              :class="{ 'menu-option-card--disabled': !mode.available }"
              type="button"
              @click="selectGameMode(mode)"
            >
              <div class="menu-option-topline">
                <span class="menu-option-title">{{ mode.title }}</span>
                <span class="menu-option-status">{{ mode.status }}</span>
              </div>
              <div class="menu-option-icon-shell" aria-hidden="true">
                <i class="bi menu-option-icon" :class="mode.iconClass"></i>
              </div>
            </button>
          </div>

          <div v-else class="menu-submenu-shell">
            <div class="menu-submenu-header">
              <button class="menu-back-button" type="button" @click="backToModeSelect()">
                <i class="bi bi-arrow-left" aria-hidden="true"></i>
                <span>Back</span>
              </button>
              <div>
                <h2 class="menu-submenu-title mb-1">Single Player</h2>
                <p class="menu-submenu-copy mb-0">
                  Choose the clock format and project complexity for your run.
                </p>
              </div>
            </div>

            <div class="menu-setup-section">
              <div class="menu-setup-title">Time Limit</div>
              <div class="menu-option-grid menu-option-grid--formats">
                <button
                  v-for="format in singlePlayerFormats"
                  :key="format.id"
                  class="menu-option-card menu-option-card--format"
                  :class="{ 'menu-option-card--selected': format.id === selectedFormatId }"
                  type="button"
                  @click="selectFormat(format.id)"
                >
                  <div class="menu-option-topline">
                    <span class="menu-option-title">{{ format.title }}</span>
                  </div>
                </button>
              </div>
            </div>

            <div class="menu-setup-section">
              <div class="menu-setup-title">Difficulty</div>
              <div class="menu-option-grid menu-option-grid--difficulties">
                <button
                  v-for="difficulty in singlePlayerDifficulties"
                  :key="difficulty.id"
                  class="menu-option-card menu-option-card--difficulty"
                  :class="{ 'menu-option-card--selected': difficulty.id === selectedDifficultyId }"
                  type="button"
                  @click="selectDifficulty(difficulty.id)"
                >
                  <div class="menu-option-topline">
                    <span class="menu-option-title">{{ difficulty.title }}</span>
                  </div>
                  <p class="menu-option-copy mb-0">{{ difficulty.summary }}</p>
                </button>
              </div>
            </div>

            <div class="menu-launch-row">
              <button
                class="btn btn-primary menu-launch-button"
                type="button"
                @click="launchSinglePlayer()"
              >
                Start Run
              </button>
              <span class="menu-launch-meta">
                {{ activeFormat.title }} • {{ activeDifficulty.summary }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-else class="home-layout" :style="editorThemeStyle">
      <section class="app-surface rounded p-2 p-lg-3 h-100 overflow-hidden home-game-shell">
        <div class="home-game-grid">
          <section class="home-workbench">
            <article class="editor-card">
              <div class="editor-card-header">
                <div class="editor-header-main">
                  <div class="editor-file-tabs" role="tablist" aria-label="Project files">
                    <button
                      v-for="file in missionFiles"
                      :key="file.id"
                      class="editor-file-tab"
                      :class="{ active: file.id === activeFileId }"
                      type="button"
                      role="tab"
                      :aria-selected="file.id === activeFileId"
                      @click="selectEditorFile(file.id)"
                    >
                      {{ file.label }}
                    </button>
                  </div>
                  <span v-if="currentFile" class="editor-file-path">{{ currentFile.path }}</span>
                </div>
                <div class="editor-header-actions">
                  <div
                    class="mission-timer"
                    :class="{ danger: secondsLeft <= 60 && !isSolved, running: isRunningMission }"
                  >
                    <strong>{{ isRunningMission ? 'RUN' : formattedTime }}</strong>
                  </div>
                  <button
                    class="btn btn-primary editor-run-button"
                    :class="{ 'editor-run-button--running': isRunningMission }"
                    type="button"
                    :aria-label="missionExpired || isSolved ? 'Load new mission' : 'Run code'"
                    :title="missionExpired || isSolved ? 'Load new mission' : 'Run code'"
                    :disabled="isRunningMission"
                    @click="runMission"
                  >
                    <i
                      class="bi"
                      :class="isRunningMission ? 'bi-arrow-repeat' : 'bi-play-fill'"
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
              </div>

              <div class="editor-surface">
                <div ref="editorGutter" class="editor-gutter" aria-hidden="true">
                  <span v-for="lineNumber in editorLineNumbers" :key="lineNumber">
                    {{ String(lineNumber).padStart(3, '0') }}
                  </span>
                </div>
                <div class="editor-code-layer">
                  <div ref="editorHighlight" class="editor-highlight" aria-hidden="true">
                    <div
                      v-for="(line, index) in highlightedCodeLines"
                      :key="`code-${index}`"
                      class="editor-highlight-line"
                      v-html="line"
                    ></div>
                  </div>
                  <textarea
                    ref="editorTextarea"
                    v-model="currentCode"
                    class="editor-textarea"
                    spellcheck="false"
                    wrap="off"
                    @scroll="syncEditorScroll"
                    @keydown.tab.prevent="handleEditorTab"
                  ></textarea>
                </div>
              </div>
            </article>
          </section>

          <aside class="home-side-panels">
            <div class="console-toolbar">
              <button class="console-back-button" type="button" @click="returnToMenu()">
                <i class="bi bi-arrow-left" aria-hidden="true"></i>
                <span>Back To Menu</span>
              </button>
            </div>

            <article class="console-card console-side-card">
              <div class="console-header">
                <span class="editor-pill">Console</span>
                <span class="editor-meta">Always open</span>
              </div>
              <div class="console-body">
                <template v-for="(entry, index) in consoleEntries" :key="`${entry.type}-${index}`">
                  <div class="console-line" :class="consoleEntryClass(entry.type)">
                    <div class="console-line-text">{{ entry.text }}</div>
                    <button
                      v-if="shouldShowConsoleHintButton(entry)"
                      class="console-hint-button"
                      type="button"
                      @click="toggleConsoleHint(entry)"
                    >
                      {{ entry.showHint ? 'Hide Hint' : 'Hint' }}
                    </button>
                  </div>
                  <div
                    v-if="entry.showHint && entry.hintText"
                    class="console-line console-line-inline-hint hint"
                  >
                    {{ entry.hintText }}
                  </div>
                </template>
              </div>
            </article>
          </aside>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.app-page-shell {
  min-height: 0;
}

.home-menu-shell {
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  background:
    radial-gradient(circle at top, rgba(255, 214, 90, 0.08), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.08)),
    linear-gradient(180deg, rgba(15, 50, 77, 0.98), rgba(8, 19, 29, 0.98));
}

.home-menu-frame {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 0;
  transform: translateY(-1.25rem);
}

.home-menu-panel {
  display: grid;
  gap: 1.25rem;
  width: min(62rem, 100%);
  padding: clamp(1.1rem, 2vw, 1.75rem);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1.25rem;
  background:
    linear-gradient(180deg, rgba(7, 23, 36, 0.74), rgba(7, 23, 36, 0.42)), rgba(8, 19, 29, 0.72);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.04),
    0 1.5rem 3rem rgba(0, 0, 0, 0.28);
}

.home-menu-brand {
  display: grid;
  justify-items: center;
  width: min(62rem, 100%);
  text-align: center;
}

.home-menu-brand-image {
  display: block;
  width: min(100%, clamp(9rem, 22vw, 17rem));
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 0.9rem 1.8rem rgba(0, 0, 0, 0.28));
}

.menu-submenu-header {
  display: grid;
  gap: 0.65rem;
}

.menu-submenu-title {
  color: var(--screen-text);
  font-family: 'Press Start 2P', monospace;
  font-size: clamp(1.15rem, 2.5vw, 1.85rem);
  line-height: 1.5;
}

.menu-submenu-copy,
.menu-option-copy {
  color: var(--screen-muted);
}

.menu-option-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.menu-option-grid--formats {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.menu-option-grid--difficulties {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.menu-option-card,
.menu-back-button {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1rem;
  background: rgba(8, 19, 29, 0.48);
  color: var(--screen-text);
}

.menu-option-card {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  text-align: left;
  transition:
    transform 0.16s ease,
    border-color 0.16s ease,
    background 0.16s ease;
}

.menu-option-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 214, 90, 0.34);
  background: rgba(16, 37, 52, 0.64);
}

.menu-option-card--disabled {
  opacity: 0.82;
}

.menu-option-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.menu-option-icon-shell {
  display: grid;
  place-items: center;
  min-height: 8.5rem;
  border-radius: 0.9rem;
  background:
    radial-gradient(circle at center, rgba(255, 214, 90, 0.12), transparent 58%),
    rgba(8, 19, 29, 0.42);
}

.menu-option-icon {
  font-size: clamp(3.4rem, 5vw, 4.6rem);
  line-height: 1;
  color: var(--screen-accent);
  text-shadow:
    0 0 16px rgba(255, 214, 90, 0.2),
    0 0 32px rgba(142, 230, 255, 0.1);
}

.menu-option-title,
.menu-option-status,
.menu-back-button {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.58rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.menu-option-title {
  color: var(--screen-text);
}

.menu-option-status {
  color: var(--screen-accent);
}

.menu-submenu-shell {
  display: grid;
  gap: 1rem;
}

.menu-setup-section {
  display: grid;
  gap: 0.75rem;
}

.menu-setup-title {
  color: var(--screen-accent);
  font-family: 'Press Start 2P', monospace;
  font-size: 0.56rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.menu-launch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.menu-launch-button {
  min-width: 11rem;
}

.menu-launch-meta {
  color: var(--screen-muted);
  font-family: 'Press Start 2P', monospace;
  font-size: 0.54rem;
  line-height: 1.6;
  text-transform: uppercase;
}

.menu-back-button {
  justify-content: center;
}

.home-layout {
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
}

.home-game-shell {
  flex: 1 1 auto;
  min-height: 0;
}

.home-game-grid {
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) minmax(18rem, 0.85fr);
  gap: 0.85rem;
  height: 100%;
  min-height: 0;
}

.home-workbench,
.home-side-panels {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
}

.console-toolbar {
  display: flex;
  align-items: center;
}

.editor-card,
.console-card,
.chat-card {
  border: 1px solid var(--screen-border);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(7, 23, 36, 0.45), rgba(7, 23, 36, 0.18));
}

.page-eyebrow {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--screen-accent);
}

.page-title,
.mission-timer strong,
.side-stat-card strong,
.player-summary-row strong {
  color: var(--screen-text);
}

.page-copy,
.panel-copy,
.mission-issue-copy,
.review-copy,
.player-summary-row span,
.editor-meta,
.mission-stat-chip span,
.side-stat-card span {
  color: var(--screen-muted);
}

.editor-header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.45rem;
}

.editor-header-main {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.editor-file-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  min-width: 0;
}

.editor-file-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.7rem;
  background: rgba(8, 19, 29, 0.4);
  color: var(--screen-muted);
  font-family: 'Press Start 2P', monospace;
  font-size: 0.5rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.editor-file-tab.active,
.menu-option-card--selected {
  border-color: rgba(255, 214, 90, 0.42);
  background: rgba(21, 49, 68, 0.72);
  color: var(--screen-text);
  box-shadow: inset 0 0 0 1px rgba(255, 214, 90, 0.08);
}

.editor-file-path {
  color: var(--screen-muted);
  font-family: 'Press Start 2P', monospace;
  font-size: 0.5rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.mission-timer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 5.4rem;
  height: 2rem;
  padding: 0 0.65rem;
  border: 1px solid rgba(255, 214, 90, 0.26);
  border-radius: 0.65rem;
  background: rgba(8, 19, 29, 0.55);
}

.mission-timer.danger {
  border-color: rgba(255, 122, 89, 0.45);
  box-shadow: 0 0 20px rgba(255, 122, 89, 0.12);
}

.mission-timer.running {
  border-color: rgba(142, 230, 255, 0.42);
  box-shadow: 0 0 20px rgba(142, 230, 255, 0.14);
}

.review-title,
.mission-issue-title {
  font-size: 0.6rem;
  font-family: 'Press Start 2P', monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.mission-timer strong {
  font-size: 1.05rem;
  line-height: 1;
}

.editor-card,
.console-card,
.chat-card {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.editor-card {
  flex: 1 1 auto;
}

.console-card {
  min-height: 0;
}

.console-side-card {
  flex: 1 1 auto;
}

.ops-side-card {
  flex: 1 1 auto;
}

.console-back-button,
.menu-back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
  padding: 0.55rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1rem;
  background: rgba(8, 19, 29, 0.48);
  color: var(--screen-text);
}

.console-back-button:hover,
.menu-back-button:hover {
  border-color: rgba(255, 214, 90, 0.34);
  color: var(--screen-accent);
}

.chat-card {
  flex: 1 1 auto;
}

.editor-card-header,
.console-header,
.chat-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.55rem 0.85rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.chat-header {
  align-items: flex-start;
}

.chat-header-main {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  min-width: 0;
}

.chat-tab-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  min-width: 0;
}

.editor-run-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  min-width: 2rem;
  padding: 0;
}

.editor-run-button i {
  font-size: 0.95rem;
}

.editor-run-button--running {
  pointer-events: none;
}

.editor-run-button--running i {
  animation: editor-run-spin 0.8s linear infinite;
}

.editor-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.55rem;
  border-radius: 999px;
  background: rgba(255, 214, 90, 0.12);
  color: var(--screen-accent);
  font-size: 0.56rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-family: 'Press Start 2P', monospace;
}

.editor-surface {
  --editor-font-size: 1.3rem;
  --editor-line-height: 1.35;
  --editor-pad-y: 1rem;
  --editor-pad-x: 1.1rem;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  flex: 1 1 auto;
  min-height: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.025), rgba(255, 255, 255, 0)),
    var(--home-editor-bg);
}

.editor-code-layer {
  position: relative;
  min-width: 0;
  min-height: 0;
}

.editor-gutter {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0;
  width: 4.5rem;
  padding: 1rem 0.75rem 1rem 1rem;
  overflow: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(205, 230, 240, 0.42);
  font-family: 'VT323', monospace;
  font-size: var(--editor-font-size);
  line-height: var(--editor-line-height);
  user-select: none;
}

.editor-gutter span,
.editor-highlight-line,
.editor-textarea {
  line-height: var(--editor-line-height);
}

.editor-highlight,
.editor-textarea {
  width: 100%;
  height: 100%;
  min-height: 34rem;
  padding: var(--editor-pad-y) 1rem var(--editor-pad-y) var(--editor-pad-x);
  font-family: 'VT323', monospace;
  font-size: var(--editor-font-size);
  letter-spacing: 0;
  tab-size: 2;
  font-kerning: none;
  font-variant-ligatures: none;
  font-feature-settings:
    'liga' 0,
    'calt' 0;
}

.editor-highlight {
  position: absolute;
  inset: 0;
  margin: 0;
  overflow: hidden;
  color: #eefbff;
  pointer-events: none;
  white-space: pre;
}

.editor-highlight-line {
  min-height: 1.35em;
}

.editor-textarea {
  position: relative;
  z-index: 1;
  resize: none;
  border: 0;
  background: transparent;
  color: transparent;
  -webkit-text-fill-color: transparent;
  overflow: auto;
  caret-color: var(--home-editor-accent);
  white-space: pre;
  overflow-wrap: normal;
}

.editor-textarea::selection {
  background: rgba(255, 214, 90, 0.2);
}

.editor-textarea:focus {
  outline: none;
}

@keyframes editor-run-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.console-body {
  display: grid;
  gap: 0.45rem;
  padding: 1rem;
  min-height: 0;
  overflow: auto;
  font-family: 'VT323', monospace;
  font-size: 1rem;
}

.chat-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding: 1rem;
}

.chat-tab {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  padding: 0.42rem 0.7rem;
  background: rgba(8, 19, 29, 0.42);
  color: var(--screen-text);
  font-family: 'Press Start 2P', monospace;
  font-size: 0.52rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.chat-tab.active {
  border-color: rgba(255, 214, 90, 0.38);
  background: rgba(255, 214, 90, 0.14);
  color: var(--screen-accent);
}

.console-line {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.55rem 0.75rem;
  border-radius: 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(8, 19, 29, 0.42);
  color: var(--screen-text);
}

.console-line-text {
  flex: 1 1 auto;
  min-width: 0;
}

.console-hint-button {
  flex: 0 0 auto;
  border: 1px solid rgba(142, 230, 255, 0.28);
  border-radius: 999px;
  padding: 0.28rem 0.6rem;
  background: rgba(142, 230, 255, 0.12);
  color: #b8f5ff;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.52rem;
  line-height: 1.4;
  text-transform: uppercase;
}

.console-hint-button:hover {
  border-color: rgba(142, 230, 255, 0.52);
  background: rgba(142, 230, 255, 0.18);
}

.console-line-inline-hint {
  margin-top: -0.1rem;
}

.console-line.error {
  border-color: rgba(255, 122, 89, 0.28);
  color: #ffb8a8;
}

.console-line.success {
  border-color: rgba(255, 214, 90, 0.28);
  color: #fff1a8;
}

.console-line.hint {
  border-color: rgba(142, 230, 255, 0.28);
  color: #b8f5ff;
}

:deep(.token--keyword) {
  color: var(--home-editor-syntax-keyword);
}

:deep(.token--function) {
  color: var(--home-editor-syntax-function);
}

:deep(.token--variable) {
  color: var(--home-editor-syntax-variable);
}

:deep(.token--property) {
  color: var(--home-editor-syntax-property);
}

:deep(.token--string) {
  color: var(--home-editor-syntax-string);
}

:deep(.token--number) {
  color: var(--home-editor-syntax-number);
}

:deep(.token--comment) {
  color: var(--home-editor-syntax-comment);
}

.settings-panel {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-height: 0;
  overflow: auto;
  padding-right: 0.15rem;
}

.mission-stat-row,
.side-stat-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.mission-stat-chip,
.side-stat-card,
.mission-issue-card,
.review-card,
.chat-bubble {
  padding: 0.8rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.85rem;
  background: rgba(8, 19, 29, 0.42);
}

.mission-stat-chip {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mission-stat-chip strong,
.side-stat-card strong {
  font-size: 1.15rem;
  color: var(--screen-text);
}

.mission-issue-list,
.review-grid,
.chat-feed,
.player-summary {
  display: grid;
  gap: 0.75rem;
}

.chat-feed {
  min-height: 100%;
  align-content: start;
}

.mission-issue-title,
.review-title {
  color: var(--screen-accent);
  margin-bottom: 0.35rem;
}

.review-fix {
  margin-top: 0.55rem;
  color: #eefbff;
}

.settings-action-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.settings-action-row {
  flex-wrap: wrap;
}

.player-summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

@media (max-width: 1199.98px) {
  .menu-option-grid {
    grid-template-columns: 1fr;
  }

  .menu-option-grid--formats,
  .menu-option-grid--difficulties {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .home-game-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .home-side-panels {
    overflow: auto;
  }

  .console-side-card {
    max-height: 12rem;
  }
}

@media (max-width: 767.98px) {
  .menu-option-grid--formats,
  .menu-option-grid--difficulties,
  .menu-option-grid {
    grid-template-columns: 1fr;
  }

  .menu-option-topline,
  .menu-launch-row,
  .editor-header-main,
  .editor-header-actions,
  .editor-card-header,
  .console-header,
  .settings-action-row,
  .player-summary-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .chat-header-main {
    flex-direction: column;
    align-items: flex-start;
  }

  .editor-surface {
    grid-template-columns: 3.5rem minmax(0, 1fr);
  }

  .editor-gutter {
    width: 3.5rem;
    padding-inline: 0.55rem;
  }

  .mission-stat-row,
  .side-stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>
