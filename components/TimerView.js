import React, { Component } from 'react';

import {
    View, Text, StyleSheet, Button
} from 'react-native';

const TIMER_STARTED = 1;
const TIMER_PAUSED = 2;
const TIMER_STOPPED = 3;

class TimerView extends Component {

    constructor(props) {
        super(props)
        this.getTimerInfo = this.getTimerInfo.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.pauseTimer = this.pauseTimer.bind(this);
    }
    nIntervId = null;

    state = {
        timer: {
            start: null,
            end: null,
            lastPauseCount: null,
            lastPause: null,
            count: 0,
            pauses: [],
            countFormatted: '00:00:00',
            status: TIMER_STOPPED,
        }
    }
    // getTime = () => new Date().toLocaleTimeString()
    parseTime(count) {
        let miliseconds = count % 1000;
        let seconds = Math.floor(count  / 1000) % 60;
        let minutes = Math.floor(count  / (1000 * 60)) % 60;
        let hours = Math.floor(count  / (1000 * 60 * 60)) % 60;

        miliseconds = (miliseconds < 10) ? '0' + miliseconds : miliseconds.toString();
        seconds = (seconds < 10) ? '0' + seconds : seconds.toString();
        minutes = (minutes < 10) ? '0' + minutes : minutes.toString();
        hours = (hours < 10) ? '0' + hours : hours.toString();
        return `${hours}:${minutes}:${seconds}`;
    }

    getTimerInfo = () => {
        var now = new Date().getTime();
        let totalCount = 0;
        if (this.state.timer.pauses && this.state.timer.pauses.length) {

            // desde start hasta primera pausa
            totalCount = this.state.timer.pauses[0].init - this.state.timer.start;

            // desde pausa ultima a start siguiente
            for (let i = 0; i < this.state.timer.pauses.length; i++) {
                if (i != this.state.timer.pauses.length - 1) { // no estamos en la ultima
                    totalCount += this.state.timer.pauses[i + 1].init - this.state.timer.pauses[i].end;
                }
            }

            // desde final ultima pausa hasta ahora
            let lastPause = this.state.timer.pauses[this.state.timer.pauses.length - 1];
            console.log("lastPause: ", lastPause);
            if (lastPause && lastPause.end) {
                totalCount += now - lastPause.end;
            }
        } else { // no pauses
            totalCount = now - this.state.timer.start;
        }
        return totalCount;
    }

    componentDidMount = () => {

    }
    startTimer = () => {
        console.log("Start timer");
        if (! this.state.timer.start) {
            this.setState({
                timer: {
                    ...this.state.timer,
                    start: new Date().getTime()
                }
            }, () => {});
        }
        this.nIntervId = setInterval(() => {
            const pausesObj = this.state.timer.pauses;
            const actualCount = this.getTimerInfo()
            if (this.state.timer.status === TIMER_PAUSED) {
                pausesObj[pausesObj.length -1].end = new Date().getTime();
            }
            this.setState({
                timer: {
                    ...this.state.timer,
                    count: actualCount,
                    status: TIMER_STARTED,
                    countFormatted: this.parseTime(actualCount),
                    pauses: this.state.timer.pauses
                }
            });
        }, 1);
    }
    pauseTimer = () => {
        console.log("Pause timer");
        clearInterval(this.nIntervId);
        let pausesArr = this.state.timer.pauses;
        pausesArr.push({
            init: new Date().getTime(),
            end: null
        });
        this.setState({
            timer: {
                ...this.state.timer,
                status: TIMER_PAUSED,
                pauses: pausesArr
            }
        }, () => {
            // save the pause 'time'

        })

    }
    stopTimer = () => {

    }
    resetTimer = () => {
        //TODO: add modal to ask if he/she is sure about this operation
        console.log("Pause timer");
        clearInterval(this.nIntervId);

        this.setState({
            timer: {
                start: null,
                end: null,
                lastPauseCount: null,
                lastPause: null,
                count: 0,
                pauses: [],
                countFormatted: '00:00:00',
                status: TIMER_STOPPED,
            }
        })
    }

    render() {
        const { status } = this.state.timer;
        console.log("STATUS: ", status);
        return(
            <View style={styles.container}>
                <Text>Timer page</Text>
                <Text>{this.state.timer.countFormatted}</Text>

                { status !== TIMER_STARTED &&
                    <Button
                        title="Play"
                        // color={primaryButton}
                        onPress={this.startTimer}
                    />
                }
                { status === TIMER_STARTED &&
                    <Button
                        title="Pause"
                        onPress={this.pauseTimer}
                    />
                }
                <Button
                    title="Reset"
                    onPress={this.resetTimer}
                />
                {/* TODO: Add pay/stop timer events */}
                {/* <Button
                    title="Pay"
                    onPress={this.stopTimer}
                /> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});

export default TimerView