import React, { Component } from 'react';
import {
    FlatList, View, Text, StyleSheet, TouchableOpacity, Alert
} from 'react-native';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { danger, blue, lightGrey, gold, lightBlue } from '../utils/colors';
import { connect } from 'react-redux'
import { resetState } from '../actions/index'

import {
    playerStartTimer, playerPauseTimer, chargePlayer, startTimer,
    pauseTimer
} from '../actions/index';

import { Utils } from '../utils/utils';

class PlayerListItem extends Component {


    state = {
        timerCount: null,
        timerCountFormatted: { hours: '00', minutes: '00', seconds: '00' },
        paymentAmount: 0
    }

    constructor(props) {
        super(props)
        this.onStartTimer = this.onStartTimer.bind(this);
        this.onPauseTimer = this.onPauseTimer.bind(this);
        this.onUpdateTimer = this.onUpdateTimer.bind(this);
        this.onChargePlayer = this.onChargePlayer.bind(this);
    }

    // magic from outside :)
    componentDidUpdate(prevProps, prevState) {
        const player = this.getCurrentPlayer();
        const { timer, playerId } = this.props;

        let forcedStart = false;

        let prevPlayer = prevProps.players[playerId];
        if (prevProps.timer.status != this.props.timer.status) {

            forcedStart = this.props.timer.status === Utils.TIMER_STARTED;
            if ( this.props.timer.status === Utils.PLAYER_STARTED ) {
                console.log("[pListItem did update]: on forced start from timer: ", player.id);
                this.onStartTimer(false);
                //  FOr auto started players
            } else if(this.props.timer.status === Utils.PLAYER_PAUSED){
                console.log("[pListItem did update]: on forced pause from timer: ", player.id);
                this.onPauseTimer(false);
            }
        }
    }

    // TODO: add the delete player behaviour
    // TODO: add the reset player timer behaviour

    /**
     * We want to keep track of time even when app is closed!
     */
    componentDidMount = () => {

        const player = this.getCurrentPlayer();
        console.log("componentDidMount: (nIntervid is) : ", this.nIntervId);
        console.log("player.timer.start: ", player.timer.start);
        if (! this.nIntervId && player.timer.start ) {
            // TODO: children
            if(player.timer.status === Utils.PLAYER_STARTED) {
                console.log("The timer is supposed to be started ...");
                this.nIntervId = setInterval(() => {
                    this.onUpdateTimer();
                }, 1000);
            } else if (player.timer.status === Utils.PLAYER_PAUSED) {
                console.log("The timer is supposed to be paused ...");
                this.onUpdateTimer();
            } else  {
                this.onUpdateTimer(); //charged player
            }
        }
    }

    nIntervId = null;

    getCurrentPlayer = () => {
        const { playerId, players } = this.props;
        return players[playerId];
    }

    ////////////////////////////////////////////////////////////////////////////

    isUserPaused = (id) => {
        const { players } = this.props;
        let pausesArrLength = players[id].timer.pauses.length;
        if (pausesArrLength) {
            return players[id].timer.pauses[pausesArrLength - 1].end ? false : true
        }
        return false;
    }

    getActivePlayersCount = () => {
        let nPendingPlayers = 0;
        for (userId of this.props.playersPendingPayment) {
            nPendingPlayers += ! this.isUserPaused(userId) ? 1 : 0;
        }
        return nPendingPlayers;
    }

    calculate = () => {
        const { timer } = this.props;
        const player = this.getCurrentPlayer();
        // if (player.timer.status !== Utils.PLAYER_CHARGED) {
        const now = new Date().getTime();
        let billableTimeOffset = (timer.status === Utils.PLAYER_STARTED) ? now - timer.lastEventTime : 0;
        let activePlayersCount = this.getActivePlayersCount();
        let totalBillable = (billableTimeOffset / activePlayersCount) + player.timer.billable;
        //TODO: set price per hour from a place
        let sigma = (4/(60*60*1000));
        return parseFloat(totalBillable * sigma).toFixed(2);

    };
            ////////////////////////////////////////////////////////////////////
    getPlayerTimerInfo = () => {
        const player = this.getCurrentPlayer();
        // if(!player) return null;
        var now = new Date().getTime();
        let totalCount = 0;
        if (player.timer.pauses && player.timer.pauses.length) {
            // desde start hasta primera pausa
            totalCount = player.timer.pauses[0].init - player.timer.start;

            // desde pausa ultima a start siguiente
            for (let i = 0; i < player.timer.pauses.length; i++) {
                if (i != player.timer.pauses.length - 1) { // no estamos en la ultima
                    totalCount += player.timer.pauses[i + 1].init - player.timer.pauses[i].end;
                }
            }

            // desde final ultima pausa hasta ahora
            let lastPause = player.timer.pauses[player.timer.pauses.length - 1];
            if (lastPause && lastPause.end) {
                totalCount += now - lastPause.end;
            }
        } else { // no pauses
            totalCount = now - player.timer.start;
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
    ////////////////////////////////////////////////////////////////////////////

    onUpdateTimer = () => {

        const totalTime = this.getPlayerTimerInfo();
        this.setState({
            timerCount: totalTime,
            timerCountFormatted: this.parseTime(totalTime),
            paymentAmount: this.calculate()
        });
    }

    /* Only allow start player timer when global timer is running. If only one
    player both buttons (player and timer) should do the same work
    isUiEvent: Used for understanding if action comes from user click or not
    */
    onStartTimer = (isUiEvent) => {
        const player = this.getCurrentPlayer();
        const now = new Date().getTime();
        const { players, startGeneralTimer, timer } = this.props;
        let startTimerAllowed = true;

        if ( Object.values(players).length === 1 ) {
            startGeneralTimer(now);
        } else if(timer.status !== Utils.TIMER_STARTED && isUiEvent) {
            startTimerAllowed = false;
            Alert.alert(
                'No se puede realizar esta acción',
                `Inicia el tiempo de la mesa para poder gestionar los tiempos de cada jugador en la mesa.`,
                [{
                    text: '¡Vale!', style: 'success'
                }]
            )
        }
        if (startTimerAllowed) {
            this.props.playerStartTimer(player.id, now);
            this.nIntervId = setInterval(() => {
                this.onUpdateTimer();
            }, 1000);
        }
    }

    /* Only allow pause player timer when global timer is not running. If only one
    player both buttons (player and timer) should do the same work
    isUiEvent: Used for understanding if action comes from user click or not
    */
    onPauseTimer = (isUiEvent) => {
        const player = this.getCurrentPlayer(this.props.playerId);
        const now = new Date().getTime();
        const { players, pauseGeneralTimer, timer } = this.props;
        let pauseTimerAllowed = true;

        if ( Object.values(players).length === 1 ) {
            pauseGeneralTimer(now);
        } else if(timer.status !== Utils.TIMER_STARTED && isUiEvent) {
            pauseTimerAllowed = false;
            Alert.alert(
                'No se puede realizar esta acción',
                `Inicia el tiempo de la mesa para poder gestionar los tiempos de cada jugador en la mesa.`,
                [{
                    text: '¡Vale!', style: 'success'
                }]
            )
        }
        if (pauseTimerAllowed) {
            clearInterval(this.nIntervId);
            this.props.playerPauseTimer(player.id, now);
        }
    }

    onChargePlayer = () => {
        const player = this.getCurrentPlayer(this.props.playerId);
        Alert.alert(
            '¿Seguro?',
            `¿Quieres cobrar y sacar de la partida a ${player.name}?`,
            [
                {
                    text: 'No', onPress: () => {}, style: 'cancel'
                },
                {
                    text: 'Sí, ¡cobremos!.', onPress: () => {
                        clearInterval(this.nIntervId);
                        this.props.chargePlayer(player.id)
                    }
                },
            ],
            { cancelable: false }
        );
    }

    render() {
        const player = this.getCurrentPlayer()
        const { timer } = this.props;
        const { timerCount, timerCountFormatted, paymentAmount } = this.state;
        const playerCharged = player.timer.status === Utils.PLAYER_CHARGED;
        return (

            <View style={styles.player}>
                <View style={styles.playerColumn1}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    { ! playerCharged &&
                        <View style={styles.playerButtons}>

                            {/* { timer.status !== Utils.TIMER_STOPPED && player.timer.status !== Utils.PLAYER_STARTED && */}
                            { player.timer.status !== Utils.PLAYER_STARTED &&
                                <TouchableOpacity onPress={() => this.onStartTimer(true)}>
                                    <FontAwesome name='play' size={25} color={ blue } />
                                </TouchableOpacity>
                            }
                            {/* { timer.status !== Utils.TIMER_STOPPED && player.timer.status === Utils.PLAYER_STARTED && */}
                            { player.timer.status === Utils.PLAYER_STARTED &&
                                <TouchableOpacity onPress={() => this.onPauseTimer(true)}>
                                    <FontAwesome name='pause' size={25} color={ lightGrey } />
                                </TouchableOpacity>
                            }
                            <TouchableOpacity onPress={this.onChargePlayer}>
                                <FontAwesome name='euro' size={25} color={ gold } />
                            </TouchableOpacity>
                            {/* <TouchableOpacity>
                                <FontAwesome name='undo' size={25} color={'black'} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <FontAwesome name='trash' size={25} color={ danger } />
                            </TouchableOpacity> */}
                        </View>
                    }
                    { !! playerCharged &&
                        <View style={styles.playerButtons}>
                            <Text>Cobrado</Text>
                        </View>
                    }
                </View>
                <View style={styles.playerColumn2}>
                    <View style={styles.playerTime}>
                        <Text style={styles.timerCountPrimary}>
                            { timerCountFormatted.hours }:{ timerCountFormatted.minutes }
                        </Text>
                        <Text style={styles.timerCountSeconds}>
                            { timerCountFormatted.seconds }
                        </Text>
                    </View>
                    <Text style={styles.playerMoney}>{paymentAmount} €</Text>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    player: {
        backgroundColor: 'white',
        height: 100,
        flexDirection: 'row'
    },
    playerColumn1: {
        justifyContent: 'space-around',
        flex: 3,
        // backgroundColor: 'green'
    },
    playerColumn2: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flex: 1.5,
        // backgroundColor: 'blue'
    },
    playerName: {
        fontSize: 30,
        paddingLeft: 20
    },
    playerTime: {
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
    playerMoney: {
        fontSize: 20,
        color: 'blue'
    },
    playerButtons: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },

});

function mapStateToProps(state) {
    return {
      players: state.players,
      timer: state.timer,
      playersPendingPayment: state.playersPendingPayment
    }
}

function mapDispatchToProps (dispatch) {
    return {
        playerStartTimer: (id, time) => dispatch(playerStartTimer(id, time)),
        playerPauseTimer: (id, time) => dispatch(playerPauseTimer(id, time)),
        chargePlayer: (id) => dispatch(chargePlayer(id)),
        startGeneralTimer: (time) => dispatch(startTimer(time)),
        pauseGeneralTimer: (time) => dispatch(pauseTimer(time)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerListItem)