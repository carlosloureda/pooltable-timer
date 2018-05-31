import React from 'react';
import {
    StyleSheet, Text, View, Image, TouchableOpacity
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

class Header extends React.Component {

    render() {
        const { navigation,  headerProps } = this.props;
        return (
            <View style={styles.header}>
                <View style={styles.headerLine1}>
                    <View style={styles.headerLogo}>
                        <Image
                            source={require('../assets/images/logo.jpg')}
                            style = {{width:25, height: 25}}
                        />
                        <Text style={styles.headerLogoTitle}>
                            Pooltable Timer
                        </Text>
                    </View>
                    <View style={styles.headerMenu}>
                        <TouchableOpacity onPress={() => navigation.navigate('Settings', { })} >
                            <MaterialIcons name="settings" color="#dadada" size={30}/>
                        </TouchableOpacity>
                    </View>
                </View>
                { !! headerProps &&
                    <View style={styles.headerBackLine}>
                        {/* <HeaderBackButton onPress={() => navigation.goBack(null)} />, */}
                        <TouchableOpacity style={styles.headerBackButton} onPress={() => navigation.goBack(null)} >
                            <FontAwesome name="long-arrow-left" color="#dadada" size={60}/>
                        </TouchableOpacity>
                        <Text style={styles.headerBackText}> {headerProps.title} </Text>
                    </View>
                }
            </View>
        )
    }
}

export default Header;

const styles = StyleSheet.create({
    headerLine1: {
      backgroundColor: '#4b4b4b',
      flexDirection: 'row',
      height: 35
    },
    headerBackLine: {
        borderTopWidth: 1,
        borderColor: '#dadada',
        backgroundColor: '#4b4b4b',
        flexDirection: 'row',
        height: 70,
        justifyContent: 'flex-start'
    },
    headerBackButton: {
        marginLeft: 10,
        flex: 1
    },
    headerBackText: {
        flexDirection: 'row',
        color: '#dadada',
        paddingTop: 8,
        fontSize: 30,
        flex: 4
    },
    headerLogo: {
      flex: 4,
      flexDirection: 'row',
      paddingLeft: 10,
      paddingTop: 5
    },
    headerLogoTitle: {
      paddingLeft: 20,
      fontSize: 20,
      color: '#333333',
    },
    headerMenu: {
      flex: 1,
      alignItems: 'flex-end',
      paddingTop: 3,
      paddingRight: 5
    }
});