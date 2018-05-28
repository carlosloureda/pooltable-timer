import React, { Component } from 'react';

import {
    View, Text, StyleSheet, Button, TouchableOpacity, Easing
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { connect } from 'react-redux'
import {
    startTimer, pauseTimer, updateTimer, resetTimer,
    playerStartTimer, playerPauseTimer
} from '../actions/index';

// import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { Utils } from '../utils/utils';
const timeUtils = require('../utils/time-utils');

const PRICE_PER_HOUR = 4;
const PRICER_PER_MS = (PRICE_PER_HOUR/(60*60*1000));
const CURRENCY_SYMBOL ="€";

class TimerView extends Component {

    constructor(props) {
        super(props)
        this.onStartTimer = this.onStartTimer.bind(this);
        this.onPauseTimer = this.onPauseTimer.bind(this);
    }
    nIntervId = null;

    componentDidMount = () => {
        // this.refs.circularProgress.performTimingAnimation(100, 8000, Easing.quad);
        // this.props.resetTimer();
    }

    onStartTimer = () => {
        console.log("TIMERVIEW START TIMER");
        const now = new Date().getTime();
        this.props.startTimer(now);
        const playersArr = Utils.objectToArray(this.props.players);
        playersArr.forEach((player) => {
            this.props.playerStartTimer(player.id, now);
        });

        this.nIntervId = setInterval(() => {
            this.props.updateTimer();
        }, 1000);
    }

    onPauseTimer = () => {
        const now = new Date().getTime();
        clearInterval(this.nIntervId);
        this.props.pauseTimer(now);
        const playersArr = Utils.objectToArray(this.props.players);
        playersArr.forEach((player) => {
            this.props.playerPauseTimer(player.id, now);
        });
    }

    stopTimer = () => {

    }

    resetTimer = () => {
        //TODO: add modal to ask if he/she is sure about this operation
        clearInterval(this.nIntervId);
        this.props.resetTimer();
    }

    getTotalPrice = () => {
        return timeUtils.roundNumber(this.props.timer.count * PRICER_PER_MS, 2);
    }

    render() {
        const { status, countFormatted } = this.props.timer;
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
                            // onPress={this.resetTimer}
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
        players: state.players,
    };
}

function mapDispatchToProps (dispatch) {
    return {
        startTimer: (time) => dispatch(startTimer(time)),
        pauseTimer: (time) => dispatch(pauseTimer(time)),
        updateTimer: () => dispatch(updateTimer()),
        resetTimer: () => dispatch(resetTimer()),
        playerStartTimer: (id, time) => dispatch(playerStartTimer(id, time)),
        playerPauseTimer: (id, time) => dispatch(playerPauseTimer(id, time)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimerView)