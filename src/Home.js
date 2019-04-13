

import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { loadDataStore, persistirConversa } from './actions/AppActions'
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  AsyncStorage,
  TouchableHighlight,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
const wsUri = 'wss://echo.websocket.org'

class Home extends React.Component {
  constructor() {
    super();
    this.websocket = new WebSocket(wsUri)
    this.emit = this.emit.bind(this)
  }
  state = {
    texto: " ",
    mensagem: "",
    data: null
  }

  _renderItem = ({ item, index }) => {
    if (item.data.type === 'user') {
      return (
        <View style={{ alignItems: 'flex-end', marginTop: 5, marginBottom: 5, marginLeft: 40 }}>
          <Text style={{ fontSize: 18, color: '#000', padding: 10, backgroundColor: '#dbf5b4', elevation: 1, borderRadius: 15 }}>{item.data.texto}</Text>
        </View>
      )
    }
    return (
      <View style={{ alignItems: 'flex-start', marginTop: 5, marginBottom: 5, marginRight: 40, }}>
        <Text style={{ fontSize: 18, color: '#000', padding: 10, backgroundColor: '#f7f7f7', elevation: 1, borderRadius: 15 }}>{item.data.texto}</Text>
      </View>

    )
  }

  emit() {
    this.websocket.send(this.state.texto)
    //Aqui as conversas do usuario sao matidas(Percistidas)
    AsyncStorage.getItem('Conversas').then((value) => {
      //Verificação para usar a concatenação caso ja exista o arquivo de percistencia
      if (value !== null) {
        var vl = JSON.parse(value)
        vl = vl.concat({ type: 'user', texto: this.state.texto })
        AsyncStorage.setItem('Conversas', JSON.stringify(vl))

      } else {
        var conversas = { conversa: [{ type, texto }] }
        AsyncStorage.setItem('Conversas', JSON.stringify(conversas.conversa))
      }
    })

  }

  componentDidMount() {
    this.props.loadDataStore()
    this.websocket.onopen = () => console.log('OPEN')//Conexao e aberta aqui

    this.websocket.onmessage = ({ data }) => {
      // A mensagem do servidor(websocket) e armazenada, mudando o type para server
      AsyncStorage.getItem('Conversas').then((value) => {
        var vl = JSON.parse(value)
        vl = vl.concat({ type: 'server', texto: data })
        AsyncStorage.setItem('Conversas', JSON.stringify(vl))
      })
      this.setState({ data: this.props.conversas })//Quando a conversa e armazenda ela atualiza o data com a informação que vem do redux
    }
  }

  componentWillUpdate() {
    this.props.loadDataStore()//Sempre quando ha uma atualização no Asyn aqui atualiza 
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.conversas })//Os dados da conversa e carregado aqui para ser renderizado na tela
  }


  render() {
    if (this.state.data !== null) {
      return (
        <View style={{ flex: 1, backgroundColor: '#eee4dc', padding: 10 }}>
          <View style={{ flex: 1, paddingBottom: 20 }}>
            <FlatList
              data={this.state.data}
              extraData={this.state.data}
              keyExtractor={item => `${item.type}`}
              renderItem={this._renderItem}
            />
          </View>
          <View style={{ flexDirection: 'row', height: 40 }}>
            <TextInput
              onChangeText={texto => this.setState({ texto })}
              style={{ flex: 4, backgroundColor: '#fff', fontSize: 18, borderRadius: 20 }}
            />
            <TouchableHighlight onPress={this.emit} underlayColor='#fff' style={{ marginLeft: 10, justifyContent: 'center' }}>
              <Icon name='send-o' size={35} />
            </TouchableHighlight>
          </View>
        </View >
      )
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#eee4dc', padding: 10 }}>

        <View style={{ flex: 1, backgroundColor: '#DCDCDC' }}>
          <Text>Conversas</Text>
        </View>
        <View style={{ flexDirection: 'row', height: 60 }}>
          <TextInput
            onChangeText={texto => this.setState({ texto })}
            style={{ flex: 4, backgroundColor: '#fff', fontSize: 18 }}
          />
          <TouchableHighlight onPress={this.emit} underlayColor='#fff' style={{ marginLeft: 10 }}>
            <Icon name='send-o' size={30} />
          </TouchableHighlight>
        </View>
      </View>
    )

  }
}

mapStateToProps = state => {
  const conversas = _.map(state.ListConversa, (data, type) => {
    return { type, data }
  })
  return { conversas }
}

export default connect(mapStateToProps, { loadDataStore, persistirConversa })(Home);
