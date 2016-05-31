import React from 'react'
import mqtt from 'mqtt'
import { Line } from 'react-chartjs'
import Typist from 'react-typist'

// import chartOptions from './history-conf'

const DATASET = {
  fillColor: 'rgba(0, 233, 207, .2)',
  strokeColor: 'rgb(0, 233, 207)',
  pointColor: 'rgb(0, 233, 207)',
  pointStrokeColor: 'rgb(0, 233, 207)',
  pointHighlightFill: 'rgb(0, 233, 207)',
  pointHighlightStroke: 'rgb(0, 233, 207)'
}

const LABELS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']

const SCALAR_TYPES = ['volume', 'temperature', 'luminosity', 'humidity']

export default class History extends React.Component {
  constructor () {
    super()
    this.mqtt = mqtt.connect(window.mqttUri)
    this.state = { topics: {}, scalars: {}, autotype: 'your garden' }
  }

  componentDidMount () {
    this.mqtt.subscribe('#') // subscription to all channels
    this.mqtt.on('message', (topic, message) => {
      const { topics, scalars } = this.state
      console.log('message', message)
      topic = topic.toString().replace('netbeast/', '')
      message = JSON.parse(message)

      if (SCALAR_TYPES.indexOf(topic) < 0) {
        topics[topic] = topics[topic] || []
        topics[topic] = message
        this.setState({ topics })
      } else {
        scalars[topic] = scalars[topic] || new Array(22)
        scalars[topic] = [...scalars[topic], message[topic]].slice(1, 22)
        console.log(scalars)
        this.setState({ scalars })
      }
    })
  }

  componentWillUnmount () {
    this.mqtt.unsubscribe('netbeast/network')
  }

  changeAutoTypes () {
    const { autotype } = this.state
    const autotypes =  ['your garden', 'the neighbourhood', 'the studio']
    const index = autotypes.findIndex(text => text === autotype)
    const nextText = (index + 1) >= autotypes.length ? autotypes[0] : autotypes[index + 1]
    setTimeout(() => this.setState({ autotype: nextText }), 1000)
  }

  render () {
    const { topics, scalars, autotype } = this.state
    const areThereTopics = (
      Object.keys(topics).length > 0 ||
      Object.keys(scalars).length > 0
    )

    return (
      <span className='history-view'>
        {areThereTopics ? this.renderHistoryData.call(this) : (
        <div>
          <h2> <br/> <br/> Reading data from <br/>
            <Typist key={autotype} onTypingDone={this.changeAutoTypes.bind(this)}>
              {autotype}.&nbsp;
            </Typist>
          </h2>
          <p style={{ margin: 150 }}>
            Data published through MQTT to netbeast/* will be here displayed.
            Try any of <kbd>['volume', 'temperature', 'luminosity', 'humidity']</kbd>
            &nbsp; as escalar values to see them represented in graphs.
          </p>
        </div>
        )}
      </span>
    )
  }

  renderHistoryData () {
    const { topics, scalars } = this.state

    return (
        <div className='history-data'>
          {Object.keys(scalars).map((topic, idx) => {
            const localData = Object.create({ labels: LABELS })
            localData.datasets = [Object.assign({}, DATASET, { label: topic, data: scalars[topic] })]
            const latestValue = Math.round(scalars[topic][scalars[topic].length - 1] * 100) / 100

            return (
              <div className='chart' key={topic}>
                <h6>
                  {topic}&nbsp;
                  <span className='latest-value'>{!isNaN(latestValue) ? latestValue : null}</span>
                </h6>
                <Line data={localData} height='240px'/>
                <br/>
              </div>
            )
          })}
          {Object.keys(topics).map((topic, idx) => {
            return (
              <div key={topic} className='topic'>
                <p>
                  <h6>{topic}</h6>
                  {JSON.stringify(topics[topic])}
                </p>
              </div>
            )
          })}
        </div>
      )
  }
}
