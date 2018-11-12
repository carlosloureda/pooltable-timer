import React, { Component } from 'react';
import {
    FlatList, View, Text, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { connect } from 'react-redux';

import { setTablePrice } from '../actions/index';

import BlzTextInput from './ui/BlzTextInput';
import BlzToast from './ui/BlzToast';
import Header from './Header';

const timeUtils = require('../utils/time-utils');
import { Utils } from '../utils/utils';
class SettingsView extends Component {

    constructor(props) {
        super(props)
        this.onPriceChange = this.onPriceChange.bind(this);
        this.onPriceSave = this.onPriceSave.bind(this);
    }

    static navigationOptions = ({ navigation }) => {
        const options = {
            title: 'Settings'
        }
        return {
          header: <Header
                navigation={navigation}
                headerProps= {options}
            />,
        }
    };

    state = {
        pricePerHour: this.props.pricePerHour.toString()
    }

    onPriceSave() {
        let { pricePerHour } = this.state;
        let { setTablePrice, timer } = this.props;
        if (typeof pricePerHour === 'string' || pricePerHour instanceof String) {
            pricePerHour = pricePerHour.replace(/,/gi, ".");
        }
        /* TODO: Quick fix for errors when changing current players price per hour */
        if (timer.status !== Utils.TIMER_STOPPED) {
            this.refs.errorToast.ShowToastFunction('No podemos cambiar el precio de la mesa con jugadores en juego.');
            return;
        }
        // check if the input is a valid number
        if(isFinite(pricePerHour) && pricePerHour != ''){
            pricePerHour = timeUtils.roundNumber(parseFloat(pricePerHour), 2);
            this.setState({
                pricePerHour: pricePerHour.toString()
            });
            setTablePrice(pricePerHour);
            this.refs.successToast.ShowToastFunction('Precio cambiado con éxito.');
        } else {
            this.refs.errorToast.ShowToastFunction('Introduce un precio correcto, por favor.');
        }
    }

    onPriceChange(text) {
        this.setState({
            pricePerHour: text
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    Configura tus precios
                </Text>
                <View style={styles.formInputBtnWrapper}>
                    <View style={styles.formInput}>
                        <BlzTextInput
                            placeHolder={'Precio por hora (€)'}
                            label={'Precio por hora (€)'}
                            text={this.state.pricePerHour}
                            onChange={this.onPriceChange}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.formBtn}
                        title="add" onPress={() => {this.onPriceSave()}}
                    >
                        <FontAwesome name="save" size={40} />
                    </TouchableOpacity>
                </View>
                <BlzToast ref="successToast" backgroundColor="#3b9607" position="bottom"/>
                <BlzToast ref="errorToast"  backgroundColor='#E91E63' position="bottom"/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        marginHorizontal: 25,
        fontWeight: 'bold',
        color: '#333333',
        fontSize: 30,
        paddingBottom: 10
    },
    formInputBtnWrapper: {
        flexDirection: 'row',
    },
    formInput: {
        flex: 4,
    },
    formBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

function mapStateToProps(state) {
    return {
      pricePerHour: state.pricePerHour,
      timer: state.timer,
    }
}

function mapDispatchToProps (dispatch) {
    return {
        setTablePrice: (price) => dispatch(setTablePrice(price)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView)