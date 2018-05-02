
import React, { Component } from 'react';
import {
  AsyncStorage,
  Platform,  
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Repo from './components/Repo';
import NewRepoModal from './components/NewRepoModal';

export default class App extends Component {
  state = {
    modalVisible: false,
    repos: [
    //   { 
    //     id: 1,
    //     thumbnail: 'https://avatars2.githubusercontent.com/u/69631?s=200&v=4',
    //     title: 'rocketseat.com.br',
    //     author: 'rocketseat'
    //   },
    //   { 
    //     id: 2,
    //     thumbnail: 'https://avatars2.githubusercontent.com/u/69631?s=200&v=4',
    //     title: 'fischer1983.com.br',
    //     author: 'fischer1983'
    //   }      
    ]
  }

  async componentDidMount() {
    const repos = JSON.parse(await AsyncStorage.getItems('@Minicurso:repositories')) || [] 
    this.setState({ repos });
  };

  _addRepository = async (newRepoText) => {
    const repoCall = await fetch (`http://api.github.com/repos/${newRepoText}`)
    const response = await repoCall.json();

    const repository = {
      author: response.owner.login,
      id: response.id,
      title: response.name,
      thumbnail: response.owner.avatar_url,
    };

    this.setState({
      modalVisible: false,
      newRepoText: '',
      repos : [
        ...this.state.repos,
        repository
      ],
    });

    await AsyncStorage.setItem('@Minicurso:repositories', JSON.stringify(this.state.repos))
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}> 
          <Text style={styles.headerText}>Minicurso ReactNative</Text>
          <TouchableOpacity onPress={() => this.setState({ modalVisible: true })}>
            <Text style={styles.headerButton}>+</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.repoList}>
          {this.state.repos.map(repo => <Repo key={repo.id} data={repo}/> )}
        </ScrollView>
        <NewRepoModal 
          onCancel={() => this.setState({ modalVisible: false})} 
          onAdd={this._addRepository} 
          visible={this.state.modalVisible} 
          onRequestClose={() => {}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    flex: 1,
  },

  header: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    height: (Platform.OS === 'ios') ? 70 : 50,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: (Platform.OS === 'ios') ? 20 : 0,   
  },

  headerButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  repoList: {
    padding: 20
  },

});