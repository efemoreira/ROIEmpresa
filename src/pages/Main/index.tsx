import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  Alert,
  StatusBar,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  TextInput,
  NativeModules,
  Vibration,
  Image,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Avatar, Card} from 'react-native-paper';
import axios from 'axios';

import colors from '../../style/colors';
import {useAuth} from '../../hooks/auth';
import {styles} from './styles';
import {ScrollView} from 'react-native-gesture-handler';

const isAndroid = Platform.OS === 'android';

const baseURLFaker = axios.create({
  baseURL: 'https://bulb-api.azurewebsites.net/',
});

const Main: React.FC = () => {
  const {user, signOut} = useAuth();

  function handleSignOut() {
    signOut();
  }

  const [clientes, setClientes] = React.useState([]);

  const getCliente = async (): any => {
    const resp = await axios.get(
      `https://bulb-api.azurewebsites.net/userarrived`,
    );
    const {data} = resp;
    console.log(data);
    data.DataHoraEmbarque = new Date(data.DataHoraEmbarque);
    data.DataHoraEmbarque = data.DataHoraEmbarque;
    setClientes(data);
  };

  React.useEffect(() => {
    const interval = setInterval(getCliente, 5000);
    return () => clearInterval(interval);
  }, [clientes]);

  return (
    <>
      <View style={styles.body}>
        {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
        {Platform.OS === 'android' && (
          <StatusBar
            backgroundColor="rgba(49,49,49,0)"
            translucent={true}
            barStyle="light-content"
          />
        )}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.titulo}>{`Clientes Dentro`}</Text>
          </View>
          <TouchableOpacity
            style={styles.close}
            onPress={() => {
              handleSignOut();
            }}>
            <Text>SAIR</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.main}>
          <ScrollView style={styles.itens}>
            {clientes.map((cliente, index) => {
              const data = new Date(cliente.DataHoraEmbarque);
              const hora = data.getHours();
              const min = data.getMinutes();
              const sub = `Entrou ${hora}:${min}`;
              return (
                <View key={index}>
                  <Card style={styles.card}>
                    <Card.Title
                      titleStyle={styles.cardTitle}
                      titleNumberOfLines={2}
                      title={cliente.userName}
                      subtitleStyle={styles.cardSubTitle}
                      subtitleNumberOfLines={3}
                      subtitle={sub}
                      left={(props) => (
                        <Avatar.Image
                          size={48}
                          source={require('../../assets/images/avatar.png')}
                        />
                      )}
                    />
                  </Card>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default Main;
