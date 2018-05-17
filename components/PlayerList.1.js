import React, { Component } from 'react';
import {
    FlatList, View, Text, StyleSheet, TouchableOpacity
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

class PlayerList extends Component {

    render() {
        const players = [
            { name: 'Angel', time: '01:52:00', money: '7,52 €', status:'started', id: 'item1' },
            { name: 'Carlos', time: '00:45:12', money: '3,10 €', status:'started', id: 'item2' },
            { name: 'Dani', time: '02:14:28', money: '9 €', status:'paused', id: 'item3' },
            { name: 'Javi', time: '00:13:09', money: '0,30 €', status:'started', id: 'item4' },
            { name: 'Kike', time: '01:34:57', money: '5 €', status:'finished', id: 'item5' },
            { name: 'Ivika', time: '03:02:35', money: '9€', status:'paused', id: 'item6' }
        ];
        return (
            <FlatList style={styles.container}
                data={ players }
                keyExtractor={(player) => player.id}
                ItemSeparatorComponent={() => <View style={{height: 5, backgroundColor: '#E5E5E5'}}/>}
                renderItem={({item}) =>

                    <View style={styles.player}>
                        <View style={styles.playerLine1}>
                            <Text style={styles.playerName}>{item.name}</Text>
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
                            <Text style={styles.playerMoney}>{item.money}</Text>
                        </View>
                        <View style={styles.playerLine2}>
                            { item.status !== 'started'  &&
                                <TouchableOpacity>
                                    <FontAwesome name='play' size={25} color={'#dadada'} />
                                </TouchableOpacity>
                            }
                            { item.status === 'started'  &&
                                <TouchableOpacity>
                                    <FontAwesome name='pause' size={25} color={'#dadada'} />
                                </TouchableOpacity>
                            }
                            <TouchableOpacity>
                                <FontAwesome name='shopping-cart' size={25} color={'#dadada'} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <FontAwesome name='undo' size={25} color={'#dadada'} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <FontAwesome name='times-circle' size={25} color={'#dadada'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            />
        )
    }
}

const styles = StyleSheet.create({
    player: {
        backgroundColor: 'white',
        height: 100,
        // paddingHorizontal: 40,
        justifyContent: 'space-around'
    },
    playerLine1: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    playerLine2: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    playerName: {
        fontSize: 30
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
        // color: '#00e0ff'
    }
});

export default PlayerList;
