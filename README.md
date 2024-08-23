[# IKAM](https://maps.googleapis.com/maps/api/geocode/json?address=la+zandunga+177+benito+juarez+57000&key=AIzaSyCSGXtNOul2BBR119u0hhduLTWq8CD4Omo

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { collection, addDoc, onSnapshot, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { auth, ikam } from '../firebase/config-ikam';
import Carousel from "pinar";
import { ScrollView, View, Image, StyleSheet, Text, TouchableOpacity, Dimensions, Linking, Modal, StatusBar } from "react-native";
import { Video } from 'expo-av';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome5 } from "@expo/vector-icons";

const { width: viewportWidth } = Dimensions.get("window");
const API_KEY = 'AIzaSyB-AIzaSyCSGXtNOul2BBR119u0hhduLTWq8CD4Omo';  // Reemplaza con tu clave API

const obtenerCoordenadasDeURL = async (url) => {
    try {
        // Decodificar y codificar la URL para el uso en la consulta de API
        const address = encodeURIComponent(url);
        console.log(address)
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`;
        
        const response = await axios.get(geocodeUrl);
        const results = response.data.results;

        if (results.length > 0) {
            const location = results[0].geometry.location;
            return {
                latitude: location.lat,
                longitude: location.lng
            };
        } else {
            console.error('No se encontraron coordenadas para la dirección proporcionada.');
            return null;
        }
    } catch (error) {
        console.error('Error al obtener las coordenadas:', error);
        return null;
    }
};

export default function VistaDetallesPyme({ pymeId, volver, obtenerDetallesPyme, vistaDetalles, setVistaDetalles }) {
    const [pyme, setPyme] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [location, setLocation] = useState(null);

    useEffect(() => {
        const fetchPymeDetails = async () => {
            const details = await obtenerDetallesPyme(pymeId);
            setPyme(details);

            // Extraer coordenadas desde el enlace de Google Maps
            if (details && details.url_maps) {
                const coords = await obtenerCoordenadasDeURL(details.url_maps);
                setLocation(coords);
            }
        };
        fetchPymeDetails();
    }, [pymeId]);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const likesCollection = collection(ikam, 'likes');
        const q = query(likesCollection, where('userId', '==', user.uid), where('pymeId', '==', pymeId));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
                setIsFavorite(true);
            } else {
                setIsFavorite(false);
            }
        });

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

    const makeCall = () => {
        if (pyme && pyme.numero_cel) {
            Linking.openURL(`tel:${pyme.numero_cel}`);
        }
    };

    const abrirWhatsApp = (numero) => {
        const mensaje = "Hola me comunico desde Ikam Multitiendas";
        const url = `https://wa.me/${numero}?text=${mensaje}`;
        abrirEnNavegador(url);
    };

    const abrirEnNavegador = (url) => {
        if (url) {
            Linking.openURL(url).catch((err) =>
                console.error("No se pudo abrir la URL:", err)
            );
        }
    };

    return (
        <Modal
            animationType="fade"
            visible={vistaDetalles}
            onRequestClose={() => {
                setVistaDetalles(!vistaDetalles);
                StatusBar.setHidden(false);
                setPyme(null);
            }}
            transparent={false}
        >
            <StatusBar hidden={true} />
            <View style={estilos.areaSegura}>
                {pyme ? (
                    <>
                        <View style={estilos.imagenContenedor}>
                            <Carousel>
                                <View style={estilos.videoContainer}>
                                    <Video
                                        source={{ uri: pyme.video }} // URL del video
                                        style={estilos.video}
                                        useNativeControls
                                        resizeMode="contain"
                                        shouldPlay
                                        isLooping
                                    />
                                </View>
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
                                        setVistaDetalles(!vistaDetalles);
                                        StatusBar.setHidden(false);
                                        setPyme(null);
                                    }}
                                >
                                    <FontAwesome5 name="arrow-left" size={25} color="#000" />
                                </TouchableOpacity>

                                {isFavorite ?
                                    <TouchableOpacity
                                        style={estilos.botonDerecha}
                                        onPress={() => {
                                            removeLike(pymeId);
                                        }}
                                    >
                                        <FontAwesome5 name="heart" size={25} color="#C61919" />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        style={estilos.botonDerecha}
                                        onPress={() => {
                                            addLike(pymeId);
                                        }}
                                    >
                                        <FontAwesome5 name="heart" size={25} color="#000" />
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                        <ScrollView>
                            <View style={estilos.detalleContenedor}>
                                <Text style={estilos.tituloDetalle}>{pyme.nombre_pyme}</Text>
                                <Text style={estilos.categoriaDetalle}>
                                    {pyme.nombreSubcate ? pyme.nombreSubcate : "Sin categoría"}
                                </Text>
                                <Text style={estilos.descripcionTitulo}>
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
                                {/* Aquí se añade el mapa */}
                                {location ? (
                                    <View style={estilos.mapaContenedor}>
                                        <MapView
                                            style={estilos.mapa}
                                            initialRegion={{
                                                latitude: location.latitude,
                                                longitude: location.longitude,
                                                latitudeDelta: 0.0922,
                                                longitudeDelta: 0.0421,
                                            }}
                                        >
                                            <Marker
                                                coordinate={{
                                                    latitude: location.latitude,
                                                    longitude: location.longitude
                                                }}
                                                title={pyme.nombre_pyme}
                                                description={pyme.direccion}
                                            />
                                        </MapView>
                                    </View>
                                ) : (
                                    <Text>No se pudo obtener la ubicación.</Text>
                                )}
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
                                            {pyme.numero_cel}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={estilos.descripcionContenedorTel}
                                    onPress={() => abrirWhatsApp(pyme.numero_cel)}
                                >
                                    <FontAwesome5 name="whatsapp" size={29} color="#25D366" solid />
                                    <View style={estilos.textoContenedor}>
                                        <Text style={estilos.descripcionTitulo}>Envíanos un mensaje</Text>
                                        <Text style={estilos.descripcionDetalle}>
                                            {pyme.numero_cel}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </>
                ) : (
                    <Text>Cargando...</Text>
                )}
            </View>
        </Modal>
    );
}

const estilos = StyleSheet.create({
    // Asegúrate de definir los estilos aquí
    areaSegura: {
        flex: 1,
    },
    imagenContenedor: {
        flex: 1,
    },
    videoContainer: {
        width: viewportWidth,
        height: 200,
    },
    video: {
        width: '100%',
        height: '100%',
    },
    imagenDetalle: {
        width: viewportWidth,
        height: 200,
    },
    botonesContenedor: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
    },
    botonIzquierda: {
        padding: 10,
    },
    botonDerecha: {
        padding: 10,
    },
    detalleContenedor: {
        padding: 10,
    },
    tituloDetalle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    categoriaDetalle: {
        fontSize: 16,
        color: '#555',
    },
    descripcionTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    descripcionDetalle: {
        fontSize: 16,
    },
    descripcionContenedor: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    textoContenedor: {
        marginLeft: 10,
    },
    mapaContenedor: {
        height: 300,
        marginVertical: 10,
    },
    mapa: {
        ...StyleSheet.absoluteFillObject,
    },
    descripcionContenedorTel: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
});
)
