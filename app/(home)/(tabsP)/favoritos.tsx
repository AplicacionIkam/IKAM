import React from "react";

import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
  Dimensions
} from "react-native";
import { useRouter } from 'expo-router';
const { width, height } = Dimensions.get('window');


import colorsIkam from '../../assets/estilos';

export default function App() {
  const ruta = useRouter();

  return (
    <SafeAreaView style={styles.areaSegura}>
      <View style={styles.cabecera}>
        <Image
          source={require("../../assets/img/logo1.png")}
          style={styles.logo}
        />
      </View>
      <Text style={styles.textoFavoritos}>Favoritos</Text>
      <ScrollView>
        <View style={styles.contenedorNF}>
          <Text style={styles.noEncontrado}>
            Para poder ver tus favoritos, es necesario contar con una cuenta
          </Text>
          <Text style={styles.noEncontrado}>
            Por favor registrate
          </Text>
          <Image
            source={require("../../assets/img/abuNC.png")}
            style={[styles.notfoundImg]}
          />
        </View>
        <View style={styles.contenedorBtn}>
          <Pressable
            // title="Login"
            style={styles.btn}
            onPress={() => ruta.push('/RegisterScreen')}
          >
            <Text style={styles.btnText}>Registrarse</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textoFavoritos: {
    marginVertical: 15,
    fontSize: 35,
    fontWeight: "bold",
    textAlign: 'center'
  },
  areaSegura: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  cabecera: {
    backgroundColor: "#CC0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 85,
    height: 85,
    resizeMode: "contain",
  },  
  contenedorNF: {
    flex: 1,
    paddingTop: 25,
  },
  notfoundImg: {
    width: 400,
    height: 400,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    resizeMode: "stretch",
  },
  noEncontrado: {
    textAlign: "center",
    fontSize: 30,
    marginVertical: 10,
    marginHorizontal: 10
  },
  contenedorBtnP: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  btn: {
    width: '80%',
    padding: 15,
    borderRadius: 40,
    backgroundColor: colorsIkam.cian.backgroundColor,
    alignItems: 'center',
  },
  btnText: {
    fontSize: width * 0.05,
    color: 'white',
  },
  contenedorBtn: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },

});
