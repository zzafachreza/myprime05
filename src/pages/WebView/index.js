import { View, Text } from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview';
import { MyHeader } from '../../components';


export default function WebViewScreen({navigation, route}) {
      const { url, title } = route.params;
       
  

  return (
    <View style={{
        flex:1,
        
    }}>
    <MyHeader title={title || 'Prime Generator'} /> 
      <WebView
       source={{uri:url}}
       style={{
        flex:1,
        
       }}
        allowsFullscreenVideo
        javaScriptEnabled
        domStorageEnabled 
      />
    </View>
  )
}