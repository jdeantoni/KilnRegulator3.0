'use strict';
import React from 'react';

import {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  Alert
} from 'react-native';
import SettingsList from 'react-native-settings-list';

/*
// simple example
class SettingsListExample extends Component {
  constructor(){
    super();
    this.onValueChange = this.onValueChange.bind(this);
    this.state = {switchValue: false, stages: 20};
  }

  render() {
    return (
      <View style={{backgroundColor:'gray',flex:1}}>
        <View style={{flex:1, marginTop:50}}>
          <SettingsList>
          <SettingsList.Header headerText='First Grouping' headerStyle={{color:'white'}}/>
            <SettingsList.Item
              icon={
                <View style={{height:30,marginLeft:10,alignSelf:'center'}}>
                  <Image style={{alignSelf:'center',height:30, width:30}} source={require('./images/about.png')}/>
                </View>
              }
              itemWidth={50}
              title='Icon Example'
              onPress={() => Alert.alert('Icon Example Pressed')}
            />
            <SettingsList.Item
              hasNavArrow={false}
              switchState={this.state.switchValue}
              switchOnValueChange={this.onValueChange}
              hasSwitch={true}
              title='Switch Example'/>
            <SettingsList.Item
              title='Different Colors Example'
              backgroundColor='#D1D1D1'
              titleStyle={{color:'blue'}}
              arrowStyle={{color:'blue'}}
              onPress={() => Alert.alert('Different Colors Example Pressed')}/>
            <SettingsList.Header headerText='Different Grouping' headerStyle={{color:'white', marginTop:50}}/>
            <SettingsList.Item titleInfo='Some Information' hasNavArrow={false} title='Information Example'/>
            <SettingsList.Item title='Settings 1'/>
            <SettingsList.Item title='Settings 2'/>
            <SettingsList.Item
              id="stages"
              title='stages'
              isEditable={true}
              value={this.state.stages.toString()}
              onTextChange={(text) => this.setState({stages: text})} 
            />
          </SettingsList>
        </View>
      </View>
    );
  }

  onValueChange(value){
    this.setState({switchValue: value});
  }
}
*/

/**
 * realistic iPhone example
 */
 class SettingsListExample extends Component {
   constructor(){
     super();
     this.onValueChange = this.onValueChange.bind(this);
     this.state = {switchValue: false, loggedIn: false};
   }
   render() {
     var bgColor = '#DCE3F4';
     return (
       <View style={{backgroundColor:'#EFEFF4',flex:1}}>
         <View style={{borderBottomWidth:1, backgroundColor:'#f7f7f8',borderColor:'#c8c7cc'}}>
           <Text style={{alignSelf:'center',marginTop:30,marginBottom:10,fontWeight:'bold',fontSize:16}}>Settings</Text>
         </View>
         <View style={{backgroundColor:'#EFEFF4',flex:1}}>
           <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
             <SettingsList.Header headerStyle={{marginTop:15}}/>
             {this.state.toggleAuthView ?
               <SettingsList.Item
                 icon={
                     <Image style={styles.imageStyle} source={require('./images/user.png')}/>
                 }
                 title='Logged In As...'
                 hasNavArrow={false}
               />
               :
               <SettingsList.Item
                 icon={
                     <Image style={styles.imageStyle} source={require('./images/user.png')}/>
                 }
                 isAuth={true}
                 authPropsUser={{placeholder:'E-mail'}}
                 authPropsPW={{placeholder:'Password'}}
                 onPress={() => this.toggleAuthView()}
               />
             }
             <SettingsList.Header headerStyle={{marginTop:15}}/>
             <SettingsList.Item
               icon={
                   <Image style={styles.imageStyle} source={require('./images/airplane.png')}/>
               }
               hasSwitch={true}
               switchState={this.state.switchValue}
               switchOnValueChange={this.onValueChange}
               hasNavArrow={false}
               title='Airplane Mode'
             />
             <SettingsList.Item
               icon={<Image style={styles.imageStyle} source={require('./images/wifi.png')}/>}
               title='Wi-Fi'
               titleInfo='Bill Wi The Science Fi'
               titleInfoStyle={styles.titleInfoStyle}
               onPress={() => Alert.alert('Route to Wifi Page')}
             />
             <SettingsList.Item
               icon={<Image style={styles.imageStyle} source={require('./images/blutooth.png')}/>}
               title='Blutooth'
               titleInfo='Off'
               titleInfoStyle={styles.titleInfoStyle}
               onPress={() => Alert.alert('Route to Blutooth Page')}
             />
             <SettingsList.Item
               icon={<Image style={styles.imageStyle} source={require('./images/cellular.png')}/>}
               title='Cellular'
               onPress={() => Alert.alert('Route To Cellular Page')}
             />
             <SettingsList.Item
               icon={<Image style={styles.imageStyle} source={require('./images/hotspot.png')}/>}
               title='Personal Hotspot'
               titleInfo='Off'
               titleInfoStyle={styles.titleInfoStyle}
               onPress={() => Alert.alert('Route To Hotspot Page')}
             />
             <SettingsList.Header headerStyle={{marginTop:15}}/>
             <SettingsList.Item
               icon={<Image style={styles.imageStyle} source={require('./images/notifications.png')}/>}
               title='Notifications'
               onPress={() => Alert.alert('Route To Notifications Page')}
             />
             <SettingsList.Item
               icon={<Image style={styles.imageStyle} source={require('./images/control.png')}/>}
               title='Control Center'
               onPress={() => Alert.alert('Route To Control Center Page')}
             />
             <SettingsList.Item
               icon={<Image style={styles.imageStyle} source={require('./images/dnd.png')}/>}
               title='Do Not Disturb'
               onPress={() => Alert.alert('Route To Do Not Disturb Page')}
             />
             <SettingsList.Header headerStyle={{marginTop:15}}/>
             <SettingsList.Item
               icon={<Image style={styles.imageStyle} source={require('./images/general.png')}/>}
               title='General'
               onPress={() => Alert.alert('Route To General Page')}
             />
             <SettingsList.Item
               icon={<Image style={styles.imageStyle} source={require('./images/display.png')}/>}
               title='Display & Brightness'
               onPress={() => Alert.alert('Route To Display Page')}
             />
           </SettingsList>
         </View>
       </View>
     );
   }
   toggleAuthView() {
     this.setState({toggleAuthView: !this.state.toggleAuthView});
   }
   onValueChange(value){
     this.setState({switchValue: value});
   }
 }

const styles = StyleSheet.create({
  imageStyle:{
    marginLeft:15,
    alignSelf:'center',
    height:30,
    width:30
  },
  titleInfoStyle:{
    fontSize:16,
    color: '#8e8e93'
  }
});

module.exports = SettingsListExample;
