import { LitElement, html } from '../../../app-stdlib/vendor/lit-element/lit-element.js'
import { classMap } from '../../../app-stdlib/vendor/lit-element/lit-html/directives/class-map.js'
import * as QP from '../lib/query-params.js'
import settingsViewCSS from '../../css/views/settings.css.js'
import './settings/drive-handlers.js'
import './settings/programs.js'

class SettingsView extends LitElement {
  static get properties () {
    return {
      currentSubview: {type: String}
    }
  }

  static get styles () {
    return settingsViewCSS
  }

  constructor () {
    super()
    this.currentSubview = QP.getParam('subview') || 'general'
    this.load()
  }

  async load () {
    await this.requestUpdate()
    try {
      await Promise.all(Array.from(this.shadowRoot.querySelectorAll('[loadable]'), el => el.load()))
    } catch (e) {
      console.debug(e)
    }
  }

  // rendering
  // =

  render () {
    document.title = 'Settings'
    return html`
      <link rel="stylesheet" href="beaker://assets/font-awesome.css">
      <div class="subnav">${this.renderSubnav()}</div>
      <div class="subview">${this.renderSubview()}</div>
    `
  }

  renderSubnav () {
    const item = (id, icon, label) => {
      const cls = classMap({item: true, current: id === this.currentSubview})
      return html`
        <div class=${cls} @click=${e => this.onClickSubview(e, id)}><span class="fa-fw ${icon}"></span> ${label}</div>
      `
    }
    return html`
      ${item('general', 'fas fa-cog', 'General')}
      <hr>
      ${item('applications', 'far fa-window-restore', 'Applications')}
      ${item('commands', 'fas fa-terminal', 'Commands')}
      ${item('cloud-peers', 'fas fa-cloud', 'Cloud Peers')}
      ${item('users', 'fas fa-users', 'Users')}
      <hr>
      ${item('crawler', 'fas fa-spider', 'Crawler')}
      ${item('log-viewer', 'far fa-list-alt', 'Log Viewer')}
      <hr>
      ${item('help', 'far fa-question-circle', 'Information & Help')}
      <hr>
    `
  }

  renderSubview () {
    switch (this.currentSubview) {
      case 'applications':
        return html`
          <programs-view loadable type="application"></programs-view>
          <drive-handlers-view loadable></drive-handlers-view>
        `
      case 'commands':
        return html`<programs-view loadable type="webterm.sh/cmd-pkg"></programs-view>`
      default:
        return html`<div class="empty"><div><span class="fas fa-toolbox"></span></div>Under Construction</div>`
    }
  }

  // events
  // =

  onClickSubview (e, id) {
    this.currentSubview = id
    QP.setParams({subview: id})
    this.load()
  }
}

customElements.define('settings-view', SettingsView)