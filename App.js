/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert, ScrollView} from 'react-native';
import OneSignal from 'react-native-onesignal';
import { ONE_SIGNAL_ID } from './src/config';
import { ListItem } from 'react-native-elements';

export default class App extends Component {

  state = {
    notifications: [
      {
        title: 'adasdasd',
        body: 'fnasfd'
      }
    ]
  }

  async componentDidMount(){
    // Initi OneSignal class with APP ID
    OneSignal.init(ONE_SIGNAL_ID);
    OneSignal.inFocusDisplaying(2);
    // configure OneSignal events
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }

  onReceived = async (notification) => {
    console.log('NOTIFICATION:', notification );
    const { additionalData } = notification.payload;
    const { notifications } = this.state;
    if(notification.isAppInFocus){      
      const updated = [ ...notifications, { title: notification.payload.title, body: notification.payload.body } ];
      this.setState({ notifications: updated });
      Alert.alert(notification.payload.title, notification.payload.body);
    }
  }

  onOpened = (openResult) => {
    const { notification } = openResult.notification;
    const { additionalData } = openResult.notification.payload;
    const { isAppInFocus } = openResult.notification;
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
    if(isAppInFocus){
      console.log('[NOTIFICATION RECEIVED ON FOREGROUND]');
      Alert.alert(JSON.stringify(notification));
    }
  }

  onIds = async (device) => {
    console.log('[PUSH TOKEN - ONE SIGNAL]', device);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}>
          <Text style={{textAlign: 'center', fontSize: 23, padding: 10, fontWeight: 'bold', color: '#2196F3'}}>
            Centro de notificaciones
          </Text>
          {
            this.state.notifications.map((e, i) => {
              return(
                <ListItem
                  key={i}
                  title={e.title}
                  subtitle={e.body}
                  chevron
                  topDivider
                  bottomDivider
                  />
              );
            })
          }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
