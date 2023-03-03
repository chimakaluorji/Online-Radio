import {
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Button,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';

import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';

import Nav from './Nav';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

import Share from 'react-native-share';

const {width, height} = Dimensions.get('window');

const ReactMenu = () => {
  const [menuTrack, setMenuTrack] = useState('radio');

  const navigation = useNavigation();

  const radioActive = () => {
    if (menuTrack !== 'radio') {
      setMenuTrack('radio');
    }
  };

  const tvActive = () => {
    if (menuTrack !== 'tv') {
      setMenuTrack('tv');
    }
  };

  const likeActive = () => {
    if (menuTrack !== 'like') {
      setMenuTrack('like');
    }
  };

  const shareActive = () => {
    if (menuTrack !== 'share') {
      setMenuTrack('share');
    }
  };

  const playAudio = async () => {
    await TrackPlayer.play();
  };

  const pauseAudio = async () => {
    await TrackPlayer.pause();
  };

  const showAlert = () => {
    Alert.alert(
      'THANK YOU',
      'Thank you for finding our app useful and we promise to serve you better',
      [{text: 'OK', onPress: () => console.log('Ok Pressed')}],
    );
  };

  //Handling Share of the app to other apps
  const url = 'https://play.google.com/store/apps/details?id=com.ebbc';
  const title = 'EBBC';
  const message =
    'Please download EBBC App to listen to the radio and watch Tv channels around the globe.';

  const options = {
    title,
    url,
    message,
  };

  const share = async (customOptions = options) => {
    try {
      await Share.open(customOptions);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Nav />

      <View style={styles.bottomContainer}>
        <View style={styles.bottomControlWrapper}>
          <TouchableOpacity
            onPress={() => {
              radioActive();
              playAudio();
              navigation.navigate('Radio');
            }}>
            <View style={styles.menuView}>
              <MaterialCommunityIcons
                name="radio"
                size={30}
                color={menuTrack === 'radio' ? '#FFD369' : '#888888'}
              />
              <Text style={styles.menuMessage}>Radio</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              tvActive();
              pauseAudio();
              navigation.navigate('TV');
            }}>
            <View style={styles.menuView}>
              <Icon
                name="tv-outline"
                size={30}
                color={menuTrack === 'tv' ? '#FFD369' : '#888888'}
              />
              <Text style={styles.menuMessage}>Television</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              likeActive();
              showAlert();
            }}>
            <View style={styles.menuView}>
              <Icon
                name="ios-heart-outline"
                size={30}
                color={menuTrack === 'like' ? '#FFD369' : '#888888'}
              />
              <Text style={styles.menuMessage}>Like</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              shareActive();
              await share();
            }}>
            <View style={styles.menuView}>
              <Icon
                name="md-share-social-outline"
                size={30}
                color={menuTrack === 'share' ? '#FFD369' : '#888888'}
              />
              <Text style={styles.menuMessage}>Share</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ReactMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1729',
  },
  bottomContainer: {
    width: width,
    alignItems: 'center',
    paddingVertical: 10,
    borderTopColor: '#393E46',
    borderWidth: 1,
  },
  bottomControlWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  menuMessage: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
    color: '#FFD369',
    alignItems: 'center',
  },
  menuView: {
    alignItems: 'center',
  },
});
