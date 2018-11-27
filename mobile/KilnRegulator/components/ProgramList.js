import React from 'react';
import { FlatList } from 'react-native';
import ProgramItem from "../components/ProgramItem";

export default class ProgramList extends React.Component {
    render() {
        return (
            <FlatList
                data={this.props.ids}
                keyExtractor={(item) => item.toString()}
                renderItem={({item}) => <ProgramItem id={{item}}/>}
            />
        );
    }
}
