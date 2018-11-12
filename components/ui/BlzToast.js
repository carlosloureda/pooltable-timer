import React from 'react';
import { StyleSheet, View, Modal, Text, Button, Platform, Animated } from 'react-native';

import PropTypes from 'prop-types';

/* See from: https://reactnativecode.com/custom-common-toast-for-both-android-ios-app/ */

class BlzToast extends React.Component{

    constructor(){
        super();
        this.animateOpacityValue = new Animated.Value(0);
        this.state = {
            ShowToast: false
        }
        this.ToastMessage = '';
    }

    componentWillUnmount(){
        this.timerID && clearTimeout(this.timerID);
    }

    ShowToastFunction( message = "Custom React Native Toast", duration = 4000){
        this.ToastMessage = message;
        this.setState({ ShowToast: true }, () => {
            Animated.timing(
                this.animateOpacityValue,
                {
                    toValue: 1,
                    duration: 500
                }
            ).start(this.HideToastFunction(duration))
        });
    }

    HideToastFunction = (duration) => {
        this.timerID = setTimeout(() => {
            Animated.timing(
               this.animateOpacityValue, {
                 toValue: 0,
                 duration: 500
               }
            ).start(() => {
               this.setState({ ShowToast: false });
               clearTimeout(this.timerID);
            })
        }, duration);
    }

    render(){

        if(this.state.ShowToast) {

            return(
                <Animated.View
                    style = {
                        [ styles.animatedToastView,
                        {   opacity: this.animateOpacityValue,
                            top: (this.props.position == 'top') ? '10%' : '80%',
                            backgroundColor: this.props.backgroundColor }]
                    }
                >
                    <Text
                        numberOfLines = { this.ToastMessage.length % 30 ? this.ToastMessage.length % 30 : 1 }
                        style = {[ styles.ToastBoxInsideText, { color: this.props.textColor }]}>{ this.ToastMessage }
                    </Text>
                </Animated.View>
            );
        } else {
            return null;
        }
    }
}

export default BlzToast;


BlzToast.propTypes = {
    backgroundColor: PropTypes.string,
    position: PropTypes.oneOf([
       'top',
       'bottom'
    ]),
    textColor: PropTypes.string
};

BlzToast.defaultProps = {
    backgroundColor: '#666666',
    textColor: '#fff'
}

const styles = StyleSheet.create({

  MainContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: (Platform.OS == 'ios') ? 20 : 0,
    margin:10
  },
  animatedToastView: {
    marginHorizontal: 30,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 25,
    zIndex: 9999,
    position: 'absolute',
    justifyContent: 'center'
  },

  ToastBoxInsideText: {
    fontSize: 15,
    alignSelf: 'stretch',
    textAlign: 'center'
  }
});