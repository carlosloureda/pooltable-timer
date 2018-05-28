import React, { Component } from 'react';
import {
    FlatList, View, Text, StyleSheet, TouchableOpacity
} from 'react-native';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { danger, blue, lightGrey, gold, lightBlue } from '../utils/colors';
import { connect } from 'react-redux'
import { resetState } from '../actions/index'

import {
    playerStartTimer, playerPauseTimer, playerUpdateTimer
} from '../actions/index';

import { Utils } from '../utils/utils';

class PlayerListItem extends Component {

    constructor(props) {
        super(props)
        this.onStartTimer = this.onStartTimer.bind(this);
        this.onPauseTimer = this.onPauseTimer.bind(this);
    }

    // TODO: add the play button behaviour
        // each player it is individual timer
    // TODO: add the stop button behaviour
    // TODO: add the delete player behaviour
    // TODO: add the reset player timer behaviour

    tmp() {

        players: [
            {
                name: 'Angel', time: '01:52:00', money: '7,52', id: 'item1',
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
                    status: Utils.TIMER_STOPPED,
                }
            }
        ]
    }

    nIntervId = null;

    getPlayerById = () => {
        const { playerId, players } = this.props;
        return players[playerId];
    }

    onStartTimer = () => {
        const player = this.getPlayerById(this.props.playerId);

        if (! player.timer.start) {
            this.props.playerStartTimer(player.id);
        }
        this.nIntervId = setInterval(() => {
            this.props.playerUpdateTimer(player.id);
        }, 1000);
    }

    onPauseTimer = () => {
        const player = this.getPlayerById(this.props.playerId);
        clearInterval(this.nIntervId);
        this.props.playerPauseTimer(player.id);
    }

    render() {
        const player = this.getPlayerById()
        const { countFormatted } = player.timer;
        return (

            <View style={styles.player}>
                <View style={styles.playerColumn1}>
                    <Text style={styles.playerName}>{player.name}</Text>
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
                        <TouchableOpacity>
                            <FontAwesome name='euro' size={25} color={ gold } />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <FontAwesome name='undo' size={25} color={'black'} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <FontAwesome name='trash' size={25} color={ danger } />
                        </TouchableOpacity>
                    </View>
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
      players: state.players
    }
}

function mapDispatchToProps (dispatch) {
    return {
        playerStartTimer: (id) => dispatch(playerStartTimer(id)),
        playerPauseTimer: (id) => dispatch(playerPauseTimer(id)),
        playerUpdateTimer: (id) => dispatch(playerUpdateTimer(id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerListItem)