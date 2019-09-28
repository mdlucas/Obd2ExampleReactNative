/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  AppEventEmitter,
  ScrollView,
  View,
  Text,
  DeviceEventEmitter,
  StatusBar,
} from 'react-native';
import obd2 from '@furkanom/react-native-obd2';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

export default class App extends Component {
  state = {
    direction: '-',
    temp: '-',
    fuel: '-',
    speed: '0km/h',
    rpm: '0RPM',
    engineRunTime: '00:00:00',
    isStartLiveData: false,
    gpsState: '-',
    btStatus: '-',
    btDeviceList: [],
    btSelectedDeviceAddress: '',
    obd2Data: {},
  };

  componentDidMount = async () => {
    this.obdLiveDataListener = DeviceEventEmitter.addListener(
      'obd2LiveData',
      this.obdLiveData.bind(this),
    );
    const nameList = await obd2.getBluetoothDeviceNameList();
    const deviceObd2 = await nameList.filter(item => item.name === 'OBDII');
    obd2.ready();
    if (deviceObd2.length > 0) {
      obd2.startLiveData(deviceObd2[0].address);
    }
  };
  startLiveData() {
    obd2.setMockUpMode(true);
    obd2.startLiveData(this.state.btSelectedDeviceAddress);
  }
  obdLiveData(data) {
    console.log(data);
    let copyData = JSON.parse(JSON.stringify(this.state.obd2Data));
    copyData[data.cmdID] = data;
    this.setState({
      obd2Data: copyData,
    });

    if (data.cmdID === 'ENGINE_RPM') {
      this.setState({
        rpm: data.cmdResult,
      });
    }

    if (data.cmdID === 'SPEED') {
      this.setState({
        speed: data.cmdResult,
      });
    }
    if (data.cmdID === 'AIR_INTAKE_TEMP') {
      this.setState({
        temp: data.cmdResult,
      });
    }
    if (data.cmdID === 'FUEL_LEVEL') {
      this.setState({
        fuel: data.cmdResult,
      });
    }
  }
  setDeviceAddress(aDeviceAddress) {
    console.log('setDeviceAddress : ' + aDeviceAddress);
    this.setState({btSelectedDeviceAddress: aDeviceAddress}, () => {
      this.startLiveData();
    });
  }
  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionDescription}>
                  RPM:{this.state.rpm}
                </Text>
                <Text style={styles.sectionDescription}>
                  Speed:{this.state.speed}
                </Text>
                <Text style={styles.sectionDescription}>
                  Temp:{this.state.temp}
                </Text>
                <Text style={styles.sectionDescription}>
                  Fuel:{this.state.fuel}
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>See Your Changes</Text>
                <Text style={styles.sectionDescription}>
                  <ReloadInstructions />
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Debug</Text>
                <Text style={styles.sectionDescription}>
                  <DebugInstructions />
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Learn More</Text>
                <Text style={styles.sectionDescription}>
                  Read the docs to discover what to do next:
                </Text>
              </View>
              <LearnMoreLinks />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
