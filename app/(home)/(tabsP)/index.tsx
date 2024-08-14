import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import {
    ScrollView,
    RefreshControl,
    View,
    Image,
    StyleSheet,
    Text,
    Dimensions,
    SafeAreaView,
    BackHandler,
    Alert,
    StatusBar
} from "react-native";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import VistaDetallesPyme from '../../components/DetallesPyme';
import VistaDetallesPymeMod from '../../components/DetallesPymeModal';
import BarraBusqueda from '../../components/barraBusqueda';
import ListaCategorias from '../../components/categorias';
import ModalFiltro from '../../components/modalFiltro';
import { ikam } from "../../firebase/config-ikam";
import ListaPymes from '../../components/pymes';

const App = () => {
    // Hooks
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [pymeSeleccionada, setPymeSeleccionada] = useState(null);
    const [categoriasElegir, setCategoriasElegir] = useState([]);
    const [vistaDetalles, setVistaDetalles] = useState(false);
    const [busquedaPyme, setbusquedaPyme] = useState(String);
    // const [modalVisiblePy, setModalVisiblePy] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [colonia, setColonia] = useState(String);
    const [pymesCol, setPymesCol] = useState([]);
    const [pymesQ, setPymesQ] = useState([]);
    const [pymes, setPymes] = useState([]);       

    const obtenerAtributosColeccion = async () => {
        try {
            const querySnapshot = await getDocs(collection(ikam, "pyme"));
            const atributos = new Set();

            querySnapshot.forEach((doc:any) => {
                const data = doc.data();
                Object.keys(data).forEach((key) => {
                    atributos.add(key);
                });
            });
            // console.log("Atributos de la colección 'pyme':", Array.from(atributos));
        } catch (error) {
            console.error(
                "Error obteniendo los atributos de la colección 'pyme':",
                error
            );
        }
    };

    const obtenerPymes = async () => {
        obtenerAtributosColeccion();
        const querySnapshot = await getDocs(collection(ikam, "pyme"));
        const pymesArray = querySnapshot.docs.map((doc:any) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setPymes(pymesArray);
    };

    useEffect(() => {
        // obtenerCategorias();
        setColonia('');
        obtenerPymes();
    }, []);

    useEffect(() => {
        const pyme = pymes.filter(p =>
            p.nomColonia && typeof p.nomColonia === 'string' && p.nomColonia.includes(colonia)
        );
        setPymesCol(pyme)
    }, [pymes]);

    useEffect(() => {
        setPymesQ(pymesCol)
    }, [pymesCol]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        // await obtenerCategorias();
        await obtenerPymes();
        setRefreshing(false);
        setbusquedaPyme("");
    }, []);

    useEffect(() => {
        if (!colonia) {
            setPymesCol(pymes)
            setPymesQ(pymes);
        }
        if (colonia) {
            const pyme = pymes.filter(p =>
                p.nomColonia && typeof p.nomColonia === 'string' && p.nomColonia.includes(colonia)
            );
            setPymesCol(pyme)
            setPymesQ(pyme)
        }
    }, [colonia])

    useEffect(() => {
        if (!busquedaPyme) {
            setPymesQ(pymesCol);
        }

        if (busquedaPyme) {
            const pyme = pymesCol.filter(p =>
                p.nombre_pyme.toLowerCase().includes(busquedaPyme.toLowerCase())
            );
            setPymesQ(pyme);
        }
    }, [busquedaPyme])

    useEffect(() => {
        if (categoriasElegir) {
            const pyme = pymesCol.filter(p =>
                // p.nombre_pyme.toLowerCase().includes(busquedaPyme.toLowerCase())
                p.nombreSubcate && typeof p.nombreSubcate === 'string' && p.nombreSubcate.includes(categoriasElegir)
            );
            setPymesQ(pyme);
        }
    }, [categoriasElegir])

    const obtenerDetallesPyme = async (pymeId:any) => {
        const docRef = doc(ikam, "pyme", pymeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    };
    
    return (
        <SafeAreaView style={estilos.areaSegura}>
            <View style={estilos.cabecera}>
                <Image
                    source={require("../../assets/img/logo1.png")}
                    style={estilos.logo}
                />
            </View>
            <BarraBusqueda
                busquedaPyme={busquedaPyme}
                setbusquedaPyme={setbusquedaPyme}
                setModalVisible={setModalVisible}
            />
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={estilos.contenedorCategorias}>
                    <ListaCategorias
                        setCategoriaSeleccionada={setCategoriaSeleccionada}
                        pymesQ={pymesQ}
                        categoriaSeleccionada={categoriaSeleccionada}
                        pymesCol={pymesCol}
                        setCategoriasElegir={setCategoriasElegir} />
                </View>
                {pymesQ.length > 0 ?
                    <View>
                        <View style={estilos.contenedorPymes}>
                            <ListaPymes
                                setPymeSeleccionada={setPymeSeleccionada}
                                pymesQ={pymesQ}
                                setVistaDetalles={setVistaDetalles}
                            />
                        </View>
                    </View>
                    :
                    <View style={estilos.contenedorNF}>
                        <Text style={estilos.noEncontrado}>
                            ¡Lo sentimos!
                        </Text>
                        <Text style={estilos.noEncontrado}>
                            Contenido no encontrado
                        </Text>
                        <Image
                            source={require("../../assets/img/abuNotFound.png")}
                            style={[estilos.notfoundImg]}
                        />
                    </View>

                }
                <ModalFiltro
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    colonia={colonia}
                    setColonia={setColonia}
                />
                <VistaDetallesPymeMod
                    pymeId={pymeSeleccionada}
                    volver={() => setVistaDetalles(false)}
                    obtenerDetallesPyme={obtenerDetallesPyme}
                    vistaDetalles={vistaDetalles}
                    setVistaDetalles={setVistaDetalles}
                />
            </ScrollView>
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
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    contenedorPymes: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
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
        marginVertical: 10

    }
});

export default App;
