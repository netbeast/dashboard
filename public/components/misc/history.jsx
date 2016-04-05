import React from 'react'
import mqtt from 'mqtt'
import { Line } from 'react-chartjs'

import chartOptions from './history-conf'

export default class History extends React.Component {
  constructor () {
    super()
    this.mqtt = mqtt.connect(window.mqttUri)
    this.state = { topics: {} }
  }

  componentWillMount () {
    this.mqtt.subscribe('#') // subscription to all channels
    this.mqtt.on('message', (topic, message) => {
      const { topics } = this.state
      topic = topic.toString()
      message = JSON.parse(message)
      
      topics[topic] = topics[topic] || []
      topics[topic] = [ message, ...topics[topic] ].slice(0, 11)
      this.setState({ topics })
      
      console.log('[%s] %s', topic.toString(), message.toString())
    })
  }

  componentWillUnmount () {
    this.mqtt.unsubscribe('netbeast/network')
  }

  render () {
    const { topics } = this.state
    const data = {
      labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      datasets: [{
        label: "My First dataset",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: [65, 59, 80, 81, 56, 55, 40, 56, 55, 40]
      }]
    }

    return (
      <div>
      <h2>MQTT Helper</h2>
      {Object.keys(topics).map((topic, idx) => {
        const localData = data
        localData.datasets[0].data = topics[topic]

        return (
          <span key={topic}>
          <h3>{topic}</h3>
          <Line data={localData} options={chartOptions} />
          </span>
          )
      })}
      </div>
      )
  }
}


