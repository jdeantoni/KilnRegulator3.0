import React from "react";
import {View, Text, StyleSheet, Button, ScrollView, TouchableOpacity, Image, TextInput, Alert} from "react-native";
import images from "../helpers/ImageLoader";

export default class Table extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.segments
        };

        this.dataHeaders = ["Segment", "T° cible (°C)", "Durée (h)", "Pente (°C/h)"];
    }

    renderHeader() {
        let res = [];
        for (let i = 0; i < this.dataHeaders.length; i++) {
            res[i] = (
                <View key={i} style={styles.cell}>
                    <Text style={{color: "white"}}>{this.dataHeaders[i]}</Text>
                </View>
            );
        }
        return (
            <View style={styles.header_row}>
                {res}
                <View style={styles.suppr_cell}/>
            </View>
        );
    }

    renderRows() {
        let res = [];
        for (let i = 0; i < this.state.data.length; i++) {
            res[i] = this.renderRow(this.state.data[i], i);
        }
        return res;
    }

    renderRow(row, key) {
        return (
            <View key={key} style={styles.row}>
                <View style={styles.cell}>
                    <Text>{key+1}</Text>
                </View>
                {this.renderCell("targetTemperature", 500, 4, key)}
                {this.renderCell("duration", 6.5, 4, key)}
                {this.renderCell("slope", 100, 4, key)}
                <View style={styles.suppr_cell}>
                    <TouchableOpacity onPress={() => this.removeSegment(key)}>
                        <Image source={images.minus} style={styles.minus}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    renderCell(headerKey, placeholder, maxLength, key) {
        return (
            <View style={styles.cell}>
                <TextInput
                    placeholder={`${placeholder}`}
                    onChangeText={(text) => {this.changeValueInData(key, headerKey, text)}}
                    value={this.giveValue(this.state.data[key][headerKey])}
                    maxLength={maxLength}
                    keyboardType="numeric"/>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <ScrollView style={styles.container}>
                    {this.renderRows()}
                    <Button title={"Ajouter un segment"} onPress={() => this.addSegment()}/>
                </ScrollView>
            </View>
        )
    }

    addSegment() {
        if (this.state.data.length >= 12) {
            Alert.alert("Erreur", "Vous ne pouvez pas ajouter plus de 12 segments.", [{text: 'Ok', onPress: () => {}}]);
        } else {
            this.setState({data: [...this.state.data, {}]});
        }
    }

    removeSegment(index) {
        let array = [...this.state.data];
        array.splice(index, 1);
        this.setState({data: array});
        this.props.onChangeValue(array);
    }

    changeValueInData(rowId, headerKey, value) {
        if (Number.isNaN(Number.parseFloat(value)) && value !== "") {
            return false;
        }
        let array = [...this.state.data];
        array[rowId][headerKey] = value;
        this.setState({data: array});
        this.props.onChangeValue(array);
    }

    giveValue(val) {
        return (val === undefined) ? "" : `${val}`;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    cell: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    suppr_cell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        height: 50,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: "grey"
    },
    header_row: {
        height: 50,
        flexDirection: 'row',
        backgroundColor: "#B71C1C",
        borderBottomWidth: 2,
    },
    minus: {
        height: 20,
        width: 20
    }
});