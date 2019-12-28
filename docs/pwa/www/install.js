'use strict'

let deferredInstallPrompt = null
const installButton = document.getElementById('install-pwa')
installButton.addEventListener('click', installPwa)

window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent)
window.addEventListener('appinstalled', event => {
  console.log('Amidz PWA was installed', event)
})

function saveBeforeInstallPromptEvent (event) {
  console.log('Showing install button')
  deferredInstallPrompt = event
  installButton.removeAttribute('hidden')
}

function installPwa (event) {
  deferredInstallPrompt.prompt()
  event.srcElement.setAttribute('hidden', true)
  deferredInstallPrompt.userChoice
    .then(choice => {
      if (choice.outcome === 'accepted') {
        console.log('User accepted A2HS prompt', choice)
      } else {
        console.log('User dismissed A2HS prompt', choice)
      }
      deferredInstallPrompt = null
    })
}
