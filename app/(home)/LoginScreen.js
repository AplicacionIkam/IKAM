import { signInWithEmailAndPassword } from 'firebase/auth';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';

import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  Dimensions,
  ActivityIndicator
} from 'react-native';

const { width, height } = Dimensions.get('window');

import { auth, ikam } from '../firebase/config-ikam';
import { saveUserData } from "../auth/authService";
import Logo from '../assets/img/logo_ikam.png';

const LoginScreen = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      const userDocRef = doc(ikam, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        await saveUserData(user);
        router.push({ pathname: '(tabs)', params: { user: userData } });
      } else {
        setErrorMessage('No se encontraron datos del usuario.');
      }
    } catch (error) {
      setErrorMessage('Correo o contraseña incorrectos');
      console.log(error.message)
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!form.email || !form.password) {
      Alert.alert("Campos vacios", "Todos los campos deben ser llenados");
      return false;
    }
    return true;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>


      <View style={styles.container}>
        <ScrollView>
          <Image source={Logo} style={styles.logo} />
          <View style={styles.header}>
            <Text style={styles.title}>
              Inicia sesión <Text style={{ color: '#075eec' }}></Text>
            </Text>
          </View>
          {loading ?
            <ActivityIndicator size="large" color="#C61919" />
            :

            <View style={styles.form}>
              <View style={styles.input}>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  keyboardType="email-address"
                  onChangeText={email => setForm({ ...form, email })}
                  placeholder="Correo electrónico"
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={form.email}
                />
              </View>              

              <View style={styles.input}>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  secureTextEntry={!showPassword}
                  onChangeText={password => setForm({ ...form, password })}
                  placeholder="Contraseña"
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={form.password}
                />
                <FontAwesome5
                  style={styles.eyeIcon}
                  name={showPassword ? 'eye' : 'eye-slash'}
                  size={25}
                  color="#222C57"
                  onPress={() => {
                    setShowPassword(!showPassword)
                  }}
                />
              </View>

              {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
              <Text style={styles.formLink}>¿Has olvidado tu contraseña?</Text>

              <View style={styles.formAction}>
                <TouchableOpacity onPress={() => {
                  if (validateForm()) {
                    handleLogin()
                  }
                }}>
                  <View style={styles.btnContain}>
                    <View style={styles.btn}>
                      <Text style={styles.btnText}>Ingresar</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              {/* <Text style={styles.subtitle2}>O también</Text>            
            <View style={styles.signInButtons}> */}

              {/* <TouchableOpacity
                onPress={() => { }}
                style={styles.signInBtn}
              >
                <Entypo name='email' color='#81f7d8' size={30} />                
              </TouchableOpacity> */}

              {/* <TouchableOpacity onPress={() => { }} style={styles.signInBtn}>
                <Entypo name='facebook-with-circle' color='#5882FA' size={40} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { }} style={styles.signInBtn}>
                <AntDesign name='google' color='#F78181' size={40} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { }} style={styles.signInBtn}>
                <Entypo name='circle' size={40} />
              </TouchableOpacity>
            </View> */}

              <View style={styles.input} />
              <Text style={styles.label}>
                ¿No tienes cuenta? <Link href={'RegisterScreen'} style={styles.labelLink}>Regístrate en IKAM</Link>
              </Text>
            </View>

          }
        </ScrollView>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 35,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    textAlign: 'center',
    fontSize: 20
  },
  labelLink: {
    textAlign: 'center',
    color: 'blue',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#222C57',
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '500',
    color: '#929292',
  },
  subtitle2: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1D2A32',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 36,
  },
  logo: {
    alignSelf: 'center',
    width: width * 0.8,
    height: height * 0.2,
    marginBottom: -25,
    marginTop: 50
  },
  form: {
    width: '100%',
    marginBottom: 14,
    paddingHorizontal: 24,
  },
  formAction: {
    marginTop: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  formLink: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222C57',
    marginBottom: 20,
    textAlign: 'right'
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  input: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#222',
    marginBottom: 5,
  },
  inputControl: {
    marginTop: 2,
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#222C57',
    borderStyle: 'solid',
    width: '100%',
  },
  inputControl2: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 2,
    borderColor: '#222C57',
    borderStyle: 'solid',
    marginBottom: 7,
    marginTop: 10,
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 15,
    height: 30,
    justifyContent: 'center',
  },
  btnContain: {
    alignItems: 'center',
    marginTop: 1,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: '#C61919',
    borderColor: '#222C57',
    width: width * 0.8,
    marginBottom: 15
  },
  btnText: {
    fontSize: 15,
    lineHeight: 15,
    fontWeight: '600',
    color: '#fff',
  },
  signInButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  signInBtn: {
    flexDirection: 'row',
    width: '40%',
    borderWidth: 0,
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInBtnText: {
    marginLeft: 10,
    fontSize: 13,
  },
  error: {
    textAlign: 'center',
    color: '#C61919',
    marginTop: 10,
  },
});

export default LoginScreen;
