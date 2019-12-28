'use strict'

// supposes BASE_PATH is defined globally.

function getMessageFromCache (path) {
  if (!('caches' in window)) {
    return null
  }
  return caches.match(path)
    .then(response => {
      if (response) {
        return response.json()
      }
      return null
    })
    .catch(err => {
      console.error('Error getting data from cache', err)
      return null
    })
}

function getMessageFromNetwork (path) {
  return fetch(path)
    .then(response => response.json())
    .catch(() => null)
}

function setMessage (data) {
  if (!data) {
    // comes here,
    // - if the data does not exist,
    // - or if the data is not cached
    return false
  }
  const { message } = data
  const element = document.getElementById('message')
  element.innerHTML = message
  return true
}

function showMessage () {
  const MESSAGE_PATH = `${BASE_PATH}/data/message.json`
  const cached = getMessageFromCache(MESSAGE_PATH)
    .then(setMessage)
  const network = getMessageFromNetwork(MESSAGE_PATH)
    .then(setMessage)
  // warns the user if the message is neither cached nor on network
  Promise.all([cached, network])
    .then(updates => {
      if (updates.indexOf(true) === -1) {
        setMessage({
          message: `No such message: ${MESSAGE_PATH}`
        })
      }
    })
}

function init () {
  document.getElementById('show-message')
    .addEventListener('click', showMessage)
}

init()
