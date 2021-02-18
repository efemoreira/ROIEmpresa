import React, {createContext, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as auth from '../services/auth';
import api from '../services/api';
import {Alert} from 'react-native';

interface User {
  id: string;
  group_id: string;
  boarding_point: string;
  boarding_time: string;
  boarding_tolerance: string;
  landing_point: string;
  landing_time: string;
  landing_tolerance: string;
  name: string;
  telefone: string;
  hired_company: string;
  tipo: string;
}

interface SignInCredentials {
  email: string;
  senha: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storagedUser = await AsyncStorage.getItem('@Mobs2:user');
      const storagedToken = await AsyncStorage.getItem('@Mobs2:token');

      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser));
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
      }

      setLoading(false);
    }

    loadStorageData();
  });

  async function signIn({email: email, senha: senha}) {
    if (email === 'lucas@teste.com') {
      console.log('SignIN TEste');
      const response = await auth.signIn();
      console.log('SignIN TEste', response);
      setUser(response.user);
      console.log('SignIN TEste setado');
      api.defaults.headers.Authorization = `Bearer ${response.token}`;

      await AsyncStorage.setItem('@Mobs2:user', JSON.stringify(response.user));
      await AsyncStorage.setItem('@Mobs2:token', response.token);
    } else {
      try {
        const loginData = {
          email: email,
          password: senha,
        };
        const response = await api.post('/user/login', loginData);

        if (response.data.success) {
          const {driver, auth_token} = response.data;

          setUser(driver);

          api.defaults.headers.Authorization = `Bearer ${auth_token}`;

          await AsyncStorage.setItem('@Mobs2:user', JSON.stringify(driver));
          await AsyncStorage.setItem('@Mobs2:token', auth_token);
        } else {
          Alert.alert('Erro', response.data.data);
        }
      } catch (err) {
        console.log('SignIn Error', err);
      }
    }
  }

  async function signOut() {
    await AsyncStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{signed: !!user, user, loading, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}

export {AuthProvider, useAuth};
