<script>
import { themeOptions } from '@/data/themes.js'

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

  return ''
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

function createBugDescriptor(id, correct, buggy, errorName, consoleText, fix) {
  return {
    id,
    correct,
    buggy,
    errorName,
    consoleText,
    fix,
  }
}

function buildChallengeTemplate() {
  const template = [
    'const challengeInput = [',
    "  { file: 'auth.js', errors: 2, severity: 'high' },",
    "  { file: 'store.js', errors: 1, severity: 'medium' },",
    "  { file: 'profile.js', errors: 3, severity: 'critical' },",
    "  { file: 'leaderboard.js', errors: 0, severity: 'low' },",
    "  { file: 'session.js', errors: 1, severity: 'medium' },",
    ']',
    '',
    'function normalizeFileName(name) {',
    "  return name.replace('.js', '').toUpperCase();",
    '}',
    '',
    'function formatSeverity(level) {',
    '  return level.toUpperCase();',
    '}',
    '',
    'function buildSummary(queue) {',
    '  const summary = {',
    '    totalErrors: 0,',
    '    files: [],',
    '    severities: [],',
    '  };',
    '',
    '  for (const entry of queue) {',
    '    summary.totalErrors += entry.errors;',
    '    summary.files.push(normalizeFileName(entry.file));',
    '    summary.severities.push(formatSeverity(entry.severity));',
    '  }',
    '',
    '  return summary;',
    '}',
    '',
    'function getPrimarySeverity(summary) {',
    "  if (summary.severities.includes('CRITICAL')) {",
    "    return 'critical';",
    '  }',
    '',
    "  if (summary.severities.includes('HIGH')) {",
    "    return 'high';",
    '  }',
    '',
    "  return 'medium';",
    '}',
    '',
    'function getReviewMessage(summary) {',
    '  if (summary.totalErrors > 4) {',
    "    return 'Review required before shipping.';",
    '  }',
    '',
    "  return 'Ready for release.';",
    '}',
    '',
    'function renderDiagnostics(queue) {',
    '  const summary = buildSummary(queue);',
    '  const average = summary.totalErrors / queue.length;',
    '  const output = [];',
    '',
    "  output.push('Diagnostic summary');",
    "  output.push('------------------');",
    '  output.push(`Files scanned: ${summary.files.length}`);',
    createBugDescriptor(
      'reference-total-errors',
      '  output.push(`Total errors: ${summary.totalErrors}`);',
      '  output.push(`Total errors: ${summaryTotalErrors}`);',
      'ReferenceError',
      '`summaryTotalErrors` is not defined.',
      'Use the existing `summary.totalErrors` property from the summary object.',
    ),
    createBugDescriptor(
      'syntax-average-format',
      '  output.push(`Average errors per file: ${average.toFixed(2)}`);',
      '  output.push(`Average errors per file: ${average.toFixed(2}`);',
      'SyntaxError',
      'The `toFixed(2)` call is missing a closing parenthesis.',
      'Close the method call so the template string expression parses correctly.',
    ),
    createBugDescriptor(
      'type-severity-method',
      '  output.push(`Highest severity: ${getPrimarySeverity(summary).toLowerCase()}`);',
      '  output.push(`Highest severity: ${getPrimarySeverity(summary).toLowercase()}`);',
      'TypeError',
      '`toLowercase()` is not a valid JavaScript string method.',
      'Use the real string method name: `toLowerCase()`.',
    ),
    '  output.push(`Review: ${getReviewMessage(summary)}`);',
    "  output.push(`File roster: ${summary.files.join(', ')}`);",
    '',
    "  return output.join('\\n');",
    '}',
    '',
    'function runChallenge() {',
    '  const result = renderDiagnostics(challengeInput);',
    '  return `${result}\\nRun complete.`;',
    '}',
    '',
    'const output = runChallenge();',
    'output;',
  ]

  while (template.length < 100) {
    template.push(
      `// watchpoint ${String(template.length + 1).padStart(3, '0')}: inspect the queue before shipping`,
    )
  }

  return template
}

function shuffle(items) {
  const clone = [...items]

  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]]
  }

  return clone
}

function normalizeCodeLine(line = '') {
  return line.replace(/\s+/g, ' ').trim()
}

const CHALLENGE_TEMPLATE = buildChallengeTemplate()
const ALL_BUG_IDS = CHALLENGE_TEMPLATE.filter((entry) => typeof entry === 'object').map(
  (entry) => entry.id,
)

export default {
  name: 'HomePage',
  props: {
    userProfile: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      activeModalSection: 'mission',
      currentCode: '',
      starterCode: '',
      activeBugs: [],
      consoleEntries: [],
      secondsLeft: 180,
      timerId: null,
      isSolved: false,
      missionExpired: false,
      missionsPlayed: 0,
      missionsCleared: 0,
      missionsExpired: 0,
      runCount: 0,
      bestClearSeconds: null,
    }
  },
  computed: {
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
    editorLineNumbers() {
      return this.currentCode.split('\n').map((_, index) => index + 1)
    },
    highlightedCodeLines() {
      return this.currentCode.split('\n').map((line) => highlightJavaScriptLine(line))
    },
    formattedTime() {
      const minutes = String(Math.floor(this.secondsLeft / 60)).padStart(2, '0')
      const seconds = String(this.secondsLeft % 60).padStart(2, '0')

      return `${minutes}:${seconds}`
    },
    unresolvedBugCount() {
      const currentLines = this.currentCode.split('\n')

      return this.activeBugs.filter((bug) => {
        const line = currentLines[bug.lineNumber - 1] ?? ''

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

      return `${this.activeBugs.length} seeded issue(s). ${this.unresolvedBugCount} still unresolved.`
    },
    chatFeed() {
      if (this.isSolved) {
        return [
          'Control room: clean run confirmed. That patch set ships.',
          'Mentor bot: nice pacing. You solved the mission before the timer collapsed.',
          'Ops note: roll another mission if you want a different mix of bug types.',
        ]
      }

      if (this.missionExpired) {
        return [
          'Control room: timeout. Snapshot the lesson and reset the file.',
          'Mentor bot: start with the line number from the console next time, not the whole file.',
          'Ops note: Syntax errors usually block the rest of the run, so clear those first.',
        ]
      }

      if (this.secondsLeft <= 60) {
        return [
          'Control room: final minute. Fix the parser issue first if one is still active.',
          'Mentor bot: after syntax, check misspelled method names and undefined variables.',
          'Ops note: run often. Short feedback loops win missions.',
        ]
      }

      return [
        'Control room: read the console, patch one failure at a time, then rerun.',
        'Mentor bot: ReferenceError means the name is wrong. TypeError means the value is wrong.',
        'Ops note: the review panel has quick reminders for the common JavaScript failures in this mode.',
      ]
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
  },
  mounted() {
    this.resetMission()
  },
  beforeUnmount() {
    this.stopTimer()
  },
  methods: {
    buildMission(activeBugIds) {
      const codeLines = []
      const activeBugs = []

      CHALLENGE_TEMPLATE.forEach((entry, index) => {
        if (typeof entry === 'string') {
          codeLines.push(entry)
          return
        }

        if (activeBugIds.includes(entry.id)) {
          codeLines.push(entry.buggy)
          activeBugs.push({ ...entry, lineNumber: index + 1 })
          return
        }

        codeLines.push(entry.correct)
      })

      return {
        code: codeLines.join('\n'),
        activeBugs,
      }
    },
    pickActiveBugIds() {
      const bugCount = Math.floor(Math.random() * ALL_BUG_IDS.length) + 1

      return shuffle(ALL_BUG_IDS).slice(0, bugCount)
    },
    startTimer() {
      this.stopTimer()

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
            { type: 'error', text: 'Timer expired. Mission failed before a clean run.' },
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
      const mission = this.buildMission(this.pickActiveBugIds())

      this.missionsPlayed += 1
      this.currentCode = mission.code
      this.starterCode = mission.code
      this.activeBugs = mission.activeBugs
      this.consoleEntries = [
        {
          type: 'info',
          text: `Mission ${this.missionsPlayed} loaded. ${mission.activeBugs.length} error(s) seeded into the file.`,
        },
        {
          type: 'info',
          text: 'Press Run to inspect the failures, then patch the broken lines before the clock hits zero.',
        },
      ]
      this.secondsLeft = 180
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
      this.currentCode = this.starterCode
      this.consoleEntries = [
        { type: 'info', text: 'Starter code restored. Run again to recheck the current mission.' },
      ]
    },
    runMission() {
      if (this.missionExpired || this.isSolved) {
        this.resetMission()
        return
      }

      this.runCount += 1

      const currentLines = this.currentCode.split('\n')
      const unresolved = this.activeBugs.filter((bug) => {
        const line = currentLines[bug.lineNumber - 1] ?? ''

        return normalizeCodeLine(line) !== normalizeCodeLine(bug.correct)
      })

      if (unresolved.length > 0) {
        this.consoleEntries = [
          {
            type: 'error',
            text: `Run failed. ${unresolved.length} unresolved error(s) still block execution.`,
          },
          ...unresolved.map((bug) => ({
            type: 'error',
            text: `${bug.errorName} at line ${bug.lineNumber}: ${bug.consoleText}`,
          })),
          {
            type: 'hint',
            text: 'Open the Review tab for the JavaScript error cheat sheet and fix patterns.',
          },
        ]
        return
      }

      this.isSolved = true
      this.stopTimer()
      const clearSeconds = 180 - this.secondsLeft
      this.missionsCleared += 1

      if (this.bestClearSeconds === null || clearSeconds < this.bestClearSeconds) {
        this.bestClearSeconds = clearSeconds
      }

      this.consoleEntries = [
        { type: 'success', text: 'Build succeeded. No seeded errors remain.' },
        { type: 'success', text: 'Diagnostic summary' },
        { type: 'success', text: '------------------' },
        { type: 'success', text: 'Files scanned: 5' },
        { type: 'success', text: 'Total errors: 7' },
        { type: 'success', text: 'Average errors per file: 1.40' },
        { type: 'success', text: 'Highest severity: critical' },
        { type: 'success', text: 'Review: Review required before shipping.' },
        { type: 'success', text: 'File roster: AUTH, STORE, PROFILE, LEADERBOARD, SESSION' },
        { type: 'success', text: 'Run complete.' },
      ]
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
    selectSideTab(section) {
      this.activeModalSection = section
    },
    consoleEntryClass(type) {
      return {
        error: type === 'error',
        success: type === 'success',
        hint: type === 'hint',
        info: type === 'info',
      }
    },
  },
}
</script>

<template>
  <main
    class="w-100 flex-grow-1 py-3 px-2 px-lg-3 d-flex flex-column overflow-hidden app-page-shell"
  >
    <div class="home-layout" :style="editorThemeStyle">
      <section class="app-surface rounded p-2 p-lg-3 h-100 overflow-hidden home-game-shell">
        <div class="home-game-grid">
          <section class="home-workbench">
            <article class="editor-card">
              <div class="editor-card-header">
                <span class="editor-pill">main.js</span>
                <div class="editor-header-actions">
                  <div class="mission-timer" :class="{ danger: secondsLeft <= 60 && !isSolved }">
                    <strong>{{ formattedTime }}</strong>
                  </div>
                  <button
                    class="btn btn-primary editor-run-button"
                    type="button"
                    :aria-label="missionExpired || isSolved ? 'Load new mission' : 'Run code'"
                    :title="missionExpired || isSolved ? 'Load new mission' : 'Run code'"
                    @click="runMission"
                  >
                    <i class="bi bi-play-fill" aria-hidden="true"></i>
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
                  <pre ref="editorHighlight" class="editor-highlight" aria-hidden="true"><div
                      v-for="(line, index) in highlightedCodeLines"
                      :key="`code-${index}`"
                      class="editor-highlight-line"
                      v-html="line"
                    ></div></pre>
                  <textarea
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
            <article class="console-card console-side-card">
              <div class="console-header">
                <span class="editor-pill">Console</span>
                <span class="editor-meta">Always open</span>
              </div>
              <div class="console-body">
                <div
                  v-for="(entry, index) in consoleEntries"
                  :key="`${entry.type}-${index}`"
                  class="console-line"
                  :class="consoleEntryClass(entry.type)"
                >
                  {{ entry.text }}
                </div>
              </div>
            </article>
          </aside>
        </div>
      </section>

      <aside class="home-chat-dock">
        <article class="chat-card home-chat-card">
          <div class="chat-header">
            <div class="chat-tab-row" role="tablist" aria-label="Side panels">
              <button
                class="chat-tab"
                :class="{ active: activeModalSection === 'chat' }"
                type="button"
                role="tab"
                :aria-selected="activeModalSection === 'chat'"
                @click="selectSideTab('chat')"
              >
                Chat
              </button>
              <button
                class="chat-tab"
                :class="{ active: activeModalSection === 'mission' }"
                type="button"
                role="tab"
                :aria-selected="activeModalSection === 'mission'"
                @click="selectSideTab('mission')"
              >
                Mission
              </button>
              <button
                class="chat-tab"
                :class="{ active: activeModalSection === 'review' }"
                type="button"
                role="tab"
                :aria-selected="activeModalSection === 'review'"
                @click="selectSideTab('review')"
              >
                Review
              </button>
              <button
                class="chat-tab"
                :class="{ active: activeModalSection === 'stats' }"
                type="button"
                role="tab"
                :aria-selected="activeModalSection === 'stats'"
                @click="selectSideTab('stats')"
              >
                Stats
              </button>
            </div>
          </div>
          <div class="chat-body">
            <div v-if="activeModalSection === 'chat'" class="chat-feed">
              <div v-for="message in chatFeed" :key="message" class="chat-bubble">
                {{ message }}
              </div>
            </div>

            <div v-else-if="activeModalSection === 'mission'" class="settings-panel">
              <div class="settings-action-row">
                <button class="btn btn-primary btn-sm" type="button" @click="resetMission()">
                  New Mission
                </button>
                <button
                  class="btn btn-outline-light btn-sm"
                  type="button"
                  @click="restoreStarterCode()"
                >
                  Restore Starter
                </button>
              </div>
              <p class="panel-copy mb-0">
                {{ missionSummary }}
              </p>
              <div class="mission-stat-row">
                <div class="mission-stat-chip">
                  <span>Seeded</span>
                  <strong>{{ activeBugs.length }}</strong>
                </div>
                <div class="mission-stat-chip">
                  <span>Remaining</span>
                  <strong>{{ unresolvedBugCount }}</strong>
                </div>
              </div>
              <div class="mission-issue-list">
                <div v-for="bug in activeBugs" :key="bug.id" class="mission-issue-card">
                  <div class="mission-issue-title">{{ bug.errorName }}</div>
                  <div class="mission-issue-copy">Line {{ bug.lineNumber }}: {{ bug.fix }}</div>
                </div>
              </div>
            </div>

            <div v-else-if="activeModalSection === 'review'" class="settings-panel">
              <div class="review-grid">
                <div v-for="guide in reviewGuides" :key="guide.title" class="review-card">
                  <div class="review-title">{{ guide.title }}</div>
                  <p class="review-copy mb-0">{{ guide.summary }}</p>
                  <div class="review-fix">Fix: {{ guide.fix }}</div>
                </div>
              </div>
            </div>

            <div v-else class="settings-panel">
              <div class="side-stat-grid">
                <div v-for="card in sessionStatCards" :key="card.label" class="side-stat-card">
                  <span>{{ card.label }}</span>
                  <strong>{{ card.value }}</strong>
                </div>
              </div>
              <div class="player-summary">
                <div class="player-summary-row">
                  <span>Operator</span>
                  <strong>{{ userProfile.displayName }}</strong>
                </div>
                <div class="player-summary-row">
                  <span>Rank</span>
                  <strong>{{ userProfile.rankLabel }}</strong>
                </div>
                <div class="player-summary-row">
                  <span>Lifetime success rate</span>
                  <strong>{{ userProfile.successRate }}%</strong>
                </div>
                <div class="player-summary-row">
                  <span>Current level</span>
                  <strong>{{ userProfile.level }}</strong>
                </div>
              </div>
            </div>
          </div>
        </article>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.app-page-shell {
  min-height: 0;
}

.home-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.22fr) minmax(19rem, 21rem);
  gap: 1rem;
  flex: 1 1 auto;
  min-height: 0;
  align-items: stretch;
}

.home-game-shell {
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

.home-chat-dock {
  min-height: 0;
  display: flex;
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

.chat-card {
  flex: 1 1 auto;
}

.home-chat-card {
  width: 100%;
  min-height: 0;
}

.editor-card-header,
.console-header,
.chat-header {
  display: flex;
  align-items: center;
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
  font-size: 1rem;
  line-height: 1.35;
  user-select: none;
}

.editor-gutter span,
.editor-highlight-line,
.editor-textarea {
  line-height: 1.35;
}

.editor-highlight,
.editor-textarea {
  width: 100%;
  height: 100%;
  min-height: 34rem;
  padding: 1rem 1rem 1rem 1.1rem;
  font-family: 'VT323', monospace;
  font-size: 1rem;
  white-space: pre;
}

.editor-highlight {
  position: absolute;
  inset: 0;
  margin: 0;
  overflow: hidden;
  color: #eefbff;
  pointer-events: none;
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
}

.editor-textarea::selection {
  background: rgba(255, 214, 90, 0.2);
}

.editor-textarea:focus {
  outline: none;
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
  padding: 0.55rem 0.75rem;
  border-radius: 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(8, 19, 29, 0.42);
  color: var(--screen-text);
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
  .home-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .home-game-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .home-side-panels {
    overflow: auto;
  }

  .home-chat-dock {
    min-height: 18rem;
  }

  .console-side-card {
    max-height: 12rem;
  }
}

@media (max-width: 767.98px) {
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
