import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  LogBox,
} from 'react-native';

import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import StreamUrl from '../model/StreamUrl';

import NetInfo from '@react-native-community/netinfo';

const {width, height} = Dimensions.get('window');

const Item = ({item, onPress, backgroundColor, textColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <Text style={[styles.title, textColor]}>{item.title}</Text>
  </TouchableOpacity>
);

const List = () => {
  const [selectedId, setSelectedId] = useState(1);

  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [trackArtwork, setTrackArtwork] = useState();

  const [isPlaying, setPlaying] = useState(true);

  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);

  const playBackState = usePlaybackState();

  const [volume, setVolume] = useState(0.9);

  const [activeMode, setActiveMode] = useState('on');

  const [network, setNetwork] = useState('');

  const [screenIndex, setScreenIndex] = useState(0);

  const scrollViewRef = useRef(null);

  const trackPlayerInit = async () => {
    await TrackPlayer.setupPlayer({
      waitForBuffer: true,
    });

    await TrackPlayer.updateOptions({
      // Media controls capabilities
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],
    });

    await TrackPlayer.reset();
    await TrackPlayer.add(StreamUrl);
    await TrackPlayer.play();
  };

  function unsubscribe() {
    NetInfo.fetch().then(state => {
      setTimeout(function () {
        if (state.isConnected) {
          // any thing you want to load before navigate home screen
          setNetwork('Connected');
        } else {
          //Not internet connection
          setNetwork('NotConnected');
          showAlert();
        }
      }, 500);
    });
  }

  useEffect(() => {
    LogBox.ignoreAllLogs();
    trackPlayerInit();
    unsubscribe();
  }, []);

  const skipToAnotherChannel = async id => {
    await TrackPlayer.play();

    let trackId = id - 1;
    await TrackPlayer.skip(trackId);
    return setSelectedId(id);
  };

  //Changing the track
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const {title, artwork, artist} = track;
      setTrackTitle(title);
      setTrackArtist(artist);
      setTrackArtwork(artwork);
    }
  });

  const togglePlayBack = async playBackState => {
    const currentTrack = await TrackPlayer.getCurrentTrack();

    if (currentTrack != null) {
      if (playBackState == 'ready') {
        await TrackPlayer.play();
      } else {
        if (playBackState == State.Paused) {
          await TrackPlayer.play();
        } else {
          await TrackPlayer.pause();
        }
      }
    }
  };

  const skipNext = async () => {
    await TrackPlayer.skipToNext();

    setSelectedId((await TrackPlayer.getCurrentTrack()) + 1);

    renderItem(StreamUrl);
  };

  const skipPrev = async () => {
    await TrackPlayer.skipToPrevious();

    setSelectedId((await TrackPlayer.getCurrentTrack()) + 1);

    renderItem(StreamUrl);
  };

  const increaseVolume = async () => {
    volumeLevel = volume + 0.1;
    setVolume(volumeLevel);
    await TrackPlayer.setVolume(volumeLevel);
  };

  const decreaseVolume = async () => {
    volumeLevel = volume - 0.1;
    setVolume(volumeLevel);
    await TrackPlayer.setVolume(volumeLevel);
  };

  const onPlayPausePress = async () => {
    const state = await TrackPlayer.getState();

    if (state === TrackPlayer.STATE_PLAYING) {
      TrackPlayer.pause();
      setPlaying(false);
    }

    if (state === TrackPlayer.STATE_PAUSED) {
      TrackPlayer.play();
      setPlaying(true);
    }
  };

  const changeActiveMode = () => {
    if (activeMode == 'off') {
      setActiveMode('on');
    } else {
      setActiveMode('off');
    }
  };

  const toNextScroll = () => {
    setScreenIndex(screenIndex => screenIndex + 60);
    console.log(screenIndex);
    scrollViewRef.current?.scrollTo({
      y: screenIndex,
      animated: true,
    });
  };

  const toPrevScroll = () => {
    setScreenIndex(screenIndex => screenIndex - 60);
    console.log(screenIndex);
    scrollViewRef.current?.scrollTo({
      y: screenIndex,
      animated: true,
    });
  };

  const showAlert = () => {
    Alert.alert(
      'No Internet Connection',
      'No internet connection on your device, connect to internet and click on reconnect',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Reconnect', onPress: () => trackPlayerInit()},
      ],
    );
  };

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#946a05' : '#FFD369';
    const color = item.id === selectedId ? 'white' : 'black';

    //console.log(item.id + ' and ' + selectedId);
    //console.log('HI: ' + network);
    //let trackId = await TrackPlayer.getCurrentTrack();

    return (
      <Item
        item={item}
        onPress={() => skipToAnotherChannel(item.id)}
        backgroundColor={{backgroundColor}}
        textColor={{color}}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* Station Image */}
        <View style={styles.imageFrame}>
          <Image source={trackArtwork} style={styles.stationImage} />
        </View>
        {/* Station Content */}
        <View>
          <Text style={styles.songTitle}>{trackTitle}</Text>
          <Text style={styles.songArtist}>{trackArtist}</Text>
        </View>
        {/* Station Select */}
        <View style={styles.listContainer}>
          <View style={styles.flatListView}>
            <ScrollView
              ref={scrollViewRef}
              nestedScrollEnabled={true}
              style={{width: '100%'}}>
              <View>
                <ScrollView
                  ref={scrollViewRef}
                  horizontal={true}
                  style={{width: '100%'}}
                  contentContainerStyle={{flexGrow: 1}}>
                  <FlatList
                    data={StreamUrl}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    extraData={selectedId}
                  />
                </ScrollView>
              </View>
            </ScrollView>
          </View>

          <View style={styles.musicControlContainer}>
            <TouchableOpacity
              onPress={() => {
                skipPrev();
                toPrevScroll();
              }}>
              <Icon name="play-skip-back-outline" size={35} color="#FFD369" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                togglePlayBack(playBackState);
              }}>
              {playBackState === State.Playing ? (
                <Icon
                  name={
                    playBackState === State.Playing
                      ? 'ios-pause-circle'
                      : 'ios-play-circle'
                  }
                  size={75}
                  color="#FFD369"
                />
              ) : (
                <ActivityIndicator size={75} color="#FFD369" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                skipNext();
                toNextScroll();
              }}>
              <Icon
                name="play-skip-forward-outline"
                size={35}
                color="#FFD369"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.sliderView}>
            <Slider
              style={styles.progressBar}
              value={volume}
              minimumValue={0}
              maximumValue={1}
              thumbTintColor="#FFD369"
              minimumTrackTintColor="#FFD369"
              maximumTrackTintColor="#ffffff"
              onSlidingComplete={async value => {
                await TrackPlayer.setVolume(value);
              }}
            />
          </View>

          <View style={styles.volume}>
            <TouchableOpacity
              onPress={() => {
                decreaseVolume();
              }}>
              <Icon name="ios-volume-off-outline" size={30} color="#FFD369" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                increaseVolume();
              }}>
              <Icon name="md-volume-high-outline" size={30} color="#FFD369" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  mainContainer: {
    flex: 1,
  },
  item: {
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 15,
  },
  title: {
    fontSize: 22,
  },
  progressBar: {
    width: 350,
    height: 20,
    marginTop: 20,
  },
  flatListView: {
    shadowColor: '#FFD369',
    elevation: 40,
    width: '90%',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#FFD369',
    height: 310,
  },
  sliderView: {
    width: '90%',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  listContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    width: '60%',
    justifyContent: 'space-between',
  },

  stationImage: {
    width: '90%',
    height: 150,
    borderRadius: 35,
    marginTop: 10,
    borderWidth: 3,
    borderColor: '#FFD369',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageFrame: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  songTitle: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    color: '#EEEEEE',
  },

  songArtist: {
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
    color: '#EEEEEE',
  },
  volume: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});

export default List;
