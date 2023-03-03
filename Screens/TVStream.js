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

import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Video from 'react-native-video';

import StreamUrl from '../model/TVStreamUrl';

import NetInfo from '@react-native-community/netinfo';

const {width, height} = Dimensions.get('window');

const Item = ({item, onPress, backgroundColor, textColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <Text style={[styles.title, textColor]}>{item.title}</Text>
    <Image source={item.artwork} style={styles.stationImage} />
  </TouchableOpacity>
);

const TVStream = () => {
  const [selectedId, setSelectedId] = useState(1);

  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [trackArtwork, setTrackArtwork] = useState();

  const [isPlaying, setPlaying] = useState(true);

  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);

  const [volume, setVolume] = useState(0.9);

  const [activeMode, setActiveMode] = useState('on');

  const [network, setNetwork] = useState('');

  const [isLoad, setIsLoad] = useState();

  const [screenIndex, setScreenIndex] = useState(0);
  const [content, setContent] = useState();

  const scrollViewRef = useRef(null);

  const videoPlayer = useRef();

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

  const skipToAnotherChannel = async id => {
    let trackId = id - 1;
    return setSelectedId(id);
  };

  const skipNext = () => {
    setSelectedId(selectedId => selectedId + 1);
  };

  const skipPrev = () => {
    setSelectedId(selectedId => selectedId - 1);
    console.log(selectedId);
  };

  const increaseVolume = () => {
    volumeLevel = volume + 0.1;
    setVolume(volumeLevel);
  };

  const decreaseVolume = () => {
    volumeLevel = volume - 0.1;
    setVolume(volumeLevel);
  };

  const onPlayPausePress = () => {
    if (isPlaying !== true) {
      setPlaying(true);
      setIsLoad(false);
    } else {
      setPlaying(false);
      setIsLoad(true);
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
    setScreenIndex(screenIndex => screenIndex + 50);
    console.log(screenIndex);
    scrollViewRef.current?.scrollTo({
      y: screenIndex,
      animated: true,
    });
  };

  const toPrevScroll = () => {
    setScreenIndex(screenIndex => screenIndex - 50);
    console.log(screenIndex);
    scrollViewRef.current?.scrollTo({
      y: screenIndex,
      animated: true,
    });
  };

  const goFullScreen = () => {
    if (videoPlayer.current) {
      videoPlayer.current.presentFullscreenPlayer();
    }
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

    return (
      <Item
        item={item}
        onPress={() => skipToAnotherChannel(item.id)}
        backgroundColor={{backgroundColor}}
        textColor={{color}}
      />
    );
  };

  const ID = () => {
    let id = 0;
    if (selectedId > 0 && selectedId < 22) {
      id = selectedId - 1;
    }
    return id;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* Station Image */}
        <View style={styles.imageFrame}>
          <Video
            ref={ref => (videoPlayer.current = ref)}
            source={{
              uri: StreamUrl[ID()].url,
            }}
            thumbnail={{uri: StreamUrl[ID()].artwork}}
            rate={1.0}
            volume={volume}
            paused={!isPlaying}
            muted={false}
            resizeMode="stretch"
            shouldPlay
            isLooping
            onLoadStart={() => setIsLoad(true)}
            onReadyForDisplay={() => setIsLoad(false)}
            onBuffer={() => setIsLoad(true)}
            style={{
              width: '100%',
              height: 340,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: '#FFD369',
            }}
          />
        </View>
        {/* Station Content */}
        <View>
          <Text style={styles.songTitle}>
            {StreamUrl[ID()].title}, {StreamUrl[ID()].artist}
          </Text>
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
                onPlayPausePress();
              }}>
              {isLoad === false ? (
                <Icon name="ios-pause-circle" size={60} color="#FFD369" />
              ) : (
                <View style={styles.indicatorWrapper}>
                  <Icon
                    name="ios-play-circle"
                    size={60}
                    color="#FFD369"
                    style={'flex: 0.5'}
                  />
                  <ActivityIndicator
                    size={60}
                    color="#FFD369"
                    style={'flex: 0.5'}
                  />
                </View>
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
              onSlidingComplete={value => {
                setVolume(value);
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
    backgroundColor: '#0a1729',
  },
  mainContainer: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    padding: 7,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    flex: 0.8,
  },
  progressBar: {
    width: 350,
    height: 10,
    marginTop: 5,
  },
  flatListView: {
    shadowColor: '#FFD369',
    elevation: 40,
    width: '90%',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#FFD369',
    height: 220,
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
    marginTop: 2,
    width: '60%',
    justifyContent: 'space-between',
  },

  stationImage: {
    width: 10,
    height: 32,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFF',
    flex: 0.2,
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

export default TVStream;
