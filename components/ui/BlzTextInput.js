import React from 'react';
import {
  StyleSheet, Text, View, TextInput
//   TouchableOpacity,
//   TouchableHighlight, Button,
} from 'react-native';

// import { lightBlue } from '../../utils/colors.js';

class BlzTextInput extends React.Component {

    constructor(props) {
        super(props);
        // this.state = { text: 'Useless Placeholder' };
        this.state = {
            text: props.text ? props.text :  null,
            textError: false,
            filledOrFocused: false,
            focused: false
        }
    }

    onChange = (text) => {
        this.setState({text})
        if (this.props.onChange) {
            this.props.onChange(text);
        }
    }
    onBlur = () => {
        this.setState({
            filledOrFocused: false || (this.state.text  && this.state.text.length),
            focused: false
        })
    }
    onFocus = () => {
        this.setState({
            filledOrFocused: true, focused: true
        })
    }
    dynamicColorLabel = () => {
        return {
            color: this.state.focused ? '#2a660c' : 'grey'
        }
    }
    render() {
        const { filledOrFocused } = this.state;
        return (
            <View>
                {!!filledOrFocused && <Text style={ [styles.label, this.dynamicColorLabel()] }>Nombre</Text>}
                <TextInput
                    style={{height: 60, paddingHorizontal: 5, marginHorizontal: 20, fontSize: 20, color: 'green'}}
                    onChangeText={(text) => this.onChange(text)}
                    onBlur= {() => this.onBlur()}
                    onFocus= {() => this.onFocus()}
                    value={this.state.text}
                    placeholder={filledOrFocused ? '' : 'Nombre'}
                    underlineColorAndroid = {this.state.textError ? 'red' : '#2a660c'}
                    // selectionColor = {'green'}
                />
            </View>
        )
    }
}

export default BlzTextInput;

const styles = StyleSheet.create({
    label: {
        marginHorizontal: 25,
        fontWeight: 'bold',
        color: 'grey'
    }
});