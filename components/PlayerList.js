import React, { Component } from 'react';
import {
    FlatList, View, Text, StyleSheet, TouchableOpacity
} from 'react-native';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { connect } from 'react-redux'
import { resetState } from '../actions/index'

import { danger, blue, lightGrey, gold, lightBlue } from '../utils/colors';
import PlayerListItem from './PlayerListItem';

import { Utils } from '../utils/utils';

class PlayerList extends Component {

    constructor(props) {
        super(props);
        // props.resetState();
    }

    render() {
        const players = Utils.objectToArray(this.props.players);
        return (
            <View>
                <FlatList
                    data={ players }
                    keyExtractor={(player) => player.id}
                    ItemSeparatorComponent={() => <View style={{height: 5, backgroundColor: '#E5E5E5'}}/>}
                    renderItem={({item}) =>
                        <PlayerListItem playerId={item.id} />
                    }
                />
            </View>
        )
    }
}

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