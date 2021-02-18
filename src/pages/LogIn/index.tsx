import React, {useEffect, useRef, useState} from 'react';

import {
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Image,
  Animated,
  TextInput,
  Easing,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';

import colors from '../../style/colors';

import {styles} from './styles';
import {useAuth} from '../../hooks/auth';

const animateParams = {
  basePos: new Animated.Value(100),
  baseOpacity: new Animated.Value(0),
  btPos: new Animated.Value(100),
  btOpacity: new Animated.Value(0),
  textOpacity: new Animated.Value(0),
  inputPos_1: new Animated.Value(40),
  inputOpacity_1: new Animated.Value(0),
  inputPos_2: new Animated.Value(40),
  inputOpacity_2: new Animated.Value(0),
};

const animateIn = () => {
  setTimeout(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(animateParams.basePos, {
          toValue: 0,
          duration: 1000,
          easing: Easing.bezier(1, -0.57, 0, 1.34),
          useNativeDriver: true,
        }),
        Animated.spring(animateParams.baseOpacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.cubic,
          useNativeDriver: true,
        }),
        Animated.spring(animateParams.btPos, {
          toValue: 0,
          duration: 800,
          easing: Easing.bezier(1, -0.57, 0, 1.34),
          delay: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(animateParams.btOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.bezier(1, -0.57, 0, 1.34),
          delay: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(animateParams.textOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.cubic,
          delay: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(animateParams.inputPos_1, {
          toValue: 1,
          duration: 1900,
          easing: Easing.bezier(1, -0.57, 0, 1.34),
          delay: 1800,
          useNativeDriver: true,
        }),
        Animated.spring(animateParams.inputOpacity_1, {
          toValue: 1,
          duration: 1900,
          easing: Easing.bezier(1, -0.57, 0, 1.34),
          delay: 1800,
          useNativeDriver: true,
        }),
        Animated.spring(animateParams.inputPos_2, {
          toValue: 1,
          duration: 1900,
          easing: Easing.bezier(1, -0.57, 0, 1.34),
          delay: 1900,
          useNativeDriver: true,
        }),
        Animated.spring(animateParams.inputOpacity_2, {
          toValue: 1,
          duration: 1900,
          easing: Easing.bezier(1, -0.57, 0, 1.34),
          delay: 1900,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {});
  }, 1000);
};

const LogIn: React.FC = () => {
  const senhaInputRef = useRef<TextInput>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const {signIn} = useAuth();

  async function handleSignInPress() {
    setLoading(true);
    if (email.length === 0 || senha.length === 0) {
      setError('Todos os campos são obrigatórios.');
      setLoading(false);
    } else {
      try {
        signIn({email: email, senha: senha});
        setLoading(false);
      } catch (err) {
        setError('Houve um problema com o login, verifique suas credenciais.');
        setLoading(false);
        Alert.alert(error);
      }
    }
  }

  useEffect(() => {
    animateIn();
  });

  return (
    <>
      {/* STATUS BAR CONFIG ************** */}
      {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
      {Platform.OS === 'android' && (
        <StatusBar
          backgroundColor={colors.transl}
          translucent={true}
          barStyle="light-content"
        />
      )}
      <ScrollView
        style={styles.body}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        {/* INICIO PÁGINA LOGIN ************** */}
        <KeyboardAvoidingView behavior={'position'} style={styles.login}>
          <View style={styles.logo}>
            <Image
              source={require('../../assets/images/logo.png')}
              resizeMode="contain"
              style={styles.logoImage}
            />
          </View>
          {/* INICIO FORMULÁRIO LOGIN ************** */}
          <Animated.View
            style={[
              styles.loginContent,
              {
                transform: [{translateY: animateParams.basePos}],
                // marginTop: animateParams.basePos,
                opacity: animateParams.baseOpacity,
              },
            ]}>
            {/* Need to make the loading */}
            {loading ? (
              <View style={styles.loginSpinner}>
                <ActivityIndicator size="large" color={colors.green} />
              </View>
            ) : (
              <View style={styles.loginForm}>
                <Animated.Text
                  style={[styles.intro, {opacity: animateParams.textOpacity}]}
                  numberOfLines={2}>
                  {`ROI\nAtendente`}
                </Animated.Text>
                <Animated.View
                  style={{
                    transform: [{translateY: animateParams.inputPos_1}],
                    opacity: animateParams.inputOpacity_1,
                  }}>
                  <TextInput
                    placeholderTextColor={colors.p_}
                    selectionColor={colors.p_}
                    autoCapitalize="none"
                    numberOfLines={1}
                    keyboardType="email-address"
                    autoCorrect={false}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    selectTextOnFocus={true}
                    placeholder="Email"
                    onSubmitEditing={() => {
                      senhaInputRef.current?.focus();
                    }}
                    value={email}
                    onChangeText={setEmail}
                    style={[styles.input]}
                  />
                </Animated.View>
                <Animated.View
                  style={{
                    transform: [{translateY: animateParams.inputPos_2}],
                    opacity: animateParams.inputOpacity_2,
                  }}>
                  <TextInput
                    ref={senhaInputRef}
                    placeholder="Senha"
                    value={senha}
                    onChangeText={setSenha}
                    placeholderTextColor={colors.p_}
                    selectionColor={colors.p_}
                    autoCapitalize="none"
                    numberOfLines={1}
                    keyboardType="default"
                    returnKeyType="next"
                    autoCorrect={false}
                    blurOnSubmit={true}
                    style={[styles.input]}
                    secureTextEntry
                  />
                </Animated.View>
              </View>
            )}
            {!loading && (
              <View style={styles.buttonWrap}>
                <Animated.View
                  style={[
                    styles.buttonEntrar,
                    {
                      transform: [{translateY: animateParams.btPos}],
                      opacity: animateParams.btOpacity,
                    },
                  ]}>
                  <TouchableOpacity
                    style={styles.buttonEntrarTouch}
                    onPress={handleSignInPress}>
                    <Text style={styles.buttonEntrarText}>ENTRAR</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            )}
          </Animated.View>
        </KeyboardAvoidingView>
      </ScrollView>
    </>
  );
};

export default LogIn;
