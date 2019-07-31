import React from "react";
import {View, Text, StyleSheet, Button, ScrollView, TouchableOpacity, Image, TextInput, Alert} from "react-native";
import images from "../helpers/ImageLoader";
import {SLOPE, DURATION, TARGET_TEMPERATURE, TEMP_ORIGIN} from "../helpers/Constants";
import colors from "../styles/colors";

export default class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.segments,
            dataEditableState:this.props.segmentsEditableStates != null ? this.props.segmentsEditableStates : [true, true, true]
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
                {this.renderCell(TARGET_TEMPERATURE, 500, 4, key)}
                {this.renderCell(DURATION, 6.5, 4, key)}
                {this.renderCell(SLOPE, 100, 4, key)}
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
            <View style={this.state.dataEditableState[this.giveEditableStateIndex(key, headerKey)] ? styles.cell: styles.lockedCell}>
                <TextInput
                    placeholder={`${placeholder}`}
                    onChangeText={(text) => {this.changeValueInData(key, headerKey, text)}}
                    value={this.giveValue(this.state.data[key][headerKey])}
                    maxLength={maxLength}
                    keyboardType="numeric"
                    editable = {this.state.dataEditableState[this.giveEditableStateIndex(key, headerKey)]}
                    />

            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <ScrollView style={styles.container}>
                    {this.renderRows()}
                    <Button title={"Ajouter un segment"}
                            onPress={() => this.addSegment()}
                            color={colors.PRIMARY_COLOR}
                            style={{marginHorizontal: 20}}/>
                </ScrollView>
            </View>
        )
    }

    addSegment() {
        if (this.state.data.length >= 12) {
            Alert.alert("Erreur", "Vous ne pouvez pas ajouter plus de 12 segments.", [{text: 'Ok', onPress: () => {}}]);
        } else {
            this.setState({data: [...this.state.data, {}]});
            this.setState({dataEditableState: [...this.state.dataEditableState, true,true,true]});
        }
    }

    removeSegment(index) {
        let array = [...this.state.data];
        array.splice(index, 1);
        this.setState({data: array});
        this.props.onChangeValue(array);
    }

    changeValueInData(rowId, headerKey, value) {
        if (((value === "-" || value === ".") && headerKey !== SLOPE) ||
        (value !== "-" && value !== "."  && value !== "" && (Number.isNaN(Number.parseFloat(value) && headerKey !== DURATION)))) { //
            return false
        }
        if (headerKey !== SLOPE && value[0] === "-") {
            value = Math.abs(value);
        }

        let array = [...this.state.data];
        let editArray = [...this.state.dataEditableState];

        if (headerKey === SLOPE) { //editing slope
            duration =  array[rowId][DURATION]
            targetTemp =  array[rowId][TARGET_TEMPERATURE]
            //target temp is computed
            if ((targetTemp == null || !editArray[this.giveEditableStateIndex(rowId,TARGET_TEMPERATURE)]) && (duration != null)){
                array[rowId][TARGET_TEMPERATURE] = ''+((value * duration)+ this.getTargetTempOfRow(rowId-1))
                editArray[this.giveEditableStateIndex(rowId,TARGET_TEMPERATURE)] = false
            }
            else
            //Duration is computed
            if ((duration == null || !editArray[this.giveEditableStateIndex(rowId,DURATION)]) && (targetTemp != null)){
                array[rowId][DURATION] = ''+((targetTemp-this.getTargetTempOfRow(rowId-1))/value)
                editArray[this.giveEditableStateIndex(rowId,DURATION)] = false
            }
        }
        else
        if (headerKey === DURATION) { //editing duration
            //formating duration
            var formatToDo = value.toString().indexOf(':')
            if ( formatToDo !== -1 && (value.toString().length - formatToDo) == 3){ //only if the forme is *X:XX
                var splittedVal = value.toString().split(':')
                value=Number.parseFloat(splittedVal[0])+Number.parseFloat(splittedVal[1]/60)
            }
            //if not yet a number, return...
            if (Number.isNaN(Number.parseFloat(value))) {
                return false
            }

            slope =  array[rowId][SLOPE]
            targetTemp =  array[rowId][TARGET_TEMPERATURE]
            //target temp is computed
            if ((targetTemp == null || !editArray[this.giveEditableStateIndex(rowId,TARGET_TEMPERATURE)]) && (slope != null)){
                array[rowId][TARGET_TEMPERATURE] = ''+((value * slope) + this.getTargetTempOfRow(rowId-1))
                editArray[this.giveEditableStateIndex(rowId,TARGET_TEMPERATURE)] = false
            }
            else
            //slope is computed
            if ((slope == null || !editArray[this.giveEditableStateIndex(rowId,SLOPE)]) && (targetTemp != null)){
                array[rowId][SLOPE] = ''+((targetTemp - this.getTargetTempOfRow(rowId-1))/value)
                editArray[this.giveEditableStateIndex(rowId,SLOPE)] = false
            }
        }
        else
        if (headerKey === TARGET_TEMPERATURE) { //editing target temp
            slope =  array[rowId][SLOPE]
            duration =  array[rowId][DURATION]
            //duration is computed
            if ((duration == null || !editArray[this.giveEditableStateIndex(rowId,DURATION)]) && (slope != null)){
                array[rowId][DURATION] = ''+((value - this.getTargetTempOfRow(rowId-1))/slope)
                editArray[this.giveEditableStateIndex(rowId,DURATION)] = false
            }
            else
            //slope is computed
            if ((slope == null || !editArray[this.giveEditableStateIndex(rowId,SLOPE)]) && (duration != null)){
                array[rowId][SLOPE] = ''+((value - this.getTargetTempOfRow(rowId-1))/duration)
                editArray[this.giveEditableStateIndex(rowId,SLOPE)] = false
            }
        }


        array[rowId][headerKey] = value;
        this.setState({data: array});
        this.setState({dataEditableState: editArray})
        this.props.onChangeValue(array);
        this.props.onChangeState(editArray);
    }

    giveValue(val) {
        return (val === undefined) ? "" : `${val}`;
    }

    giveEditableStateIndex(key, headerKey)  {
        headerKeyNumber = 0
        if (headerKey == DURATION){
            headerKeyNumber = 1
        }
        if (headerKey == SLOPE){
        headerKeyNumber = 2
        }
        return ((key*3) + headerKeyNumber)
    }

    getTargetTempOfRow(row){
        if(row < 0){
            return TEMP_ORIGIN
        }else{
            return Number.parseFloat(this.state.data[row][TARGET_TEMPERATURE])
        }
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
    lockedCell: {
        flex: 3,
        backgroundColor: colors.MY_GREY,
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
        backgroundColor: colors.PRIMARY_DARK_COLOR,
        borderBottomWidth: 2,
    },
    minus: {
        height: 20,
        width: 20
    }
});
