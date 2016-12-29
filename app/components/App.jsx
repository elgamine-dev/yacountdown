import React from 'react'
import moment from 'moment'
import PieChart from 'react-simple-pie-chart';

let style = window.getComputedStyle(document.querySelector('body'))
const mainColor = style.color
const bgColor = style.backgroundColor

let App = React.createClass({
  getInitialState() {
    return {}
  },
  onSetTime(e){
    e.preventDefault()
    const duration = parseInt(this.minutes.value, 10)
    this.start(duration)
  },
  restart(){
    this.start(this.state.duration)
  },
  start(duration){
    this.setState({startAt:moment().add(duration, 'minutes'), duration, finished:false})
    let val = setInterval(()=>{
        let remaining = moment.duration(this.state.startAt.diff(moment())) 
        if(remaining.asSeconds() <= 0) {

          clearInterval(val)
          this.setState({finished:true, remaining: moment.duration(0)})
        }
        this.setState({remaining, hideForm:true})
    },200)
  },
  render(){
    let hideForm = this.state.hideForm || false
    return (
      <div>
        <section className="time-setter" style={{display:hideForm && 'none' || 'block'  }}>
          <form onSubmit={this.onSetTime}>
            <input ref={(input)=>{this.minutes = input}} defaultValue="3" />
            <button>Set</button>
          </form>
        </section>

        <Clock time={this.state} restart={this.restart} style={{display:hideForm && 'block' || 'none'  }} />
      </div>
    )
  }
})


let Clock = React.createClass({
  render(){
    const time = this.props.time.remaining
    let blink = {}, minutes = 0, seconds, rem = 100, left = 0

    if(moment.isDuration(time)){
      minutes = time.minutes()
      seconds = time.seconds()
      rem = time.as('seconds')
      left = (this.props.time.duration * 60) - time.as('seconds')
      if(rem<=0) {
        rem=0;
        left=100;
      }
      if(rem < 10) {
        blink = {animationName:'blink'}
      }
    }
    return (
      <section className="clock" style={this.props.style} >
        <div className="clock-svg">
          <PieChart slices={[
            {color: bgColor, value: rem},
            {color: mainColor, value: left}
          ]} />
        </div>
        <div className="clock-remaining">
          <div className="clock-remaining--inner" style={blink}>
          {minutes}:<TwoDigits value={seconds} />
          <div className="clock-restart" style={{display:this.props.time.finished && 'block' || 'none'}}>
            <button className="inverse" onClick={()=>{this.props.restart()}}>restart</button>
          </div>
          </div>
        </div>
      </section>
    )
  }
})

let TwoDigits = React.createClass({
  render(){
    let aff = !!this.props.value && this.props.value || 0
    aff = aff >= 10 ? aff : "0"+aff
    return (
      <span>{aff}</span>
      )
  }
})

module.exports = App;