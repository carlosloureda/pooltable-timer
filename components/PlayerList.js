import React, { Component } from 'react';
import {
    FlatList, View, Text, StyleSheet, TouchableOpacity
} from 'react-native';

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { danger, blue, lightGrey, gold, lightBlue } from '../utils/colors';

class PlayerList extends Component {

    render() {
        const players = [
            { name: 'Angel', time: '01:52:00', money: '7,52', status:'started', id: 'item1' },
            { name: 'Carlos', time: '00:45:12', money: '3,10', status:'started', id: 'item2' },
            { name: 'Dani', time: '02:14:28', money: '9', status:'paused', id: 'item3' },
            { name: 'Javi', time: '00:13:09', money: '0,30', status:'started', id: 'item4' },
            { name: 'Kike', time: '01:34:57', money: '5', status:'finished', id: 'item5' },
            { name: 'Ivika', time: '03:02:35', money: '9', status:'paused', id: 'item6' }
        ];
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
                                    { item.status !== 'started'  &&
                                        <TouchableOpacity>
                                            <FontAwesome name='play' size={25} color={ blue } />
                                        </TouchableOpacity>
                                    }
                                    { item.status === 'started'  &&
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

export default PlayerList;
