import React, { Component } from 'react';

import {
    View, Text, StyleSheet, Button, TouchableOpacity, Easing, Alert
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { connect } from 'react-redux'
import {
    startTimer, pauseTimer, resetTimer,
    playerStartTimer, playersPauseTimer
} from '../actions/index';

// import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { Utils } from '../utils/utils';
const timeUtils = require('../utils/time-utils');

const CURRENCY_SYMBOL ="€";

class TimerView extends Component {

    state = {
        count: 0,
        countFormatted: {
            hours: '00', minutes: '00', seconds: '00'
        }
    }

    constructor(props) {
        super(props)
        this.onStartTimer = this.onStartTimer.bind(this);
        this.onPauseTimer = this.onPauseTimer.bind(this);
        this.onUpdateTimer = this.onUpdateTimer.bind(this);
        this.initTimer = this.initTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
    }

    nIntervId = null;

    initTimer = () => {
        if (! this.nIntervId) {
            this.nIntervId = setInterval(() => {
                this.onUpdateTimer();
            }, 1000);
        }
    }
    stopTimer = () => {
        clearInterval(this.nIntervId);
        this.nIntervId = null;
    }

    /**
     * We want to keep track of time even when app is closed!
     * // TODO: push notification when time has been running for too long?
     */
    componentDidMount = () => {
        const { timer } = this.props;
        if (! this.nIntervId && timer.start ) {
            if(timer.status === Utils.TIMER_STARTED) {
                console.log("The timer is supposed to be started ...");
                this.initTimer();
            } else if (timer.status === Utils.TIMER_PAUSED) {
                console.log("The timer is supposed to be paused ...");
                this.onUpdateTimer();
            }
        }
        // this.refs.circularProgress.performTimingAnimation(100, 8000, Easing.quad);
        // this.props.resetTimer();
    }

    // when children wants to force update on parent (ex. when one child and we
    // play the start/pause on the child we want child and parent timer start)
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.timer.status !== this.props.timer.status ) {
            // console.log("[TIMERVIEW] this.props.timer.status : ", this.props.timer.status);
            // console.log("[TIMERVIEW] this.nIntervId : ", this.nIntervId);
            if (this.props.timer.status === Utils.TIMER_STARTED) {
                console.log("[TIMERVIEW] Not paused");
                this.initTimer();
            }
            else if (this.props.timer.status !== Utils.TIMER_STARTED) {
                console.log("[TIMERVIEW] Paused");
                this.stopTimer()
            }
        }
    }

    getTimerInfo = () => {
        const { timer } = this.props;
        var now = new Date().getTime();
        let totalCount = 0;
        if (timer.pauses && timer.pauses.length) {
            // desde start hasta primera pausa
            totalCount = timer.pauses[0].init - timer.start;

            // desde pausa ultima a start siguiente
            for (let i = 0; i < timer.pauses.length; i++) {
                if (i != timer.pauses.length - 1) { // no estamos en la ultima
                    totalCount += timer.pauses[i + 1].init - timer.pauses[i].end;
                }
            }

            // desde final ultima pausa hasta ahora
            let lastPause = timer.pauses[timer.pauses.length - 1];
            if (lastPause && lastPause.end) {
                totalCount += now - lastPause.end;
            }
        } else { // no pauses
            totalCount = now - timer.start;
        }
        return totalCount;
    }

    parseTime = (count) => {
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

    onUpdateTimer = () => {
        const totalCount = this.getTimerInfo();
        this.setState({
            count: totalCount,
            countFormatted: this.parseTime(totalCount)
        });
    }

    onStartTimer = () => {
        const now = new Date().getTime();
        this.props.startTimer(now);
        const playersArr = Utils.objectToArray(this.props.players);
        playersArr.forEach((player) => {
            this.props.playerStartTimer(player.id, now);
        });
        this.initTimer();
    }

    onPauseTimer = () => {
        const now = new Date().getTime();
        this.stopTimer();
        this.props.pauseTimer(now);
        console.log("this.props.players: ", this.props.players)
        const playersArr = Utils.objectToArray(this.props.players);
        console.log("playersArr: ", playersArr)        
        this.props.playersPauseTimer(now);        
    }

    resetTimer = () => {
        Alert.alert(
            '¿Seguro?',
            `Al reiniciar contador borralas a todos los jugadores de la partida.`,
            [
                {
                    text: 'No', onPress: () => {}, style: 'cancel'
                },
                {
                    text: 'Sí, reinicia.', onPress: () => {
                        // console.log(">>>> RESTARTING!!!!!");
                        const playersArr = Utils.objectToArray(this.props.players);
                        const now = new Date().getTime();

                        this.props.pauseTimer(now);
                        this.props.resetTimer();
                        this.stopTimer();
                        this.props.playersPauseTimer(now);
                        this.setState({
                            count: 0,
                            countFormatted: {
                                hours: '00', minutes: '00', seconds: '00'
                            }
                        });
                    }
                },
            ],
            { cancelable: false }
        );
    }


    getTotalPrice = () => {
        const { pricerPerMiliseconds } = this.props;
        // console.log("[TIMERVIEWS getTotalPrice()] this.state.count: ", this.state.count);
        // console.log("[TIMERVIEWS getTotalPrice()] pricerPerMiliseconds: ", pricerPerMiliseconds);
        return timeUtils.roundNumber(this.state.count * pricerPerMiliseconds, 2);
    }

    render() {
        const { status } = this.props.timer;
        const { countFormatted } = this.state;
        return(
            <View style={styles.timerWrapper}>
                <View style={styles.timerButtons}>
                    { status !== Utils.TIMER_STARTED &&

                        <TouchableOpacity
                            onPress={this.onStartTimer}
                            style={styles.timerButtonsCircle}
                        >
                            <FontAwesome
                                name='play' size={30}
                                color={'#dadada'}
                            />
                        </TouchableOpacity>

                    }
                    { status === Utils.TIMER_STARTED &&

                        <TouchableOpacity
                            onPress={this.onPauseTimer}
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

function mapStateToProps(state) {
    return {
        timer: state.timer,
        pricerPerMiliseconds: state.pricerPerMiliseconds,
        players: state.players,
    };
}

function mapDispatchToProps (dispatch) {
    return {
        startTimer: (time) => dispatch(startTimer(time)),
        pauseTimer: (time) => dispatch(pauseTimer(time)),
        resetTimer: () => dispatch(resetTimer()),
        playerStartTimer: (id, time) => dispatch(playerStartTimer(id, time)),
        playersPauseTimer: (time) => dispatch(playersPauseTimer(time)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimerView)