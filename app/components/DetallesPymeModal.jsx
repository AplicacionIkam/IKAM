import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { auth, ikam } from '../firebase/config-ikam';
import Carousel from "pinar";
import {
    ScrollView,
    SafeAreaView,
    View,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    Linking,
    Modal,
    StatusBar
} from "react-native";

const { width: viewportWidth } = Dimensions.get("window");


export default VistaDetallesPyme = ({ pymeId, volver, obtenerDetallesPyme, vistaDetalles, setVistaDetalles }) => {
    const [pyme, setPyme] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchPymeDetails = async () => {
            const details = await obtenerDetallesPyme(pymeId);
            setPyme(details);
        };
        fetchPymeDetails();
    }, [pymeId]);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return; // Asegúrate de que el usuario esté autenticado

        const likesCollection = collection(ikam, 'likes');
        const q = query(likesCollection, where('userId', '==', user.uid), where('pymeId', '==', pymeId));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
                // Si hay al menos un documento, la pyme está en los favoritos
                setIsFavorite(true);
            } else {
                // No se encontró el documento, la pyme no está en los favoritos
                setIsFavorite(false);
            }
        });

        // Cleanup: Desuscribirse cuando el componente se desmonte
        return () => unsubscribe();
    }, [pymeId]);

    const addLike = async (pymeId) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const likesCollectionRef = collection(ikam, 'likes');
                await addDoc(likesCollectionRef, {
                    userId: user.uid,
                    pymeId: pymeId
                });
                console.log('Like added');
            } else {
                console.log('No user is signed in');
            }
        } catch (error) {
            console.error('Error adding like:', error);
        }
    };

    const removeLike = async (pymeId) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const likesCollectionRef = collection(ikam, 'likes');
                const q = query(likesCollectionRef, where("userId", "==", user.uid), where("pymeId", "==", pymeId));
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });

                console.log('Like removed');
            } else {
                console.log('No user is signed in');
            }
        } catch (error) {
            console.error('Error removing like:', error);
        }
    };

    // Método genérico para abrir cualquier URL
    const abrirEnNavegador = (url) => {
        if (url) {
            Linking.openURL(url).catch((err) =>
                console.error("No se pudo abrir la URL:", err)
            );
        }
    };

    const makeCall = () => {
        if (pyme && pyme.numero_cel) {
            Linking.openURL(`tel:${pyme.numero_cel}`);
        }
    };

    const abrirWhatsApp = (numero) => {
        const mensaje = "Hola me comunico desde Ikam Multitiendas"
        const url = `https://wa.me/${numero}?text=${mensaje}`;
        abrirEnNavegador(url);
    };

    return (
        <Modal
            animationType="fade"
            visible={vistaDetalles}
            onRequestClose={() => {
                setVistaDetalles(!vistaDetalles)
                StatusBar.setHidden(false);
                setPyme()
            }}
            transparent={false}
        >
            <StatusBar hidden={true} />
            <View style={estilos.areaSegura}>

                {pyme ? (
                    <>
                        <View style={estilos.imagenContenedor}>
                            <Carousel>
                                <Image
                                    source={{ uri: pyme.imagen1 }}
                                    style={estilos.imagenDetalle}
                                />
                                <Image
                                    source={{ uri: pyme.imagen2 }}
                                    style={estilos.imagenDetalle}
                                />
                                <Image
                                    source={{ uri: pyme.imagen3 }}
                                    style={estilos.imagenDetalle}
                                />
                                <Image
                                    source={{ uri: pyme.imagen4 }}
                                    style={estilos.imagenDetalle}
                                />
                                <Image
                                    source={{ uri: pyme.imagen5 }}
                                    style={estilos.imagenDetalle}
                                />
                            </Carousel>
                            <View style={estilos.botonesContenedor}>
                                <TouchableOpacity
                                    style={estilos.botonIzquierda}
                                    onPress={() => {
                                        setVistaDetalles(!vistaDetalles)
                                        StatusBar.setHidden(false);
                                        setPyme()
                                    }}
                                >
                                    <FontAwesome5 name="arrow-left" size={25} color="#000" />
                                </TouchableOpacity>

                                {isFavorite ?
                                    <TouchableOpacity
                                        style={estilos.botonDerecha}
                                        onPress={() => {
                                            removeLike(pymeId)
                                        }}
                                    >
                                        <FontAwesome5 name="heart" size={25} color="#C61919" />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        style={estilos.botonDerecha}
                                        onPress={() => {
                                            addLike(pymeId)
                                        }}
                                    >
                                        <FontAwesome5 name="heart" size={25} color="#000" />
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                        <ScrollView >
                            <View style={estilos.detalleContenedor}>
                                <Text style={estilos.tituloDetalle}>{pyme.nombre_pyme}</Text>
                                <Text style={estilos.categoriaDetalle}>
                                    {pyme.nombreSubcate ? pyme.nombreSubcate : "Sin categoría"}
                                </Text>
                                <Text style={estilos.descripcionTitulo}>
                                    {/* {pyme.descripcion} */}
                                    {pyme.descripcion}
                                </Text>
                                <TouchableOpacity onPress={() => abrirEnNavegador(pyme.url_maps)}>
                                    <View style={estilos.descripcionContenedor}>
                                        <FontAwesome5 name="map-marker-alt" size={33} color="#000" />
                                        <View style={estilos.textoContenedor}>
                                            <Text style={estilos.descripcionTitulo}>
                                                Encuéntranos en
                                            </Text>
                                            <Text style={estilos.descripcionDetalle}>
                                                {pyme.direccion}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View style={estilos.descripcionContenedor}>
                                    <FontAwesome5 name="clock" size={29} color="#000" solid />
                                    <View style={estilos.textoContenedor}>
                                        <Text style={estilos.descripcionTitulo}>Te atendemos</Text>
                                        <Text style={estilos.descripcionDetalle}>
                                            {pyme.horario_apertura}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={estilos.descripcionContenedorTel}
                                    onPress={makeCall}
                                >
                                    <FontAwesome5 name="phone" size={29} color="#000" solid />
                                    <View style={estilos.textoContenedor}>
                                        <Text style={estilos.descripcionTitulo}>Llámanos al</Text>
                                        <Text style={estilos.descripcionDetalle}>
                                            {pyme.num_local}
                                        </Text>
                                        <Text style={estilos.descripcionDetalle}>
                                            {pyme.num_cel}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <View style={estilos.contenedorRedes}>
                                    <Text style={estilos.descripcionRedes}>
                                        También contáctanos
                                    </Text>
                                    <View style={estilos.iconosContenedor}>
                                        <TouchableOpacity
                                            onPress={() => abrirEnNavegador(pyme.url_facebook)}
                                        >
                                            <FontAwesome5
                                                name="facebook-f"
                                                size={29}
                                                color="#0165E1"
                                                style={estilos.icono}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => abrirEnNavegador(pyme.url_instagram)}
                                        >
                                            <FontAwesome5
                                                name="instagram"
                                                size={37}
                                                color="#E1306C"
                                                style={estilos.icono}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => abrirWhatsApp(pyme.num_cel)}
                                        >
                                            <FontAwesome5
                                                name="whatsapp"
                                                size={37}
                                                color="green"
                                                style={estilos.icono}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => abrirEnNavegador(pyme.url_tiktok)}
                                        >
                                            <FontAwesome5
                                                name="tiktok"
                                                size={29}
                                                color="#000"
                                                style={estilos.icono}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </>
                ) : (
                    <Text>Cargando...</Text>
                )}
            </View>
        </Modal>
    );
};

const estilos = StyleSheet.create({
    areaSegura: {
        flex: 1,
        backgroundColor: "#F0F0F0",
        marginTop: 0
    },
    // Detalles de PyME
    detalleContenedor: {
        // flex: 1,
        height: "auto",
        padding: 20,
        backgroundColor: "#FFFFFF",
    },
    imagenContenedor: {
        position: "relative",
        width: "100%",
        height: "40%",
        resizeMode: "stretch",
    },
    imagenDetalle: {
        width: "100%",
        height: "100%",
        resizeMode: "stretch",
    },
    botonesContenedor: {
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        top: 40,
        left: 5,
        right: 5,
        paddingHorizontal: 10,
    },
    botonIzquierda: {
        backgroundColor: "#fff",
        borderRadius: 30,
        padding: 9,
        elevation: 6,
    },
    botonDerecha: {
        backgroundColor: "#fff",
        borderRadius: 30,
        padding: 9,
        elevation: 5,
    },
    tituloDetalle: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center"
    },
    categoriaDetalle: {
        textAlign: "right",
        fontSize: 18,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#DDD",
    },
    descripcionContenedor: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        paddingEnd: 28,
    },
    descripcionContenedorTel: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        paddingEnd: 28,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#DDD",
    },
    textoContenedor: {
        flexDirection: "column",
        marginLeft: 15,
    },
    descripcionTitulo: {
        fontSize: 18,
        color: "#000",
        fontWeight: "bold",
        marginBottom: 5,
    },
    descripcionDetalle: {
        fontSize: 15,
        color: "#888",
    },
    contenedorRedes: {
        flexDirection: "column",
    },
    descripcionRedes: {
        fontSize: 18,
        color: "#000",
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
    },
    iconosContenedor: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 15,
    },
    icono: {
        marginHorizontal: 10,
    },

});