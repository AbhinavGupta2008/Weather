import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    TextInput,
    Alert,
    BackHandler,
    ToastAndroid,

} from 'react-native';
var sunset = '';
var sunrise = '';

//import * as Permissions from 'expo-permissions';
//import Geolocation from '@react-native-community/geolocation';
import { Header } from 'react-native-elements';

import orange from './orange.jpg';
import red from './redd.jpg';
import blue from './back1.jpg';
import green from './pin.png';
import pin2 from './pin2-r.png'
var countInterval
var color = ''

export default class WeatherScreen extends Component {
    constructor() {
        super();
        this.state = {
            weather: '',
            time: '',
            path: '',
            refresh: '',
            dayOfWeek: '',
            lat: '26.8381',
            lon: '80.9346',
            city: 'Lucknow',
            back: '',
            hasLocPermissions: null,
            latlon: [],
            newWeather: '',
            airDes: '',
            uvDes: '',
            pin: '',
            counter: 0,
            pollution: '',
            message: "",
            name: '',
            temp: 0,
            alertCount: 0,
            decider: false
        };
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }
    // Function to refresh the data
    refresh = () => {
        this.setState({ weather: '', newWeather: '', time: '', refresh: '', path: '', dayOfWeek: '', back: '', uvDes: '', pin: '' });
        // this.getWeather();
        console.log
        this.getLatLon()
        this.newWeather();
        this.getTime();
        this.getPollution();
        var url = 'https://worldtimeapi.org/api/timezone/Asia/Kolkata';
        return fetch(url)
            .then((response) => response.json())
            .then((responseJSON) => {
                this.setState({ refresh: responseJSON, dayOfWeek: '' });


                if (this.state.refresh.day_of_week === 1) {
                    this.setState({ dayOfWeek: 'Mon' });
                } else if (this.state.refresh.day_of_week === 2) {
                    this.setState({ dayOfWeek: 'Tue' });
                } else if (this.state.refresh.day_of_week === 3) {
                    this.setState({ dayOfWeek: 'Wed' });
                } else if (this.state.refresh.day_of_week === 4) {
                    this.setState({ dayOfWeek: 'Thu' });
                } else if (this.state.refresh.day_of_week === 5) {
                    this.setState({ dayOfWeek: 'Fri' });
                } else if (this.state.refresh.day_of_week === 6) {
                    this.setState({ dayOfWeek: 'Sat' });
                } else {
                    this.setState({ dayOfWeek: 'Sun' });
                }
            })
            .catch((error) => console.log(error));
    };
    // Back pressed function when back button is pressed
    backPressed = () => {
        Alert.alert(
            'Exit App',
            'Do you want to exit?',
            [
                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Yes', onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: false });
        return true;
    }
    componentDidMount() {
        //this.getLocPermissions();this.getlocation();
        // this.getWeather();
        this.refresh(); this.getPollution();
        this.newWeather();


        this.getTime();
        this.getLatLon();
        countInterval = setInterval(this.incrementCounter, 1000);
        setInterval(this.getTime, 1000);
        //  setInterval(this.getWeather, 300000);
        setInterval(this.newWeather, 300000);
        BackHandler.addEventListener('hardwareBackPress', this.backPressed);

    }
    //Main weather data
    newWeather = () => {
        var url = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + this.state.lat + '&lon=' + this.state.lon + '&exclude=hourly,daily&appid=5e3a5052feb3a0c4a71b4f3be877776f';
        return fetch(url)
            .then((response) => response.json())
            .then((responseJSON) => {

                this.setState({ newWeather: responseJSON, temp: responseJSON.current.temp - 273.15 })

                if (this.state.newWeather.current.uvi <= 2) {
                    this.setState({ uvDes: 'Low' })
                } else if (this.state.newWeather.current.uvi <= 5) {
                    this.setState({ uvDes: 'Moderate' })
                } else if (this.state.newWeather.current.uvi <= 7) {
                    this.setState({ uvDes: 'High' })
                } else if (this.state.newWeather.current.uvi <= 10) {
                    this.setState({ uvDes: 'Very High' })
                } else if (this.state.newWeather.current.uvi >= 11) {
                    this.setState({ uvDes: 'Extreme' })
                }

                if (
                    (this.state.temp) > 32 && (this.state.temp) < 40
                ) {
                    this.setState({ back: orange });
                    color = '#FC723C'; this.setState({ pin: pin2 })
                } else if (
                    (this.state.temp) > 40 ||
                    (this.state.temp) === 40
                ) {
                    this.setState({ back: red });
                    color = '#E51400';
                    this.setState({ pin: green })
                } else {
                    this.setState({ back: blue });
                    color = '#4D99FD';
                    this.setState({ pin: pin2 })
                }

                var unixTime = this.state.newWeather.current.sunset;
                var date = new Date(unixTime * 1000);
                sunset = date.toLocaleTimeString()

                unixTime = this.state.newWeather.current.sunrise;
                date = new Date(unixTime * 1000);
                sunrise = date.toLocaleTimeString()


            })
            .catch((error) => {
                alert("Sorry, an error occoured try again later");
                this.timeCounter()
                console.log(error)
            });
    };

    timeCounter() {
        setInterval(this.timecounter, 1000)
        this.setState({ alertCount: this.state.alertCount + 1 });
        if (this.state.alertCount === 5) {

            BackHandler.exitApp();
            this.setState({ alertCount: 0 })
        }

    }
    //Provied Time
    getTime = async () => {
        var url = 'https://worldtimeapi.org/api/timezone/Asia/Kolkata';
        return fetch(url)
            .then((response) => response.json())
            .then((responseJSON) => {
                this.setState({ time: responseJSON });
            })
            .catch((error) => {
                alert("Sorry, an error occoured try again later");
                this.timeCounter()
                console.log(error)
            });
    };


    //To get Pollloution Index

    getPollution = async () => {
        var url = 'https://api.openweathermap.org/data/2.5/air_pollution?lat=' + this.state.lat + '&lon=' + this.state.lon + '&appid=5e3a5052feb3a0c4a71b4f3be877776f';
        return fetch(url)
            .then((response) => response.json())
            .then((responseJSON) => {
                this.setState({ pollution: responseJSON })
                if (this.state.pollution.list[0].main.aqi === 1) {
                    this.setState({ airDes: 'Good' })
                } else if (this.state.pollution.list[0].main.aqi === 2) {
                    this.setState({ airDes: 'Fair' })
                } else if (this.state.pollution.list[0].main.aqi === 3) {
                    this.setState({ airDes: 'Moderate' })
                } else if (this.state.pollution.list[0].main.aqi === 4) {
                    this.setState({ airDes: 'Poor' })
                }
                else if (this.state.pollution.list[0].main.aqi === 5) {
                    this.setState({ airDes: 'Very Poor' })
                }
                else {
                    this.setState({ airDes: '--' })
                }

            })
            .catch((error) => {
                alert("Sorry, an error occoured try again later");
                this.timeCounter()
                console.log(error)
            });
    };

    /* getWeather = async () => {
         var url =
             'https://fcc-weather-api.glitch.me/api/current?lat=' +
             this.state.lat +
             '&lon=' +
             this.state.lon;
         return fetch(url)
             .then((response) => response.json())
             .then((responseJSON) => {
                 this.setState({ weather: responseJSON });
 
                 this.setState({ refresh: this.state.time });
                 
 
                 /// this.getPic();
 
             })
             .catch((error) => console.log(error));
     };*/


    //To get Latitude and Longitude whe we search
    getLatLon = async () => {
        var url =
            'https://api.openweathermap.org/geo/1.0/direct?q=' +
            this.state.city +
            '&appid=5e3a5052feb3a0c4a71b4f3be877776f';
        return fetch(url)
            .then((response) => response.json())
            .then((responseJSON) => {


                if (responseJSON.length == 0) {
                    alert('Please check the spelling or enter a valid city name');

                } else {
                    this.setState({ latlon: responseJSON, name: responseJSON, lat: responseJSON[0].lat, lon: responseJSON[0].lon, });
                    this.newWeather();
                    // this.getWeather();
                    this.getPollution();
                }



                this.setState({ latlon: [] })
            })

            .catch((error) => {
                alert("Sorry, an error occoured try again later");
                this.timeCounter()
                console.log(error)
            });
    };






    //Counter for loading screen
    incrementCounter = () => {

        this.setState({ counter: this.state.counter + 1 });
        if (this.state.counter === 5) {
            this.setState({ message: "*Trying To reach the server*" });


        } else if (this.state.counter === 20) {
            this.setState({ message: "*Please wait and check your internet connection*" });

        } else if (this.state.counter === 35) {
            this.setState({ message: "*Not able to reach the server try again later*" });

        } else if (this.state.counter === 40) {
            this.setState({ message: "" });
            alert("*Sorry, We were not able to reach the server*")
        }
        else if (this.state.counter === 43) {
            this.setState({ counter: 0 })
            clearInterval(countInterval)
            BackHandler.exitApp();
        }

    }





    /*getLocPermissions = async () => {
          const { status } = await Permissions.askAsync(Permissions.LOCATION);
          this.setState({
            hasLocPermissions: status === 'granted',
          });
    };
    
        getlocation = () => {
          Geolocation.getCurrentPosition((info) => {
            this.setState({ lat: info.coords.latitude, lon: info.coords.longitude });
    
    
          });
        };*/


    render = () => {

        /*if (this.state.hasLocPermissions === false) {
          return (
            <View style={{ flex: 1, borderWidth: 1 }}>
              <ImageBackground
                source={require('./back1.jpg')}
                resizeMode="cover"
                style={styles.image}>
                {Alert.alert('Please give Location Permission')}
                <Text
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    margin: '90%',
                    marginTop: 50,
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 10,
                  }}>
                  Please give Location Permission
                </Text>

                <TouchableOpacity
                  style={{
                    width: 70,
                    height: 30,
                    justifyContent: 'center',
                    marginTop: 10,
                    borderRadius: 5,
                    borderWidth: 1,
                    alignSelf: 'center',
                    fontSize: 14,
                  }}
                  onPress={() => {
                    this.refresh;
                    this.getLocPermissions;
                  }}>
                  <Text style={{ alignSelf: 'center' }}>Refresh</Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          );
        } else {*/
        if (
            this.state.time === '' ||
            this.state.getLatLon === '' ||
            this.state.refresh === '' ||
            this.state.newWeather === '' ||
            this.state.polloution === '' ||
            this.state.name === ''
        ) {
            return (

                <View style={styles.container}>
                    <ImageBackground
                        source={require('./back1.jpg')}
                        resizeMode="cover"
                        style={styles.image}>
                        <Text style={[styles.loadImg, { fontWeight: 'bold' }]}>Loading...</Text>
                        <Image
                            style={{
                                width: 65,
                                height: 65,


                                alignSelf: 'center',
                                justifyContent: 'center',
                            }}
                            source={require('./loading1.gif')}
                        />

                        <TouchableOpacity
                            style={{
                                width: 70,
                                height: 30,
                                justifyContent: 'center',
                                marginTop: '5%',
                                borderRadius: 5,
                                borderWidth: 1.5,
                                alignSelf: 'center',
                                fontSize: 14,
                            }}
                            onPress={() => {
                                this.refresh();
                            }}>
                            <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>Refresh</Text>
                        </TouchableOpacity>
                        <View style={{ marginTop: 70, alignItems: 'center', }}><Text style={{ color: 'red', fontWeight: 'bold' }}>{this.state.message}</Text></View>

                    </ImageBackground>
                </View>
            );
        } else {
            clearInterval(countInterval)
            return (
                <View style={styles.container}>
                    <ImageBackground
                        source={this.state.back}
                        resizeMode="cover"
                        style={styles.image}>
                        <View>

                            <Header
                                backgroundColor={'#2832C2'}
                                leftComponent={{
                                    text: this.state.time.datetime.slice(2, 10),
                                    style: { color: '#fff' },
                                }}
                                centerComponent={{
                                    text: 'Weather App',
                                    style: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
                                }}
                                rightComponent={{
                                    text: this.state.time.datetime.slice(11, 16),
                                    style: { color: '#fff' },
                                }}
                            />
                        </View>
                        <ScrollView>
                            <TouchableOpacity onPress={() => this.setState(previousState => ({ decider: !previousState.decider }))}>
                                <Image style={{ height: 30, width: 30, marginTop: 10, marginRight: 10, alignSelf: 'flex-end' }} source={require('./searchicon.png')} />
                            </TouchableOpacity>
                            {this.state.decider ?


                                <View style={styles.lowerContainer}>
                                    <View style={styles.textinputContainer}>

                                        <TextInput
                                            style={[styles.textinput, { backgroundColor: "transparent", }]}
                                            placeholder={"Enter Your City Name, Country Code"}
                                            placeholderTextColor={"#FFFFFF"}
                                            value={this.state.text}
                                            onChangeText={(text) => {
                                                this.setState({ city: text.trim() });
                                            }}

                                        />
                                        <TouchableOpacity
                                            style={styles.scanbutton}
                                            onPress={() =>{ this.getLatLon()
                                            this.setState(previousState => ({ decider: !previousState.decider }))}}
                                        >
                                            <Text style={styles.scanbuttonText}>GO</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View> : <Text></Text>
                            }







                            {/* <View>
                                <View style={{ alignItems: 'center' }}>
                                    <TextInput
                                        style={styles.inputBox}
                                        onChangeText={(text) => {
                                            this.setState({ city: text.trim() });

                                        }}
                                        value={this.state.text}
                                        placeholderTextColor={'#e7decc'}
                                        placeholder="Enter Your City Name, Country Code"
                                    />
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                    }}>
                                    <View style={{ marginRight: 20 }}>
                                        <TouchableOpacity
                                            style={styles.goButton}
                                            onPress={() => {
                                                this.getLatLon();
                                            }}>
                                            <Text style={styles.buttonText}>GO</Text>
                                        </TouchableOpacity>
                                    </View>*/}
                            { /*<View>
                                        <TouchableOpacity
                                            style={styles.goButton1}
                                            onPress={() => {
                                                Alert.alert("This Feature is Coming soon!!!")
                                            }}>
                                            <Text style={styles.buttonText}>Curr. Location</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>*/}












                            <View style={styles.subContainer}>
                                <View style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    marginTop: 20,
                                }}>
                                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                        <Image
                                            style={styles.location}
                                            source={this.state.pin}
                                        />
                                        <Text style={{}}>
                                            &nbsp; {this.state.name[0].name}
                                            &nbsp;&nbsp;
                                        </Text>
                                        <Image
                                            style={styles.flag}
                                            source={{ uri: 'https://countryflagsapi.com/png/' + this.state.name[0].country }}
                                        />
                                    </View>
                                    <Text>
                                        Lat: {this.state.newWeather.lat}&nbsp;&nbsp;Lon:&nbsp;
                                        {this.state.newWeather.lon}
                                    </Text>
                                </View><Image style={styles.cloudImage} source={{ uri: 'https://openweathermap.org/img/wn/' + this.state.newWeather.current.weather[0].icon + '@4x.png' }} />



                                <View style={[styles.textContainer, { backgroundColor: color, }]}>
                                    <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                                        {this.state.newWeather.current.weather[0].description.toUpperCase()}
                                    </Text>
                                </View>
                                <View style={[styles.textContainer, { backgroundColor: color, }]}><Image style={styles.pic} source={require('./temp.png')} />
                                    <Text>
                                        Temperature: {Math.round(this.state.newWeather.current.temp - 273.15)}
                                        &deg;C
                                    </Text>
                                    <Text>
                                        Feels like:{' '}
                                        {Math.round(this.state.newWeather.current.feels_like - 273.15)}
                                        &deg;C
                                    </Text>
                                </View>


                                <View style={{ flexDirection: 'row' }}>
                                    <View style={[styles.textContainer, { backgroundColor: color, width: 130, padding: 20 }]}>

                                        <Image style={styles.pic} source={require('./Sunrise-512.png')} />
                                        <Text style={styles.textStyle}>
                                            Sunrise:&nbsp;{'\n'}
                                            {sunrise}


                                        </Text>
                                    </View>

                                    <View style={[styles.textContainer, { backgroundColor: color, width: 130, padding: 20 }]}>

                                        <Image style={styles.pic} source={require('./sunset.png')} />

                                        <Text style={styles.textStyle}>
                                            Sunset:&nbsp;{'\n'}
                                            {sunset}


                                        </Text>
                                    </View>


                                </View>


                                <View style={{ flexDirection: 'row' }}>
                                    <View style={[styles.textContainer, { backgroundColor: color, width: 131, padding: 20 }]}>

                                        <Image style={styles.pic} source={require('./humidity.png')} />

                                        <Text style={styles.textStyle}>
                                            Humidity:{'\n'} {this.state.newWeather.current.humidity}%
                                        </Text>
                                    </View>

                                    <View style={[styles.textContainer, { backgroundColor: color, width: 130, padding: 20 }]}>

                                        <Image style={{ width: 40, height: 40 }} source={require('./atmpressure1.png')} />
                                        <Text style={styles.textStyle}>Pressure:{'\n'}
                                            {this.state.newWeather.current.pressure}mb</Text>
                                    </View>
                                </View>


                                <View style={{ flexDirection: 'row' }}>
                                    <View style={[styles.textContainer, { backgroundColor: color, width: 130, padding: 25 }]}>

                                        <Image style={styles.pic} source={require('./visible.png')} />
                                        <Text style={styles.textStyle}>
                                            Visibility:&nbsp;{'\n'}
                                            {this.state.newWeather.current.visibility / 1000}&nbsp;km
                                        </Text>
                                    </View>

                                    <View style={[styles.textContainer, { backgroundColor: color, width: 130, padding: 25 }]}>
                                        <Image style={styles.pic} source={require('./wind.png')} />
                                        <Text style={styles.textStyle}>Wind:&nbsp;{'\n'}
                                            {this.state.newWeather.current.wind_speed}&nbsp;km/h</Text>
                                    </View>
                                </View>






                                <View style={{ flexDirection: 'row' }}>
                                    <View style={[styles.textContainer, { backgroundColor: color, width: 130, padding: 15 }]}><Image style={{ width: 30, height: 30 }} source={require('./uvindex.png')} />
                                        <Text style={styles.textStyle}>
                                            UV Index:&nbsp;{'\n'}
                                            {this.state.newWeather.current.uvi}{'\n'}
                                            {this.state.uvDes}
                                        </Text>
                                    </View>

                                    <View style={[styles.textContainer, { backgroundColor: color, width: 130, padding: 15 }]}><Image style={{ width: 20, height: 20 }} source={require('./AirQuality.png')} />
                                        <Text style={styles.textStyle}>
                                            Air Quality:&nbsp;{'\n'}
                                            {this.state.airDes}

                                        </Text>
                                    </View>


                                </View>


                                <View style={{ alignSelf: 'center', alignItems: 'center', opacity:0.3, width: '90%', height: 0, borderWidth: 1, marginBottom: 5,marginTop:0 }}>
                                    <View style={{  flexDirection: 'row', marginTop: 5, marginBottom: 10,height:20 }}>
                                        <Text style={{ fontSize: 9, alignSelf: 'center', color:'black',marginTop:2.5}}>Data From&nbsp;</Text>
                                        
                                        <Image style={styles.logo} source={require('./logo.jpg')} />
                                    </View>
                                </View>

                            </View>
                        </ScrollView>


                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#2832C2',
                               
                                width: '100%',
                                height: 27,
                            }}>
                            <Text style={styles.refreshText}>
                                Updated :&nbsp;{this.state.dayOfWeek},&nbsp;
                                {this.state.refresh.datetime.slice(2, 10)}
                                &nbsp;/&nbsp;{this.state.refresh.datetime.slice(11, 16)}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.refresh();
                                }}>
                                <Image
                                    style={styles.refreshImg}
                                    source={require('./refresh.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>
            );
        }
        // }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
    },
    subContainer: {
        flex: 1,
       

        alignItems: 'center',
    },

    cloudImage: {
        width: 290,
        height: 245,
        marginTop: 20,
    },
    textContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 20,
        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowColor: 'black',
        padding: 30,
        margin: 15,
        width: 290,
        fontFamily: 'fantasy',
        justifyContent: 'center'


    },
    refreshImg: {
        alignSelf: 'center',
        width: 25,
        height: 15,
    },
    loadImg: {
        marginTop: '17%',
        marginLeft: '42%',
        alignItems: 'center',
        fontSize: 16,
        justifyContent: 'center',
    },
    refreshText: {
        alignItems: 'center',
        fontSize: 12,
        color: 'white',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    location: {
        width: 16,
        height: 25,
    },
    textStyle: {
        textAlign: 'center',
    },
    flag: {
        width: 25,
        height: 20
    },
    pic: {
        width: 20,
        height: 20
    },
    lowerContainer: {

        alignItems: "center",
        marginTop: 10,
        marginBottom:15,
    },
    textinputContainer: {
        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowColor: 'black',
        borderWidth: 2,
        borderRadius: 10,
        flexDirection: "row",
        backgroundColor: "transparent",
        borderColor: "#FFFFFF"
    },
    textinput: {
        width: "80%",
        height: 38,
        padding: 10,
        borderColor: "#FFFFFF",
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderWidth: 1.5,
        fontSize: 13,
        textAlign: 'center',
        fontFamily: "Rajdhani_600SemiBold",
        color: "#FFFFFF"
    },
    scanbutton: {
        width: 60,
        height: 38,
        backgroundColor: "#9DFD24",
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    scanbuttonText: {
        fontSize: 21,
        color: "#0A0101",
        fontFamily: "Rajdhani_600SemiBold"
    },
    /*  goButton1: {
          width: '85%',
          borderWidth: 2,
          height: 45,
          marginRight: 10,
          marginLeft: 15,
          padding: 10,
          marginTop: 10,
          backgroundColor: '#9DFD24',
          justifyContent: 'center',
          borderRadius: 3,
          shadowOpacity: 0.3,
          shadowRadius: 15,
          shadowColor: 'black',
      },*/

    logo: {
marginTop:5,
        height: 15,
        width: 35,
        margin: 2,
        justifyContent: 'center',
        alignSelf: 'center'
    },/*
    lowerContainer: {
    flex: 0.5,
    alignItems: "center"
  },inputBox: {
        height: 42,
        width: '80%',
        alignSelf: 'center',
        marginTop: 15,
        textAlign: 'center',
        borderWidth: 4,

        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowColor: 'black',
        fontSize: 12,
        color: 'white',
        borderRadius: 8,
    },
    goButton: {
        width: '65%',
        borderWidth: 2,
        height: 45,
        padding: 10,
        marginLeft: 25,
        marginTop: 10,
        backgroundColor: '#9DFD24',
        justifyContent: 'center',
        borderRadius: 3,
        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowColor: 'black',
        borderColor: 'black',
    },
    buttonText: {
        alignItems: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        justifyContent: 'center',
    },*/


});