import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
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
    PixelRatio,

} from "react-native";

const { width: viewportWidth } = Dimensions.get("window");


export default VistaDetallesPyme = ({ pymeId, volver, obtenerDetallesPyme }) => {
    const [pyme, setPyme] = useState(null);

    useEffect(() => {
        const fetchPymeDetails = async () => {
            const details = await obtenerDetallesPyme(pymeId);
            setPyme(details);
        };

        fetchPymeDetails();
    }, [pymeId]);

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
        <SafeAreaView style={estilos.areaSegura}>
            {pyme ? (
                <>
                    <View style={estilos.imagenContenedor}>
                        <Carousel>
                            <Image
                                source={{ uri: pyme.imagen1}}
                                style={estilos.imagenDetalle}
                            />
                            <Image
                                source={{ uri: pyme.imagen2}}
                                style={estilos.imagenDetalle}
                            />
                            <Image
                                source={{ uri: pyme.imagen3}}
                                style={estilos.imagenDetalle}
                            />
                            <Image
                                source={{ uri: pyme.imagen4}}
                                style={estilos.imagenDetalle}
                            />
                            <Image
                                source={{ uri: pyme.imagen5}}
                                style={estilos.imagenDetalle}
                            />
                        </Carousel>
                        <View style={estilos.botonesContenedor}>
                            <TouchableOpacity style={estilos.botonIzquierda} onPress={volver}>
                                <FontAwesome5 name="arrow-left" size={25} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity style={estilos.botonDerecha}>
                                <FontAwesome5 name="heart" size={25} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView >
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
                                        onPress={() => abrirWhatsApp(pyme.numero_cel)}
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
        </SafeAreaView>
    );
};

const estilos = StyleSheet.create({
    areaSegura: {
        flex: 1,
        backgroundColor: "#F0F0F0",
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
        top: 55,
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