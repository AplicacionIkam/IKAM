import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Dimensions,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  BackHandler,
  Alert,
  Text,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";

import ListaCategorias from "../../components/categorias";
import ListaPymes from "../../components/pymes";
import ModalFiltro from "../../components/modalFiltro";
import VistaDetallesPymeMod from "../../components/DetallesPymeModal";
import BarraBusquedaCategoria from "../../components/barraBusquedaCategoria";
import BarraBusqueda from "../../components/barraBusqueda";
import app from "../../firebase/config-ikam";

// Define los tipos
interface Categoria {
  id: string;
  nombreCat: string;
}

interface Pyme {
  id: string;
  nombreCategoria: string;
  nomColonia?: string; // Asegúrate de que este campo existe
  nombre_pyme?: string; // Asegúrate de que este campo existe
}

const { width: viewportWidth } = Dimensions.get("window");
const db = getFirestore(app);

const App = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    string | null
  >(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [pymes, setPymes] = useState<Pyme[]>([]);
  const [pymeSeleccionada, setPymeSeleccionada] = useState<string | null>(null);
  const [colonia, setColonia] = useState<string>("");
  const [pymesCol, setPymesCol] = useState<Pyme[]>([]);
  const [pymesQ, setPymesQ] = useState<Pyme[]>([]);
  const [vistaDetalles, setVistaDetalles] = useState<boolean>(false);
  const [busquedaCategoria, setBusquedaCategoria] = useState<string>("");
  const [busquedaPyme, setBusquedaPyme] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Obtener categorías
  const obtenerCategorias = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categoria"));
      const categoriasArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Categoria[];
      setCategorias(categoriasArray);
    } catch (error) {
      console.error("Error obteniendo las categorías:", error);
    }
  }, []);

  // Obtener pymes por categoría
  const obtenerPymesPorCategoria = useCallback(
    async (nombreCategoria: string) => {
      try {
        const q = query(
          collection(db, "pyme"),
          where("nombreCategoria", "==", nombreCategoria)
        );
        const querySnapshot = await getDocs(q);
        const pymesArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Pyme[];
        setPymes(pymesArray);
      } catch (error) {
        console.error("Error obteniendo las pymes:", error);
      }
    },
    []
  );

  // Obtener todas las pymes
  const obtenerTodasLasPymes = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "pyme"));
      const pymesArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Pyme[];
      setPymes(pymesArray);
    } catch (error) {
      console.error("Error obteniendo todas las pymes:", error);
    }
  }, []);

  // Obtener detalles de una pyme
  const obtenerDetallesPyme = async (pymeId: string) => {
    try {
      const docRef = doc(db, "pyme", pymeId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error("Error obteniendo detalles de la pyme:", error);
      return null;
    }
  };

  // Manejar el evento de retroceso en Android
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (categoriaSeleccionada) {
          setCategoriaSeleccionada(null);
          setBusquedaCategoria("");
          return true;
        } else {
          Alert.alert(
            "Salir",
            "¿Estás seguro que quieres salir?",
            [
              { text: "No", onPress: () => null, style: "cancel" },
              { text: "Sí", onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: false }
          );
          return true;
        }
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      obtenerCategorias();

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [categoriaSeleccionada, obtenerCategorias])
  );

  // Efectos secundarios
  useEffect(() => {
    setColonia("");
  }, []);

  useEffect(() => {
    if (colonia) {
      const pyme = pymes.filter(
        (p) =>
          p.nomColonia &&
          typeof p.nomColonia === "string" &&
          p.nomColonia.includes(colonia)
      );
      setPymesCol(pyme);
      setPymesQ(pyme);
    } else {
      setPymesCol(pymes);
      setPymesQ(pymes);
    }
  }, [colonia, pymes]);

  useEffect(() => {
    if (busquedaCategoria) {
      const categoriasFiltradas = categorias.filter((categoria) =>
        categoria.nombreCat
          .toLowerCase()
          .includes(busquedaCategoria.toLowerCase())
      );
      setCategorias(categoriasFiltradas);
    } else {
      obtenerCategorias();
    }
  }, [busquedaCategoria, obtenerCategorias]);

  useEffect(() => {
    if (busquedaPyme) {
      const pyme = pymesCol.filter((p) =>
        p.nombre_pyme?.toLowerCase().includes(busquedaPyme.toLowerCase())
      );
      setPymesQ(pyme);
    } else {
      setPymesQ(pymesCol);
    }
  }, [busquedaPyme, pymesCol]);

  // Obtener pymes cuando se selecciona una categoría o se muestra todas las pymes
  useEffect(() => {
    if (categoriaSeleccionada) {
      const categoria = categorias.find(
        (cat) => cat.id === categoriaSeleccionada
      );
      if (categoria) {
        obtenerPymesPorCategoria(categoria.nombreCat);
      }
    } else {
      obtenerTodasLasPymes();
    }
  }, [
    categoriaSeleccionada,
    categorias,
    obtenerPymesPorCategoria,
    obtenerTodasLasPymes,
  ]);

  return (
    <SafeAreaView style={estilos.areaSegura}>
      <View style={estilos.cabecera}>
        <Image
          source={require("../../assets/img/logo1.png")}
          style={estilos.logo}
        />
      </View>

      {categoriaSeleccionada === null ? (
        <View style={estilos.contenedorCategorias}>
          <BarraBusquedaCategoria
            busquedaCategoria={busquedaCategoria}
            setbusquedaCategoria={setBusquedaCategoria}
          />
          <ListaCategorias
            setCategoriaSeleccionada={setCategoriaSeleccionada}
            categorias={categorias}
            categoriaSeleccionada={categoriaSeleccionada}
          />
        </View>
      ) : (
        <View style={estilos.contenedorPymes}>
          <BarraBusqueda
            busquedaPyme={busquedaPyme}
            setbusquedaPyme={setBusquedaPyme}
            setModalVisible={setModalVisible}
          />
          {pymes.length > 0 ? (
            <ListaPymes
              setPymeSeleccionada={setPymeSeleccionada}
              pymesQ={pymesQ}
              setVistaDetalles={setVistaDetalles}
            />
          ) : (
            <View style={estilos.contenedorMensaje}>
              <Text style={estilos.mensajeNoPymes}>
                No hay pymes disponibles para esta categoría
              </Text>
            </View>
          )}
          <VistaDetallesPymeMod
            pymeId={pymeSeleccionada || ""}
            volver={() => setVistaDetalles(false)}
            obtenerDetallesPyme={obtenerDetallesPyme}
            vistaDetalles={vistaDetalles}
            setVistaDetalles={setVistaDetalles}
          />
        </View>
      )}
      <ModalFiltro
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        colonia={colonia}
        setColonia={setColonia}
      />
    </SafeAreaView>
  );
};

const estilos = StyleSheet.create({
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
  contenedorCategorias: {
    flex: 1,
    paddingHorizontal: 5,
  },
  contenedorPymes: {
    flex: 1,
    paddingHorizontal: 5,
  },
  contenedorMensaje: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mensajeNoPymes: {
    textAlign: "center",
    fontSize: 25,
    marginVertical: 20,
  },
  tarjeta: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: (viewportWidth * 0.88 - 20) / 2, // Ajusta el ancho para dos columnas
    marginVertical: 10,
    marginHorizontal: 10, // Espacio horizontal entre columnas
  },
  imagenContainer: {
    width: "100%",
    height: (viewportWidth * 0.88 - 20) / 2, // Hacer que la altura sea igual al ancho para que sea cuadrado
    position: "relative",
  },
  imagenTarjeta: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // Asegura que la imagen mantenga el aspecto y cubra el contenedor
  },
  detalleTarjeta: {
    flex: 1,
    padding: 10,
  },
  tituloTarjeta: {
    textAlign: "center",
    fontSize: 16,
  },
  tarjetaTodasPymes: {
    
    backgroundColor: "#EFEFEF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textoTarjeta: {
    fontSize: 18,
    color: "#333",
  },
});

export default App;
