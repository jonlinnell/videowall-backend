const axios = require('axios')

const API = 'http://countdown.api.tfl.gov.uk/interfaces/ura/instant_V1'

const getBusDepartures = stopCode => new Promise((resolve, reject) => {
  axios.get(API, {
    params: {
      stopCode1: stopCode,
      ReturnList: 'EstimatedTime,LineID,DestinationName,StopPointName,TripID',
    },
  })
    .then((response) => {
      const parsedResponseData = JSON.parse(`[${response.data.replace(/]/g, '],').replace(/\],$/, ']').toString()}]`)

      const busData = parsedResponseData
        .slice(1)
        .sort((a, b) => {
          const x = a[5]
          const y = b[5]
          return ((x < y) ? -1 : ((x > y) ? 1 : 0)) // eslint-disable-line no-nested-ternary
        })

      resolve(busData.map(bus => ({
        destination: bus[3],
        service: bus[2],
        eta: Math.round(((Math.abs(new Date(bus[5] - Date.now())) % 86400000) % 3600000) / 60000),
      })))
    })
    .catch(error => reject(error))
})

module.exports = getBusDepartures