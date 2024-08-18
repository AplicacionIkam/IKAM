import { FontAwesome5 } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
  Pressable,
  StatusBar
} from 'react-native';
import ModalTerminosCondiciones from '../components/modalPoliticas'; // Asegúrate de que la ruta sea correcta

const { width, height } = Dimensions.get('window');

import { registerUser } from "../auth/authRegister";
import Logo from '../assets/img/logo_ikam.png';

const RegisterScreen = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    last_name: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    const { email, password, confirmPassword, name, last_name } = form;

    // Validaciones
    if (!name || !last_name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Todos los campos son requeridos');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Correo electrónico inválido');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (!acceptedTerms) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones');
      return;
    }

    setLoading(true);
    try {
      await registerUser(email, password, name, last_name);
      router.push('(tabs)');
    } catch (error) {
      if (error === "Error: Firebase: Error (auth/email-already-in-use).") {
        console.error("Error al registrar el usuario:", error);
        Alert.alert("Usuario ya registrado", "Ikam Multitiendas: El usuario que intenta registrar ya existe.");
      } else {
        console.error("Error al registrar el usuario:", error);
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  function MyCheckbox() {
    const [checked, setChecked] = useState(false);
    return (
      <Pressable
        style={[styles.checkboxBase, checked && styles.checkboxChecked]}
        onPress={() => setChecked(!checked)}>
        {checked && <FontAwesome5 name="check" size={15} color="white" />}
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <ScrollView>
          <Image source={Logo} style={styles.logo} />
          <View style={styles.header}>
            <Text style={styles.title}>Regístrate</Text>
          </View>
          {loading ?
            <ActivityIndicator size="large" color="#C61919" />
            :

            <View style={styles.form}>
              {/* Campos de entrada */}
              <View style={styles.input}>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  keyboardType="default"
                  onChangeText={name => setForm({ ...form, name })}
                  placeholder="Nombre"
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={form.name}
                />
              </View>

              <View style={styles.input}>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  keyboardType="default"
                  onChangeText={last_name => setForm({ ...form, last_name })}
                  placeholder="Apellido"
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={form.last_name}
                />
              </View>

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

              <View style={styles.inputContainer}>
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
              <View style={styles.inputContainer}>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  secureTextEntry={!showConfirmPassword}
                  onChangeText={confirmPassword => setForm({ ...form, confirmPassword })}
                  placeholder="Confirmar contraseña"
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={form.confirmPassword}
                />
                <FontAwesome5
                  style={styles.eyeIcon}
                  name={showConfirmPassword ? 'eye' : 'eye-slash'}
                  size={25}
                  color="#222C57"
                  onPress={() => {
                    setShowConfirmPassword(!showConfirmPassword)
                  }}
                />
              </View>
              <View style={styles.appContainer}>
                <View style={styles.checkboxContainer}>
                  <MyCheckbox />
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.checkboxLabel}>{`Aceptar términos y condiciones`}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.formAction}>
                <TouchableOpacity onPress={handleRegister}>
                  <View style={styles.btnContain}>
                    <View style={styles.btn}>
                      <Text style={styles.btnText}>Registrar</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>
                ¿Ya tienes una cuenta? <Link href={'LoginScreen'} style={styles.labelLink}>Inicia en IKAM</Link>
              </Text>
            </View>
          }
        </ScrollView>
      </View>

      <ModalTerminosCondiciones
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    paddingHorizontal: 20,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  label: {
    textAlign: 'center',
    fontSize: 20
  },
  labelLink: {
    textAlign: 'center',
    color: 'blue'
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#222C57',
    marginBottom: 6,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  logo: {
    alignSelf: 'center',
    width: width * 0.8,
    height: height * 0.2,
    marginBottom: -25,
    marginTop: 50
  },
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 10,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  inputControl: {
    marginTop: 15,
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
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 25,
    height: 30,
    justifyContent: 'center',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  checkboxBase: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'blue',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: 'blue',
  },
  appContainer: {
    flex: 1,
    marginBottom: 25
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 15,
    color: 'blue',
  },
});

export default RegisterScreen;
