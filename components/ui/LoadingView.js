import React from 'react';
import {
  StyleSheet, View, Image
} from 'react-native';

export default class LoadingView extends React.Component {

    render() {
        return (
            // TODO: create this view
            <View style={styles.container}>
                <Image
                    source={ require('../../assets/images/pool_10_ball.jpg') }
                    style = {{width:200, height: 200}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});