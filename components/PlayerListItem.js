import React, { Component } from 'react';
import {
    FlatList, View, Text, StyleSheet, TouchableOpacity, Alert
} from 'react-native';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { danger, blue, lightGrey, gold, lightBlue } from '../utils/colors';
import { connect } from 'react-redux'
import { resetState } from '../actions/index'

import {
    playerStartTimer, playerPauseTimer, playerUpdateTimer, chargePlayer
} from '../actions/index';

import { Utils } from '../utils/utils';

class PlayerListItem extends Component {


    constructor(props) {
        super(props)
        this.onStartTimer = this.onStartTimer.bind(this);
        this.onPauseTimer = this.onPauseTimer.bind(this);
        this.onChargePlayer = this.onChargePlayer.bind(this);
    }

    // magic from outside :)
    componentDidUpdate(prevProps, prevState) {
        const player = this.getPlayerById();
        const { timer, playerId } = this.props;

        let forcedStart = false;

        let prevPlayer = prevProps.players[playerId];
        if (prevProps.timer.status != this.props.timer.status) {

            forcedStart = this.props.timer.status === Utils.PLAYER_STARTED;
            if ( this.props.timer.status === Utils.PLAYER_STARTED ) {
                console.log("[pListItem did update]: on forced start from timer: ", player.id);
                this.onStartTimer();
                //  FOr auto started players
            } else if(this.props.timer.status === Utils.PLAYER_PAUSED){
                console.log("[pListItem did update]: on forced pause from timer: ", player.id);
                this.onPauseTimer();
            }
        }
    }

    // TODO: add the delete player behaviour
    // TODO: add the reset player timer behaviour

    // For charging the players
        // remove player
            // 'Add chargableTime to the remaining users'
            // If:   last player -> end game
            // else: set the end time y elapased a este user

    nIntervId = null;

    getPlayerById = () => {
        const { playerId, players } = this.props;
        return players[playerId];
    }

    onStartTimer = () => {
        const player = this.getPlayerById(this.props.playerId);
        const now = new Date().getTime();
        this.props.playerStartTimer(player.id, now);
        this.nIntervId = setInterval(() => {
            this.props.playerUpdateTimer(player.id, now);
        }, 1000);
    }

    onPauseTimer = () => {
        const player = this.getPlayerById(this.props.playerId);
        const now = new Date().getTime();
        clearInterval(this.nIntervId);
        this.props.playerPauseTimer(player.id, now);
    }

    onChargePlayer = () => {
        const player = this.getPlayerById(this.props.playerId);
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
        const player = this.getPlayerById()
        const { countFormatted } = player.timer;
        const playerCharged = player.timer.status === Utils.PLAYER_CHARGED;
        return (

            <View style={styles.player}>
                <View style={styles.playerColumn1}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    { ! playerCharged &&
                        <View style={styles.playerButtons}>
                            { player.timer.status !== Utils.PLAYER_STARTED &&
                                <TouchableOpacity onPress={this.onStartTimer}>
                                    <FontAwesome name='play' size={25} color={ blue } />
                                </TouchableOpacity>
                            }
                            { player.timer.status === Utils.PLAYER_STARTED &&
                                <TouchableOpacity onPress={this.onPauseTimer}>
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
                            { countFormatted.hours }:{ countFormatted.minutes }
                        </Text>
                        <Text style={styles.timerCountSeconds}>
                            { countFormatted.seconds }
                        </Text>
                    </View>
                    <Text style={styles.playerMoney}>{player.money} €</Text>
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
      timer: state.timer
    }
}

function mapDispatchToProps (dispatch) {
    return {
        playerStartTimer: (id, time) => dispatch(playerStartTimer(id, time)),
        playerPauseTimer: (id, time) => dispatch(playerPauseTimer(id, time)),
        playerUpdateTimer: (id, time) => dispatch(playerUpdateTimer(id, time)),
        chargePlayer: (id) => dispatch(chargePlayer(id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerListItem)