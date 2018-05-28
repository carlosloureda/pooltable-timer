import React, { Component } from 'react';
import {
    FlatList, View, Text, StyleSheet, TouchableOpacity
} from 'react-native';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { danger, blue, lightGrey, gold, lightBlue } from '../utils/colors';
import { connect } from 'react-redux'
import { resetState } from '../actions/index'

const utils = require('../utils/utils');

class PlayerList extends Component {

    constructor(props) {
        super(props);
        // props.resetState();
    }

    render() {
        const { players } = this.props;
        return (
            <View>
                <FlatList
                    data={ players }
                    keyExtractor={(player) => player.id}
                    ItemSeparatorComponent={() => <View style={{height: 5, backgroundColor: '#E5E5E5'}}/>}
                    renderItem={({item}) =>

                        <View style={styles.player}>
                            <View style={styles.playerColumn1}>
                                <Text style={styles.playerName}>{item.name}</Text>
                                <View style={styles.playerButtons}>
                                    { item.status !== utils.PLAYER_STARTED &&
                                        <TouchableOpacity>
                                            <FontAwesome name='play' size={25} color={ blue } />
                                        </TouchableOpacity>
                                    }
                                    { item.status === utils.PLAYER_STARTED &&
                                        <TouchableOpacity>
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
                                        {/* { countFormatted.hours }:{ countFormatted.minutes } */}
                                        00:00
                                    </Text>
                                    <Text style={styles.timerCountSeconds}>
                                        {/* { countFormatted.seconds } */}
                                        00
                                    </Text>
                                </View>
                                <Text style={styles.playerMoney}>{item.money} €</Text>
                            </View>

                        </View>
                    }
                />

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
        resetState: () => dispatch(resetState()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerList)