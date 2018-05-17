import React, { Component } from 'react';

import {
    View, Text, StyleSheet, Button, TouchableOpacity, Easing
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// import { AnimatedCircularProgress } from 'react-native-circular-progress';

const timeUtils = require('../utils/time-utils');

const TIMER_STARTED = 1;
const TIMER_PAUSED = 2;
const TIMER_STOPPED = 3;
const PRICE_PER_HOUR = 4;
const PRICER_PER_MS = (PRICE_PER_HOUR/(60*60*1000));
const CURRENCY_SYMBOL ="€";

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
            countFormatted: {
                hours: '00', minutes: '00', seconds: '00'
            },
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
        return  {
            hours, minutes, seconds
        }
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
            if (lastPause && lastPause.end) {
                totalCount += now - lastPause.end;
            }
        } else { // no pauses
            totalCount = now - this.state.timer.start;
        }
        return totalCount;
    }

    componentDidMount = () => {
        // this.refs.circularProgress.performTimingAnimation(100, 8000, Easing.quad);
    }
    startTimer = () => {
        // console.log("Start timer");
        if (! this.state.timer.start) {
            this.setState({
                timer: {
                    ...this.state.timer,
                    start: new Date().getTime(),
                    status: TIMER_STARTED
                }
            }, () => {});
        }
        // this.setState({
        //     timer: {
        //         ...this.state.timer,
        //         status: TIMER_STARTED
        //     }
        // }, () => {});
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
        }, 1000);
    }
    pauseTimer = () => {
        // console.log("Pause timer");
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
        // console.log("Pause timer");
        clearInterval(this.nIntervId);

        this.setState({
            timer: {
                start: null,
                end: null,
                lastPauseCount: null,
                lastPause: null,
                count: 0,
                pauses: [],
                countFormatted: {
                    hours: '00', minutes: '00', seconds: '00'
                },
                status: TIMER_STOPPED,
            }
        })
    }

    getTotalPrice = () => {
        return timeUtils.roundNumber(this.state.timer.count * PRICER_PER_MS, 2);
    }

    render() {
        const { status, countFormatted } = this.state.timer;
        return(
            <View style={styles.timerWrapper}>
                <View style={styles.timerButtons}>
                    { status !== TIMER_STARTED &&

                        <TouchableOpacity
                            onPress={this.startTimer}
                            style={styles.timerButtonsCircle}
                        >
                            <FontAwesome
                                name='play' size={30}
                                color={'#dadada'}
                            />
                        </TouchableOpacity>

                    }
                    { status === TIMER_STARTED &&

                        <TouchableOpacity
                            onPress={this.pauseTimer}
                            style={styles.timerButtonsCircle}
                        >
                            <FontAwesome
                                name='pause' size={30}
                                color={'#dadada'}
                            />
                        </TouchableOpacity>
                    }
                </View>
                <View style={styles.timerInfo}>
                    <View style={styles.timerUpperLine}>
                        <FontAwesome
                            style={styles.resetButton}
                            name='undo' size={15}
                            color={'#999'}
                            onPress={this.resetTimer}
                        />
                        <Text style={styles.timerPrice}>
                            {this.getTotalPrice() + ' ' + CURRENCY_SYMBOL}
                        </Text>
                    </View>
                    <View style={styles.timerCount}>
                        <Text style={styles.timerCountPrimary}>
                            { countFormatted.hours }:{ countFormatted.minutes }
                        </Text>
                        <Text style={styles.timerCountSeconds}>
                            { countFormatted.seconds }
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    timerWrapper: {
        backgroundColor: '#333333',
        // flex: 1,
        flexDirection: 'row',
        width: 300,
        height:100,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    timerButtons: {
        // backgroundColor: 'red',
        height: 100,
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },
    timerButtonsCircle: {
        borderWidth: 6,
        // borderColor:'rgba(0,0,0,0.2)',
        borderColor:'#4b4b4b',
        alignItems:'center',
        justifyContent:'center',
        marginLeft: 5,
        width:80,
        height:80,
        // backgroundColor:'#fff',
        borderRadius:100,
    },
    timerInfo: {
        height: 100,
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    timerCount: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    timerCountPrimary: {
        fontSize: 30,
        color: '#dadada'
    },
    timerCountSeconds: {
        paddingLeft: 5,
        fontSize: 15,
        color: '#999'
    },
    resetButton: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        // flex: 1,
        paddingTop: 5,
        // justifyContent: 'flex-end'
    },
    timerPrice: {
        flex: 2,
        fontSize: 20,
        color: '#00e0ff'
    },
    timerUpperLine: {
        flex: 1,
        width: 150, //TODO: change one day
        alignItems: 'center',
        justifyContent: 'center'
    }

});

export default TimerView