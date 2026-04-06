<script>
const PAGE_LABELS = {
  home: 'Debug Lobby',
  store: 'Store',
  profile: 'Profile',
  leaderboards: 'Leaderboards',
}

function buildMessage(author, text, own = false) {
  return {
    id: `${author}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    author,
    text,
    own,
  }
}

export default {
  name: 'GlobalChatPanel',
  emits: ['home-action'],
  props: {
    activePage: {
      type: String,
      required: true,
    },
    homePanelState: {
      type: Object,
      required: true,
    },
    userProfile: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      activeTab: 'global',
      draftMessage: '',
      globalMessages: [
        buildMessage('Nova', 'Ranked queue is still warming up, but the solo ladder is busy.'),
        buildMessage('PatchKid', 'Anyone else speedrunning the hard mission set tonight?'),
        buildMessage('Ops', 'Global chat is live across the cabinet now.'),
      ],
      localMessages: {
        home: [
          buildMessage('MentorBot', 'Local channel tracks the current debug room.'),
          buildMessage('Cipher', 'Check imports first when a mission spans multiple files.'),
        ],
        store: [buildMessage('Quartermaster', 'New icon packs rotated into the storefront.')],
        profile: [buildMessage('Archivist', 'Your latest clear times sync here once a run ends.')],
        leaderboards: [buildMessage('Scorekeeper', 'Top runs refresh every few minutes.')],
      },
    }
  },
  computed: {
    activePageLabel() {
      return PAGE_LABELS[this.activePage] ?? 'Arcade'
    },
    hasHomePanels() {
      return this.activePage === 'home' && this.homePanelState?.available
    },
    panelTabs() {
      const tabs = [
        { id: 'global', label: 'Global' },
        { id: 'local', label: `${this.activePageLabel} Local` },
      ]

      if (this.hasHomePanels) {
        tabs.push(
          { id: 'mission', label: 'Mission' },
          { id: 'review', label: 'Review' },
          { id: 'stats', label: 'Stats' },
        )
      }

      return tabs
    },
    availableTabIds() {
      return this.panelTabs.map((tab) => tab.id)
    },
    isChatTab() {
      return this.activeTab === 'global' || this.activeTab === 'local'
    },
    activeMessages() {
      if (this.activeTab === 'global') {
        return this.globalMessages
      }

      return this.localMessages[this.activePage] ?? []
    },
    panelHint() {
      if (this.activeTab === 'global') {
        return 'Talk to everyone online in Find The Err0r OS.'
      }

      if (this.activeTab === 'local') {
        return `Talk to players browsing ${this.activePageLabel}.`
      }

      if (this.activeTab === 'mission') {
        return this.homePanelState?.missionSummary ?? 'Mission data will appear here during a run.'
      }

      if (this.activeTab === 'review') {
        return 'Reference fixes and common JavaScript failure patterns.'
      }

      return 'Track your current debug run metrics.'
    },
  },
  watch: {
    activePage: {
      immediate: true,
      handler(page) {
        if (!this.localMessages[page]) {
          this.localMessages[page] = [
            buildMessage('Ops', `Local channel initialized for ${PAGE_LABELS[page] ?? 'Arcade'}.`),
          ]
        }
      },
    },
    homePanelState: {
      deep: true,
      handler(state) {
        if (!this.availableTabIds.includes(this.activeTab)) {
          this.activeTab = state?.available ? 'mission' : 'global'
        }
      },
    },
  },
  methods: {
    selectTab(tabId) {
      this.activeTab = tabId

      if (tabId === 'mission' || tabId === 'review' || tabId === 'stats') {
        this.$emit('home-action', tabId)
      }
    },
    sendMessage() {
      const text = this.draftMessage.trim()

      if (!text) {
        return
      }

      const message = buildMessage(this.userProfile.displayName, text, true)

      if (this.activeTab === 'global') {
        this.globalMessages.push(message)
      } else {
        this.localMessages[this.activePage].push(message)
      }

      this.draftMessage = ''
    },
    triggerHomeAction(action) {
      this.$emit('home-action', action)
    },
  },
}
</script>

<template>
  <aside class="chat-card app-chat-card">
    <div class="chat-card__header">
      <div>
        <div class="chat-card__eyebrow">Comms</div>
        <div class="chat-card__title">Player Chat</div>
        <p class="chat-card__copy mb-0">{{ panelHint }}</p>
      </div>
      <div class="chat-card__status">Live</div>
    </div>

    <div class="chat-card__tabs" role="tablist" aria-label="Chat channels and tools">
      <button
        v-for="tab in panelTabs"
        :key="tab.id"
        class="chat-card__tab"
        :class="{ 'chat-card__tab--active': tab.id === activeTab }"
        type="button"
        role="tab"
        :aria-selected="tab.id === activeTab"
        @click="selectTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="isChatTab" class="chat-card__feed" aria-live="polite">
      <article
        v-for="message in activeMessages"
        :key="message.id"
        class="chat-message"
        :class="{ 'chat-message--own': message.own }"
      >
        <div class="chat-message__author">{{ message.author }}</div>
        <div class="chat-message__body">{{ message.text }}</div>
      </article>
    </div>

    <div v-else-if="activeTab === 'mission'" class="chat-card__panel">
      <div class="settings-action-row">
        <button
          class="chat-card__action chat-card__action--primary"
          type="button"
          @click="triggerHomeAction('resetMission')"
        >
          New Mission
        </button>
        <button
          class="chat-card__action"
          type="button"
          @click="triggerHomeAction('restoreStarterCode')"
        >
          Restore Starter
        </button>
      </div>
      <div class="mission-stat-row">
        <div class="mission-stat-chip">
          <span>Seeded</span>
          <strong>{{ homePanelState.seededBugCount ?? 0 }}</strong>
        </div>
        <div class="mission-stat-chip">
          <span>Remaining</span>
          <strong>{{ homePanelState.unresolvedBugCount ?? 0 }}</strong>
        </div>
      </div>
      <div class="mission-issue-list">
        <div v-for="bug in homePanelState.activeBugs" :key="bug.id" class="mission-issue-card">
          <div class="mission-issue-title">{{ bug.errorName }}</div>
          <div class="mission-issue-copy">
            {{ bug.fileLabel }}:{{ bug.lineNumber }} · {{ bug.fix }}
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'review'" class="chat-card__panel">
      <div class="review-grid">
        <div v-for="guide in homePanelState.reviewGuides" :key="guide.title" class="review-card">
          <div class="review-title">{{ guide.title }}</div>
          <p class="review-copy mb-0">{{ guide.summary }}</p>
          <div class="review-fix">Fix: {{ guide.fix }}</div>
        </div>
      </div>
    </div>

    <div v-else class="chat-card__panel">
      <div class="side-stat-grid">
        <div
          v-for="card in homePanelState.sessionStatCards"
          :key="card.label"
          class="side-stat-card"
        >
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

    <form v-if="isChatTab" class="chat-card__composer" @submit.prevent="sendMessage">
      <input
        v-model="draftMessage"
        class="chat-card__input"
        type="text"
        maxlength="180"
        :placeholder="`Message ${activeTab === 'global' ? 'global' : activePageLabel.toLowerCase()} chat...`"
      />
      <button class="chat-card__send" type="submit">Send</button>
    </form>
  </aside>
</template>

<style scoped>
.app-chat-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 0;
  border: 2px solid rgba(142, 230, 255, 0.24);
  border-radius: 1.1rem;
  background:
    radial-gradient(circle at top, rgba(255, 214, 90, 0.08), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.06)),
    linear-gradient(180deg, rgba(15, 50, 77, 0.98), rgba(8, 19, 29, 0.96));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 12px 24px rgba(0, 0, 0, 0.24);
  color: #eefbff;
}

.chat-card__header,
.chat-card__composer {
  padding: 0.95rem 1rem;
}

.chat-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.chat-card__eyebrow,
.chat-card__title,
.chat-card__status,
.chat-card__tab,
.chat-card__send {
  font-family: 'Press Start 2P', monospace;
}

.chat-card__eyebrow {
  color: #ffd65a;
  font-size: 0.52rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.chat-card__title {
  margin-top: 0.35rem;
  color: #eefbff;
  font-size: 0.78rem;
  line-height: 1.5;
}

.chat-card__copy {
  margin-top: 0.45rem;
  color: rgba(205, 230, 240, 0.78);
  font-family: 'VT323', monospace;
  font-size: 1.05rem;
  line-height: 1.2;
}

.chat-card__status {
  color: #8ee6ff;
  font-size: 0.52rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.chat-card__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  padding: 0.85rem 1rem 0;
}

.chat-card__tab {
  padding: 0.42rem 0.65rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: rgba(8, 19, 29, 0.42);
  color: rgba(205, 230, 240, 0.78);
  font-size: 0.5rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.chat-card__tab--active {
  border-color: rgba(255, 214, 90, 0.38);
  background: rgba(255, 214, 90, 0.14);
  color: #ffd65a;
}

.chat-card__feed {
  display: grid;
  gap: 0.65rem;
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding: 1rem;
}

.chat-message {
  padding: 0.75rem 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.85rem;
  background: rgba(8, 19, 29, 0.42);
}

.chat-message--own {
  border-color: rgba(255, 214, 90, 0.24);
  background: rgba(255, 214, 90, 0.08);
}

.chat-message__author {
  margin-bottom: 0.25rem;
  color: #ffd65a;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.5rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.chat-message__body {
  color: #eefbff;
  font-family: 'VT323', monospace;
  font-size: 1.08rem;
  line-height: 1.2;
  word-break: break-word;
}

.chat-card__panel {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 0.85rem;
  min-height: 0;
  overflow: auto;
  padding: 1rem;
}

.settings-action-row,
.mission-stat-row,
.side-stat-grid,
.player-summary {
  display: grid;
  gap: 0.75rem;
}

.settings-action-row {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.mission-stat-row,
.side-stat-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.chat-card__action,
.mission-issue-title,
.review-title,
.player-summary-row strong,
.side-stat-card strong,
.mission-stat-chip strong {
  font-family: 'Press Start 2P', monospace;
}

.chat-card__action {
  min-height: 2.5rem;
  padding: 0.65rem 0.8rem;
  border: 1px solid rgba(142, 230, 255, 0.28);
  border-radius: 0.8rem;
  background: rgba(8, 19, 29, 0.48);
  color: #eefbff;
  font-size: 0.5rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.chat-card__action--primary {
  border-color: rgba(255, 214, 90, 0.82);
  background: linear-gradient(180deg, rgba(255, 214, 90, 0.98), rgba(202, 156, 42, 0.94));
  color: #1b1a10;
}

.mission-stat-chip,
.side-stat-card,
.mission-issue-card,
.review-card {
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

.mission-stat-chip span,
.side-stat-card span,
.mission-issue-copy,
.review-copy,
.player-summary-row span {
  color: rgba(205, 230, 240, 0.78);
}

.mission-stat-chip strong,
.side-stat-card strong {
  font-size: 0.7rem;
  line-height: 1.5;
  color: #eefbff;
}

.mission-issue-list,
.review-grid {
  display: grid;
  gap: 0.75rem;
}

.mission-issue-title,
.review-title {
  color: #ffd65a;
  font-size: 0.52rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.35rem;
}

.mission-issue-copy,
.review-copy,
.review-fix,
.player-summary-row {
  font-family: 'VT323', monospace;
  font-size: 1rem;
  line-height: 1.2;
}

.review-fix {
  margin-top: 0.55rem;
  color: #eefbff;
}

.player-summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.chat-card__composer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.6rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.chat-card__input {
  min-width: 0;
  height: 2.8rem;
  padding: 0 0.8rem;
  border: 1px solid rgba(142, 230, 255, 0.24);
  border-radius: 0.8rem;
  background: rgba(8, 19, 29, 0.62);
  color: #eefbff;
  font-family: 'VT323', monospace;
  font-size: 1.08rem;
}

.chat-card__input::placeholder {
  color: rgba(205, 230, 240, 0.5);
}

.chat-card__input:focus {
  outline: none;
  border-color: rgba(255, 214, 90, 0.45);
  box-shadow: 0 0 0 0.12rem rgba(255, 214, 90, 0.15);
}

.chat-card__send {
  min-width: 5.5rem;
  height: 2.8rem;
  padding: 0 0.8rem;
  border: 1px solid rgba(255, 214, 90, 0.82);
  border-radius: 0.8rem;
  background: linear-gradient(180deg, rgba(255, 214, 90, 0.98), rgba(202, 156, 42, 0.94));
  color: #1b1a10;
  font-size: 0.54rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 767.98px) {
  .app-chat-card {
    min-height: 19rem;
  }

  .settings-action-row,
  .mission-stat-row,
  .side-stat-grid {
    grid-template-columns: 1fr;
  }

  .chat-card__header,
  .chat-card__composer {
    padding-inline: 0.85rem;
  }
}
</style>
